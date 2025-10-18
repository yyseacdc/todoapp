export const colorTokens = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceMuted: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5f5',
  accent: '#38bdf8',
  accentMuted: '#0ea5e9',
  danger: '#f87171',
  success: '#4ade80'
} as const;

export const spacingTokens = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem'
} as const;

export const typography = {
  heading: 'font-semibold tracking-tight',
  body: 'text-base leading-relaxed',
  caption: 'text-sm text-slate-400'
} as const;

export const motion = {
  default: '150ms ease-in-out',
  gentle: '250ms ease-out',
  snappy: '120ms ease-out'
} as const;

export const designTokens = {
  color: colorTokens,
  spacing: spacingTokens,
  typography,
  motion
};

export type DesignTokens = typeof designTokens;
