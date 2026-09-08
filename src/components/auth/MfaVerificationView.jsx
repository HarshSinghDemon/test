import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { PrimaryButton, GhostButton } from '../common/Button.jsx';
import OtpInputBoxes from './OtpInputBoxes.jsx';
import { sendEmailOtp, verifyMfaCode } from '../../services/authApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${(props) => props.theme.colors.redLight};
  border: 1px solid ${(props) => props.theme.colors.redMid};
  border-radius: ${(props) => props.theme.radii.pill};
  padding: 4px 12px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.red};
`;

// Method Selector Toggle: [ Authenticator App | Email Code ]
const MethodToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
`;

const ToggleOption = styled.button`
  padding: 10px 12px;
  background-color: ${(props) => (props.$active ? props.theme.colors.white : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.border : 'transparent')};
  border-radius: 6px;
  box-shadow: ${(props) => (props.$active ? '0 2px 6px rgba(0,0,0,0.04)' : 'none')};
  font-size: 13px;
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  color: ${(props) => (props.$active ? props.theme.colors.ink : props.theme.colors.soft)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.ink};
  }
`;

const InstructionPanel = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
  color: ${(props) => props.theme.colors.soft};
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  strong {
    color: ${(props) => props.theme.colors.ink};
  }
`;

const ExpiryTimer = styled.div`
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 11.5px;
  color: ${(props) => props.theme.colors.soft};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusBanner = styled(motion.div)`
  background-color: ${(props) =>
    props.$error ? props.theme.colors.redLight : props.theme.colors.surface};
  border: 1px solid
    ${(props) => (props.$error ? props.theme.colors.redMid : props.theme.colors.border)};
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${(props) => (props.$error ? props.theme.colors.red : props.theme.colors.ink)};
`;

/**
 * Step 2: Multi-Factor Verification View
 * Displays method selector (Authenticator App or Email Code).
 * Auto-submits on 6-digit entry with auto-focus and backspace navigation.
 */
export default function MfaVerificationView({
  preAuthData,
  onVerified,
  onBack,
  onOpenTotpSetup,
}) {
  const [selectedMethod, setSelectedMethod] = useState(preAuthData?.default_method || 'totp');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(300);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Countdown timer for email code expiration
  useEffect(() => {
    if (!emailSent || emailCountdown <= 0) return;
    const timer = setInterval(() => {
      setEmailCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailSent, emailCountdown]);

  const handleSendEmailCode = async () => {
    setIsSendingEmail(true);
    setErrorMessage('');
    try {
      await sendEmailOtp(preAuthData?.pre_auth_token || '');
      setEmailSent(true);
      setEmailCountdown(300);
    } catch (err) {
      setErrorMessage('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerify = async (candidateCode) => {
    const codeToSubmit = candidateCode || code;
    if (codeToSubmit.length < 6) return;

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const result = await verifyMfaCode({
        pre_auth_token: preAuthData?.pre_auth_token || '',
        method: selectedMethod,
        code: codeToSubmit,
      });
      onVerified?.(result);
    } catch (err) {
      setErrorMessage(err.message || 'Verification code invalid or expired. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Container>
      <HeaderBlock>
        <Badge>
          <ShieldCheck size={14} />
          <span>Security Verification</span>
        </Badge>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111110', marginTop: '4px' }}>
          Confirm Your Identity
        </h3>
        <p style={{ fontSize: '13px', color: '#72716d' }}>
          Choose your preferred verification method to access your files.
        </p>
      </HeaderBlock>

      {/* Dual Method Selector */}
      <MethodToggle>
        <ToggleOption
          type="button"
          $active={selectedMethod === 'totp'}
          onClick={() => {
            setSelectedMethod('totp');
            setCode('');
            setErrorMessage('');
          }}
        >
          <Smartphone size={15} />
          <span>Authenticator App</span>
        </ToggleOption>

        <ToggleOption
          type="button"
          $active={selectedMethod === 'email'}
          onClick={() => {
            setSelectedMethod('email');
            setCode('');
            setErrorMessage('');
            if (!emailSent) {
              handleSendEmailCode();
            }
          }}
        >
          <Mail size={15} />
          <span>Email Code</span>
        </ToggleOption>
      </MethodToggle>

      {/* Specific Instructions based on chosen method */}
      {selectedMethod === 'totp' ? (
        <InstructionPanel>
          <span>
            Enter the 6-digit rolling code displayed in <strong>Google Authenticator</strong> or <strong>Authy</strong>.
          </span>
          <GhostButton
            $small
            type="button"
            onClick={onOpenTotpSetup}
            style={{ fontSize: '11.5px', padding: '4px 10px' }}
          >
            <QrCode size={13} /> Need to enroll new device?
          </GhostButton>
        </InstructionPanel>
      ) : (
        <InstructionPanel>
          <span>
            {emailSent
              ? `Verification code dispatched to ${preAuthData?.masked_email || 'school email'}.`
              : `Click below to send a 6-digit code to ${preAuthData?.masked_email || 'your email'}.`}
          </span>

          {!emailSent ? (
            <PrimaryButton
              type="button"
              $small
              onClick={handleSendEmailCode}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? 'Sending Code...' : `Send Code to ${preAuthData?.masked_email || 'Email'}`}
            </PrimaryButton>
          ) : (
            <ExpiryTimer>
              <span>Expires in: {formatSeconds(emailCountdown)}</span>
              {emailCountdown === 0 && (
                <button
                  type="button"
                  onClick={handleSendEmailCode}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c8102e',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Resend Code
                </button>
              )}
            </ExpiryTimer>
          )}
        </InstructionPanel>
      )}

      {/* 6-box input with JetBrains Mono font & auto-focus */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#111110' }}>
          Enter 6-Digit Code
        </span>
        <OtpInputBoxes
          value={code}
          onChange={setCode}
          onComplete={handleVerify}
          disabled={isVerifying}
        />
      </div>

      {/* Error display */}
      <AnimatePresence>
        {errorMessage && (
          <StatusBanner
            $error
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </StatusBanner>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <PrimaryButton
          type="button"
          onClick={() => handleVerify()}
          disabled={code.length < 6 || isVerifying}
          style={{ width: '100%' }}
        >
          {isVerifying ? 'Verifying...' : 'Verify & Open Portal'} <ArrowRight size={15} />
        </PrimaryButton>

        <GhostButton $small type="button" onClick={onBack} style={{ alignSelf: 'center' }}>
          &larr; Back to login
        </GhostButton>
      </div>
    </Container>
  );
}
