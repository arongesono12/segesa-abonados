import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!name.trim() || !validateEmail(email) || !validatePassword(password)) {
      setError('Completa tu nombre, un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      router.replace('/');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.identity}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <ScreenHeader title="Crear cuenta" subtitle="Después vincularemos tu cuenta eléctrica principal." />
      </View>

      <View style={styles.formCard}>
        <AppTextField
          autoComplete="name"
          label="Nombre completo"
          onChangeText={setName}
          returnKeyType="next"
          textContentType="name"
          value={name}
        />
        <View style={styles.fieldDivider} />
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
          autoComplete="new-password"
          helperText="Usa al menos 6 caracteres."
          label="Contraseña"
          onChangeText={setPassword}
          returnKeyType="go"
          secureTextEntry
          textContentType="newPassword"
          value={password}
        />
      </View>

      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}

      <AppButton title="Crear mi cuenta" icon="person-add-outline" loading={isSubmitting} onPress={handleRegister} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
        <TextLink title="Iniciar sesión" onPress={() => router.replace('/(auth)/login')} />
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
    borderRadius: nativeUI.compactRadius,
    height: 56,
    width: 56,
    ...nativeUI.curveStyle,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
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
