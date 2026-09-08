import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { X, QrCode, Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../common/Button.jsx';
import OtpInputBoxes from './OtpInputBoxes.jsx';
import { setupTotpEnrollment } from '../../services/authApi';

const SetupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const InstructionText = styled.p`
  font-size: 13.5px;
  color: ${(props) => props.theme.colors.soft};
  line-height: 1.55;
  max-width: 360px;
`;

const QrContainer = styled.div`
  padding: 14px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 150px;
    height: 150px;
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
  padding: 8px 12px;
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 13px;
  color: ${(props) => props.theme.colors.ink};
  user-select: all;

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
      color: ${(props) => props.theme.colors.ink};
    }
  }
`;

export default function TotpSetupModal({ onConfirmed, onCancel }) {
  const [setupData, setSetupData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setupTotpEnrollment().then((res) => setSetupData(res));
  }, []);

  const handleCopyKey = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCompleteSetup = (codeToVerify) => {
    const code = codeToVerify || confirmCode;
    if (code.length < 6) return;

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      onConfirmed?.();
    }, 500);
  };

  return (
    <SetupWrapper>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111110' }}>
          Set Up Authenticator App
        </h3>
        <InstructionText style={{ marginTop: '6px' }}>
          Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below to secure your account.
        </InstructionText>
      </div>

      {setupData && (
        <>
          <QrContainer>
            <img src={setupData.qr_code_base64} alt="Authenticator App QR Code" />
          </QrContainer>

          <SecretKeyWrap>
            <span>{setupData.secret}</span>
            <button type="button" onClick={handleCopyKey}>
              {copied ? <Check size={13} color="#c8102e" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </SecretKeyWrap>
        </>
      )}

      <div style={{ width: '100%', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#111110' }}>
          Enter 6-digit code from app to confirm
        </span>
        <OtpInputBoxes
          value={confirmCode}
          onChange={setConfirmCode}
          onComplete={handleCompleteSetup}
          disabled={isVerifying}
        />
      </div>

      {errorMsg && (
        <span style={{ fontSize: '12px', color: '#c8102e' }}>{errorMsg}</span>
      )}

      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <GhostButton $small type="button" onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </GhostButton>
        <PrimaryButton
          type="button"
          onClick={() => handleCompleteSetup()}
          disabled={confirmCode.length < 6 || isVerifying}
          style={{ flex: 2 }}
        >
          {isVerifying ? 'Confirming...' : 'Complete Setup'} <ArrowRight size={15} />
        </PrimaryButton>
      </div>
    </SetupWrapper>
  );
}
