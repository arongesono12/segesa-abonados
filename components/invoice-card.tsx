import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Invoice } from '@/types/domain';
import { formatDate, formatMoney } from '@/utils/format';

type InvoiceCardProps = {
  invoice: Invoice;
  onPress: () => void;
};

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  const isPaid = invoice.status === 'paid';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <View>
          <Text style={styles.period}>{invoice.period}</Text>
          <Text style={styles.meta}>{invoice.invoiceNumber}</Text>
        </View>
        <Text style={styles.amount}>{formatMoney(invoice.amount, invoice.currency)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.meta}>Vence {formatDate(invoice.dueDate)} · {invoice.kwh} kWh</Text>
        <Text style={[styles.badge, isPaid ? styles.paid : styles.pending]}>{isPaid ? 'Pagada' : 'Pendiente'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  period: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  amount: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  paid: {
    backgroundColor: '#E6F6EF',
    color: colors.success,
  },
  pending: {
    backgroundColor: '#FFF5D6',
    color: colors.warning,
  },
});
