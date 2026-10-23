import { Platform } from 'react-native';

/**
 * Paleta de la app. Se usa en modo claro y oscuro.
 */
export const Colors = {
  light: {
    text: '#11181C',
    background: '#F7F9FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6F0FA',
    textSecondary: '#5B6570',
    border: '#DCE3E8',
    primary: '#208AEF',
    success: '#1A7F37',
    successSoft: '#E6F4EA',
    warning: '#8A5A00',
    warningSoft: '#FFF3CD',
    danger: '#B42318',
    dangerSoft: '#FDECEA',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F1113',
    backgroundElement: '#1A1D1F',
    backgroundSelected: '#22303C',
    textSecondary: '#A6ADB4',
    border: '#2E3439',
    primary: '#2F7FD1',
    success: '#7BD88F',
    successSoft: '#17351F',
    warning: '#F5C86B',
    warningSoft: '#3A2E12',
    danger: '#F08A80',
    dangerSoft: '#3B1D1B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
} as const;

export const MaxContentWidth = 720;
