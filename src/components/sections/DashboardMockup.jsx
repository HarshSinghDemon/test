import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Folder,
  FileText,
  Bell,
  Settings,
  AlertCircle,
  Lock,
  FileSpreadsheet,
} from 'lucide-react';
import { evaluate_risk } from '../../services/mockSecurityEngine.js';

// Browser frame container with subtle border and zero unnecessary shadows
const FrameContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  box-shadow: ${(props) => props.theme.shadows.dashboard};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChromeHeader = styled.div`
  height: 38px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
`;

const WindowDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e5e5e2;
`;

const UrlBar = styled.div`
  margin-left: 12px;
  height: 22px;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 11px;
  color: ${(props) => props.theme.colors.soft};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 480px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

// Left sidebar: My Files, Security Alerts, Settings
const Sidebar = styled.aside`
  background-color: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 840px) {
    display: none;
  }
`;

const AccountHeader = styled.div`
  padding: 0 8px 14px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  h6 {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }

  span {
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 11px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

const SidebarItem = styled.button`
  background-color: ${(props) => (props.$active ? props.theme.colors.white : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.border : 'transparent')};
  border-radius: 6px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  font-family: ${(props) => props.theme.typography.displayFont};
  font-size: 13px;
  font-weight: ${(props) => (props.$active ? '700' : '500')};
  color: ${(props) => (props.$active ? props.theme.colors.ink : props.theme.colors.soft)};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  svg {
    color: ${(props) => (props.$active ? props.theme.colors.red : props.theme.colors.soft)};
  }

  span.badge {
    margin-left: auto;
    font-size: 10px;
    font-weight: 700;
    background-color: ${(props) => props.theme.colors.redLight};
    color: ${(props) => props.theme.colors.red};
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const MainContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${(props) => props.theme.colors.white};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  h4 {
    font-size: 18px;
    font-weight: 800;
    color: ${(props) => props.theme.colors.ink};
  }

  p {
    font-size: 12px;
    color: ${(props) => props.theme.colors.soft};
    margin-top: 2px;
  }
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.red};
  background-color: ${(props) => props.theme.colors.redLight};
  border: 1px solid ${(props) => props.theme.colors.redMid};
  padding: 5px 12px;
  border-radius: ${(props) => props.theme.radii.pill};
`;

// Top KPI cards: Total Files, Blocked Attempts
const KpiRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const KpiCard = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  span.label {
    font-size: 12px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.soft};
  }

  div.val-row {
    display: flex;
    align-items: baseline;
    gap: 8px;

    span.number {
      font-size: 26px;
      font-weight: 800;
      color: ${(props) => (props.$alert ? props.theme.colors.red : props.theme.colors.ink)};
    }

    span.sub {
      font-size: 12px;
      color: ${(props) => props.theme.colors.soft};
    }
  }
`;

// Simple Bar Chart: Daily Downloads
const ChartContainer = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.card};
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span.title {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.ink};
  }

  span.note {
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 11px;
    color: ${(props) => props.theme.colors.red};
    font-weight: 600;
  }
`;

const BarsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: flex-end;
  height: 86px;
  gap: 10px;
  padding-top: 8px;
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
`;

const BarColumn = styled.div`
  width: 100%;
  max-width: 24px;
  height: ${(props) => props.$height}%;
  background-color: ${(props) => (props.$highlight ? props.theme.colors.red : '#dcdcd8')};
  border-radius: 4px 4px 0 0;
  transition: all 0.2s ease;
`;

const BarLabel = styled.span`
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 10px;
  color: ${(props) => (props.$highlight ? props.theme.colors.red : props.theme.colors.soft)};
  font-weight: ${(props) => (props.$highlight ? '700' : '500')};
`;

// Smart Alert Card with simple explanation
const SmartAlertCard = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-left: 4px solid ${(props) => props.theme.colors.red};
  border-radius: ${(props) => props.theme.radii.card};
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div.left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${(props) => props.theme.colors.red};
    font-weight: 700;
    font-size: 13px;
  }

  span.status {
    font-family: ${(props) => props.theme.typography.monoFont};
    font-size: 11px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.red};
    background-color: ${(props) => props.theme.colors.redLight};
    padding: 3px 8px;
    border-radius: 4px;
  }
`;

const AlertText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.ink};
  font-weight: 600;
`;

const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 12px 14px;
  border-radius: 6px;
`;

const ReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.ink2};

  span.bullet {
    color: ${(props) => props.theme.colors.red};
    font-weight: 700;
  }
`;

// File List View
const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  font-size: 13px;

  div.file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${(props) => props.theme.colors.ink};
    font-weight: 600;

    svg {
      color: ${(props) => props.theme.colors.soft};
    }
  }

  span.tag {
    font-size: 11px;
    color: ${(props) => props.theme.colors.soft};
  }
`;

/**
 * DashboardMockup Component
 * Friendly file manager layout:
 * - Left sidebar: My Files, Security Alerts, Settings
 * - Top KPI cards: Total Files, Blocked Attempts
 * - Simple Bar Chart: Daily Downloads
 * - Smart Alert Card: "Alert: 400 exam files were requested at 3 AM from an unknown location. Account temporarily locked."
 */
export default function DashboardMockup() {
  const [activeTab, setActiveTab] = useState('alerts');
  const alertData = evaluate_risk();

  const downloadHistory = [
    { label: 'Mon', count: 18, highlight: false },
    { label: 'Tue', count: 12, highlight: false },
    { label: 'Wed', count: 24, highlight: false },
    { label: 'Thu', count: 16, highlight: false },
    { label: 'Fri', count: 30, highlight: false },
    { label: 'Sat', count: 5, highlight: false },
    { label: '3 AM', count: 96, highlight: true },
  ];

  return (
    <FrameContainer id="dashboard-mockup">
      {/* Top Browser Bar */}
      <ChromeHeader>
        <WindowDot />
        <WindowDot />
        <WindowDot />
        <UrlBar>
          <Lock size={12} color="#c8102e" />
          <span>facultyguard.app/my-files</span>
        </UrlBar>
      </ChromeHeader>

      <DashboardGrid>
        {/* Left Sidebar: My Files, Security Alerts, Settings */}
        <Sidebar>
          <AccountHeader>
            <h6>My Account</h6>
            <span>usr_9921_smith</span>
          </AccountHeader>

          <SidebarItem
            $active={activeTab === 'files'}
            onClick={() => setActiveTab('files')}
          >
            <Folder size={16} />
            My Files
          </SidebarItem>

          <SidebarItem
            $active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell size={16} />
            Security Alerts
            <span className="badge">1 New</span>
          </SidebarItem>

          <SidebarItem
            $active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            Settings
          </SidebarItem>
        </Sidebar>

        {/* Main Content Area */}
        <MainContent>
          <HeaderRow>
            <div>
              <h4>{activeTab === 'files' ? 'My Files' : 'Security Alerts'}</h4>
              <p>Monitored files and automatic protection</p>
            </div>
            <StatusPill>
              <AlertCircle size={14} />
              Account Locked
            </StatusPill>
          </HeaderRow>

          {/* Top KPI cards: Total Files, Blocked Attempts */}
          <KpiRow>
            <KpiCard>
              <span className="label">Total Files</span>
              <div className="val-row">
                <span className="number">248</span>
                <span className="sub">files monitored</span>
              </div>
            </KpiCard>

            <KpiCard $alert>
              <span className="label">Blocked Attempts</span>
              <div className="val-row">
                <span className="number">1</span>
                <span className="sub">unauthorized attempt</span>
              </div>
            </KpiCard>
          </KpiRow>

          {activeTab === 'files' ? (
            /* File List View */
            <FileList>
              <FileItem>
                <div className="file-info">
                  <FileText size={16} />
                  <span>Calculus_Final_Exam_2026.pdf</span>
                </div>
                <span className="tag">Modified Yesterday</span>
              </FileItem>
              <FileItem>
                <div className="file-info">
                  <FileSpreadsheet size={16} />
                  <span>Physics_Grading_Rubric_Master.xlsx</span>
                </div>
                <span className="tag">Protected</span>
              </FileItem>
              <FileItem>
                <div className="file-info">
                  <FileText size={16} />
                  <span>Midterm_Review_Questions_Solutions.pdf</span>
                </div>
                <span className="tag">Protected</span>
              </FileItem>
            </FileList>
          ) : (
            <>
              {/* Daily Downloads Bar Chart */}
              <ChartContainer>
                <ChartHeader>
                  <span className="title">Daily Downloads</span>
                  <span className="note">Download Spike at 3 AM</span>
                </ChartHeader>
                <BarsContainer>
                  {downloadHistory.map((day) => (
                    <BarWrapper key={day.label}>
                      <BarColumn $height={day.count} $highlight={day.highlight} />
                      <BarLabel $highlight={day.highlight}>{day.label}</BarLabel>
                    </BarWrapper>
                  ))}
                </BarsContainer>
              </ChartContainer>

              {/* Smart Alert Card */}
              <SmartAlertCard>
                <AlertTitleRow>
                  <div className="left">
                    <AlertCircle size={16} />
                    <span>Smart Alert</span>
                  </div>
                  <span className="status">Auto-Lock Active</span>
                </AlertTitleRow>

                <AlertText>{alertData.summary}</AlertText>

                <ReasonList>
                  {alertData.alert_reasons.map((reason, idx) => (
                    <ReasonItem key={idx}>
                      <span className="bullet">&bull;</span>
                      <span>{reason}</span>
                    </ReasonItem>
                  ))}
                </ReasonList>
              </SmartAlertCard>
            </>
          )}
        </MainContent>
      </DashboardGrid>
    </FrameContainer>
  );
}
