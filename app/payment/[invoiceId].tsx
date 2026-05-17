import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
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
      router.replace({
        pathname: '/payment/confirmation',
        params: { reference: payment.reference, amount: String(payment.amount), currency: payment.currency },
      });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={sharedStyles.title}>Método de pago</Text>
      <Text style={sharedStyles.subtitle}>Elige cómo quieres pagar esta factura. La confirmación se consulta al backend.</Text>

      <View style={styles.list}>
        {methods.map((method) => {
          const selected = selectedMethod === method.id;

          return (
            <Pressable key={method.id} onPress={() => setSelectedMethod(method.id)} style={[styles.method, selected && styles.selected]}>
              <View style={styles.radioOuter}>{selected ? <View style={styles.radioInner} /> : null}</View>
              <View style={styles.methodText}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
      <AppButton title="Confirmar pago" icon="shield-check" loading={isSubmitting} onPress={payInvoice} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  method: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioInner: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  methodText: {
    flex: 1,
    gap: 4,
  },
  methodTitle: {
    ...fontBase,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  methodDescription: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
});
