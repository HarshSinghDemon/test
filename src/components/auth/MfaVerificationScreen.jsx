import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Smartphone, Mail, ShieldAlert, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../common/Button.jsx';
import OtpInputBoxes from './OtpInputBoxes.jsx';
import { sendEmailOtp, verifyMfaCode } from '../../services/authApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Header = styled.div`
  text-align: center;

  h3 {
    font-size: 18px;
    font-weight: 800;
    color: ${(props) => props.theme.colors.ink};
  }

  p {
    font-size: 13px;
    color: ${(props) => props.theme.colors.soft};
    margin-top: 4px;
    line-height: 1.5;
  }
`;

const MethodSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 4px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const MethodTab = styled.button`
  padding: 9px 12px;
  border: none;
  background: ${(props) => (props.$active ? props.theme.colors.white : 'transparent')};
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  color: ${(props) => (props.$active ? props.theme.colors.ink : props.theme.colors.soft)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? '0 1px 3px rgba(0,0,0,0.06)' : 'none')};
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.ink};
  }
`;

const EmailNotice = styled.div`
  background-color: ${(props) => props.theme.colors.offWhite};
  border: 1px dashed ${(props) => props.theme.colors.borderHi};
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.soft};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  span.email {
    font-family: ${(props) => props.theme.typography.monoFont};
    color: ${(props) => props.theme.colors.ink};
    font-weight: 600;
  }

  button.resend {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11.5px;
    color: ${(props) => props.theme.colors.red};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }

    &:disabled {
      color: ${(props) => props.theme.colors.soft};
      cursor: not-allowed;
      text-decoration: none;
    }
  }
`;

/**
 * MfaVerificationScreen Component
 * Prompts user to choose between Authenticator App (Default) or Email Code
 */
export default function MfaVerificationScreen({ preAuthData, onVerified, onBack }) {
  const [method, setMethod] = useState(preAuthData?.default_method || 'totp');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [errorMsg, setErrorMsg] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');

  // Auto-send email code when email method is selected for the first time
  useEffect(() => {
    if (method === 'email' && preAuthData?.pre_auth_token) {
      handleDispatchEmail();
    }
  }, [method]);

  // Countdown timer for 5-minute expiry
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDispatchEmail = async () => {
    if (!preAuthData?.pre_auth_token && !preAuthData?.email) return;
    setIsSendingEmail(true);
    setErrorMsg('');
    setNoticeMsg('');
    try {
      const res = await sendEmailOtp(preAuthData.pre_auth_token, preAuthData?.email);
      setCountdown(300);
      if (res?.warning) {
        setNoticeMsg(res.warning);
      } else if (res?.message) {
        setNoticeMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to dispatch verification email. Please try Authenticator App.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otpCode;
    if (code.length < 6) return;

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const result = await verifyMfaCode({
        pre_auth_token: preAuthData?.pre_auth_token || '',
        email: preAuthData?.email,
        method,
        code,
      });
      onVerified?.(result);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid 6-digit code. Please check and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatCountdown = () => {
    const m = Math.floor(countdown / 60);
    const s = countdown % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Container>
      <Header>
        <h3>Two-Step Verification</h3>
        <p>Confirm your identity to unlock protected course materials on this device.</p>
      </Header>

      {/* Choice between Authenticator App or Email Code */}
      <MethodSelector>
        <MethodTab
          type="button"
          $active={method === 'totp'}
          onClick={() => {
            setMethod('totp');
            setOtpCode('');
            setErrorMsg('');
          }}
        >
          <Smartphone size={15} />
          <span>Authenticator App</span>
        </MethodTab>

        <MethodTab
          type="button"
          $active={method === 'email'}
          onClick={() => {
            setMethod('email');
            setOtpCode('');
            setErrorMsg('');
          }}
        >
          <Mail size={15} />
          <span>Email Code</span>
        </MethodTab>
      </MethodSelector>

      {method === 'email' && (
        <EmailNotice>
          <div>
            Code sent to <span className="email">{preAuthData?.masked_email || 'd***h@institution.edu'}</span>
            <div style={{ fontSize: '11px', color: '#72716d', marginTop: '2px' }}>
              Expires in <strong>{formatCountdown()}</strong>
            </div>
          </div>
          <button
            type="button"
            className="resend"
            onClick={handleDispatchEmail}
            disabled={isSendingEmail || countdown > 240}
          >
            <RefreshCw size={11} className={isSendingEmail ? 'spin' : ''} />
            <span>{isSendingEmail ? 'Sending...' : 'Resend'}</span>
          </button>
        </EmailNotice>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#111110' }}>
            {method === 'totp' ? 'Enter 6-digit code from authenticator' : 'Enter 6-digit code sent to inbox'}
          </span>
          <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#72716d' }}>
            {otpCode.length}/6 digits
          </span>
        </div>

        <OtpInputBoxes
          value={otpCode}
          onChange={setOtpCode}
          onComplete={handleVerify}
          disabled={isVerifying}
        />
      </div>

      {errorMsg && <span style={{ fontSize: '12.5px', color: '#c8102e', textAlign: 'center' }}>{errorMsg}</span>}

      {noticeMsg && (
        <div
          style={{
            fontSize: '11.5px',
            color: '#111110',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            padding: '8px 12px',
            lineHeight: 1.45,
            textAlign: 'center',
          }}
        >
          {noticeMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
        <GhostButton $small type="button" onClick={onBack} style={{ flex: 1 }}>
          <ArrowLeft size={14} /> Back
        </GhostButton>
        <PrimaryButton
          type="button"
          onClick={() => handleVerify()}
          disabled={otpCode.length < 6 || isVerifying}
          style={{ flex: 2 }}
        >
          {isVerifying ? 'Verifying...' : 'Authenticate'} &rarr;
        </PrimaryButton>
      </div>
    </Container>
  );
}
