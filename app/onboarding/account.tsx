import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
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
      <ScreenHeader
        title="Vincula tu cuenta eléctrica"
        subtitle="Usaremos este identificador para consultar facturas, sincronizar tu perfil y confirmar pagos."
      />

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Dato obligatorio</Text>
        <Text style={styles.noticeText}>Puedes encontrarlo en una factura impresa o en tu contrato de suministro.</Text>
      </View>

      <View style={styles.formCard}>
        <AppTextField
          autoCapitalize="characters"
          error={error}
          helperText="Ejemplo: SEG-123456"
          label="Número de cuenta, contrato o abonado"
          onChangeText={setContractNumber}
          placeholder="SEG-123456"
          value={contractNumber}
        />
      </View>

      <AppButton title="Validar y guardar" loading={isSubmitting} onPress={validateAccount} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 6,
    padding: 16,
    ...nativeUI.curveStyle,
  },
  noticeTitle: {
    color: colors.primaryDark,
    fontFamily: nativeUI.fontBlack,
    fontSize: 15,
    fontWeight: '900',
  },
  noticeText: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
});
