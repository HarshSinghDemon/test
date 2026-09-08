import React from 'react';
import styled from 'styled-components';

// Primary call-to-action button styled with deep red, smooth hover lift, and focus ring
export const PrimaryButton = styled.button`
  background-color: ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.typography.displayFont};
  font-size: ${(props) => (props.$small ? '13px' : '14.5px')};
  font-weight: 600;
  padding: ${(props) => (props.$small ? '8px 16px' : '11px 22px')};
  border: 1px solid ${(props) => props.theme.colors.red};
  border-radius: ${(props) => props.theme.radii.button};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: ${(props) => props.theme.colors.redDark};
    border-color: ${(props) => props.theme.colors.redDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(200, 16, 46, 0.22);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Ghost button with subtle border for secondary actions like demo video and sign-in
export const GhostButton = styled.button`
  background-color: ${(props) => (props.$filled ? props.theme.colors.surface : 'transparent')};
  color: ${(props) => props.theme.colors.ink};
  font-family: ${(props) => props.theme.typography.displayFont};
  font-size: ${(props) => (props.$small ? '13px' : '14.5px')};
  font-weight: 600;
  padding: ${(props) => (props.$small ? '8px 16px' : '11px 22px')};
  border: 1px solid ${(props) => (props.$bordered ? props.theme.colors.border : 'transparent')};
  border-radius: ${(props) => props.theme.radii.button};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: ${(props) => props.theme.colors.surface};
    border-color: ${(props) => props.theme.colors.borderHi};
    color: ${(props) => props.theme.colors.ink};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Featured dark button for premium tier cards and inverted simulation walkthrough
export const DarkButton = styled.button`
  background-color: ${(props) => props.theme.colors.ink};
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.typography.displayFont};
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border: 1px solid ${(props) => props.theme.colors.ink};
  border-radius: ${(props) => props.theme.radii.button};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: ${(props) => props.theme.colors.red};
    border-color: ${(props) => props.theme.colors.red};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
