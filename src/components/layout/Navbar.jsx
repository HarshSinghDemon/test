import React from 'react';
import styled from 'styled-components';
import { Shield, LogIn } from 'lucide-react';
import { GhostButton } from '../common/Button.jsx';

// Sticky premium navigation header with 16px blur
const NavHeader = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1140px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Brand logo with shield and medical red accent
const Brand = styled.a`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${(props) => props.theme.colors.ink};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  span.dot {
    color: ${(props) => props.theme.colors.red};
    font-size: 22px;
    line-height: 1;
    margin-left: 1px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-size: 13.5px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.soft};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.colors.ink};
  }
`;

/**
 * Sticky Premium Navbar
 * Links: [Features, Protection, Demo] and a [Sign In] button.
 */
export default function Navbar({ onOpenAuth }) {
  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <NavHeader id="navbar">
      <NavContainer>
        {/* Brand logo left */}
        <Brand href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Shield size={18} color="#c8102e" />
          <span>Faculty Guard</span>
          <span className="dot">·</span>
        </Brand>

        {/* Links: Features, Protection, Demo */}
        <NavLinks>
          <NavLink onClick={() => scrollToSection('features')}>Features</NavLink>
          <NavLink onClick={() => scrollToSection('protection')}>Protection</NavLink>
          <NavLink onClick={() => scrollToSection('demo')}>Demo</NavLink>
        </NavLinks>

        {/* [Sign In] right */}
        <div>
          <GhostButton $small $bordered onClick={onOpenAuth}>
            <LogIn size={14} />
            <span>Sign In</span>
          </GhostButton>
        </div>
      </NavContainer>
    </NavHeader>
  );
}
