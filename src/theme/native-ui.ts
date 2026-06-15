import { Platform, useWindowDimensions } from 'react-native';

const systemFont = Platform.select({
  ios: undefined,
  android: 'sans-serif',
  web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  default: undefined,
});

export const fontBase = {
  fontFamily: systemFont,
} as const;

export const iosContinuousCurve = Platform.OS === 'ios' ? ({ borderCurve: 'continuous' } as const) : {};

export const nativeUI = {
  platform: Platform.OS,
  radius: Platform.select({ ios: 12, android: 10, web: 10, default: 10 }),
  compactRadius: Platform.select({ ios: 8, android: 8, web: 8, default: 8 }),
  controlHeight: Platform.select({ ios: 46, android: 44, web: 42, default: 44 }),
  inputHeight: Platform.select({ ios: 46, android: 44, web: 42, default: 44 }),
  screenPadding: Platform.select({ ios: 16, android: 16, web: 22, default: 16 }),
  sectionGap: 14,
  fontFamily: systemFont,
  fontRegular: systemFont,
  fontMedium: Platform.select({ ios: undefined, android: 'sans-serif-medium', web: systemFont, default: undefined }),
  fontBold: Platform.select({ ios: undefined, android: 'sans-serif-medium', web: systemFont, default: undefined }),
  fontBlack: Platform.select({ ios: undefined, android: 'sans-serif-black', web: systemFont, default: undefined }),
  cardShadow: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
    },
    android: { elevation: 1 },
    web: { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' },
    default: {},
  }),
  buttonShadow: Platform.select({
    ios: {
      shadowColor: '#1D4ED8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
    },
    android: { elevation: 2 },
    web: { boxShadow: '0 10px 22px rgba(29, 78, 216, 0.22)' },
    default: {},
  }),
  curveStyle: iosContinuousCurve,
};

export function useNativeLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 768;
  const isWide = width >= 900;

  return {
    width,
    height,
    isTablet,
    isWide,
    maxContentWidth: isWide ? 760 : isTablet ? 680 : undefined,
    tabBarHeight: Platform.select({
      ios: isTablet ? 76 : 84,
      android: 68,
      web: 64,
      default: 72,
    }),
  };
}

export function platformStackHeaderOptions() {
  return Platform.select({
    ios: {
      headerBackTitle: 'Atras',
      headerLargeTitleShadowVisible: false,
      headerTransparent: false,
    },
    android: {
      animation: 'slide_from_right' as const,
      headerBackTitleVisible: false,
    },
    web: { headerBackTitleVisible: false },
    default: {},
  });
}

export function platformTabHeaderOptions() {
  return Platform.select({
    ios: {
      headerLargeTitle: false,
      headerLargeTitleShadowVisible: false,
      headerBackTitle: 'Atras',
    },
    android: { headerBackTitleVisible: false },
    web: { headerBackTitleVisible: false },
    default: {},
  });
}
