import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { EmptyState } from '@/components/empty-state';
import { ScreenHeaderBar } from '@/components/navigation/ScreenHeaderBar';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { Invoice } from '@/types/domain';
import { formatDate, formatMoney } from '@/utils/format';

const fallbackInvoice: Invoice = {
  id: 'inv-2025-05',
  accountId: 'acc-1',
  invoiceNumber: 'F-2025-05-0123',
  period: 'Mayo 2025',
  issueDate: '2025-06-05',
  dueDate: '2025-06-30',
  amount: 25000,
  currency: 'XAF',
  status: 'pending',
  kwh: 500,
  contractNumber: '00012345',
  customerCode: 'CL-2026-0001',
  serviceAddress: 'Malabo, Barrio Centro',
  pdfUrl: 'mock://facturas/F-2025-05-0123.pdf',
};

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loadInvoice = useCallback(() => electricityApi.getInvoice(id), [id]);
  const { data: invoice, isLoading, error } = useApiResource(loadInvoice, Boolean(id));
  const displayInvoice = invoice ?? fallbackInvoice;

  return (
    <Screen topInset>
      <ScreenHeaderBar title="Detalle de factura" rightIcon="download-outline" />

      {isLoading && !invoice ? <ActivityIndicator color={colors.primary} /> : null}
      {error && !displayInvoice ? <EmptyState icon="alert-outline" title="Factura no disponible" message={error} /> : null}

      <View style={styles.card}>
        <SegesaLogo />

        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.sectionTitle}>Factura</Text>
            <Text style={styles.invoiceNo}>N° {displayInvoice.invoiceNumber}</Text>
          </View>
          <StatusBadge
            label={displayInvoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
            tone={displayInvoice.status === 'paid' ? 'success' : 'warning'}
          />
        </View>

        <View style={styles.divider} />
        <Row label="Periodo facturado" value="01/05/2025 - 31/05/2025" />
        <Row label="Fecha de emision" value={formatDate(displayInvoice.issueDate)} />
        <Row label="Fecha limite de pago" value={formatDate(displayInvoice.dueDate)} />

        <View style={styles.divider} />
        <Text style={styles.summaryTitle}>Resumen</Text>
        <Row label="Consumo" value={`${displayInvoice.kwh} kWh`} />
        <Row label="Cargo fijo" value={formatMoney(5000, displayInvoice.currency)} />
        <Row label="Energia" value={formatMoney(17500, displayInvoice.currency)} />
        <Row label="Impuestos" value={formatMoney(2500, displayInvoice.currency)} />

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.total}>{formatMoney(displayInvoice.amount, displayInvoice.currency)}</Text>
        </View>

        <AppButton
          title="Descargar PDF"
          icon="download-outline"
          variant="secondary"
          onPress={() => router.push({ pathname: '/invoices/pdf-viewer', params: { invoiceId: displayInvoice.id } })}
          style={styles.button}
        />
        {displayInvoice.status !== 'paid' ? (
          <AppButton
            title="Pagar ahora"
            onPress={() => router.push({ pathname: '/payments/method', params: { invoiceId: displayInvoice.id } })}
            style={styles.payButton}
          />
        ) : null}
      </View>
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 20,
    marginTop: 20,
    padding: 28,
    ...nativeUI.cardShadow,
  },
  invoiceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 30,
    fontWeight: '900',
  },
  invoiceNo: {
    ...fontBase,
    color: colors.text,
    fontSize: 25,
    marginTop: 10,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 24,
    fontWeight: '900',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 21,
  },
  rowValue: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 20,
    textAlign: 'right',
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 24,
    fontWeight: '900',
  },
  total: {
    ...fontBase,
    color: colors.success,
    fontSize: 29,
    fontWeight: '900',
  },
  button: {
    marginTop: 20,
  },
  payButton: {
    backgroundColor: colors.success,
  },
});
