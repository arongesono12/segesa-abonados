import '../global.css';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { nativeUI, platformStackHeaderOptions } from '@/theme/native-ui';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          ...platformStackHeaderOptions(),
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontFamily: nativeUI.fontBold,
            fontWeight: '700',
          },
          contentStyle: { backgroundColor: colors.background },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/provider" options={{ title: 'Proveedor eléctrico' }} />
        <Stack.Screen name="onboarding/account" options={{ title: 'Cuenta de servicio' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="invoice/[id]" options={{ title: 'Detalle de factura' }} />
        <Stack.Screen name="payment/[invoiceId]" options={{ title: 'Método de pago' }} />
        <Stack.Screen name="payment/confirmation" options={{ title: 'Confirmación' }} />
      </Stack>
      <StatusBar backgroundColor={colors.background} style="dark" translucent />
    </AuthProvider>
  );
}
