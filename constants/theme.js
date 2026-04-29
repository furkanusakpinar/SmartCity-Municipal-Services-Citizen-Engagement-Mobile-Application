import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#0B3D91',
    primaryDark: '#072B6B',
    primaryLight: '#1565C0',
    accent: '#1E88E5',
    gold: '#F9A825',
    goldLight: '#FFF8E1',
    text: '#1A202C',
    textSecondary: '#546E7A',
    background: '#EEF2F7',
    card: '#FFFFFF',
    border: '#DCE4EE',
    tint: '#0B3D91',
    icon: '#78909C',
    tabIconDefault: '#90A4AE',
    tabIconSelected: '#0B3D91',
    notification: '#E53935',
    success: '#2E7D32',
    surface: '#F7F9FC',
  },
  dark: {
    primary: '#5C8FD6',
    primaryDark: '#3A6FBF',
    primaryLight: '#7AABEF',
    accent: '#42A5F5',
    gold: '#FFD54F',
    goldLight: '#3D3000',
    text: '#E8EDF2',
    textSecondary: '#90A4AE',
    background: '#080F1E',
    card: '#0F1F3D',
    border: '#1A2E4A',
    tint: '#5C8FD6',
    icon: '#78909C',
    tabIconDefault: '#546E7A',
    tabIconSelected: '#5C8FD6',
    notification: '#EF5350',
    success: '#43A047',
    surface: '#0D1929',
  },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
