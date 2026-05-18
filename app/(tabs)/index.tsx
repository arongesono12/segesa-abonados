import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI, useNativeLayout } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';
import { getErrorMessage } from '@/utils/validation';

export default function DashboardScreen() {
  const { user, primaryAccount, updateAccounts } = useAuth();
  const { isTablet } = useNativeLayout();
  const [syncError, setSyncError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const loadPendingInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error, refetch } = useApiResource(loadPendingInvoices);
  const totalPending = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0;

  const syncCustomer = async () => {
    setSyncError('');
    setIsSyncing(true);

    try {
      const accounts = await electricityApi.syncCustomer();
      await updateAccounts(accounts);
      await refetch();
    } catch (caughtError) {
      setSyncError(getErrorMessage(caughtError));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Screen>
      <View style={styles.greeting}>
        <Text style={styles.greetingLabel}>Hola, {user?.name}</Text>
        <Text style={styles.greetingSub}>Estado actualizado de tu servicio eléctrico.</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Pendiente por pagar</Text>
        <Text style={styles.balanceAmount}>{formatMoney(totalPending)}</Text>
        <View style={styles.balanceMeta}>
          <PlatformIcon name="receipt-outline" size={15} color={colors.primaryLight} />
          <Text style={styles.balanceMetaText}>{invoices?.length ?? 0} factura(s) pendiente(s)</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={syncCustomer} style={({ pressed }) => [styles.syncChip, pressed && styles.pressed]}>
          {isSyncing ? <ActivityIndicator size="small" color={colors.primaryLight} /> : <PlatformIcon name="refresh" size={15} color={colors.primaryLight} />}
          <Text style={styles.syncChipText}>Sincronizar</Text>
        </Pressable>
      </View>

      {syncError ? <Text style={styles.errorText}>{syncError}</Text> : null}

      {primaryAccount ? (
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <View style={styles.accountIcon}>
              <PlatformIcon name="lightning-bolt" size={17} color={colors.surface} weight="semibold" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountProvider}>{primaryAccount.providerName}</Text>
              <Text style={styles.accountMeta}>Contrato {primaryAccount.contractNumber}</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/accounts')} style={({ pressed }) => [styles.accountAction, pressed && styles.pressed]}>
              <PlatformIcon name="chevron-right" size={18} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.accountAddress}>{primaryAccount.serviceAddress}</Text>
          <Text style={styles.accountSync}>Última sincronización: {formatDate(primaryAccount.lastSyncAt)}</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Facturas recientes</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/invoices')} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.sectionLink}>Ver todas</Text>
        </Pressable>
      </View>

      {isLoading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {error ? <EmptyState icon="alert-outline" title="No pudimos cargar facturas" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? <EmptyState title="Sin pendientes" message="No tienes facturas pendientes en este momento." /> : null}

      {invoices?.slice(0, 2).map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onPress={() => router.push(`/invoice/${invoice.id}`)} />
      ))}

      <View style={[styles.quickActions, isTablet && styles.quickActionsTablet]}>
        <AppButton title="Ver facturas" icon="receipt-outline" variant="secondary" onPress={() => router.push('/(tabs)/invoices')} style={styles.quickButton} />
        <AppButton title="Historial" icon="clock-outline" variant="secondary" onPress={() => router.push('/(tabs)/history')} style={styles.quickButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: 6,
  },
  greetingLabel: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greetingSub: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: nativeUI.radius,
    gap: 9,
    padding: 20,
    ...nativeUI.curveStyle,
  },
  balanceLabel: {
    color: colors.primaryLight,
    fontFamily: nativeUI.fontBold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontSize: 36,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    letterSpacing: 0,
  },
  balanceMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  balanceMetaText: {
    ...fontBase,
    color: colors.primaryLight,
    fontSize: 14,
  },
  syncChip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  syncChipText: {
    color: colors.primaryLight,
    fontFamily: nativeUI.fontBold,
    fontSize: 13,
    fontWeight: '800',
  },
  errorText: {
    color: colors.danger,
    fontFamily: nativeUI.fontBold,
    fontSize: 13,
    fontWeight: '700',
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 5,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  accountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  accountIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  accountInfo: {
    flex: 1,
    gap: 2,
  },
  accountProvider: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 17,
    fontWeight: '900',
  },
  accountMeta: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
  },
  accountAction: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  accountAddress: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
  },
  accountSync: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 19,
    fontWeight: '900',
  },
  sectionLink: {
    color: colors.primary,
    fontFamily: nativeUI.fontBold,
    fontSize: 14,
    fontWeight: '800',
  },
  loader: {
    alignSelf: 'flex-start',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionsTablet: {
    maxWidth: 480,
  },
  quickButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
