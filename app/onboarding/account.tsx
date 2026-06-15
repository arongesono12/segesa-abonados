import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage } from '@/utils/validation';

const demoContracts = ['00012345', 'SEG-123456', 'CN-003256'];

export default function AccountOnboardingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const { savePrimaryAccount } = useAuth();
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const [contractNumber, setContractNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAccount = async () => {
    setError('');
    const selectedProviderId = providerId ?? 'segesa';

    if (contractNumber.trim().length < 5) {
      setError('Introduce un numero de contrato valido.');
      return;
    }

    try {
      setIsSubmitting(true);
      const account = await electricityApi.validateAccount(selectedProviderId, contractNumber);
      await savePrimaryAccount(account);
      router.replace('/tabs/home');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <View style={[styles.logoWrap, { marginTop: compact ? 44 : 82 }]}>
        <SegesaLogo large={!compact} />
      </View>

      <View style={[styles.form, { marginTop: compact ? 42 : 68 }]}>
        <Text style={[styles.title, { fontSize: compact ? 31 : 36 }]}>Vincular contrato</Text>
        <Text style={styles.subtitle}>Introduce tu numero de contrato SEGESA para consultar facturas, pagos y avisos.</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Contratos demo</Text>
          <View style={styles.chips}>
            {demoContracts.map((contract) => (
              <Pressable key={contract} onPress={() => setContractNumber(contract)} style={styles.chip}>
                <Text style={styles.chipText}>{contract}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <AppTextField
          autoCapitalize="characters"
          error={error}
          label="Numero de contrato"
          onChangeText={setContractNumber}
          placeholder="00012345"
          value={contractNumber}
        />

        <AppButton title="Validar y guardar" loading={isSubmitting} onPress={validateAccount} style={styles.button} />
      </View>
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
  notice: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  noticeTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 15,
    fontWeight: '900',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    ...fontBase,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  button: {
    marginTop: 18,
    minHeight: 60,
  },
});
