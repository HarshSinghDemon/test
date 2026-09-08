import React from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { Eye, MapPin, Lock, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import StatusPill from '../common/StatusPill.jsx';

const Section = styled.section`
  background-color: ${(props) => props.theme.colors.white};
  padding: 104px 24px 96px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 72px;
`;

const SectionHeader = styled.div`
  max-width: 680px;

  h2 {
    font-size: clamp(32px, 4vw, 44px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${(props) => props.theme.colors.ink};
    line-height: 1.15;
  }

  p {
    font-size: 16px;
    color: ${(props) => props.theme.colors.soft};
    margin-top: 14px;
    line-height: 1.6;
  }
`;

// Flow container connecting the 3 sequential steps
const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
`;

const StepRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  gap: 32px;
  align-items: center;
  padding: 36px 40px;
  background-color: ${(props) => props.theme.colors.offWhite};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.borderHi};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 28px 24px;
  }
`;

const StepNumber = styled.div`
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.$accentColor || props.theme.colors.ink};
  letter-spacing: -0.04em;
  display: flex;
  flex-direction: column;
  gap: 4px;

  span.label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

const StepText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    font-size: 22px;
    font-weight: 800;
    color: ${(props) => props.theme.colors.ink};
    letter-spacing: -0.02em;
  }

  p {
    font-size: 14.5px;
    line-height: 1.6;
    color: ${(props) => props.theme.colors.soft};
  }
`;

const StepTelemetry = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .telemetry-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;

    span.key {
      font-weight: 600;
      color: ${(props) => props.theme.colors.soft};
    }

    span.val {
      font-family: ${(props) => props.theme.typography.monoFont};
      font-weight: 700;
      color: ${(props) => props.theme.colors.ink};
    }
  }
`;

/**
 * StoryFeatures Component
 * Visual flow replacing generic cards:
 * 01 DETECT (Unusual behavior) -> 02 ANALYZE (Time + Location) -> 03 PROTECT (Auto-lock)
 */
export default function StoryFeatures() {
  return (
    <Section id="features">
      <Container>
        <SectionHeader>
          <StatusPill status="green" label="Three-Step Defense" />
          <h2 style={{ marginTop: '12px' }}>How Faculty Guard stops leaks in seconds.</h2>
          <p>
            No complex setup or security jargon. When exams or grading sheets are touched in ways that don't fit typical
            faculty patterns, the system steps in automatically.
          </p>
        </SectionHeader>

        <FlowContainer>
          {/* 01 DETECT: Unusual Behavior */}
          <StepRow
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <StepNumber $accentColor="#f59e0b">
              <span>01</span>
              <span className="label">Step One</span>
            </StepNumber>

            <StepText>
              <h3>DETECT: Unusual Downloads</h3>
              <p>
                An educator typically opens 2 to 4 course documents an hour. When an account suddenly downloads hundreds
                of final exam PDFs in minutes, the activity is flagged immediately.
              </p>
            </StepText>

            <StepTelemetry>
              <div className="telemetry-row">
                <span className="key">Baseline Rate</span>
                <span className="val">3 files / hour</span>
              </div>
              <div className="telemetry-row">
                <span className="key">Observed Velocity</span>
                <span className="val" style={{ color: '#c8102e' }}>
                  412 files / 4 min
                </span>
              </div>
              <div className="telemetry-row">
                <span className="key">Flag Type</span>
                <StatusPill status="amber" label="Burst Anomaly" />
              </div>
            </StepTelemetry>
          </StepRow>

          {/* 02 ANALYZE: Time + Location */}
          <StepRow
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <StepNumber $accentColor="#111110">
              <span>02</span>
              <span className="label">Step Two</span>
            </StepNumber>

            <StepText>
              <h3>ANALYZE: Time & Location</h3>
              <p>
                Faculty Guard verifies whether the access matches campus office hours or regular grading schedules. If
                traffic originates from an overseas VPN node at 3:00 AM, the risk level escalates to critical.
              </p>
            </StepText>

            <StepTelemetry>
              <div className="telemetry-row">
                <span className="key">Timestamp</span>
                <span className="val">03:14 AM Campus Time</span>
              </div>
              <div className="telemetry-row">
                <span className="key">Network Node</span>
                <span className="val">IP 172.56.21.9 (VPN)</span>
              </div>
              <div className="telemetry-row">
                <span className="key">Risk Score</span>
                <span className="val" style={{ color: '#c8102e' }}>
                  94 / 100 (Critical)
                </span>
              </div>
            </StepTelemetry>
          </StepRow>

          {/* 03 PROTECT: Auto-Lock */}
          <StepRow
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <StepNumber $accentColor="#c8102e">
              <span>03</span>
              <span className="label">Step Three</span>
            </StepNumber>

            <StepText>
              <h3>PROTECT: Auto-Lock & Verify</h3>
              <p>
                The repository locks down instantly to halt the transfer. Legitimate faculty can restore access in
                seconds by confirming their identity with their Authenticator App or Email code.
              </p>
            </StepText>

            <StepTelemetry>
              <div className="telemetry-row">
                <span className="key">Automated Action</span>
                <span className="val" style={{ color: '#c8102e' }}>
                  STATUS: AUTO-LOCKED
                </span>
              </div>
              <div className="telemetry-row">
                <span className="key">Damage Prevented</span>
                <span className="val">Exams Secured</span>
              </div>
              <div className="telemetry-row">
                <span className="key">Restoration</span>
                <StatusPill status="green" label="MFA Unlock Required" />
              </div>
            </StepTelemetry>
          </StepRow>
        </FlowContainer>
      </Container>
    </Section>
  );
}
