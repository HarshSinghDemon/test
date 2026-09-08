import React from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../common/Button.jsx';
import DashboardMockup from './DashboardMockup.jsx';

const HeroSection = styled.section`
  background-color: ${(props) => props.theme.colors.white};
  padding: 104px 24px 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroWrapper = styled.div`
  max-width: 1140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Headline = styled.h1`
  font-size: clamp(38px, 5.2vw, 66px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  color: ${(props) => props.theme.colors.ink};
  max-width: 860px;
  margin-bottom: 20px;

  span.highlight {
    color: ${(props) => props.theme.colors.red};
  }
`;

const Subline = styled.p`
  font-size: clamp(16px, 1.3vw, 19px);
  font-weight: 400;
  line-height: 1.65;
  color: ${(props) => props.theme.colors.soft};
  max-width: 660px;
  margin-bottom: 32px;
`;

const CtaContainer = styled.div`
  margin-bottom: 52px;
`;

const MockupWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1080px;
`;

/**
 * Hero Component
 * Displays the specified headline, subline explaining how it stops unauthorized access,
 * and the browser-framed file manager dashboard mockup.
 */
export default function Hero({ onOpenAuth }) {
  return (
    <HeroSection id="hero">
      <HeroWrapper>
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Headline>
            Your exams and academic files, <span className="highlight">kept perfectly safe.</span>
          </Headline>
        </motion.div>

        {/* Subline explaining it stops unauthorized access */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Subline>
            Stop unauthorized downloads and protect sensitive files. If unusual activity occurs outside normal hours or from unfamiliar locations, access is paused instantly.
          </Subline>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CtaContainer>
            <PrimaryButton onClick={onOpenAuth}>
              Access Files <ArrowRight size={16} />
            </PrimaryButton>
          </CtaContainer>
        </motion.div>

        {/* Browser-Framed Dashboard Mockup */}
        <MockupWrapper
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardMockup />
        </MockupWrapper>
      </HeroWrapper>
    </HeroSection>
  );
}
