import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { TextLink } from '@/components/text-link';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';
import { getErrorMessage, validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const { recoverPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecover = async () => {
    setError('');
    setMessage('');

    if (!validateEmail(email)) {
      setError('Introduce un correo electrónico válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      await recoverPassword(email);
      setMessage('Te hemos enviado instrucciones para restablecer la contraseña.');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Recuperar contraseña</Text>
        <Text style={sharedStyles.subtitle}>Recibirás un enlace seguro para crear una nueva contraseña.</Text>
      </View>

      <AppTextField autoCapitalize="none" keyboardType="email-address" label="Correo electrónico" onChangeText={setEmail} value={email} />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}
      <AppButton title="Enviar enlace" loading={isSubmitting} onPress={handleRecover} />
      <TextLink title="Volver al inicio de sesión" onPress={() => router.replace('/(auth)/login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginTop: 24,
  },
  success: {
    ...fontBase,
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
});
