import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

type Tab = 'pending' | 'paid';

export default function InvoicesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  const loadPending = useCallback(() => electricityApi.getPendingInvoices(), []);
  const loadPaid = useCallback(() => electricityApi.getPaidInvoices(), []);

  const pendingResource = useApiResource(loadPending);
  const paidResource = useApiResource(loadPaid);

  const { data: invoices, isLoading, error } = activeTab === 'pending' ? pendingResource : paidResource;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: 'Pendientes' },
    { id: 'paid', label: 'Pagadas' },
  ];

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={sharedStyles.title}>Facturas</Text>
        <Text style={sharedStyles.subtitle}>Selecciona una factura para revisar el detalle o completar el pago.</Text>
      </View>

      <View style={styles.segmentBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.segment, activeTab === tab.id && styles.segmentActive]}>
            <Text style={[styles.segmentLabel, activeTab === tab.id && styles.segmentLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="alert-outline" title="No se pudieron cargar" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? (
        <EmptyState
          title={activeTab === 'pending' ? 'Todo al día' : 'Sin facturas pagadas'}
          message={activeTab === 'pending' ? 'No tienes facturas pendientes.' : 'Las facturas pagadas aparecerán aquí.'}
        />
      ) : null}
      {invoices?.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onPress={() => router.push(`/invoice/${invoice.id}`)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  segmentBar: {
    backgroundColor: colors.border,
    borderRadius: nativeUI.radius,
    flexDirection: 'row',
    gap: 3,
    padding: 3,
  },
  segment: {
    alignItems: 'center',
    borderRadius: nativeUI.radius - 2,
    flex: 1,
    paddingVertical: 9,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...nativeUI.cardShadow,
  },
  segmentLabel: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: colors.primary,
  },
});
