import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { TextLink } from '@/components/text-link';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage, validateEmail, validatePassword } from '@/utils/validation';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { height } = useWindowDimensions();
  const compact = height < 790;
  const tight = height < 710;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!name.trim() || !phone.trim() || !validateEmail(email) || !validatePassword(password)) {
      setError('Completa tus datos y usa una contrasena de al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    if (!acceptedTerms) {
      setError('Debes aceptar los terminos y condiciones.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password, phone);
      router.replace({ pathname: '/auth/verify-otp', params: { destination: phone || email } });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <View style={[styles.logoWrap, { marginTop: tight ? 18 : compact ? 28 : 54 }]}>
        <SegesaLogo large={!compact && !tight} />
      </View>

      <View style={[styles.form, { gap: tight ? 11 : 13, marginTop: tight ? 22 : compact ? 30 : 46 }]}>
        <Text style={[styles.title, { fontSize: tight ? 30 : compact ? 34 : 40 }]}>Crear cuenta</Text>
        <Text style={[styles.subtitle, { fontSize: tight ? 16 : 19, lineHeight: tight ? 22 : 27 }]}>
          Registrate para consultar tus facturas{'\n'}y pagar en linea
        </Text>

        <FormField icon="account-outline" placeholder="Nombre completo" value={name} onChangeText={setName} tight={tight} />
        <FormField
          icon="cellphone"
          placeholder={'Telefono\nEj. 222 123 456'}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          tight={tight}
        />
        <FormField
          icon="email-outline"
          placeholder={'Correo electronico\nEj. correo@ejemplo.com'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          tight={tight}
        />
        <FormField
          icon="lock-outline"
          placeholder="Contrasena"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon="eye-outline"
          onRightPress={() => setShowPassword((value) => !value)}
          tight={tight}
        />
        <FormField
          icon="lock-outline"
          placeholder="Confirmar contrasena"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          rightIcon="eye-outline"
          onRightPress={() => setShowConfirmPassword((value) => !value)}
          tight={tight}
        />

        <Pressable onPress={() => setAcceptedTerms((value) => !value)} style={styles.terms}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
            {acceptedTerms ? <PlatformIcon name="check" color={colors.surface} size={15} /> : null}
          </View>
          <Text style={[styles.termsText, { fontSize: tight ? 14 : 16 }]}>
            Acepto los <Text style={styles.termsLink}>terminos y condiciones</Text>
          </Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title="Registrarme" loading={isSubmitting} onPress={handleRegister} style={[styles.button, { minHeight: tight ? 52 : 62 }]} />
      </View>

      <View style={[styles.footer, { marginTop: tight ? 12 : 22 }]}>
        <Text style={[styles.footerText, { fontSize: tight ? 15 : 18 }]}>Ya tienes cuenta?</Text>
        <TextLink title="Iniciar sesion" onPress={() => router.replace('/auth/login')} />
      </View>
    </Screen>
  );
}

function FormField({
  icon,
  rightIcon,
  onRightPress,
  tight,
  style,
  ...props
}: TextInputProps & {
  icon: string;
  rightIcon?: string;
  onRightPress?: () => void;
  tight: boolean;
}) {
  return (
    <View style={[styles.inputBox, { minHeight: tight ? 48 : 58 }, style]}>
      <PlatformIcon name={icon} color={colors.muted} size={tight ? 20 : 24} />
      <TextInput
        autoCorrect={false}
        placeholderTextColor={colors.muted}
        style={[styles.input, { fontSize: tight ? 15 : 18 }]}
        {...props}
      />
      {rightIcon ? (
        <Pressable accessibilityRole="button" onPress={onRightPress}>
          <PlatformIcon name={rightIcon} color={colors.muted} size={tight ? 23 : 28} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
  },
  form: {},
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  subtitle: {
    ...fontBase,
    color: colors.textSoft,
  },
  inputBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#D5D9E1',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 18,
  },
  input: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    paddingVertical: 0,
  },
  terms: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginTop: 2,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.success,
    borderRadius: 5,
    borderWidth: 2,
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  checkboxActive: {
    backgroundColor: colors.success,
  },
  termsText: {
    ...fontBase,
    color: colors.text,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '800',
  },
  button: {
    marginTop: 8,
  },
  error: {
    ...fontBase,
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  footerText: {
    ...fontBase,
    color: colors.text,
  },
});
