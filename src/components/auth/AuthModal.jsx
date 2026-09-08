import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, CheckCircle2, UserPlus, LogIn, Shield } from 'lucide-react';
import { PrimaryButton } from '../common/Button.jsx';
import MfaSetupChoice from './MfaSetupChoice.jsx';
import TotpQrEnrollment from './TotpQrEnrollment.jsx';
import MfaVerificationScreen from './MfaVerificationScreen.jsx';
import { loginUser, signupUser } from '../../services/authApi';

// Modal overlay with backdrop blur
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(17, 17, 16, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// Centered modal card adhering to design tokens
const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(17, 17, 16, 0.16);
  position: relative;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.soft};
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.ink};
    border-color: ${(props) => props.theme.colors.borderHi};
  }
`;

// Tab Bar for [ Sign In | Create Account ]
const TabsHeader = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 6px 16px 0;
  gap: 8px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 11px 16px;
  background: ${(props) => (props.$active ? props.theme.colors.white : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.border : 'transparent')};
  border-bottom: ${(props) => (props.$active ? `1px solid ${props.theme.colors.white}` : 'none')};
  margin-bottom: ${(props) => (props.$active ? '-1px' : '0')};
  border-radius: 8px 8px 0 0;
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

const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 14px 0 38px;
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.button};
  font-size: 13.5px;
  color: ${(props) => props.theme.colors.ink};
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.red};
    background-color: white;
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.redLight};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: ${(props) => props.theme.colors.soft};
  cursor: pointer;
  user-select: none;
  margin-top: 2px;

  input[type='checkbox'] {
    accent-color: ${(props) => props.theme.colors.red};
    width: 15px;
    height: 15px;
  }
`;

const SuccessOverlay = styled.div`
  background-color: ${(props) => props.theme.colors.redLight};
  border: 1px solid ${(props) => props.theme.colors.redMid};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;

  h4 {
    font-size: 16px;
    font-weight: 800;
    color: ${(props) => props.theme.colors.ink};
  }

  p {
    font-size: 13px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

/**
 * Authentication Modal ("Secure Portal")
 * Strictly complies with:
 * - Header: "Secure Portal"
 * - Sign Up Flow: Asks purely for Email and Password (no name/phone). On submit -> 2FA choice ("Send Code to Email" or "Authenticator App").
 * - TOTP QR Code: Embeds user email into URI: Faculty Guard (user@school.edu).
 * - Sign In Flow: Email + Password + "Remember me on this workstation" checkbox.
 * - Returning User Verification: Initiating login ALWAYS requires MFA.
 * - NO prefilled placeholder data in any inputs.
 */
export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [step, setStep] = useState('credentials'); // 'credentials' | 'mfa_choice' | 'totp_qr' | 'mfa_verify' | 'success'
  // Strictly empty inputs per spec: no prefilled placeholder data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preAuthData, setPreAuthData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (activeTab === 'signup') {
        // Sign Up Flow: Calls /auth/signup
        const response = await signupUser({ email, password });
        setPreAuthData(response);
        // Transition to 2FA choice selector
        setStep('mfa_choice');
      } else {
        // Sign In Flow: Calls /auth/login
        const response = await loginUser({ email, password, remember_me: rememberMe });
        setPreAuthData(response);
        // Transition to MFA verification screen
        setStep('mfa_verify');
      }
    } catch {
      setErrorMsg('Unable to validate credentials. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMethodChoice = (selectedMethod) => {
    if (selectedMethod === 'totp') {
      setStep('totp_qr');
    } else {
      setPreAuthData((prev) => ({
        ...prev,
        default_method: 'email',
      }));
      setStep('mfa_verify');
    }
  };

  const handleMfaVerified = (verificationResult) => {
    setStep('success');
    if (verificationResult?.access_token) {
      localStorage.setItem('faculty_guard_token', verificationResult.access_token);
    }

    setTimeout(() => {
      onSuccess?.(verificationResult);
      onClose();
      // Reset state for next clean launch
      setStep('credentials');
      setEmail('');
      setPassword('');
      setRememberMe(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalCard
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Secure Portal Header */}
          <HeaderBar>
            <div className="title-group">
              <Shield size={16} color="#c8102e" />
              <span>Secure Portal</span>
            </div>
            <CloseButton onClick={onClose} aria-label="Close modal">
              <X size={15} />
            </CloseButton>
          </HeaderBar>

          {/* Tab bar for Sign In / Sign Up */}
          {step === 'credentials' && (
            <TabsHeader>
              <TabButton
                $active={activeTab === 'login'}
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                type="button"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </TabButton>
              <TabButton
                $active={activeTab === 'signup'}
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg('');
                }}
                type="button"
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </TabButton>
            </TabsHeader>
          )}

          <CardBody>
            {/* Step 1: Credentials Form */}
            {step === 'credentials' && (
              <Form onSubmit={handleCredentialsSubmit}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111110' }}>
                    {activeTab === 'login' ? 'Faculty Sign In' : 'Create Educator Account'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#72716d', marginTop: '4px' }}>
                    {activeTab === 'login'
                      ? 'Enter your verified school credentials to access protected course files.'
                      : 'Enroll with your institutional email to enable anomaly detection.'}
                  </p>
                </div>

                <Field>
                  <label>Institutional Email</label>
                  <InputWrap>
                    <Mail size={16} />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. smith@institution.edu"
                      autoFocus
                    />
                  </InputWrap>
                </Field>

                <Field>
                  <label>Password</label>
                  <InputWrap>
                    <Lock size={16} />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your master password"
                    />
                  </InputWrap>
                </Field>

                {activeTab === 'login' && (
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me on this workstation</span>
                  </CheckboxLabel>
                )}

                {errorMsg && <span style={{ fontSize: '12.5px', color: '#c8102e' }}>{errorMsg}</span>}

                <PrimaryButton
                  type="submit"
                  style={{ width: '100%', marginTop: '4px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Validating...'
                    : activeTab === 'login'
                    ? 'Continue to Verification'
                    : 'Create Account & Choose 2FA'} &rarr;
                </PrimaryButton>
              </Form>
            )}

            {/* Step 2 (Sign Up): 2FA Choice Selection */}
            {step === 'mfa_choice' && (
              <MfaSetupChoice
                email={email}
                onSelectMethod={handleMethodChoice}
                onBack={() => setStep('credentials')}
              />
            )}

            {/* Step 3 (Sign Up): Authenticator App QR Enrollment */}
            {step === 'totp_qr' && (
              <TotpQrEnrollment
                registeredEmail={email}
                preAuthToken={preAuthData?.pre_auth_token}
                onConfirmed={handleMfaVerified}
                onCancel={() => setStep('mfa_choice')}
              />
            )}

            {/* Step 4 (Sign In or Email Setup): Multi-Factor Verification */}
            {step === 'mfa_verify' && (
              <MfaVerificationScreen
                preAuthData={preAuthData}
                onVerified={handleMfaVerified}
                onBack={() => setStep('credentials')}
              />
            )}

            {/* Step 5: Success confirmation */}
            {step === 'success' && (
              <SuccessOverlay>
                <CheckCircle2 size={36} color="#c8102e" />
                <div>
                  <h4>Identity Confirmed</h4>
                  <p>JWT session established. Redirecting to course file hub...</p>
                </div>
              </SuccessOverlay>
            )}
          </CardBody>
        </ModalCard>
      </Overlay>
    </AnimatePresence>
  );
}
