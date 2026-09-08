import React, { useState } from 'react';
import styled from 'styled-components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/layout/Navbar.jsx';
import HeroCommandCenter from './components/sections/HeroCommandCenter.jsx';
import StoryFeatures from './components/sections/StoryFeatures.jsx';
import IncidentWalkthrough from './components/sections/IncidentWalkthrough.jsx';
import Footer from './components/layout/Footer.jsx';
import AuthModal from './components/auth/AuthModal.jsx';

// Fallback Google Client ID for development / preview environments
const GOOGLE_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  '381592416142-facultyguard.apps.googleusercontent.com';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.ink};
  font-family: ${(props) => props.theme.typography.displayFont};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
`;

/**
 * Faculty Guard Application Shell
 * Strictly implements the approved 6 architectural UI components:
 * 1. Sticky Premium Navbar: Translucent white, blur(16px), [Features, Protection, Demo] + [Sign In]
 * 2. Hero (Security Command Center): Warm/off-white background, 72-80px typography, ambient metrics & floating mockup
 * 3. Story-Driven Features: Pure white canvas, 01 DETECT -> 02 ANALYZE -> 03 PROTECT visual flow
 * 4. "Real Incident" Walkthrough: Dark charcoal interactive simulation (400 files/4 min -> Amber -> Red Lock -> MFA Unlock)
 * 5. Strong Footer: Deep red / near-black final CTA area integrating seamlessly into footer links
 * 6. Authentication Modal ("Secure Portal"): Sign In & Sign Up tabs, zero prefilled data, 2FA setup choice, TOTP QR & Email OTP
 */
export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContainer id="facultyguard-root">
        {/* 1. Sticky Premium Navbar */}
        <Navbar onOpenAuth={handleOpenAuth} />

        <MainContent>
          {/* 2. Hero (Security Command Center) */}
          <HeroCommandCenter onOpenAuth={handleOpenAuth} />

          {/* 3. Story-Driven Features */}
          <StoryFeatures />

          {/* 4. "Real Incident" Walkthrough */}
          <IncidentWalkthrough />
        </MainContent>

        {/* 5. Strong Footer */}
        <Footer onOpenAuth={handleOpenAuth} />

        {/* 6. Authentication Modal (Secure Portal) */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={handleCloseAuth}
          onSuccess={handleAuthSuccess}
        />
      </AppContainer>
    </GoogleOAuthProvider>
  );
}
