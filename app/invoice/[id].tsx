import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Link, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { InvoiceStatus } from '@/types/domain';
import { formatDate, formatMoney } from '@/utils/format';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  pending: { label: 'Pendiente', color: colors.warning, bg: colors.warningLight, icon: 'clock-outline' },
  processing: { label: 'Procesando', color: colors.accent, bg: '#DBEAFE', icon: 'sync' },
  paid: { label: 'Pagada', color: colors.success, bg: colors.successLight, icon: 'check-circle-outline' },
  expired: { label: 'Vencida', color: colors.danger, bg: '#FEE2E2', icon: 'alert-circle-outline' },
};

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loadInvoice = useCallback(() => electricityApi.getInvoice(id), [id]);
  const { data: invoice, isLoading, error } = useApiResource(loadInvoice, Boolean(id));

  const status = invoice ? statusConfig[invoice.status] : null;

  return (
    <Screen>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState sfIcon="exclamationmark.triangle.fill" title="Factura no disponible" message={error} /> : null}
      {invoice ? (
        <>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
              {invoice.period}
            </Text>
            <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}>
              Factura {invoice.invoiceNumber}
            </Text>
          </View>

          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            borderCurve: 'continuous',
            gap: 8,
            padding: 18,
          }}>
            <Text style={{ color: '#DDEFEA', fontSize: 14, fontWeight: '700' }}>
              Total
            </Text>
            <Text selectable style={{ color: colors.surface, fontSize: 36, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
              {formatMoney(invoice.amount, invoice.currency)}
            </Text>
            <Text style={{ color: colors.surface, fontSize: 15, fontWeight: '800' }}>
              {invoice.status === 'paid' ? 'Pagada' : 'Pendiente de pago'}
            </Text>
          </View>

          <View style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 8,
            borderCurve: 'continuous',
            borderWidth: 1,
            padding: 16,
            gap: 0,
          }}>
            <Row label="Fecha de emisión" value={formatDate(invoice.issueDate)} />
            <Row label="Fecha límite" value={formatDate(invoice.dueDate)} />
            <Row label="Consumo" value={`${invoice.kwh} kWh`} />
          </View>

          {invoice.status !== 'paid' ? (
            <Link href={`/payment/${invoice.id}`} asChild>
              <AppButton title="Pagar factura" sfIcon="creditcard" onPress={() => {}} />
            </Link>
          ) : (
            <Link href="/(tabs)/history" asChild>
              <AppButton title="Ver historial" sfIcon="clock" variant="secondary" onPress={() => {}} />
            </Link>
          )}
        </>
      ) : null}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
    }}>
      <Text style={{ color: colors.muted, fontSize: 14 }}>{label}</Text>
      <Text selectable style={{ color: colors.text, fontSize: 14, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}
