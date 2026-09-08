import React from 'react';
import styled from 'styled-components';
import {
  Shield,
  Eye,
  Lock,
  FileText,
  Bell,
  Smartphone,
} from 'lucide-react';

const SectionWrapper = styled.section`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 80px 24px 96px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Top banner area matching the reference image structure with site colors
const BannerHeader = styled.div`
  text-align: center;
  max-width: 680px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  h2.banner-title {
    font-size: clamp(28px, 3.4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${(props) => props.theme.colors.ink};
  }

  p.banner-subtitle {
    font-size: 15px;
    color: ${(props) => props.theme.colors.soft};
    line-height: 1.6;
  }
`;

// Overlapping clean white card container
const FeaturesCardContainer = styled.div`
  max-width: 1040px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 56px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);

  @media (max-width: 640px) {
    padding: 40px 20px;
  }
`;

// Centered title with subtle ghost watermark text behind it (from reference image)
const TitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 52px;
  width: 100%;
`;

const GhostWatermark = styled.span`
  position: absolute;
  font-size: clamp(34px, 5.2vw, 56px);
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ecece8;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
`;

const ForegroundTitle = styled.h3`
  position: relative;
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.ink};
  z-index: 1;
`;

// 3-column by 2-row grid matching the reference layout
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 36px;
  row-gap: 48px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    row-gap: 36px;
  }
`;

// Single feature item centered with icon on diamond backdrop
const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
`;

// Subtle diamond shaped background for the icon matching site theme
const DiamondBadge = styled.div`
  width: 52px;
  height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;

  &::before {
    content: '';
    position: absolute;
    width: 42px;
    height: 42px;
    background-color: ${(props) => props.theme.colors.surface};
    border: 1px solid #e2e2de;
    transform: rotate(45deg);
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  svg {
    position: relative;
    z-index: 1;
    color: ${(props) => props.theme.colors.red};
  }

  ${FeatureItem}:hover &::before {
    border-color: ${(props) => props.theme.colors.red};
    background-color: ${(props) => props.theme.colors.redLight};
  }
`;

const FeatureTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.ink};
  letter-spacing: -0.01em;
`;

const FeatureDescription = styled.p`
  font-size: 13.5px;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.soft};
  max-width: 270px;
`;

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Storage',
    description:
      'Store exams, answer keys, and grading rubrics in an encrypted repository accessible only via verified login.',
  },
  {
    icon: Eye,
    title: 'Unusual Activity Detection',
    description:
      'Spot abnormal download spikes, unfamiliar regional access, and requests outside standard hours.',
  },
  {
    icon: Lock,
    title: 'Auto-Lock',
    description:
      'Immediately pauses download privileges the instant a suspicious bulk download spike is flagged.',
  },
  {
    icon: FileText,
    title: 'Activity Log',
    description:
      'Review a clear, chronological history of every file view and download request across all materials.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description:
      'Receive clear, plain-language notices detailing exact file counts, timestamps, and locations.',
  },
  {
    icon: Smartphone,
    title: 'Phone Verification',
    description:
      'Confirm legitimate access swiftly with a 6-digit one-time code sent directly to your mobile device.',
  },
];

/**
 * KeyFeaturesList Component
 * Styled after the reference design:
 * - Top header banner
 * - Overlapping clean white container card
 * - Watermarked "OUR FEATURES" header
 * - 3-column grid of diamond-accented icons, titles, and centered plain-English copy
 * - Strictly adhering to Faculty Guard light theme (white/slate/#c8102e deep red)
 */
export default function KeyFeaturesList() {
  return (
    <SectionWrapper id="features">
      {/* Top Banner Header */}
      <BannerHeader>
        <h2 className="banner-title">Features</h2>
        <p className="banner-subtitle">
          Core capabilities designed to safeguard academic materials and stop unauthorized file downloads.
        </p>
      </BannerHeader>

      {/* Main Elevated Card */}
      <FeaturesCardContainer>
        {/* Watermarked Centered Section Title */}
        <TitleWrapper>
          <GhostWatermark>Our Features</GhostWatermark>
          <ForegroundTitle>Our Features</ForegroundTitle>
        </TitleWrapper>

        {/* 6-Item Grid (3 columns x 2 rows) */}
        <Grid>
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <FeatureItem key={item.title}>
                <DiamondBadge>
                  <Icon size={20} />
                </DiamondBadge>
                <FeatureTitle>{item.title}</FeatureTitle>
                <FeatureDescription>{item.description}</FeatureDescription>
              </FeatureItem>
            );
          })}
        </Grid>
      </FeaturesCardContainer>
    </SectionWrapper>
  );
}
