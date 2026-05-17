import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ActionRow } from '@/components/action-row';
import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/validation';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

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
      <AnimatedText
        style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}
        entering={FadeIn.duration(300)}>
        Cuentas eléctricas
      </AnimatedText>
      <AnimatedText
        style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}
        entering={FadeIn.duration(300).delay(50)}>
        Administra los contratos vinculados a tu perfil.
      </AnimatedText>

      {accounts.length === 0 ? (
        <EmptyState sfIcon="folder.badge.plus" title="Sin cuentas asociadas" message="Añade una cuenta para consultar facturas y pagos." />
      ) : null}

      {accounts.map((account, index) => (
        <AnimatedView
          key={account.id}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 8,
            borderCurve: 'continuous',
            borderWidth: 1,
            padding: 16,
            gap: 5,
          }}
          entering={FadeIn.duration(300).delay(index * 50)}>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }}>
              {account.providerName}
            </Text>
            <Text style={{
              backgroundColor: colors.surfaceAlt,
              borderRadius: 8,
              borderCurve: 'continuous',
              color: colors.primary,
              fontSize: 12,
              fontWeight: '800',
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
              {account.isPrimary ? 'Principal' : account.status}
            </Text>
          </View>
          <Text selectable style={{ color: colors.textSoft, fontSize: 15, fontWeight: '700', marginTop: 10 }}>
            Contrato {account.contractNumber}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 5 }}>
            {account.customerName}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 5 }}>
            {account.serviceAddress}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 12, marginTop: 12 }}>
            Sincronizado {formatDate(account.lastSyncAt)}
          </Text>
        </AnimatedView>
      ))}

      <Link href="/onboarding/provider" asChild>
        <AppButton title="Añadir otra cuenta" sfIcon="plus.circle.fill" variant="secondary" onPress={() => {}} />
      </Link>
    </Screen>
  );
}
