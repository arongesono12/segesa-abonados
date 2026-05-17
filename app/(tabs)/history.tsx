import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';

export default function PaymentHistoryScreen() {
  const loadPayments = useCallback(() => electricityApi.getPayments(), []);
  const { data: payments, isLoading, error } = useApiResource(loadPayments);

  return (
    <Screen>
      <Text style={sharedStyles.title}>Historial de pagos</Text>
      <Text style={sharedStyles.subtitle}>Pagos confirmados y referencias de operación.</Text>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="alert-outline" title="No se pudo cargar el historial" message={error} /> : null}
      {!isLoading && !error && payments?.length === 0 ? (
        <EmptyState title="Sin pagos todavía" message="Tus pagos confirmados aparecerán aquí." />
      ) : null}
      {payments?.map((payment) => (
        <View key={payment.id} style={sharedStyles.card}>
          <View style={styles.row}>
            <Text style={styles.amount}>{formatMoney(payment.amount, payment.currency)}</Text>
            <Text style={styles.status}>Confirmado</Text>
          </View>
          <Text style={styles.meta}>Referencia {payment.reference}</Text>
          <Text style={styles.meta}>{formatDate(payment.paidAt)} · {payment.method.replace('_', ' ')}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amount: {
    ...fontBase,
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  status: {
    ...fontBase,
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
  },
  meta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
});
