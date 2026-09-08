import React from 'react';
import styled from 'styled-components';
import { Shield, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { PrimaryButton } from '../common/Button.jsx';

// Deep red near-black footer area
const FooterWrapper = styled.footer`
  background-color: ${(props) => props.theme.colors.deepRedFooter};
  color: ${(props) => props.theme.colors.white};
  padding: 88px 24px 44px;
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

// Final CTA Block
const CtaBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
  gap: 20px;

  h2 {
    font-size: clamp(32px, 4vw, 46px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: #ffffff;
  }

  p {
    font-size: 16px;
    color: #d4d0c8;
    line-height: 1.6;
  }
`;

const BadgesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  div.badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: #d4d0c8;
    font-weight: 500;

    svg {
      color: #10b981;
    }
  }
`;

const BottomLinksRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 13px;
  color: #a8a5a0;

  div.brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #ffffff;
  }

  div.nav {
    display: flex;
    gap: 24px;

    a {
      color: #d4d0c8;
      text-decoration: none;
      transition: color 0.15s ease;

      &:hover {
        color: #ffffff;
      }
    }
  }
`;

/**
 * Strong Footer Component
 * Deep red / near-black final CTA area integrating seamlessly into the footer links.
 */
export default function Footer({ onOpenAuth }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <FooterWrapper id="footer">
      <Container>
        {/* Final CTA block */}
        <CtaBlock>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(200, 16, 46, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={22} color="#c8102e" />
          </div>
          <h2>Ready to safeguard your exam repository?</h2>
          <p>
            Setup takes under 2 minutes. Protect files against scraping scripts and unauthorized off-campus downloads.
          </p>
          <PrimaryButton onClick={onOpenAuth} style={{ marginTop: '8px' }}>
            Open Secure Portal <ArrowRight size={16} />
          </PrimaryButton>
        </CtaBlock>

        {/* Security Compliance Badges */}
        <BadgesRow>
          <div className="badge">
            <CheckCircle size={15} />
            <span>256-Bit Encrypted at Rest</span>
          </div>
          <div className="badge">
            <CheckCircle size={15} />
            <span>Zero Student PII Harvested</span>
          </div>
          <div className="badge">
            <CheckCircle size={15} />
            <span>FERPA & Institutional Compliant</span>
          </div>
          <div className="badge">
            <CheckCircle size={15} />
            <span>RFC 6238 TOTP Standard</span>
          </div>
        </BadgesRow>

        {/* Bottom copyright and quick links */}
        <BottomLinksRow>
          <div className="brand">
            <Shield size={16} color="#c8102e" />
            <span>Faculty Guard &bull; Security & Anomaly Detection</span>
          </div>

          <div className="nav">
            <a href="#features" onClick={() => scrollToSection('features')}>
              Features
            </a>
            <a href="#protection" onClick={() => scrollToSection('protection')}>
              Protection
            </a>
            <a href="#hero" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </a>
          </div>

          <div>&copy; {new Date().getFullYear()} Faculty Guard. Built for Higher Education.</div>
        </BottomLinksRow>
      </Container>
    </FooterWrapper>
  );
}
