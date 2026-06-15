import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { ScreenHeaderBar } from '@/components/navigation/ScreenHeaderBar';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatMoney } from '@/utils/format';

const methodLabels: Record<string, string> = {
  bank_transfer: 'Transferencia bancaria',
  card: 'Tarjeta bancaria',
  mobile_money: 'Pago movil (GETESA)',
};

export default function PaymentSuccessScreen() {
  const { amount, currency, invoiceId, method, reference } = useLocalSearchParams<{
    amount?: string;
    currency?: string;
    invoiceId?: string;
    method?: string;
    reference?: string;
  }>();
  const { height } = useWindowDimensions();
  const compact = height < 790;
  const tight = height < 710;
  const paidAmount = Number(amount ?? 25000);

  return (
    <Screen topInset>
      <ScreenHeaderBar title="Confirmar pago" />

      <View style={[styles.logoWrap, { marginTop: tight ? 12 : 24 }]}>
        <SegesaLogo />
      </View>

      <View style={[styles.illustration, { height: tight ? 196 : compact ? 230 : 278, marginTop: tight ? 18 : 30, width: tight ? 286 : 330 }]}>
        <View style={styles.receipt}>
          <View style={styles.receiptLogo} />
          <View style={styles.lineLong} />
          <View style={styles.lineLong} />
          <View style={styles.lineMedium} />
          <View style={styles.ticketBox}>
            <View style={styles.lineShort} />
            <View style={styles.lineShort} />
          </View>
        </View>
        <View style={[styles.checkSmall, { height: tight ? 52 : 64, width: tight ? 52 : 64 }]}>
          <PlatformIcon name="check" color={colors.surface} size={tight ? 27 : 34} weight="bold" />
        </View>
      </View>

      <View style={[styles.successRow, { marginTop: tight ? 20 : 32 }]}>
        <View style={[styles.checkLarge, { height: tight ? 54 : 66, width: tight ? 54 : 66 }]}>
          <PlatformIcon name="check" color={colors.surface} size={tight ? 38 : 48} weight="bold" />
        </View>
        <Text style={[styles.title, { fontSize: tight ? 24 : 29, lineHeight: tight ? 31 : 37 }]}>Pago realizado{'\n'}con exito!</Text>
      </View>

      <View style={[styles.summary, { marginTop: tight ? 20 : 28 }]}>
        <SummaryRow icon="file-document-outline" label="Factura" value={invoiceId ?? 'N° F-2025-05-0123'} tight={tight} />
        <SummaryRow
          icon="cash-multiple"
          iconColor={colors.success}
          label="Monto pagado"
          value={formatMoney(paidAmount, currency ?? 'XAF')}
          valueSuccess
          tight={tight}
        />
        <SummaryRow icon="cellphone" label="Metodo de pago" value={methodLabels[method ?? 'mobile_money']} tight={tight} />
        <SummaryRow icon="phone-outline" label="Numero de telefono" value="+240 222 123 456" last tight={tight} />
      </View>

      <AppButton title="Confirmar pago" onPress={() => router.replace('/tabs/home')} style={[styles.button, { minHeight: tight ? 56 : 68 }]} />
      <View style={styles.secure}>
        <PlatformIcon name="lock-outline" color={colors.muted} size={17} />
        <Text style={styles.secureText}>Transaccion segura y encriptada</Text>
      </View>
      {reference ? <Text style={styles.reference}>Referencia {reference}</Text> : null}
    </Screen>
  );
}

function SummaryRow({
  icon,
  iconColor = colors.primary,
  label,
  value,
  valueSuccess,
  last,
  tight,
}: {
  icon: string;
  iconColor?: string;
  label: string;
  value: string;
  valueSuccess?: boolean;
  last?: boolean;
  tight: boolean;
}) {
  return (
    <View style={[styles.summaryRow, { minHeight: tight ? 54 : 70 }, last && styles.summaryRowLast]}>
      <PlatformIcon name={icon} color={iconColor} size={tight ? 23 : 29} />
      <Text style={[styles.label, { fontSize: tight ? 14 : 18 }]}>{label}</Text>
      <Text style={[styles.value, { fontSize: tight ? 14 : 18 }, valueSuccess && styles.valueSuccess]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
  },
  illustration: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F8FF',
    borderRadius: 34,
    justifyContent: 'center',
  },
  receipt: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 7,
    height: '76%',
    padding: 22,
    width: '44%',
  },
  receiptLogo: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    height: 18,
    marginBottom: 16,
    width: 58,
  },
  lineLong: {
    backgroundColor: '#CFE0F8',
    borderRadius: 6,
    height: 9,
    marginBottom: 12,
    width: '100%',
  },
  lineMedium: {
    backgroundColor: '#DCE9FB',
    borderRadius: 6,
    height: 9,
    marginBottom: 18,
    width: '68%',
  },
  lineShort: {
    backgroundColor: '#DCE9FB',
    borderRadius: 6,
    height: 7,
    width: 35,
  },
  ticketBox: {
    alignItems: 'center',
    borderColor: '#D9E6FA',
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
  },
  checkSmall: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 32,
    justifyContent: 'center',
    position: 'absolute',
  },
  successRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  checkLarge: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 34,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
    ...nativeUI.cardShadow,
  },
  summaryRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  label: {
    ...fontBase,
    color: colors.muted,
    flex: 1,
  },
  value: {
    ...fontBase,
    color: colors.text,
    flex: 1.2,
    fontWeight: '800',
    textAlign: 'right',
  },
  valueSuccess: {
    color: colors.success,
    fontWeight: '900',
  },
  button: {
    marginTop: 28,
  },
  secure: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 14,
  },
  secureText: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
  },
  reference: {
    ...fontBase,
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});
