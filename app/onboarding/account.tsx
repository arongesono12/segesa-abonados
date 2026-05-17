import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
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
      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
          Vincula tu cuenta eléctrica
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Usaremos este identificador para consultar facturas, sincronizar tu perfil y confirmar pagos.
        </Text>
      </View>

      <View style={{
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        borderRadius: 8,
        borderCurve: 'continuous',
        borderWidth: 1,
        gap: 4,
        padding: 16,
      }}>
        <Text style={{ color: colors.primaryDark, fontSize: 15, fontWeight: '800' }}>
          Dato obligatorio
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 14, lineHeight: 20 }}>
          Puedes encontrarlo en una factura impresa o en tu contrato de suministro.
        </Text>
      </View>

      <AppTextField
        autoCapitalize="characters"
        label="Número de cuenta, contrato o abonado"
        onChangeText={setContractNumber}
        placeholder="Ej. SEG-123456"
        value={contractNumber}
      />
      {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
      <AppButton title="Validar y guardar" loading={isSubmitting} onPress={validateAccount} />
    </Screen>
  );
}
