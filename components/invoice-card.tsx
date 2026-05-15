import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Pressable as ReanimatedPressable } from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { Invoice } from '@/types/domain';
import { formatDate, formatMoney } from '@/utils/format';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type InvoiceCardProps = {
  invoice: Invoice;
  index?: number;
};

export function InvoiceCard({ invoice, index = 0 }: InvoiceCardProps) {
  const isPaid = invoice.status === 'paid';

  return (
    <Link href={`/invoice/${invoice.id}`} asChild>
      <Link.Trigger>
        <AnimatedPressable
          entering={FadeIn.duration(300).delay(index * 50)}
          exiting={FadeOut.duration(200)}
          style={({ pressed }) => ({
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 8,
            borderCurve: 'continuous',
            borderWidth: 1,
            gap: 14,
            padding: 16,
            opacity: pressed ? 0.82 : 1,
          })}>
          <Link.Preview />
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View>
              <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800' }}>
                {invoice.period}
              </Text>
              <Text selectable style={{ color: colors.muted, fontSize: 13 }}>
                {invoice.invoiceNumber}
              </Text>
            </View>
            <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
              {formatMoney(invoice.amount, invoice.currency)}
            </Text>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text selectable style={{ color: colors.muted, fontSize: 13 }}>
              Vence {formatDate(invoice.dueDate)} · {invoice.kwh} kWh
            </Text>
            <Animated.Text
              style={{
                backgroundColor: isPaid ? '#E6F6EF' : '#FFF5D6',
                color: isPaid ? colors.success : colors.warning,
                borderRadius: 8,
                borderCurve: 'continuous',
                fontSize: 12,
                fontWeight: '800',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
              entering={FadeIn.duration(200).delay(index * 50 + 100)}>
              {isPaid ? 'Pagada' : 'Pendiente'}
            </Animated.Text>
          </View>
        </AnimatedPressable>
      </Link.Trigger>
    </Link>
  );
}
