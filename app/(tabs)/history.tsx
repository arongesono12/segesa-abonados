import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useApiResource } from '@/hooks/use-api-resource';
import { electricityApi } from '@/services/electricity-api';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';
import { formatDate, formatMoney } from '@/utils/format';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function PaymentHistoryScreen() {
  const loadPayments = useCallback(() => electricityApi.getPayments(), []);
  const { data: payments, isLoading, error } = useApiResource(loadPayments);

  return (
    <Screen>
      <AnimatedText
        style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}
        entering={FadeIn.duration(300)}>
        Historial de pagos
      </AnimatedText>
      <AnimatedText
        style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24 }}
        entering={FadeIn.duration(300).delay(50)}>
        Pagos confirmados y referencias de operación.
      </AnimatedText>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <EmptyState sfIcon="exclamationmark.triangle.fill" title="No se pudo cargar el historial" message={error} /> : null}
      {!isLoading && !error && payments?.length === 0 ? (
        <EmptyState sfIcon="clock.fill" title="Sin pagos todavía" message="Tus pagos confirmados aparecerán aquí." />
      ) : null}
      {payments?.map((payment, index) => (
        <AnimatedView
          key={payment.id}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 8,
            borderCurve: 'continuous',
            borderWidth: 1,
            padding: 16,
            gap: 6,
          }}
          entering={FadeIn.duration(300).delay(index * 50)}>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
              {formatMoney(payment.amount, payment.currency)}
            </Text>
            <Text style={{ color: colors.success, fontSize: 13, fontWeight: '800' }}>
              Confirmado
            </Text>
          </View>
          <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>
            Referencia {payment.reference}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>
            {formatDate(payment.paidAt)} · {payment.method.replace('_', ' ')}
          </Text>
        </AnimatedView>
      ))}
    </Screen>
  );
}
