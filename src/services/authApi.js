// REST API client for Layer 2 Authentication and MFA services
// Connects directly to the backend Express service for genuine Resend email dispatch and RFC 6238 TOTP verification

/**
 * Helper to handle fetch responses and extract error messages
 */
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = (data && data.error) || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

/**
 * Endpoint 1: POST /api/v1/auth/signup
 * Enrolls faculty account and prepares multi-factor choice
 */
export async function signupUser(payload) {
  const res = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * Endpoint 2: POST /api/v1/auth/login
 * Validates credentials and returns pre-auth token for mandatory 2FA
 */
export async function loginUser(payload) {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * Endpoint 3: POST /api/v1/auth/setup-totp
 * Generates genuine RFC 6238 Base32 secret and scannable QR Code bitmap
 */
export async function setupTotpEnrollment(preAuthToken, userEmail) {
  const res = await fetch('/api/v1/auth/setup-totp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pre_auth_token: preAuthToken,
      email: userEmail,
    }),
  });
  return handleResponse(res);
}

/**
 * Endpoint 4: POST /api/v1/auth/send-email-otp
 * Triggers backend Resend email delivery of 6-digit OTP
 */
export async function sendEmailOtp(preAuthToken, email) {
  const res = await fetch('/api/v1/auth/send-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pre_auth_token: preAuthToken, email }),
  });
  return handleResponse(res);
}

/**
 * Endpoint 5: POST /api/v1/auth/verify-mfa
 * Authenticates 6-digit code via RFC 6238 TOTP check or single-use email OTP check
 */
export async function verifyMfaCode(payload) {
  const res = await fetch('/api/v1/auth/verify-mfa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
