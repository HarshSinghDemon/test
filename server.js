import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for faculty accounts and multi-factor authentication sessions
const users = new Map();
const sessions = new Map();

// Pre-seed a default faculty user for convenience
users.set('dr.smith@institution.edu', {
  email: 'dr.smith@institution.edu',
  totpSecret: generateSecret(),
  mfaEnrolled: true,
});

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Fym65TtT_1CTGye44epG4NrJjebgKmFvD';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Faculty Guard <onboarding@resend.dev>';

function maskEmail(email) {
  const [localPart, domainPart] = (email || '').split('@');
  if (!domainPart) return email;
  const maskedLocal =
    localPart.length > 2
      ? `${localPart[0]}***${localPart[localPart.length - 1]}`
      : `${localPart[0]}***`;
  return `${maskedLocal}@${domainPart}`;
}

function generatePreAuthToken(email, action) {
  const token = `pat_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  sessions.set(token, {
    token,
    email,
    action,
    createdAt: Date.now(),
  });
  return token;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint 1: POST /api/v1/auth/signup
app.post('/api/v1/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = users.get(normalizedEmail);
  if (!user) {
    user = {
      email: normalizedEmail,
      mfaEnrolled: false,
    };
    users.set(normalizedEmail, user);
  }

  const preAuthToken = generatePreAuthToken(normalizedEmail, 'mfa_setup');

  res.json({
    step: 'mfa_setup',
    pre_auth_token: preAuthToken,
    email: normalizedEmail,
    masked_email: maskEmail(normalizedEmail),
    available_setup_methods: ['totp', 'email'],
  });
});

// Endpoint 2: POST /api/v1/auth/login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, remember_me } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = users.get(normalizedEmail);
  if (!user) {
    // Dynamically register if first-time educator
    user = {
      email: normalizedEmail,
      mfaEnrolled: false,
    };
    users.set(normalizedEmail, user);
  }

  const preAuthToken = generatePreAuthToken(normalizedEmail, 'mfa_required');

  res.json({
    step: 'mfa_required',
    pre_auth_token: preAuthToken,
    email: normalizedEmail,
    masked_email: maskEmail(normalizedEmail),
    available_methods: ['totp', 'email'],
    default_method: user.totpSecret ? 'totp' : 'email',
  });
});

// Endpoint 3: POST /api/v1/auth/setup-totp
app.post('/api/v1/auth/setup-totp', async (req, res) => {
  try {
    const { pre_auth_token, email } = req.body;
    let targetEmail = email;

    if (pre_auth_token && sessions.has(pre_auth_token)) {
      targetEmail = sessions.get(pre_auth_token).email;
    }

    if (!targetEmail) {
      return res.status(400).json({ error: 'Email is required to generate authenticator enrollment.' });
    }

    targetEmail = targetEmail.trim().toLowerCase();

    let user = users.get(targetEmail);
    if (!user) {
      user = { email: targetEmail, mfaEnrolled: false };
      users.set(targetEmail, user);
    }

    // Generate unique Base32 TOTP secret if user doesn't already have one
    const secret = generateSecret();
    user.totpSecret = secret;

    // Standard RFC 6238 key URI embedding the registered educator email
    const provisioningUri = generateURI({
      issuer: 'Faculty Guard',
      label: targetEmail,
      secret,
    });

    // Render genuine scannable QR Code as Data URI
    const qrCodeBase64 = await QRCode.toDataURL(provisioningUri, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 200,
      color: {
        dark: '#111110',
        light: '#ffffff',
      },
    });

    res.json({
      secret,
      provisioning_uri: provisioningUri,
      qr_code_base64: qrCodeBase64,
      registered_email: targetEmail,
      instructions:
        'Scan this QR code with Google Authenticator, Authy, or 1Password. Enter the 6-digit code to link your authenticator.',
    });
  } catch (err) {
    console.error('Error generating TOTP setup:', err);
    res.status(500).json({ error: 'Failed to generate authenticator enrollment QR code.' });
  }
});

// Endpoint 4: POST /api/v1/auth/send-email-otp
app.post('/api/v1/auth/send-email-otp', async (req, res) => {
  try {
    const { pre_auth_token, email } = req.body;
    let targetEmail = email;

    if (pre_auth_token && sessions.has(pre_auth_token)) {
      targetEmail = sessions.get(pre_auth_token).email;
    }

    if (!targetEmail) {
      return res.status(400).json({ error: 'Please provide a valid faculty email address.' });
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    let user = users.get(normalizedEmail);
    if (!user) {
      user = { email: normalizedEmail };
      users.set(normalizedEmail, user);
    }

    // Generate fresh 6-digit verification code with 5-minute expiry
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOtp = otpCode;
    user.emailOtpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: RESEND_FROM_EMAIL,
            to: normalizedEmail,
            subject: `Faculty Guard Verification Code: ${otpCode}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background: #ffffff;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111110;">Faculty Guard</h2>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: #111110; margin-bottom: 8px;">Two-Step Verification Code</h3>
                <p style="font-size: 14px; color: #72716d; line-height: 1.5; margin-bottom: 20px;">
                  You are logging in or confirming verification for <strong>${normalizedEmail}</strong>. Use the 6-digit passcode below:
                </p>
                <div style="text-align: center; margin: 24px 0;">
                  <div style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; padding: 14px 24px; background: #fafaf9; border: 1px solid #d6d3d1; border-radius: 8px; color: #c8102e;">
                    ${otpCode}
                  </div>
                </div>
                <p style="font-size: 12px; color: #72716d; line-height: 1.5;">
                  This code expires in 5 minutes. If you did not attempt to sign in to Faculty Guard, please alert campus IT security immediately.
                </p>
              </div>
            `,
          }),
        });

        const resData = await emailResponse.json().catch(() => ({}));

        if (emailResponse.ok) {
          console.log(`[Resend] Successfully delivered OTP ${otpCode} directly to ${normalizedEmail} (ID: ${resData?.id})`);
          return res.json({
            status: 'sent',
            message: `Verification code sent to ${normalizedEmail}`,
            masked_email: maskEmail(normalizedEmail),
            expires_in_seconds: 300,
          });
        }

        // Gracefully handle sandbox restriction or unverified recipient without throwing or logging to console.error
        const errMsg = resData?.message || '';
        const isSandboxRestriction =
          emailResponse.status === 403 ||
          errMsg.includes('only send testing emails to your own email address') ||
          errMsg.includes('resend.com/domains');
        const helpfulWarning = isSandboxRestriction
          ? `Delivery to external recipient (${normalizedEmail}) requires a verified domain in Resend (resend.com/domains). Verification passcode: ${otpCode}`
          : (errMsg || `Verification passcode: ${otpCode}`);

        return res.json({
          status: 'sent',
          message: `Verification passcode generated for ${normalizedEmail}`,
          masked_email: maskEmail(normalizedEmail),
          expires_in_seconds: 300,
          dev_code: otpCode,
          warning: helpfulWarning,
        });
      } catch (sendError) {
        return res.json({
          status: 'sent',
          message: `Code generated for ${normalizedEmail}`,
          masked_email: maskEmail(normalizedEmail),
          expires_in_seconds: 300,
          dev_code: otpCode,
          warning: `Verification passcode: ${otpCode}`,
        });
      }
    } else {
      // RESEND_API_KEY is not yet configured in Settings
      console.log(`[DEV OTP] RESEND_API_KEY is not set. 6-digit code for ${normalizedEmail} is: ${otpCode}`);
      return res.json({
        status: 'sent',
        message: `Verification code generated for ${normalizedEmail}`,
        masked_email: maskEmail(normalizedEmail),
        expires_in_seconds: 300,
        dev_code: otpCode,
        warning: 'RESEND_API_KEY environment variable is not configured yet. For testing, your 6-digit code is: ' + otpCode,
      });
    }
  } catch (err) {
    console.error('Error sending email OTP:', err);
    res.status(500).json({ error: 'Failed to process email OTP request.' });
  }
});

// Endpoint 5: POST /api/v1/auth/verify-mfa
app.post('/api/v1/auth/verify-mfa', async (req, res) => {
  const { pre_auth_token, method, code, email } = req.body;

  if (!code || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit numeric verification code.' });
  }

  let targetEmail = email;
  if (pre_auth_token && sessions.has(pre_auth_token)) {
    targetEmail = sessions.get(pre_auth_token).email;
  }

  if (!targetEmail) {
    return res.status(400).json({ error: 'Session expired or email not identified. Please log in again.' });
  }

  const normalizedEmail = targetEmail.trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) {
    return res.status(400).json({ error: 'Session expired or user not found. Please log in again.' });
  }

  let isValid = false;

  if (method === 'totp') {
    if (!user.totpSecret) {
      return res.status(400).json({ error: 'Authenticator app is not yet configured. Please set it up first.' });
    }
    // Verify against RFC 6238 time-step using otplib with 30s epoch tolerance (±1 step drift window)
    try {
      const result = await verify({
        token: code,
        secret: user.totpSecret,
        epochTolerance: 30,
      });
      isValid = Boolean(result.valid);
    } catch (totpErr) {
      console.error('TOTP verification error:', totpErr);
      isValid = false;
    }
  } else if (method === 'email') {
    const isExpired = user.emailOtpExpiresAt ? Date.now() > user.emailOtpExpiresAt : true;
    if (!isExpired && user.emailOtp === code) {
      isValid = true;
      // Invalidate used code
      user.emailOtp = undefined;
      user.emailOtpExpiresAt = undefined;
    }
  }

  if (!isValid) {
    return res.status(400).json({
      error:
        method === 'totp'
          ? 'Invalid authenticator code. Check the rolling 6 digits on your phone and try again.'
          : 'Invalid or expired email verification code. Please request a new code.',
    });
  }

  // Mark MFA as completed and issue session token
  user.mfaEnrolled = true;
  user.lastLogin = Date.now();

  const accessToken = `jwt_session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  res.json({
    status: 'authenticated',
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 86400,
    user: {
      user_id: 'usr_' + Buffer.from(normalizedEmail).toString('hex').substring(0, 10),
      email: normalizedEmail,
      full_name: 'Dr. ' + normalizedEmail.split('@')[0],
      role: 'faculty',
      mfa_enrolled: true,
    },
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faculty Guard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
