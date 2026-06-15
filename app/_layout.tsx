import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { QueryProvider } from '@/config/query-client';
import { AuthProvider } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerShown: false,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding/provider" />
          <Stack.Screen name="onboarding/account" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="invoices/[id]" />
          <Stack.Screen name="invoices/pdf-viewer" />
          <Stack.Screen name="payments/method" />
          <Stack.Screen name="payments/confirmation" />
          <Stack.Screen name="payments/success" />
          <Stack.Screen name="payments/failed" />
          <Stack.Screen name="support/create-ticket" />
          <Stack.Screen name="support/[id]" />
        </Stack>
        <StatusBar backgroundColor={colors.background} style="dark" translucent={false} />
      </AuthProvider>
    </QueryProvider>
  );
}
