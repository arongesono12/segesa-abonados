import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/cards/StatusBadge';
import { EmptyState } from '@/components/empty-state';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';

export default function PaymentHistoryScreen() {
  const loadPayments = useCallback(() => electricityApi.getPayments(), []);
  const { data: payments, isLoading, error } = useApiResource(loadPayments);

  return (
    <Screen topInset>
      <View style={styles.top}>
        <Text style={styles.title}>Historial de pagos</Text>
        <PlatformIcon name="filter-outline" color={colors.primary} size={20} />
      </View>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="alert-outline" title="No se pudo cargar el historial" message={error} /> : null}
      {!isLoading && !error && payments?.length === 0 ? (
        <EmptyState title="Sin pagos todavia" message="Tus pagos confirmados apareceran aqui." />
      ) : null}
      {payments?.map((payment) => (
        <View key={payment.id} style={styles.card}>
          <View>
            <Text style={styles.period}>{formatDate(payment.paidAt)}</Text>
            <Text style={styles.meta}>{payment.method.replace('_', ' ')}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.amount}>{formatMoney(payment.amount, payment.currency)}</Text>
            <StatusBadge label={payment.status} tone={payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning'} />
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: nativeUI.fontBlack,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
  },
  period: {
    ...fontBase,
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  meta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 11,
    marginTop: 5,
    textTransform: 'capitalize',
  },
  right: {
    alignItems: 'flex-end',
    gap: 7,
  },
  amount: {
    ...fontBase,
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
});
