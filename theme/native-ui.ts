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
  radius: Platform.select({ ios: 22, android: 20, web: 18, default: 20 }),
  compactRadius: Platform.select({ ios: 16, android: 14, web: 14, default: 14 }),
  controlHeight: Platform.select({ ios: 54, android: 52, web: 48, default: 52 }),
  inputHeight: Platform.select({ ios: 56, android: 52, web: 48, default: 52 }),
  screenPadding: Platform.select({ ios: 20, android: 18, web: 24, default: 20 }),
  sectionGap: 18,
  fontFamily: systemFont,
  fontRegular: systemFont,
  fontMedium: Platform.select({ ios: undefined, android: 'sans-serif-medium', web: systemFont, default: undefined }),
  fontBold: Platform.select({ ios: undefined, android: 'sans-serif-medium', web: systemFont, default: undefined }),
  fontBlack: Platform.select({ ios: undefined, android: 'sans-serif-black', web: systemFont, default: undefined }),
  cardShadow: Platform.select({
    ios: {
      shadowColor: '#17201D',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 18,
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
