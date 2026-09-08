import React from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../common/Button.jsx';
import StatusPill from '../common/StatusPill.jsx';
import AnimatedCounter from '../common/AnimatedCounter.jsx';
import DashboardMockup from './DashboardMockup.jsx';

const HeroSection = styled.section`
  background-color: ${(props) => props.theme.colors.offWhite};
  padding: 88px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const Wrapper = styled.div`
  max-width: 1140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

// Subtle ambient metrics row above headline
const AmbientBar = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.pill};
  padding: 6px 16px;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  div.metric {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.ink};
  }

  span.divider {
    width: 1px;
    height: 14px;
    background-color: ${(props) => props.theme.colors.border};
  }
`;

// Huge typography: 72px - 80px on desktop
const HugeHeadline = styled.h1`
  font-size: clamp(42px, 6.2vw, 78px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: ${(props) => props.theme.colors.ink};
  max-width: 960px;
  margin-bottom: 24px;

  span.accent {
    color: ${(props) => props.theme.colors.red};
  }
`;

const PlainSubline = styled.p`
  font-size: clamp(16px, 1.35vw, 19.5px);
  font-weight: 400;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.soft};
  max-width: 680px;
  margin-bottom: 36px;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 56px;
  flex-wrap: wrap;
`;

const FloatingMockupWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1080px;
  position: relative;
  border-radius: ${(props) => props.theme.radii.card};
  box-shadow: ${(props) => props.theme.shadows.commandCenter};
`;

/**
 * HeroCommandCenter Component
 * Warm/off-white background.
 * Huge typography ("Protect what students should never download" - 72-80px).
 * Subtle ambient elements (Protected files count, last scan time).
 * Floating animated dashboard mockup underneath showing active security status.
 */
export default function HeroCommandCenter({ onOpenAuth }) {
  const scrollToDemo = () => {
    const el = document.getElementById('incident-walkthrough');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <HeroSection id="hero">
      <Wrapper>
        {/* Subtle ambient metrics bar */}
        <AmbientBar
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="metric">
            <StatusPill status="green" label="Active Protection" />
          </div>
          <span className="divider" />
          <div className="metric">
            <FileCheck size={14} color="#10b981" />
            <span>
              <AnimatedCounter target={2840} prefix="" suffix=" Files Protected" />
            </span>
          </div>
          <span className="divider" />
          <div className="metric">
            <Clock size={14} color="#72716d" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px', color: '#72716d' }}>
              Last scan: Just now
            </span>
          </div>
        </AmbientBar>

        {/* Huge Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <HugeHeadline>
            Protect what students should <span className="accent">never download.</span>
          </HugeHeadline>
        </motion.div>

        {/* Plain English Subline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <PlainSubline>
            Faculty Guard monitors exam files and gradebooks in the background. When unusual downloads happen outside
            normal teaching hours, access auto-locks instantly before tests leak.
          </PlainSubline>
        </motion.div>

        {/* Action Buttons with translateY(-2px) micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <ActionsRow>
            <PrimaryButton onClick={onOpenAuth}>
              Open Secure Portal <ArrowRight size={16} />
            </PrimaryButton>
            <GhostButton $bordered onClick={scrollToDemo}>
              See Live Incident Simulation
            </GhostButton>
          </ActionsRow>
        </motion.div>

        {/* Floating animated dashboard mockup */}
        <FloatingMockupWrapper
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
        >
          <DashboardMockup />
        </FloatingMockupWrapper>
      </Wrapper>
    </HeroSection>
  );
}
