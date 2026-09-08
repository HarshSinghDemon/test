import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  MousePointer,
  Download,
  AlertCircle,
  Lock,
  FileText,
  Smartphone,
  CheckCircle2,
  Folder,
} from 'lucide-react';

const SectionWrapper = styled.section`
  background-color: ${(props) => props.theme.colors.white};
  padding: 72px 24px;
`;

const Container = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.colors.ink};
  text-align: center;
`;

// Large, beautifully framed container for screen-recording demo
const RecordingContainer = styled.div`
  width: 100%;
  max-width: 980px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`;

// Video player chrome top bar
const PlayerHeader = styled.div`
  height: 44px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
`;

const RecordingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.ink};

  span.rec-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.red};
    animation: pulse 1.6s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ControlBtn = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.soft};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.ink};
  }
`;

const TimelineBar = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${(props) => props.theme.colors.border};
  position: relative;
`;

const TimelineProgress = styled.div`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background-color: ${(props) => props.theme.colors.red};
  transition: width 0.3s linear;
`;

// Simulated Screen Stage
const ScreenStage = styled.div`
  position: relative;
  min-height: 480px;
  background-color: #fafaf8;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
`;

// Simulated browser UI inside the recording
const InnerBrowser = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InnerNav = styled.div`
  padding: 12px 18px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  div.brand {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }

  div.user {
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 11px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

const InnerContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${(props) => (props.$targeted ? props.theme.colors.redLight : props.theme.colors.surface)};
  border: 1px solid ${(props) => (props.$targeted ? props.theme.colors.redMid : props.theme.colors.border)};
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s ease;

  div.info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.ink};
  }

  div.btn-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: ${(props) => (props.$downloading ? props.theme.colors.red : props.theme.colors.soft)};
    font-weight: 600;
  }
`;

// Smart Alert Banner inside recording
const AlertPopup = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 4px solid ${(props) => props.theme.colors.red};
  border-radius: 8px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(200, 16, 46, 0.1);

  div.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.colors.red};
  }

  p {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.ink};
    line-height: 1.5;
  }
`;

// Lock overlay state
const LockCard = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.redLight};
  border: 1px solid ${(props) => props.theme.colors.redMid};
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

// Animated simulated mouse cursor
const VirtualCursor = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));

  span.label {
    background-color: ${(props) => props.theme.colors.ink};
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: -4px;
    margin-left: 14px;
  }
`;

// Step footer description
const WalkthroughFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background-color: ${(props) => props.theme.colors.white};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  font-size: 13px;
  color: ${(props) => props.theme.colors.soft};
  flex-wrap: wrap;
  gap: 12px;

  span.active-step {
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }
`;

const StepDots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.button`
  width: ${(props) => (props.$active ? '20px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => (props.$active ? props.theme.colors.red : props.theme.colors.border)};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const STEPS = [
  {
    title: '1. Navigating the Portal',
    description: 'User enters the portal and browses exams and rubric files.',
    cursor: { top: '160px', left: '220px' },
    targetedFile: null,
    downloading: false,
    showAlert: false,
    isLocked: false,
  },
  {
    title: '2. Rapid Download Initiated',
    description: 'A burst of 400 exam documents is requested in under 4 minutes at 3:14 AM.',
    cursor: { top: '230px', left: '680px' },
    targetedFile: 'Calculus_Final_Exam_2026.pdf',
    downloading: true,
    showAlert: false,
    isLocked: false,
  },
  {
    title: '3. Smart Alert Triggered',
    description: 'The system flags the sudden spike from an unfamiliar location.',
    cursor: { top: '340px', left: '420px' },
    targetedFile: 'Calculus_Final_Exam_2026.pdf',
    downloading: false,
    showAlert: true,
    isLocked: false,
  },
  {
    title: '4. Automatic Account Lock',
    description: 'Downloads are paused instantly. A 6-digit confirmation code is sent to the phone.',
    cursor: { top: '410px', left: '500px' },
    targetedFile: null,
    downloading: false,
    showAlert: true,
    isLocked: true,
  },
];

/**
 * ProductWalkthrough Component
 * Large, framed screen-recording demo showing:
 * - Mouse cursor navigating the dashboard
 * - Downloading a file
 * - Triggering a smart alert
 * - The system locking the account
 */
export default function ProductWalkthrough() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 3600);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStep = STEPS[stepIndex];
  const progressPercent = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <SectionWrapper id="demo">
      <Container>
        <SectionTitle>Product Demo</SectionTitle>

        {/* Large, beautifully framed screen-recording container */}
        <RecordingContainer>
          <PlayerHeader>
            <RecordingBadge>
              <span className="rec-dot" />
              <span>Screen Recording &middot; Full Walkthrough</span>
            </RecordingBadge>

            <Controls>
              <ControlBtn onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </ControlBtn>
              <ControlBtn onClick={() => setStepIndex(0)}>
                <RotateCcw size={14} />
                <span>Replay</span>
              </ControlBtn>
            </Controls>
          </PlayerHeader>

          <TimelineBar>
            <TimelineProgress $percent={progressPercent} />
          </TimelineBar>

          <ScreenStage>
            {/* Simulated Animated Cursor */}
            <VirtualCursor
              animate={{
                top: currentStep.cursor.top,
                left: currentStep.cursor.left,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <MousePointer size={22} fill="#111110" color="#ffffff" />
              <span className="label">cursor</span>
            </VirtualCursor>

            {/* Inner Simulated Dashboard Window */}
            <InnerBrowser>
              <InnerNav>
                <div className="brand">Faculty Guard Portal</div>
                <div className="user">usr_9921_smith &middot; Faculty</div>
              </InnerNav>

              <InnerContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111110' }}>
                    My Files (248 Total)
                  </span>
                  <span style={{ fontSize: '11px', color: '#72716d' }}>
                    Active Session: Boston, MA
                  </span>
                </div>

                <FileList>
                  <FileCard
                    $targeted={currentStep.targetedFile === 'Calculus_Final_Exam_2026.pdf'}
                    $downloading={currentStep.downloading}
                  >
                    <div className="info">
                      <FileText size={16} color="#c8102e" />
                      <span>Calculus_Final_Exam_2026.pdf</span>
                    </div>
                    <div className="btn-wrap">
                      <Download size={14} />
                      <span>{currentStep.downloading ? 'Downloading 400 Files...' : 'Download File'}</span>
                    </div>
                  </FileCard>

                  <FileCard>
                    <div className="info">
                      <FileText size={16} />
                      <span>Physics_Midterm_Questions.pdf</span>
                    </div>
                    <div className="btn-wrap">
                      <Download size={14} />
                      <span>Download File</span>
                    </div>
                  </FileCard>
                </FileList>

                {/* Smart Alert Triggered */}
                <AnimatePresence>
                  {currentStep.showAlert && (
                    <AlertPopup
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="head">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={15} />
                          <span>Smart Alert</span>
                        </div>
                        <span style={{ fontSize: '11px' }}>Triggered 3:14 AM</span>
                      </div>
                      <p>
                        Alert: 400 exam files were requested at 3 AM from an unknown location. Account temporarily locked.
                      </p>
                    </AlertPopup>
                  )}
                </AnimatePresence>

                {/* Account Locked State */}
                <AnimatePresence>
                  {currentStep.isLocked && (
                    <LockCard
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <Lock size={22} color="#c8102e" style={{ flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <b style={{ fontSize: '13px', color: '#c8102e' }}>
                          Downloads Paused &middot; Account Locked
                        </b>
                        <span style={{ fontSize: '12px', color: '#444440' }}>
                          A 6-digit confirmation code was sent to your phone to verify identity and restore access.
                        </span>
                      </div>
                    </LockCard>
                  )}
                </AnimatePresence>
              </InnerContent>
            </InnerBrowser>
          </ScreenStage>

          {/* Footer showing walkthrough status and steps */}
          <WalkthroughFooter>
            <div>
              <span className="active-step">{currentStep.title}</span> &middot; {currentStep.description}
            </div>

            <StepDots>
              {STEPS.map((_, idx) => (
                <Dot
                  key={idx}
                  $active={idx === stepIndex}
                  onClick={() => setStepIndex(idx)}
                />
              ))}
            </StepDots>
          </WalkthroughFooter>
        </RecordingContainer>
      </Container>
    </SectionWrapper>
  );
}
