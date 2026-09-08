// Design tokens for Faculty Guard Security System
// Implements strict security color semantics: Green (Safe), Amber (Suspicious), Red (Threat)
// Provides background tokens for visual rhythm (Off-White -> White -> Dark Charcoal -> Deep Red)

export const theme = {
  colors: {
    // Canvas & backgrounds for alternating section contrast
    white: '#ffffff',
    offWhite: '#fafaf9',       // Hero command center background
    surface: '#f4f4f2',        // Form fields, table headers, card surfaces
    border: '#e8e6e1',         // Clean subtle hairline dividers
    borderHi: '#d4d0c8',       // Active or focused borders
    
    // Primary typography
    ink: '#111110',            // Highest contrast charcoal text
    ink2: '#1c1c1a',           // Secondary headlines and cards
    soft: '#72716d',           // Secondary labels and metadata
    softer: '#a8a5a0',         // Subtle captions and placeholder states

    // Security Status: GREEN (Protected / Safe / Verified)
    green: '#10b981',
    greenDark: '#059669',
    greenLight: '#ecfdf5',
    greenBorder: '#a7f3d0',

    // Security Status: AMBER (Suspicious / Reviewing / High Frequency)
    amber: '#f59e0b',
    amberDark: '#d97706',
    amberLight: '#fffbeb',
    amberBorder: '#fde68a',

    // Security Status: RED (Threat / Blocked / Auto-Lock Action)
    red: '#c8102e',            // Primary security threat accent
    redDark: '#9e0d24',        // Hover state for threat buttons
    redLight: '#fdf2f4',       // Threat badge and alert tint
    redMid: '#f5c5cc',         // Alert card border

    // Inverted & Simulation: Dark Charcoal & Deep Red
    darkBg: '#111110',         // Incident walkthrough section canvas
    darkSurface: '#191918',    // Incident card surface
    darkBorder: '#292926',     // Dark section hairline dividers
    deepRedFooter: '#1f0408',  // Final CTA and footer contrast area
  },
  radii: {
    button: '6px',
    badge: '4px',
    card: '12px',
    pill: '9999px',
  },
  shadows: {
    commandCenter: '0 20px 40px -15px rgba(17, 17, 16, 0.08), 0 0 0 1px rgba(17, 17, 16, 0.06)',
    card: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },
  typography: {
    displayFont: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    monoFont: "'JetBrains Mono', 'Courier New', monospace",
  },
};
