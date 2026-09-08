import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  RefreshCw,
  Clock,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import StatusPill from '../common/StatusPill.jsx';
import { evaluate_risk } from '../../services/securityEngine';

const DarkSection = styled.section`
  background-color: ${(props) => props.theme.colors.darkBg};
  color: ${(props) => props.theme.colors.white};
  padding: 104px 24px 104px;
  border-bottom: 1px solid ${(props) => props.theme.colors.darkBorder};
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const SectionHeader = styled.div`
  max-width: 720px;

  h2 {
    font-size: clamp(32px, 4vw, 44px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${(props) => props.theme.colors.white};
    line-height: 1.15;
  }

  p {
    font-size: 15.5px;
    color: #a8a5a0;
    margin-top: 14px;
    line-height: 1.6;
  }
`;

// Stage progress tabs
const StageNav = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StageTab = styled.button`
  background-color: ${(props) => (props.$active ? '#1c1c1a' : '#141413')};
  border: 1px solid ${(props) => (props.$active ? '#383834' : props.theme.colors.darkBorder)};
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: #4a4a45;
    transform: translateY(-2px);
  }

  span.step-tag {
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 10.5px;
    font-weight: 700;
    color: #a8a5a0;
  }

  span.title {
    font-size: 13.5px;
    font-weight: 700;
    color: ${(props) => (props.$active ? props.theme.colors.white : '#72716d')};
  }
`;

// Interactive Incident Terminal Box
const SimulationConsole = styled.div`
  background-color: #161615;
  border: 1px solid ${(props) => props.theme.colors.darkBorder};
  border-radius: ${(props) => props.theme.radii.card};
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
`;

const ConsoleBar = styled.div`
  background-color: #10100f;
  border-bottom: 1px solid ${(props) => props.theme.colors.darkBorder};
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div.left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 11.5px;
    color: #a8a5a0;
  }
`;

const ConsoleBody = styled.div`
  padding: 32px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const IncidentLogCard = styled.div`
  background-color: #1b1b19;
  border: 1px solid ${(props) => props.theme.colors.darkBorder};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TelemetryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background-color: #131312;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #242421;

  .item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span.label {
      font-size: 11px;
      color: #72716d;
      font-weight: 600;
    }

    span.val {
      font-family: ${(props) => props.theme.typography.monoFont};
      font-size: 12.5px;
      font-weight: 700;
      color: #ffffff;
    }
  }
`;

const ReasonsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #131312;
  padding: 14px 16px;
  border-radius: 6px;
  border: 1px solid #242421;

  span.title {
    font-size: 11.5px;
    font-weight: 700;
    color: #a8a5a0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 12.5px;
    color: #d4d0c8;
    line-height: 1.5;
  }
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  background-color: #1b1b19;
  border: 1px solid ${(props) => props.theme.colors.darkBorder};
  border-radius: 8px;
  padding: 24px;
`;

const SimulationButton = styled.button`
  padding: 12px 20px;
  background-color: ${(props) => (props.$primary ? '#c8102e' : '#242422')};
  color: #ffffff;
  border: 1px solid ${(props) => (props.$primary ? '#c8102e' : '#383834')};
  border-radius: 6px;
  font-family: ${(props) => props.theme.typography.displayFont};
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: ${(props) => (props.$primary ? '#9e0d24' : '#2d2d2a')};
    transform: translateY(-2px);
  }
`;

/**
 * IncidentWalkthrough Component
 * Dark charcoal interactive simulation:
 * 1. Anomaly detected (400 files / 4 min)
 * 2. Suspicious flag (Amber)
 * 3. Access Locked (Red)
 * 4. User verifies via MFA to unlock (Green)
 */
export default function IncidentWalkthrough() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Anomaly, 2: Suspicious, 3: Locked, 4: Unlocked

  const stages = [
    { step: 1, label: '01. BURST', name: '400 Files / 4 Min' },
    { step: 2, label: '02. ANALYZE', name: 'Flagged Suspicious' },
    { step: 3, label: '03. AUTO-LOCK', name: 'Access Blocked' },
    { step: 4, label: '04. RESTORE', name: 'MFA Unlocked' },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <DarkSection id="protection">
      <Container id="incident-walkthrough">
        <SectionHeader>
          <StatusPill status="amber" label="Interactive Incident Simulation" />
          <h2 style={{ marginTop: '14px' }}>Watch what happens during an exam scrape attempt.</h2>
          <p>
            Experience how the automated engine detects bursts, locks down files before damage occurs, and safely
            unlocks with a two-step code.
          </p>
        </SectionHeader>

        {/* Step Tabs */}
        <StageNav>
          {stages.map((st) => (
            <StageTab
              key={st.step}
              $active={currentStep === st.step}
              onClick={() => setCurrentStep(st.step)}
              type="button"
            >
              <span className="step-tag">{st.label}</span>
              <span className="title">{st.name}</span>
            </StageTab>
          ))}
        </StageNav>

        {/* Terminal Simulation */}
        <SimulationConsole>
          <ConsoleBar>
            <div className="left">
              <span style={{ color: '#10b981' }}>&bull;</span>
              <span>LIVE INCIDENT STREAM: /audit-logs/stream-9921</span>
            </div>
            <div>
              {currentStep === 1 && <StatusPill status="amber" label="Burst In Progress" />}
              {currentStep === 2 && <StatusPill status="amber" label="Suspicious: Reviewing" />}
              {currentStep === 3 && <StatusPill status="red" label="STATUS: BLOCKED" />}
              {currentStep === 4 && <StatusPill status="green" label="STATUS: VERIFIED SAFE" />}
            </div>
          </ConsoleBar>

          <ConsoleBody>
            {/* Left: Telemetry & Explanation */}
            <IncidentLogCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Incident Telemetry</h4>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: currentStep >= 3 ? '#c8102e' : '#f59e0b',
                    fontWeight: 700,
                  }}
                >
                  {currentStep >= 3 ? 'RISK SCORE: 94/100' : 'RISK SCORE: 68/100'}
                </span>
              </div>

              <TelemetryGrid>
                <div className="item">
                  <span className="label">Observed Activity</span>
                  <span className="val" style={{ color: currentStep >= 1 ? '#f59e0b' : '#ffffff' }}>
                    412 files / 4 min
                  </span>
                </div>
                <div className="item">
                  <span className="label">Timestamp</span>
                  <span className="val">03:14:22 AM Campus Time</span>
                </div>
                <div className="item">
                  <span className="label">IP Address</span>
                  <span className="val">172.56.21.9 (VPN Node)</span>
                </div>
                <div className="item">
                  <span className="label">Target Directory</span>
                  <span className="val">/CS401_Master_Exams/</span>
                </div>
              </TelemetryGrid>

              <ReasonsBox>
                <span className="title">System Evaluation</span>
                {currentStep === 1 && (
                  <p>
                    Rapid batch requests detected. Download rate is 137x higher than professor's historical baseline of
                    3 files per hour.
                  </p>
                )}
                {currentStep === 2 && (
                  <p>
                    Cross-referenced time (03:14 AM) and geographic signature (commercial VPN). Traffic does not match
                    faculty's usual workstation.
                  </p>
                )}
                {currentStep === 3 && (
                  <p style={{ color: '#f5c5cc' }}>
                    <strong>Access Paused:</strong> Exam repository has been auto-locked. Further requests are rejected
                    instantly to preserve academic integrity.
                  </p>
                )}
                {currentStep === 4 && (
                  <p style={{ color: '#a7f3d0' }}>
                    <strong>Identity Confirmed:</strong> Educator validated identity using 6-digit Authenticator App
                    code. Session restored to legitimate professor.
                  </p>
                )}
              </ReasonsBox>
            </IncidentLogCard>

            {/* Right: Interactive Action Panel */}
            <ActionPanel>
              <div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#a8a5a0',
                  }}
                >
                  Step {currentStep} of 4
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>
                  {currentStep === 1 && 'Unusual Download Burst'}
                  {currentStep === 2 && 'Automated Risk Scoring'}
                  {currentStep === 3 && 'Course File Lockdown'}
                  {currentStep === 4 && 'Restored via 2-Step MFA'}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#a8a5a0', marginTop: '8px', lineHeight: 1.55 }}>
                  {currentStep === 1 &&
                    'A script attempts to dump all exam files at 3 AM. The burst detector calculates immediate deviation.'}
                  {currentStep === 2 &&
                    'Isolation Forest intelligence correlates night-time access with an unrecognized commercial VPN network.'}
                  {currentStep === 3 &&
                    'The repository cuts off downloading automatically. Even with stolen credentials, access is halted.'}
                  {currentStep === 4 &&
                    'Legitimate educators unlock files in 5 seconds with an Authenticator App or school email code.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentStep < 4 ? (
                  <SimulationButton $primary onClick={handleNext}>
                    {currentStep === 1 && 'Analyze Anomaly Details &rarr;'}
                    {currentStep === 2 && 'Trigger Automated Lock &rarr;'}
                    {currentStep === 3 && 'Simulate Educator MFA Unlock &rarr;'}
                  </SimulationButton>
                ) : (
                  <SimulationButton $primary onClick={handleReset}>
                    <RefreshCw size={14} /> Restart Incident Simulation
                  </SimulationButton>
                )}

                <SimulationButton onClick={handleReset}>
                  Reset to Step 01
                </SimulationButton>
              </div>
            </ActionPanel>
          </ConsoleBody>
        </SimulationConsole>
      </Container>
    </DarkSection>
  );
}
