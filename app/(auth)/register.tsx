import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
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
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Crear cuenta</Text>
        <Text style={sharedStyles.subtitle}>Después del registro vincularemos tu cuenta eléctrica principal.</Text>
      </View>

      <View style={styles.form}>
        <AppTextField label="Nombre completo" onChangeText={setName} value={name} />
        <AppTextField autoCapitalize="none" keyboardType="email-address" label="Correo electrónico" onChangeText={setEmail} value={email} />
        <AppTextField label="Contraseña" onChangeText={setPassword} secureTextEntry value={password} />
        {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
        <AppButton title="Registrarme" loading={isSubmitting} onPress={handleRegister} />
        <AppButton title="Ya tengo cuenta" variant="ghost" onPress={() => router.replace('/(auth)/login')} />
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
});
