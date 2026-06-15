import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/cards/StatusBadge';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { Invoice } from '@/types/domain';
import { formatMoney } from '@/utils/format';

type InvoiceCardProps = {
  invoice: Invoice;
  onPress: () => void;
};

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  const isPaid = invoice.status === 'paid';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.period}>{invoice.period}</Text>
          <Text style={styles.meta}>Factura N° {invoice.invoiceNumber}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.right}>
          <Text style={styles.amount}>{formatMoney(invoice.amount, invoice.currency)}</Text>
          <StatusBadge label={isPaid ? 'Pagada' : 'Pendiente'} tone={isPaid ? 'success' : 'warning'} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 84,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...nativeUI.cardShadow,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  divider: {
    alignSelf: 'stretch',
    borderColor: colors.border,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
  },
  period: {
    ...fontBase,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  meta: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 102,
  },
  amount: {
    ...fontBase,
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
});
