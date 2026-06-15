import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { ScreenHeaderBar } from '@/components/navigation/ScreenHeaderBar';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';
import { Invoice } from '@/types/domain';

type Tab = 'all' | 'pending' | 'paid' | 'expired';

const demoInvoices: Invoice[] = [
  {
    id: 'inv-2025-05',
    invoiceNumber: 'F-2025-05-0123',
    period: 'Mayo 2025',
    issueDate: '2025-06-05',
    dueDate: '2025-06-30',
    amount: 25000,
    currency: 'XAF',
    status: 'pending',
    kwh: 500,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2025-05-0123.pdf',
  },
  {
    id: 'inv-2025-04',
    invoiceNumber: 'F-2025-04-0146',
    period: 'Abril 2025',
    issueDate: '2025-05-05',
    dueDate: '2025-05-30',
    amount: 24500,
    currency: 'XAF',
    status: 'paid',
    kwh: 490,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2025-04-0146.pdf',
  },
  {
    id: 'inv-2025-03',
    invoiceNumber: 'F-2025-03-0187',
    period: 'Marzo 2025',
    issueDate: '2025-04-05',
    dueDate: '2025-04-30',
    amount: 23800,
    currency: 'XAF',
    status: 'paid',
    kwh: 476,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2025-03-0187.pdf',
  },
  {
    id: 'inv-2025-02',
    invoiceNumber: 'F-2025-02-0098',
    period: 'Febrero 2025',
    issueDate: '2025-03-05',
    dueDate: '2025-03-30',
    amount: 22900,
    currency: 'XAF',
    status: 'paid',
    kwh: 458,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2025-02-0098.pdf',
  },
  {
    id: 'inv-2025-01',
    invoiceNumber: 'F-2025-01-0074',
    period: 'Enero 2025',
    issueDate: '2025-02-05',
    dueDate: '2025-02-28',
    amount: 23100,
    currency: 'XAF',
    status: 'paid',
    kwh: 462,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2025-01-0074.pdf',
  },
  {
    id: 'inv-2024-12',
    invoiceNumber: 'F-2024-12-0199',
    period: 'Diciembre 2024',
    issueDate: '2025-01-05',
    dueDate: '2025-01-30',
    amount: 25000,
    currency: 'XAF',
    status: 'paid',
    kwh: 500,
    accountId: 'acc-1',
    contractNumber: '00012345',
    customerCode: 'CL-2026-0001',
    serviceAddress: 'Malabo, Barrio Centro',
    pdfUrl: 'mock://facturas/F-2024-12-0199.pdf',
  },
];

export default function InvoicesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const loadPending = useCallback(() => electricityApi.getPendingInvoices(), []);
  const loadPaid = useCallback(() => electricityApi.getPaidInvoices(), []);
  const pendingResource = useApiResource(loadPending);
  const paidResource = useApiResource(loadPaid);
  const apiInvoices = useMemo(() => [...(pendingResource.data ?? []), ...(paidResource.data ?? [])], [pendingResource.data, paidResource.data]);
  const sourceInvoices = apiInvoices.length >= 5 ? apiInvoices : demoInvoices;
  const invoices = sourceInvoices.filter((invoice) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'expired') return invoice.status === 'expired';
    return invoice.status === activeTab;
  });
  const isLoading = pendingResource.isLoading || paidResource.isLoading;
  const error = pendingResource.error || paidResource.error;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'paid', label: 'Pagadas' },
    { id: 'expired', label: 'Vencidas' },
  ];

  return (
    <Screen topInset>
      <ScreenHeaderBar title="Mis facturas" rightIcon="filter-outline" />

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

      {isLoading && apiInvoices.length === 0 ? <ActivityIndicator color={colors.primary} /> : null}
      {error && apiInvoices.length === 0 ? <EmptyState icon="alert-outline" title="No se pudieron cargar" message={error} /> : null}
      {!isLoading && !error && invoices.length === 0 ? (
        <EmptyState title="Sin facturas" message="No hay facturas para este filtro." />
      ) : null}

      <View style={styles.list}>
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} onPress={() => router.push(`/invoices/${invoice.id}`)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmentBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  segment: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentLabel: {
    ...fontBase,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  segmentLabelActive: {
    color: colors.surface,
  },
  list: {
    gap: 10,
    marginTop: 12,
  },
});
