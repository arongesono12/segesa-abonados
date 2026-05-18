import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { AppIconName, PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { TextLink } from '@/components/text-link';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { InvoiceStatus } from '@/types/domain';
import { formatDate, formatMoney } from '@/utils/format';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: AppIconName }> = {
  pending: { label: 'Pendiente', color: colors.warning, bg: colors.warningLight, icon: 'clock-outline' },
  processing: { label: 'Procesando', color: colors.accent, bg: '#DBEAFE', icon: 'refresh' },
  paid: { label: 'Pagada', color: colors.success, bg: colors.successLight, icon: 'check-circle-outline' },
  expired: { label: 'Vencida', color: colors.danger, bg: '#FEE2E2', icon: 'alert-outline' },
};

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loadInvoice = useCallback(() => electricityApi.getInvoice(id), [id]);
  const { data: invoice, isLoading, error } = useApiResource(loadInvoice, Boolean(id));

  const status = invoice ? statusConfig[invoice.status] : null;

  return (
    <Screen>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="alert-outline" title="Factura no disponible" message={error} /> : null}
      {invoice && status ? (
        <>
          <View style={styles.header}>
            <Text style={sharedStyles.title}>{invoice.period}</Text>
            <Text style={sharedStyles.subtitle}>Factura {invoice.invoiceNumber}</Text>
          </View>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Total a pagar</Text>
            <Text style={styles.amount}>{formatMoney(invoice.amount, invoice.currency)}</Text>
            <View style={styles.statusBadge}>
              <PlatformIcon name={status.icon} size={14} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>

          <View style={sharedStyles.card}>
            <Row label="Número" value={invoice.invoiceNumber} />
            <Row label="Periodo" value={invoice.period} />
            <Row label="Fecha de emisión" value={formatDate(invoice.issueDate)} />
            <Row label="Fecha límite" value={formatDate(invoice.dueDate)} />
            <Row label="Consumo" value={`${invoice.kwh} kWh`} />
          </View>

          {invoice.status === 'pending' || invoice.status === 'expired' ? (
            <AppButton
              title="Pagar factura"
              icon="credit-card-outline"
              onPress={() => router.push(`/payment/${invoice.id}`)}
            />
          ) : invoice.status === 'paid' ? (
            <AppButton
              title="Ver historial de pagos"
              icon="clock-outline"
              variant="secondary"
              onPress={() => router.push('/(tabs)/history')}
            />
          ) : null}

          <TextLink title="Volver a facturas" onPress={() => router.back()} />
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
    gap: 6,
  },
  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: nativeUI.radius,
    gap: 10,
    padding: 20,
  },
  amountLabel: {
    ...fontBase,
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  amount: {
    ...fontBase,
    color: colors.surface,
    fontSize: 36,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    ...fontBase,
    fontSize: 13,
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
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
  },
  rowValue: {
    ...fontBase,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
