import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';

export default function PendingInvoicesScreen() {
  const loadInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error } = useApiResource(loadInvoices);

  return (
    <Screen>
      <Text style={sharedStyles.title}>Facturas pendientes</Text>
      <Text style={sharedStyles.subtitle}>Selecciona una factura para revisar el detalle y completar el pago.</Text>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState icon="warning-outline" title="No se pudieron cargar" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? (
        <EmptyState title="Todo al día" message="No tienes facturas pendientes." />
      ) : null}
      {invoices?.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onPress={() => router.push(`/invoice/${invoice.id}`)} />
      ))}
    </Screen>
  );
}
