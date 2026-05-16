import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { getErrorMessage } from '@/utils/validation';

export default function AccountOnboardingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const { savePrimaryAccount } = useAuth();
  const [contractNumber, setContractNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAccount = async () => {
    setError('');

    if (!providerId || contractNumber.trim().length < 5) {
      setError('Introduce un número de cuenta o contrato válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      const account = await electricityApi.validateAccount(providerId, contractNumber);
      await savePrimaryAccount(account);
      router.replace('/(tabs)');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Vincula tu cuenta eléctrica</Text>
        <Text style={sharedStyles.subtitle}>
          Usaremos este identificador para consultar facturas, sincronizar tu perfil y confirmar pagos.
        </Text>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Dato obligatorio</Text>
        <Text style={styles.noticeText}>Puedes encontrarlo en una factura impresa o en tu contrato de suministro.</Text>
      </View>

      <AppTextField
        autoCapitalize="characters"
        label="Número de cuenta, contrato o abonado"
        onChangeText={setContractNumber}
        placeholder="Ej. SEG-123456"
        value={contractNumber}
      />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
      <AppButton title="Validar y guardar" loading={isSubmitting} onPress={validateAccount} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  notice: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 4,
    padding: 16,
  },
  noticeTitle: {
    ...fontBase,
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
  },
  noticeText: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
});
