export const colors = {
  // Deep dark backgrounds
  background: '#090D16',
  surface: '#121826',
  surfaceVariant: '#1B2337',
  card: '#161F32',
  border: '#232E45',

  // High-contrast vibrant accents (Gamified / Cyber Wellness)
  primary: '#00FFA3', // Neon Cyber Mint
  primaryVariant: '#00D688',
  secondary: '#7928CA', // Electric Purple
  accent: '#FF007A', // Cyberpunk Pink
  warning: '#FFB800', // Neon Gold / Warning
  error: '#FF3366', // Alert Red
  success: '#00FFA3', // Cyber Green

  // High-contrast typography
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#090D16',

  // Gamification metrics
  xpGold: '#FFD700',
  streakFire: '#FF5722',
  guardShield: '#00E5FF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  isDark: true,
};

export type Theme = typeof theme;
export default theme;
