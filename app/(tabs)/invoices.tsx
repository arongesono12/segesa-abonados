import { useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { InvoiceCard } from '@/components/invoice-card';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function PendingInvoicesScreen() {
  const loadInvoices = useCallback(() => electricityApi.getPendingInvoices(), []);
  const { data: invoices, isLoading, error } = useApiResource(loadInvoices);

  return (
    <Screen>
      <AnimatedText
        style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}
        entering={FadeIn.duration(300)}>
        Facturas pendientes
      </AnimatedText>
      <AnimatedText
        style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}
        entering={FadeIn.duration(300).delay(50)}>
        Selecciona una factura para revisar el detalle y completar el pago.
      </AnimatedText>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState sfIcon="exclamationmark.triangle.fill" title="No se pudieron cargar" message={error} /> : null}
      {!isLoading && !error && invoices?.length === 0 ? (
        <EmptyState sfIcon="checkmark.circle.fill" title="Todo al día" message="No tienes facturas pendientes." />
      ) : null}
      {invoices?.map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
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
