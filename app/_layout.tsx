import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { nativeUI, platformStackHeaderOptions } from '@/theme/native-ui';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

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
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/provider" options={{ title: 'Proveedor electrico' }} />
        <Stack.Screen name="onboarding/account" options={{ title: 'Cuenta de servicio' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="invoice/[id]" options={{ title: 'Detalle de factura' }} />
        <Stack.Screen name="payment/[invoiceId]" options={{ title: 'Metodo de pago' }} />
        <Stack.Screen name="payment/confirmation" options={{ title: 'Confirmacion' }} />
      </Stack>
      <StatusBar backgroundColor={colors.background} style="dark" translucent />
    </AuthProvider>
  );
}
