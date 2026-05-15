import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { PaymentMethodType } from '@/types/domain';
import { getErrorMessage } from '@/utils/validation';

const methods: { id: PaymentMethodType; title: string; description: string }[] = [
  { id: 'card', title: 'Tarjeta bancaria', description: 'Visa, Mastercard o tarjeta local habilitada.' },
  { id: 'mobile_money', title: 'Mobile money', description: 'Confirma el cargo desde tu operador móvil.' },
  { id: 'bank_transfer', title: 'Transferencia bancaria', description: 'Genera una referencia para transferencia.' },
];

export default function PaymentMethodScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payInvoice = async () => {
    if (!invoiceId) return;

    setError('');
    setIsSubmitting(true);

    try {
      const payment = await electricityApi.payInvoice(invoiceId, selectedMethod);
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
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
        Método de pago
      </Text>
      <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
        Elige cómo quieres pagar esta factura. La confirmación se consulta al backend.
      </Text>

      <View style={{ gap: 12 }}>
        {methods.map((method) => {
          const selected = selectedMethod === method.id;

          return (
            <Pressable
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={{
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderColor: selected ? colors.primary : colors.border,
                borderRadius: 8,
                borderCurve: 'continuous',
                borderWidth: selected ? 2 : 1,
                flexDirection: 'row',
                gap: 12,
                padding: 16,
              }}>
              <View style={{
                alignItems: 'center',
                borderColor: colors.primary,
                borderRadius: 10,
                borderWidth: 2,
                height: 20,
                justifyContent: 'center',
                width: 20,
              }}>
                {selected ? (
                  <View style={{
                    backgroundColor: colors.primary,
                    borderRadius: 5,
                    height: 10,
                    width: 10,
                  }} />
                ) : null}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '900' }}>
                  {method.title}
                </Text>
                <Text style={{ color: colors.textSoft, fontSize: 13, lineHeight: 19 }}>
                  {method.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
      <AppButton title="Confirmar pago" sfIcon="checkmark.shield.fill" loading={isSubmitting} onPress={payInvoice} />
    </Screen>
  );
}
