import { Platform, useWindowDimensions } from 'react-native';

/**
 * Spread `fontBase` into every StyleSheet text entry so that fontFamily
 * is never accidentally omitted. In React Native, fontFamily does NOT
 * cascade from parent views — it must be declared on each Text style.
 *
 * Usage:
 *   myText: { ...fontBase, color: colors.text, fontSize: 16 }
 */
export const fontBase = {
  fontFamily: Platform.select({
    ios: undefined,
    android: 'sans-serif',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    default: undefined,
  }),
} as const;

export const nativeUI = {
  platform: Platform.OS,

  // iOS uses larger radius (iOS 26 "liquid glass" era), Android follows Material 3 medium shape
  radius: Platform.select({ ios: 13, android: 12, web: 10, default: 12 }),

  controlHeight: Platform.select({ ios: 54, android: 52, web: 48, default: 52 }),
  inputHeight: Platform.select({ ios: 56, android: 52, web: 48, default: 52 }),
  screenPadding: Platform.select({ ios: 20, android: 18, web: 24, default: 20 }),

  // undefined = system font (SF Pro on iOS, Roboto on Android)
  fontFamily: Platform.select({
    ios: undefined,
    android: 'sans-serif',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    default: undefined,
  }),

  // iOS: soft diffuse shadow; Android: Material elevation; Web: box-shadow
  cardShadow: Platform.select({
    ios: {
      shadowColor: '#1E3A8A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 2px 12px rgba(30, 58, 138, 0.08)',
    },
    default: {},
  }),

  // Primary button shadow with blue tint
  buttonShadow: Platform.select({
    ios: {
      shadowColor: '#1D4ED8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 14px rgba(29, 78, 216, 0.28)',
    },
    default: {},
  }),
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
    tabBarHeight: Platform.select({ ios: isTablet ? 74 : 84, android: 68, web: 64, default: 72 }),
  };
}

export function platformStackHeaderOptions() {
  return Platform.select({
    ios: {
      headerBackTitle: 'Atrás',
      headerLargeTitleShadowVisible: false,
    },
    android: {
      animation: 'slide_from_right' as const,
      headerBackTitleVisible: false,
    },
    web: {
      headerBackTitleVisible: false,
    },
    default: {},
  });
}

export function platformTabHeaderOptions() {
  return Platform.select({
    ios: {
      headerBackTitle: 'Atrás',
      headerLargeTitleShadowVisible: false,
    },
    android: {
      headerBackTitleVisible: false,
    },
    web: {
      headerBackTitleVisible: false,
    },
    default: {},
  });
}
