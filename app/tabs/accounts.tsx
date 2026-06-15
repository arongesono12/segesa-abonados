import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionRow } from '@/components/action-row';
import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/validation';

export default function AccountsScreen() {
  const { accounts, setPrimaryAccount, updateAccounts } = useAuth();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setError('');
    setBusyAction('sync');

    try {
      const nextAccounts = await electricityApi.syncCustomer();
      await updateAccounts(nextAccounts);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setBusyAction(null);
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    setError('');
    setBusyAction(`primary:${accountId}`);

    try {
      await setPrimaryAccount(accountId);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Cuentas eléctricas" subtitle="Administra los contratos vinculados a tu perfil." />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}

      {accounts.length === 0 ? (
        <EmptyState title="Sin cuentas asociadas" message="Añade una cuenta para consultar facturas y pagos." />
      ) : null}

      <View style={styles.list}>
        {accounts.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <View style={styles.row}>
              <Text style={styles.provider}>{account.providerName}</Text>
              <Text style={styles.badge}>{account.isPrimary ? 'Principal' : account.status}</Text>
            </View>
            <Text style={styles.contract}>Contrato {account.contractNumber}</Text>
            <Text style={styles.meta}>{account.customerName}</Text>
            <Text style={styles.meta}>{account.serviceAddress}</Text>
            <Text style={styles.sync}>Sincronizado {formatDate(account.lastSyncAt)}</Text>
            {!account.isPrimary ? (
              <AppButton
                title="Hacer principal"
                icon="star-outline"
                variant="secondary"
                loading={busyAction === `primary:${account.id}`}
                onPress={() => handleSetPrimary(account.id)}
                style={styles.cardAction}
              />
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <ActionRow icon="refresh" onPress={handleSync} title={busyAction === 'sync' ? 'Sincronizando...' : 'Sincronizar cuentas'} />
        <ActionRow icon="plus-circle-outline" onPress={() => router.push('/onboarding/provider')} title="Añadir otra cuenta" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  provider: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 19,
    fontWeight: '900',
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contract: {
    color: colors.textSoft,
    fontFamily: nativeUI.fontBold,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  meta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  sync: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
    marginTop: 12,
  },
  cardAction: {
    marginTop: 14,
  },
  actions: {
    gap: 10,
  },
});
