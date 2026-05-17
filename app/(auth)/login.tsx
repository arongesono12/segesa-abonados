import * as AppleAuthentication from 'expo-apple-authentication';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage, validateEmail, validatePassword } from '@/utils/validation';

export default function LoginScreen() {
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('cliente@demo.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleLogin = async () => {
    setError('');
    if (!validateEmail(email) || !validatePassword(password)) {
      setError('Introduce un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }
    try {
      setLoadingAction('email');
      await login(email, password);
      if (process.env.EXPO_OS === 'ios') {
        const haptics = require('expo-haptics');
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      }
      router.replace('/onboarding/provider');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoadingAction('google');
    try {
      await socialLogin('google', 'google.user@demo.com', 'Usuario Google');
      if (process.env.EXPO_OS === 'ios') {
        const haptics = require('expo-haptics');
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      }
      router.replace('/onboarding/provider');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoadingAction('apple');
    try {
      if (process.env.EXPO_OS === 'ios') {
        await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      }
      await socialLogin('apple', 'apple.user@demo.com', 'Usuario Apple');
      if (process.env.EXPO_OS === 'ios') {
        const haptics = require('expo-haptics');
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      }
      router.replace('/onboarding/provider');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Screen>
      <View style={{ gap: 10, marginTop: 24 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
          Bienvenido de nuevo
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Accede para consultar y pagar tus facturas de electricidad.
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Correo electrónico"
          onChangeText={setEmail}
          returnKeyType="next"
          textContentType="emailAddress"
          value={email}
        />
        <AppTextField label="Contraseña" onChangeText={setPassword} secureTextEntry value={password} />
        {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
        <AppButton title="Entrar" loading={loadingAction === 'email'} onPress={handleLogin} />
      </View>

      <View style={{ gap: 10 }}>
        <AppButton title="Continuar con Google" sfIcon="globe" variant="secondary" loading={loadingAction === 'google'} onPress={handleGoogleLogin} />
        <AppButton title="Continuar con Apple" sfIcon="apple.logo" variant="secondary" loading={loadingAction === 'apple'} onPress={handleAppleLogin} />
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Link href="/(auth)/forgot-password" asChild>
          <AppButton title="Recuperar contraseña" variant="ghost" onPress={() => {}} />
        </Link>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '700' }}>
              No tengo cuenta, registrarme
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
