import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const PillContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border-radius: ${(props) => props.theme.radii.pill};
  font-family: ${(props) => props.theme.typography.monoFont};
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;

  ${(props) => {
    switch (props.$status) {
      case 'amber':
      case 'suspicious':
      case 'reviewing':
        return `
          background-color: ${props.theme.colors.amberLight};
          color: ${props.theme.colors.amberDark};
          border: 1px solid ${props.theme.colors.amberBorder};
        `;
      case 'red':
      case 'threat':
      case 'locked':
      case 'blocked':
        return `
          background-color: ${props.theme.colors.redLight};
          color: ${props.theme.colors.red};
          border: 1px solid ${props.theme.colors.redMid};
        `;
      case 'green':
      case 'safe':
      case 'protected':
      case 'verified':
      default:
        return `
          background-color: ${props.theme.colors.greenLight};
          color: ${props.theme.colors.greenDark};
          border: 1px solid ${props.theme.colors.greenBorder};
        `;
    }
  }}
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  position: relative;

  ${(props) => {
    switch (props.$status) {
      case 'amber':
      case 'suspicious':
      case 'reviewing':
        return `background-color: ${props.theme.colors.amber};`;
      case 'red':
      case 'threat':
      case 'locked':
      case 'blocked':
        return `background-color: ${props.theme.colors.red};`;
      case 'green':
      case 'safe':
      case 'protected':
      case 'verified':
      default:
        return `background-color: ${props.theme.colors.green};`;
    }
  }}

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background-color: inherit;
    opacity: 0.4;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

/**
 * StatusPill Component
 * Renders consistent security states:
 * - Green: Protected / Safe / Verified
 * - Amber: Suspicious / Reviewing
 * - Red: Threat / Blocked / Auto-Locked
 */
export default function StatusPill({ status = 'green', label, children }) {
  return (
    <PillContainer $status={status}>
      <Dot $status={status} />
      <span>{label || children}</span>
    </PillContainer>
  );
}
