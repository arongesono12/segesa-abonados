import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI, useNativeLayout } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';
import { getErrorMessage } from '@/utils/validation';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function DashboardScreen() {
  const { user, primaryAccount, updateAccounts } = useAuth();
  const { isTablet } = useNativeLayout();
  const [syncError, setSyncError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const loadPendingInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error, refetch } = useApiResource(loadPendingInvoices);
  const totalPending = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0;

  const syncCustomer = async () => {
    const accounts = await electricityApi.syncCustomer();
    await updateAccounts(accounts);
    await refetch();
    if (process.env.EXPO_OS === 'ios') {
      const haptics = require('expo-haptics');
      haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <Screen>
      <AnimatedView style={{ gap: 8 }} entering={FadeIn.duration(300)}>
        <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>
          Hola, {user?.name}
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
          Este es el estado actualizado de tu servicio eléctrico.
        </Text>
      </AnimatedView>

      <AnimatedView
        style={{
          backgroundColor: colors.primary,
          borderRadius: 8,
          borderCurve: 'continuous',
          gap: 8,
          padding: 18,
        }}
        entering={FadeIn.duration(400).delay(100)}>
        <Text style={{ color: '#DDEFEA', fontSize: 14, fontWeight: '700' }}>
          Pendiente por pagar
        </Text>
        <Text selectable style={{ color: colors.surface, fontSize: 34, fontWeight: '900' }}>
          {formatMoney(totalPending)}
        </Text>
        <Text style={{ color: '#DDEFEA', fontSize: 14 }}>
          {invoices?.length ?? 0} factura(s) pendiente(s)
        </Text>
      </AnimatedView>

      {syncError ? <Text style={styles.errorText}>{syncError}</Text> : null}

      {primaryAccount ? (
        <AnimatedView
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 8,
            borderCurve: 'continuous',
            borderWidth: 1,
            padding: 16,
            gap: 4,
          }}
          entering={FadeIn.duration(300).delay(150)}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }}>
            {primaryAccount.providerName}
          </Text>
          <Text selectable style={{ color: colors.textSoft, fontSize: 14, marginTop: 4 }}>
            Contrato {primaryAccount.contractNumber}
          </Text>
          <Text selectable style={{ color: colors.textSoft, fontSize: 14, marginTop: 4 }}>
            {primaryAccount.serviceAddress}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>
            Última sincronización: {formatDate(primaryAccount.lastSyncAt)}
          </Text>
        </AnimatedView>
      ) : null}

      <AnimatedView style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }} entering={FadeIn.duration(300).delay(200)}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }}>
          Facturas recientes
        </Text>
        <Link href="/(tabs)/invoices" asChild>
          <Pressable>
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 15 }}>Ver todo</Text>
          </Pressable>
        </Link>
      </AnimatedView>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState sfIcon="exclamationmark.triangle.fill" title="No pudimos cargar facturas" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? (
        <EmptyState sfIcon="checkmark.circle.fill" title="Sin pendientes" message="No tienes facturas pendientes en este momento." />
      ) : null}
      {invoices?.slice(0, 2).map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}

      <AnimatedView style={{ gap: 10 }} entering={FadeIn.duration(300).delay(250)}>
        <AppButton title="Sincronizar" sfIcon="arrow.clockwise" variant="secondary" onPress={syncCustomer} />
        <AppButton title="Métodos de pago" sfIcon="creditcard" variant="secondary" onPress={() => null} />
      </AnimatedView>
    </Screen>
  );
}
