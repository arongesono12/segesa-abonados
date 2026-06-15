import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { ScreenHeaderBar } from '@/components/navigation/ScreenHeaderBar';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { PaymentMethodType } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { getErrorMessage } from '@/utils/validation';

const methodLabels: Record<string, string> = {
  bank_transfer: 'Transferencia bancaria',
  card: 'Tarjeta bancaria',
  mobile_money: 'Pago movil (GETESA)',
};

export default function PaymentConfirmationScreen() {
  const { invoiceId, method = 'card' } = useLocalSearchParams<{ invoiceId: string; method?: PaymentMethodType }>();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmPayment = async () => {
    if (!invoiceId) return;
    setError('');
    try {
      setIsSubmitting(true);
      const payment = await electricityApi.payInvoice(invoiceId, method);
      router.replace({
        pathname: '/payments/success',
        params: {
          amount: String(payment.amount),
          currency: payment.currency,
          invoiceId: payment.invoiceId,
          method: payment.method,
          reference: payment.reference,
        },
      });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      router.push('/payments/failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <ScreenHeaderBar title="Confirmar pago" />
      <View style={styles.warning}>
        <PlatformIcon name="shield-check-outline" color={colors.primary} size={36} />
        <Text style={styles.warningText}>Revisa los datos antes de confirmar. La transaccion se enviara a la pasarela de pago.</Text>
      </View>
      <View style={styles.summary}>
        <SummaryRow label="Factura" value={invoiceId ?? 'F-2025-05-0123'} />
        <SummaryRow label="Importe" value={formatMoney(25000)} success />
        <SummaryRow label="Metodo" value={methodLabels[method]} />
        <SummaryRow label="Estado inicial" value="pending" />
      </View>
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
      <AppButton title="Confirmar pago" loading={isSubmitting} onPress={confirmPayment} style={styles.button} />
      <Text style={styles.secure}>Transaccion segura y encriptada</Text>
    </Screen>
  );
}

function SummaryRow({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, success && styles.successValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  warning: {
    alignItems: 'center',
    backgroundColor: '#EDF6FF',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    padding: 18,
  },
  warningText: {
    ...fontBase,
    color: colors.textSoft,
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
    paddingHorizontal: 22,
    ...nativeUI.cardShadow,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 68,
  },
  label: {
    ...fontBase,
    color: colors.muted,
    fontSize: 17,
  },
  value: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },
  successValue: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '900',
  },
  button: {
    marginTop: 30,
  },
  secure: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
