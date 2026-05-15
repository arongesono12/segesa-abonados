import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { formatDate, formatMoney } from '@/utils/format';

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loadInvoice = useCallback(() => electricityApi.getInvoice(id), [id]);
  const { data: invoice, isLoading, error } = useApiResource(loadInvoice, Boolean(id));

  return (
    <Screen>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="warning-outline" title="Factura no disponible" message={error} /> : null}
      {invoice ? (
        <>
          <View style={styles.header}>
            <Text style={sharedStyles.title}>{invoice.period}</Text>
            <Text style={sharedStyles.subtitle}>Factura {invoice.invoiceNumber}</Text>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amount}>{formatMoney(invoice.amount, invoice.currency)}</Text>
            <Text style={styles.status}>{invoice.status === 'paid' ? 'Pagada' : 'Pendiente de pago'}</Text>
          </View>

          <View style={sharedStyles.card}>
            <Row label="Fecha de emisión" value={formatDate(invoice.issueDate)} />
            <Row label="Fecha límite" value={formatDate(invoice.dueDate)} />
            <Row label="Consumo" value={`${invoice.kwh} kWh`} />
            <Row label="Estado" value={invoice.status} />
          </View>

          {invoice.status !== 'paid' ? (
            <AppButton title="Pagar factura" icon="card-outline" onPress={() => router.push(`/payment/${invoice.id}`)} />
          ) : (
            <AppButton title="Ver historial" icon="time-outline" variant="secondary" onPress={() => router.push('/(tabs)/history')} />
          )}
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    gap: 8,
    padding: 18,
  },
  amountLabel: {
    color: '#DDEFEA',
    fontSize: 14,
    fontWeight: '700',
  },
  amount: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: '900',
  },
  status: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
