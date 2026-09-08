import React from 'react';
import styled from 'styled-components';
import { Smartphone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { GhostButton } from '../common/Button.jsx';

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
    margin-top: 5px;
    line-height: 1.5;
  }
`;

const OptionCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background-color: ${(props) => (props.$recommended ? props.theme.colors.surface : props.theme.colors.white)};
  border: 1px solid ${(props) => (props.$recommended ? props.theme.colors.borderHi : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.radii.card};
  cursor: pointer;
  text-align: left;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: ${(props) => props.theme.colors.red};
    background-color: ${(props) => props.theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  svg.icon {
    flex-shrink: 0;
    color: ${(props) => (props.$recommended ? props.theme.colors.red : props.theme.colors.ink)};
    margin-top: 2px;
  }
`;

const OptionContent = styled.div`
  flex: 1;

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;

    span.title {
      font-size: 14px;
      font-weight: 700;
      color: ${(props) => props.theme.colors.ink};
    }

    span.badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: ${(props) => props.theme.colors.redLight};
      color: ${(props) => props.theme.colors.red};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  p.desc {
    font-size: 12.5px;
    color: ${(props) => props.theme.colors.soft};
    margin-top: 4px;
    line-height: 1.45;
  }
`;

/**
 * MfaSetupChoice Component
 * Displays post-signup options: "Authenticator App" vs "Send Code to Email"
 */
export default function MfaSetupChoice({ email, onSelectMethod, onBack }) {
  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <ShieldCheck size={22} />
          </div>
        </div>
        <h3>Select Your Verification Method</h3>
        <p>
          To safeguard course materials for <strong>{email}</strong>, select how you would like to receive two-step
          security codes.
        </p>
      </Header>

      {/* Option 1: Authenticator App (Recommended) */}
      <OptionCard
        type="button"
        $recommended={true}
        onClick={() => onSelectMethod('totp')}
      >
        <Smartphone size={20} className="icon" />
        <OptionContent>
          <div className="title-row">
            <span className="title">Authenticator App</span>
            <span className="badge">Recommended</span>
          </div>
          <p className="desc">
            Use Google Authenticator, Authy, or 1Password. Generates instant 6-digit codes offline without waiting for
            emails.
          </p>
        </OptionContent>
        <ArrowRight size={16} color="#72716d" style={{ alignSelf: 'center' }} />
      </OptionCard>

      {/* Option 2: Email Code */}
      <OptionCard
        type="button"
        $recommended={false}
        onClick={() => onSelectMethod('email')}
      >
        <Mail size={20} className="icon" />
        <OptionContent>
          <div className="title-row">
            <span className="title">Send Code to Email</span>
          </div>
          <p className="desc">
            Receive a single-use 6-digit passcode delivered to your verified institutional inbox with a 5-minute expiry.
          </p>
        </OptionContent>
        <ArrowRight size={16} color="#72716d" style={{ alignSelf: 'center' }} />
      </OptionCard>

      <GhostButton $small type="button" onClick={onBack} style={{ marginTop: '4px' }}>
        &larr; Back to Account Details
      </GhostButton>
    </Container>
  );
}
