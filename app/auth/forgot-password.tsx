import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { TextLink } from '@/components/text-link';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage, validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const { recoverPassword } = useAuth();
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecover = async () => {
    setError('');

    if (!validateEmail(email)) {
      setError('Introduce un correo electronico valido.');
      return;
    }

    try {
      setIsSubmitting(true);
      await recoverPassword(email);
      router.push({ pathname: '/auth/verify-otp', params: { destination: email, mode: 'recover' } });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <View style={[styles.logoWrap, { marginTop: compact ? 46 : 86 }]}>
        <SegesaLogo large={!compact} />
      </View>

      <View style={[styles.form, { marginTop: compact ? 44 : 72 }]}>
        <Text style={[styles.title, { fontSize: compact ? 31 : 36 }]}>Recuperar contrasena</Text>
        <Text style={styles.subtitle}>Te enviaremos un codigo temporal para verificar tu identidad.</Text>
        <AppTextField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Correo electronico"
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          value={email}
        />
        {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
        <AppButton title="Enviar codigo" loading={isSubmitting} onPress={handleRecover} style={styles.button} />
      </View>

      <TextLink title="Volver al inicio de sesion" onPress={() => router.replace('/auth/login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
  },
  form: {
    gap: 18,
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  subtitle: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 23,
  },
  button: {
    marginTop: 22,
    minHeight: 60,
  },
});
