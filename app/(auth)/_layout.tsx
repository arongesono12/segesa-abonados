import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';
import { nativeUI, platformStackHeaderOptions } from '@/theme/native-ui';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        ...platformStackHeaderOptions(),
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.text,
          fontFamily: nativeUI.fontBold,
          fontWeight: '700',
        },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
      <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Recuperar contraseña' }} />
    </Stack>
  );
}
