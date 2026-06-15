import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { SegesaLogo } from '@/components/brand/SegesaLogo';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { PaymentMethodType } from '@/types/domain';
import { formatMoney } from '@/utils/format';

const methods: { id: PaymentMethodType; title: string; description: string; icon: string; color: string }[] = [
  { id: 'card', title: 'Tarjeta bancaria', description: 'Paga con tu tarjeta Visa o Mastercard', icon: 'credit-card-outline', color: colors.primary },
  { id: 'mobile_money', title: 'Pago movil', description: 'Paga facilmente con tu billetera movil', icon: 'cellphone', color: colors.success },
  { id: 'bank_transfer', title: 'Transferencia bancaria', description: 'Realiza el pago desde tu banco', icon: 'bank-outline', color: '#2F80ED' },
];

export default function PaymentMethodScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const { height } = useWindowDimensions();
  const compact = height < 790;
  const tight = height < 710;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');

  const continueToConfirmation = () => {
    if (!invoiceId) return;
    router.push({ pathname: '/payments/confirmation', params: { invoiceId, method: selectedMethod } });
  };

  return (
    <Screen topInset>
      <View style={[styles.header, { marginTop: tight ? 14 : compact ? 20 : 28 }]}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <PlatformIcon name="arrow-left" color={colors.primary} size={28} />
        </Pressable>
        <SegesaLogo />
        <View style={styles.headerSpacer} />
      </View>

      <Text style={[styles.title, { fontSize: tight ? 24 : compact ? 27 : 30, marginTop: tight ? 18 : 26 }]}>Metodo de pago</Text>

      <View style={[styles.summary, { minHeight: tight ? 72 : 86 }]}>
        <View style={styles.summarySide}>
          <Text style={styles.summaryLabel}>Factura a pagar</Text>
          <Text style={styles.summaryInvoice}>N° F-2026-05-0123</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.summaryLabel}>Total a pagar</Text>
          <Text style={styles.amount}>{formatMoney(25000)}</Text>
        </View>
      </View>

      <Text style={[styles.section, { fontSize: tight ? 18 : 20, marginTop: tight ? 16 : 22 }]}>Selecciona un metodo</Text>

      <View style={styles.list}>
        {methods.map((method) => {
          const selected = selectedMethod === method.id;

          return (
            <Pressable
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={[styles.method, { minHeight: tight ? 64 : 76 }, selected && styles.selected]}>
              <View style={[styles.methodIcon, { backgroundColor: method.color, height: tight ? 38 : 44, width: tight ? 38 : 44 }]}>
                <PlatformIcon name={method.icon} color={colors.surface} size={tight ? 22 : 25} />
              </View>
              <View style={styles.methodText}>
                <Text style={[styles.methodTitle, { fontSize: tight ? 15 : 17 }]}>{method.title}</Text>
                <Text style={[styles.methodDescription, { fontSize: tight ? 12 : 14 }]}>{method.description}</Text>
              </View>
              <View style={[styles.radio, { height: tight ? 22 : 26, width: tight ? 22 : 26 }, selected && styles.radioSelected]}>
                {selected ? <View style={[styles.radioInner, { height: tight ? 10 : 12, width: tight ? 10 : 12 }]} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.secureBox, { minHeight: tight ? 68 : 82 }]}>
        <PlatformIcon name="shield-check-outline" color={colors.primary} size={tight ? 24 : 28} />
        <View style={styles.secureCopy}>
          <Text style={[styles.secureTitle, { fontSize: tight ? 14 : 16 }]}>Pago 100% seguro</Text>
          <Text style={[styles.secureText, { fontSize: tight ? 12 : 14, lineHeight: tight ? 17 : 20 }]}>
            Tus datos estan protegidos con encriptacion de nivel bancario.
          </Text>
        </View>
      </View>

      <AppButton title="Continuar" onPress={continueToConfirmation} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerSpacer: {
    width: 42,
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  summary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 18,
    ...nativeUI.cardShadow,
  },
  summarySide: {
    gap: 8,
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  summaryLabel: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '800',
  },
  summaryInvoice: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
  },
  amount: {
    ...fontBase,
    color: colors.success,
    fontSize: 22,
    fontWeight: '900',
  },
  section: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  list: {
    gap: 10,
  },
  method: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 16,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  methodIcon: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  methodText: {
    flex: 1,
    gap: 4,
  },
  methodTitle: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  methodDescription: {
    ...fontBase,
    color: colors.textSoft,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#B8C0CC',
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    backgroundColor: colors.primary,
    borderRadius: 7,
  },
  secureBox: {
    alignItems: 'center',
    backgroundColor: '#EDF6FF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
    paddingHorizontal: 18,
  },
  secureCopy: {
    flex: 1,
    gap: 4,
  },
  secureTitle: {
    color: colors.primary,
    fontFamily: nativeUI.fontBlack,
    fontWeight: '900',
  },
  secureText: {
    ...fontBase,
    color: colors.textSoft,
  },
  button: {
    marginTop: 18,
  },
});
