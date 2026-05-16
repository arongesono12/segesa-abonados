import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';

export default function DashboardScreen() {
  const { user, primaryAccount, updateAccounts } = useAuth();
  const loadPendingInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error, refetch } = useApiResource(loadPendingInvoices);

  const totalPending = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0;

  const syncCustomer = async () => {
    const accounts = await electricityApi.syncCustomer();
    await updateAccounts(accounts);
    await refetch();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user?.name}</Text>
        <Text style={sharedStyles.subtitle}>Este es el estado actualizado de tu servicio eléctrico.</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Pendiente por pagar</Text>
        <Text style={styles.balance}>{formatMoney(totalPending)}</Text>
        <Text style={styles.cardMeta}>{invoices?.length ?? 0} factura(s) pendiente(s)</Text>
      </View>

      {primaryAccount ? (
        <View style={sharedStyles.card}>
          <Text style={styles.sectionTitle}>{primaryAccount.providerName}</Text>
          <Text style={styles.accountText}>Contrato {primaryAccount.contractNumber}</Text>
          <Text style={styles.accountText}>{primaryAccount.serviceAddress}</Text>
          <Text style={styles.accountSync}>Última sincronización: {formatDate(primaryAccount.lastSyncAt)}</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Facturas recientes</Text>
        <Text style={styles.link} onPress={() => router.push('/(tabs)/invoices')}>Ver todo</Text>
      </View>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="warning-outline" title="No pudimos cargar facturas" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? (
        <EmptyState title="Sin pendientes" message="No tienes facturas pendientes en este momento." />
      ) : null}
      {invoices?.slice(0, 2).map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onPress={() => router.push(`/invoice/${invoice.id}`)} />
      ))}

      <View style={styles.quickActions}>
        <AppButton title="Sincronizar" icon="refresh-outline" variant="secondary" onPress={syncCustomer} />
        <AppButton title="Métodos de pago" icon="card-outline" variant="secondary" onPress={() => router.push('/(tabs)/invoices')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  greeting: {
    ...fontBase,
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: nativeUI.radius,
    gap: 8,
    padding: 18,
  },
  cardLabel: {
    ...fontBase,
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
  },
  balance: {
    ...fontBase,
    color: colors.surface,
    fontSize: 34,
    fontWeight: '900',
  },
  cardMeta: {
    ...fontBase,
    color: colors.primaryLight,
    fontSize: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...fontBase,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  link: {
    ...fontBase,
    color: colors.primary,
    fontWeight: '800',
  },
  accountText: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
    marginTop: 4,
  },
  accountSync: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
    marginTop: 10,
  },
  quickActions: {
    gap: 10,
  },
});
