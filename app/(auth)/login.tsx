import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
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
      router.replace('/');
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
      router.replace('/');
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
      if (Platform.OS === 'ios') {
        await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      }

      await socialLogin('apple', 'apple.user@demo.com', 'Usuario Apple');
      router.replace('/');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Bienvenido de nuevo</Text>
        <Text style={sharedStyles.subtitle}>Accede para consultar y pagar tus facturas de electricidad.</Text>
      </View>

      <View style={styles.form}>
        <AppTextField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Correo electrónico"
          onChangeText={setEmail}
          value={email}
        />
        <AppTextField label="Contraseña" onChangeText={setPassword} secureTextEntry value={password} />
        {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
        <AppButton title="Entrar" loading={loadingAction === 'email'} onPress={handleLogin} />
      </View>

      <View style={styles.social}>
        <AppButton title="Continuar con Google" icon="logo-google" variant="secondary" loading={loadingAction === 'google'} onPress={handleGoogleLogin} />
        <AppButton title="Continuar con Apple" icon="logo-apple" variant="secondary" loading={loadingAction === 'apple'} onPress={handleAppleLogin} />
      </View>

      <View style={styles.footer}>
        <AppButton title="Recuperar contraseña" variant="ghost" onPress={() => router.push('/(auth)/forgot-password')} />
        <Text style={styles.register} onPress={() => router.push('/(auth)/register')}>
          No tengo cuenta, registrarme
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginTop: 24,
  },
  form: {
    gap: 14,
  },
  social: {
    gap: 10,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
  },
  register: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
