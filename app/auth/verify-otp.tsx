import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage } from '@/utils/validation';

export default function VerifyOtpScreen() {
  const { destination = '', mode } = useLocalSearchParams<{ destination?: string; mode?: string }>();
  const { sendOtp, verifyOtp } = useAuth();
  const { height } = useWindowDimensions();
  const compact = height < 780;
  const tight = height < 710;
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (destination) {
      sendOtp(destination).catch((caughtError) => setError(getErrorMessage(caughtError)));
    }
  }, [destination, sendOtp]);

  const handleVerify = async () => {
    setError('');
    if (code.length !== 6) {
      setError('El codigo debe tener 6 digitos.');
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyOtp(code);
      router.replace(mode === 'recover' ? '/auth/login' : '/auth/link-contract');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <View style={[styles.logoWrap, { marginTop: tight ? 26 : compact ? 40 : 70 }]}>
        <SegesaLogo large={!compact && !tight} />
      </View>

      <View style={[styles.illustration, { height: tight ? 162 : compact ? 188 : 230, marginTop: tight ? 30 : 44 }]}>
        <View style={styles.phoneArt}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneLine} />
          <View style={styles.phoneBottom} />
        </View>
        <View style={styles.codeBubble}>
          <View style={styles.lockIcon}>
            <PlatformIcon name="lock" color={colors.surface} size={22} />
          </View>
          <Text style={styles.stars}>* * * * *</Text>
        </View>
        <View style={styles.sparkOne} />
        <View style={styles.sparkTwo} />
        <View style={styles.sparkThree} />
      </View>

      <View style={[styles.copy, { marginTop: tight ? 20 : 30 }]}>
        <Text style={[styles.title, { fontSize: tight ? 31 : compact ? 35 : 40 }]}>Verificar codigo</Text>
        <Text style={[styles.subtitle, { fontSize: tight ? 17 : 20, lineHeight: tight ? 24 : 29 }]}>
          Hemos enviado un codigo de 6 digitos{'\n'}a tu telefono
        </Text>
      </View>

      <Pressable onPress={() => inputRef.current?.focus()} style={[styles.codeRow, { marginTop: tight ? 24 : 38 }]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={[styles.codeBox, { height: tight ? 54 : 70, width: tight ? 44 : 58 }]}>
            <Text style={[styles.codeText, { fontSize: tight ? 25 : 32 }]}>{code[index] ?? ''}</Text>
          </View>
        ))}
        <TextInput
          ref={inputRef}
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
          style={styles.hiddenInput}
          value={code}
        />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={[styles.resend, { marginTop: tight ? 22 : 34 }]}>
        Reenviar codigo en <Text style={styles.timer}>00:45</Text>
      </Text>
      <AppButton title="Verificar" loading={isSubmitting} onPress={handleVerify} style={[styles.button, { minHeight: tight ? 56 : 68 }]} />
      <Pressable onPress={() => router.back()} style={styles.changeButton}>
        <Text style={styles.changeText}>Cambiar numero</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneArt: {
    backgroundColor: '#F7FBFF',
    borderColor: '#7AA8EA',
    borderRadius: 24,
    borderWidth: 5,
    height: '100%',
    width: '34%',
  },
  phoneNotch: {
    backgroundColor: '#C9DAF5',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 18,
    left: '28%',
    position: 'absolute',
    top: 0,
    width: '44%',
  },
  phoneLine: {
    backgroundColor: '#7AA8EA',
    borderRadius: 3,
    height: 5,
    left: '38%',
    position: 'absolute',
    top: 30,
    width: '24%',
  },
  phoneBottom: {
    backgroundColor: '#9CBCEC',
    borderRadius: 3,
    bottom: 16,
    height: 5,
    left: '39%',
    position: 'absolute',
    width: '22%',
  },
  codeBubble: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 20,
    height: 74,
    justifyContent: 'center',
    position: 'absolute',
    width: 254,
    ...nativeUI.cardShadow,
  },
  lockIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  stars: {
    color: '#7AA8EA',
    fontFamily: nativeUI.fontBlack,
    fontSize: 30,
    fontWeight: '900',
  },
  sparkOne: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 30,
    position: 'absolute',
    right: '22%',
    top: '36%',
    transform: [{ rotate: '18deg' }],
    width: 6,
  },
  sparkTwo: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 24,
    position: 'absolute',
    right: '16%',
    top: '45%',
    transform: [{ rotate: '58deg' }],
    width: 6,
  },
  sparkThree: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 26,
    position: 'absolute',
    right: '12%',
    top: '55%',
    transform: [{ rotate: '100deg' }],
    width: 6,
  },
  copy: {
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    ...fontBase,
    color: colors.textSoft,
    marginTop: 16,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  codeBox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  codeText: {
    ...fontBase,
    color: colors.textSoft,
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  error: {
    ...fontBase,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  resend: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 19,
    textAlign: 'center',
  },
  timer: {
    color: colors.primary,
    fontWeight: '900',
  },
  button: {
    marginTop: 32,
  },
  changeButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  changeText: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontSize: 18,
    fontWeight: '900',
  },
});
