import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTopBar } from '@/components/cards/AppTopBar';
import { QuickAction } from '@/components/cards/QuickAction';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { UsageBars } from '@/components/cards/UsageBars';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { invoiceService } from '@/services/invoice.service';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';

export default function DashboardScreen() {
  const { user, primaryAccount } = useAuth();
  const loadPendingInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error } = useApiResource(loadPendingInvoices);
  const currentInvoice = invoices?.[0];
  const downloadInvoice = async () => {
    if (!currentInvoice) return;
    await invoiceService.createInvoicePdf(
      currentInvoice.invoiceNumber,
      `SEGESA\nFactura ${currentInvoice.invoiceNumber}\nContrato ${currentInvoice.contractNumber}\nTotal ${formatMoney(currentInvoice.amount, currentInvoice.currency)}`,
    );
  };

  return (
    <Screen topInset>
      <StatusBar backgroundColor={colors.primary} style="light" translucent={false} />
      <AppTopBar
        title={`Hola, ${user?.name ?? 'Juan Mba'}`}
        subtitle={`Contrato: ${primaryAccount?.contractNumber ?? '00012345'}`}
        onBellPress={() => router.push('/tabs/support')}
      />

      <View style={styles.invoiceCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Factura actual</Text>
          {currentInvoice ? <StatusBadge label="Pendiente" tone="warning" /> : null}
        </View>

        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? <EmptyState icon="alert-outline" title="No pudimos cargar facturas" message={error} /> : null}

        {currentInvoice ? (
          <>
            {primaryAccount ? (
              <View style={styles.addressBox}>
                <Text style={styles.addressLabel}>Direccion de suministro</Text>
                <Text style={styles.addressText}>{primaryAccount.serviceAddress}</Text>
              </View>
            ) : null}
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.muted}>Importe a pagar</Text>
                <Text style={styles.amount}>{formatMoney(currentInvoice.amount, currentInvoice.currency)}</Text>
              </View>
              <View style={styles.rightInfo}>
                <Text style={styles.muted}>Estado</Text>
                <StatusBadge label="Pendiente" tone="warning" />
              </View>
            </View>
            <View style={styles.dueRow}>
              <Text style={styles.muted}>Vencimiento</Text>
              <Text style={styles.dueDate}>{formatDate(currentInvoice.dueDate)}</Text>
            </View>
            <View style={styles.actionsRow}>
              <AppButton
                title="Descargar"
                variant="secondary"
                onPress={downloadInvoice}
                style={styles.actionButton}
              />
              <AppButton
                title="Pagar ahora"
                onPress={() => router.push({ pathname: '/payments/method', params: { invoiceId: currentInvoice.id } })}
                style={styles.payButton}
              />
            </View>
          </>
        ) : !isLoading && !error ? (
          <EmptyState title="Sin pendientes" message="No tienes facturas pendientes en este momento." />
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Consumo del periodo</Text>
          <Text style={styles.muted}>Mayo 2026</Text>
        </View>
        <UsageBars />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Accesos rapidos</Text>
        <View style={styles.quickGrid}>
          <QuickAction icon="receipt-outline" label="Mis facturas" onPress={() => router.push('/tabs/invoices')} />
          <QuickAction icon="clock-outline" label="Historial de pagos" onPress={() => router.push('/tabs/payments')} />
          <QuickAction icon="bell-outline" label="Notificaciones" onPress={() => router.push('/tabs/support')} />
          <QuickAction icon="headset" label="Atencion al cliente" onPress={() => router.push('/tabs/support')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  invoiceCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 16,
    marginTop: -56,
    padding: 20,
    ...nativeUI.cardShadow,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 20,
    fontWeight: '900',
  },
  muted: {
    ...fontBase,
    color: colors.muted,
    fontSize: 15,
  },
  balanceRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    gap: 6,
    padding: 12,
  },
  addressLabel: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
  },
  addressText: {
    ...fontBase,
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  amount: {
    color: colors.success,
    fontFamily: nativeUI.fontBlack,
    fontSize: 32,
    fontWeight: '900',
  },
  rightInfo: {
    alignItems: 'flex-end',
    gap: 8,
  },
  dueRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  dueDate: {
    color: colors.text,
    fontFamily: nativeUI.fontBold,
    fontSize: 17,
    fontWeight: '900',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  actionButton: {
    flex: 1,
  },
  payButton: {
    backgroundColor: colors.success,
    flex: 1,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
  },
});
