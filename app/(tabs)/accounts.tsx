import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate } from '@/utils/format';

export default function AccountsScreen() {
  const { accounts } = useAuth();

  return (
    <Screen>
      <Text style={sharedStyles.title}>Cuentas eléctricas</Text>
      <Text style={sharedStyles.subtitle}>Administra los contratos vinculados a tu perfil.</Text>

      {accounts.length === 0 ? (
        <EmptyState title="Sin cuentas asociadas" message="Añade una cuenta para consultar facturas y pagos." />
      ) : null}

      {accounts.map((account) => (
        <View key={account.id} style={sharedStyles.card}>
          <View style={styles.row}>
            <Text style={styles.provider}>{account.providerName}</Text>
            <Text style={styles.badge}>{account.isPrimary ? 'Principal' : account.status}</Text>
          </View>
          <Text style={styles.contract}>Contrato {account.contractNumber}</Text>
          <Text style={styles.meta}>{account.customerName}</Text>
          <Text style={styles.meta}>{account.serviceAddress}</Text>
          <Text style={styles.sync}>Sincronizado {formatDate(account.lastSyncAt)}</Text>
        </View>
      ))}

      <AppButton title="Añadir otra cuenta" icon="add-circle-outline" variant="secondary" onPress={() => router.push('/onboarding/provider')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  provider: {
    ...fontBase,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  badge: {
    ...fontBase,
    backgroundColor: colors.surfaceAlt,
    borderRadius: nativeUI.radius,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contract: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  meta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
    marginTop: 5,
  },
  sync: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
    marginTop: 12,
  },
});
