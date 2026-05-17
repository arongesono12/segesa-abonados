import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { sharedStyles } from '@/components/shared-styles';
import { TextLink } from '@/components/text-link';
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
      <View style={styles.identity}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <ScreenHeader title="Bienvenido de nuevo" subtitle="Accede para consultar y pagar tus facturas." />
      </View>

      <View style={styles.formCard}>
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
        <View style={styles.fieldDivider} />
        <AppTextField
          autoComplete="current-password"
          label="Contraseña"
          onChangeText={setPassword}
          returnKeyType="go"
          secureTextEntry
          textContentType="password"
          value={password}
        />
      </View>

      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}

      <AppButton
        title="Entrar"
        icon="login"
        loading={loadingAction === 'email'}
        onPress={handleLogin}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o continúa con</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.social}>
        <AppButton
          title="Continuar con Google"
          icon="google"
          variant="secondary"
          loading={loadingAction === 'google'}
          onPress={handleGoogleLogin}
          fullWidth
        />
        {Platform.OS === 'ios' ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            cornerRadius={nativeUI.radius}
            onPress={handleAppleLogin}
            style={styles.appleBtn}
          />
        ) : (
          <AppButton
            title="Continuar con Apple"
            icon="apple"
            variant="secondary"
            loading={loadingAction === 'apple'}
            onPress={handleAppleLogin}
            fullWidth
          />
        )}
      </View>

      <View style={styles.footer}>
        <TextLink
          title="Olvidé mi contraseña"
          onPress={() => router.push('/(auth)/forgot-password')}
        />
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TextLink title="Crear cuenta" onPress={() => router.push('/(auth)/register')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    gap: 16,
    marginTop: 8,
  },
  logo: {
    borderRadius: 14,
    height: 56,
    width: 56,
    ...(Platform.OS === 'ios' ? { borderCurve: 'continuous' } : {}),
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 0,
    overflow: 'hidden',
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  fieldDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 14,
  },

  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  dividerLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: colors.muted,
    fontFamily: nativeUI.fontMedium,
    fontSize: 13,
    fontWeight: '600',
  },

  social: {
    gap: 10,
  },
  appleBtn: {
    height: nativeUI.controlHeight,
    width: '100%',
  },

  footer: {
    alignItems: 'center',
    gap: 2,
  },
  footerText: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
  },
});
