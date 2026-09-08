import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Copy, Check, ArrowRight, Shield } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../common/Button.jsx';
import OtpInputBoxes from './OtpInputBoxes.jsx';
import { setupTotpEnrollment, verifyMfaCode } from '../../services/authApi';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const InstructionText = styled.p`
  font-size: 13px;
  color: ${(props) => props.theme.colors.soft};
  line-height: 1.5;
  max-width: 360px;
`;

const EmailBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 11px;
  color: ${(props) => props.theme.colors.ink};
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  padding: 3px 8px;
  margin-top: 6px;
`;

const QrContainer = styled.div`
  padding: 12px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 145px;
    height: 145px;
    display: block;
  }
`;

const SecretKeyWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  padding: 6px 12px;
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 12.5px;
  color: ${(props) => props.theme.colors.ink};

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${(props) => props.theme.colors.soft};
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-family: inherit;

    &:hover {
      color: ${(props) => props.theme.colors.red};
    }
  }
`;

/**
 * TotpQrEnrollment Component
 * Displays the authenticator QR code embedding the educator's registered email address.
 */
export default function TotpQrEnrollment({ registeredEmail, preAuthToken, onConfirmed, onCancel }) {
  const [setupData, setSetupData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setupTotpEnrollment(preAuthToken, registeredEmail).then((res) => {
      setSetupData(res);
    });
  }, [preAuthToken, registeredEmail]);

  const handleCopyKey = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = async (codeToVerify) => {
    const code = codeToVerify || confirmCode;
    if (code.length < 6) return;

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await verifyMfaCode({
        pre_auth_token: preAuthToken || '',
        email: registeredEmail,
        method: 'totp',
        code,
      });
      onConfirmed?.(res);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid code. Check your Google Authenticator or Authy app and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Wrapper>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111110' }}>
          Set Up Authenticator App
        </h3>
        <EmailBadge>
          <Shield size={11} color="#10b981" />
          <span>Account: {registeredEmail || setupData?.registered_email || 'dr.smith@institution.edu'}</span>
        </EmailBadge>
        <InstructionText style={{ marginTop: '8px' }}>
          Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below to secure your
          account.
        </InstructionText>
      </div>

      {setupData && (
        <>
          <QrContainer>
            <img src={setupData.qr_code_base64} alt="Authenticator App QR Code" />
          </QrContainer>

          <SecretKeyWrap>
            <span>Manual Key: {setupData.secret}</span>
            <button type="button" onClick={handleCopyKey}>
              {copied ? <Check size={12} color="#c8102e" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </SecretKeyWrap>
        </>
      )}

      <div style={{ width: '100%', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#111110' }}>
          Enter 6-digit verification code to confirm
        </span>
        <OtpInputBoxes
          value={confirmCode}
          onChange={setConfirmCode}
          onComplete={handleComplete}
          disabled={isVerifying}
        />
      </div>

      {errorMsg && <span style={{ fontSize: '12px', color: '#c8102e' }}>{errorMsg}</span>}

      <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '6px' }}>
        <GhostButton $small type="button" onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </GhostButton>
        <PrimaryButton
          type="button"
          onClick={() => handleComplete()}
          disabled={confirmCode.length < 6 || isVerifying}
          style={{ flex: 2 }}
        >
          {isVerifying ? 'Confirming...' : 'Secure Account'} <ArrowRight size={15} />
        </PrimaryButton>
      </div>
    </Wrapper>
  );
}
