/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Segesa-Abonados',
  slug: 'Segesa-Abonados',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'segesaabonados',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false',
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    appleTeamId: process.env.EXPO_PUBLIC_APPLE_TEAM_ID,
    appleKeyId: process.env.EXPO_PUBLIC_APPLE_KEY_ID,
  },
};

module.exports = config;
