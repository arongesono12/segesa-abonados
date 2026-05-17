import { Platform, useWindowDimensions } from 'react-native';

export const fontBase = {
  fontFamily: Platform.select({
    ios: 'Roboto_400Regular',
    android: 'Roboto_400Regular',
    web: 'Roboto_400Regular',
    default: 'Roboto_400Regular',
  }),
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
  fontFamily: Platform.select({
    ios: 'Roboto_400Regular',
    android: 'Roboto_400Regular',
    web: 'Roboto_400Regular',
    default: 'Roboto_400Regular',
  }),
  fontRegular: 'Roboto_400Regular',
  fontMedium: 'Roboto_500Medium',
  fontBold: 'Roboto_700Bold',
  fontBlack: 'Roboto_900Black',
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
      headerBackTitle: 'Atrás',
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
      headerBackTitle: 'Atrás',
    },
    android: { headerBackTitleVisible: false },
    web: { headerBackTitleVisible: false },
    default: {},
  });
}
