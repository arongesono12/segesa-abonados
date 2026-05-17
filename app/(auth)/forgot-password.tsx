import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
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
      if (process.env.EXPO_OS === 'ios') {
        const haptics = require('expo-haptics');
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={{ gap: 10, marginTop: 24 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
          Recuperar contraseña
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Recibirás un enlace seguro para crear una nueva contraseña.
        </Text>
      </View>

      <AppTextField autoCapitalize="none" keyboardType="email-address" label="Correo electrónico" onChangeText={setEmail} value={email} />
      {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
      {message ? <Text style={{ color: colors.success, fontSize: 14, fontWeight: '700' }}>{message}</Text> : null}
      <AppButton title="Enviar enlace" loading={isSubmitting} onPress={handleRecover} />
      <Link href="/(auth)/login" asChild>
        <AppButton title="Volver al inicio de sesión" variant="ghost" onPress={() => {}} />
      </Link>
    </Screen>
  );
}
