import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
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
      if (process.env.EXPO_OS === 'ios') {
        const haptics = require('expo-haptics');
        haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
      }
      router.replace('/onboarding/provider');
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
          Crear cuenta
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Después del registro vincularemos tu cuenta eléctrica principal.
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <AppTextField label="Nombre completo" onChangeText={setName} value={name} />
        <AppTextField autoCapitalize="none" keyboardType="email-address" label="Correo electrónico" onChangeText={setEmail} value={email} />
        <AppTextField label="Contraseña" onChangeText={setPassword} secureTextEntry value={password} />
        {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
        <AppButton title="Registrarme" loading={isSubmitting} onPress={handleRegister} />
        <Link href="/(auth)/login" asChild>
          <AppButton title="Ya tengo cuenta" variant="ghost" onPress={() => {}} />
        </Link>
      </View>
    </Screen>
  );
}
