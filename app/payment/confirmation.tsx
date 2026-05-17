import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatMoney } from '@/utils/format';

export default function PaymentConfirmationScreen() {
  const { reference, amount, currency } = useLocalSearchParams<{ reference: string; amount: string; currency: string }>();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.check}>
          <MaterialCommunityIcons name="check" color={colors.surface} size={44} />
        </View>
        <Text style={styles.title}>Pago confirmado</Text>
        <Text style={styles.message}>
          El backend confirmó el pago y la factura fue actualizada en tu historial.
        </Text>
        <View style={styles.summary}>
          <Text style={styles.label}>Importe</Text>
          <Text style={styles.value}>{formatMoney(Number(amount ?? 0), currency ?? 'XAF')}</Text>
          <Text style={styles.label}>Referencia</Text>
          <Text style={styles.value}>{reference}</Text>
        </View>
      </View>

      <AppButton title="Volver al dashboard" icon="view-dashboard-outline" onPress={() => router.replace('/(tabs)')} />
      <AppButton title="Ver historial" icon="clock-outline" variant="secondary" onPress={() => router.replace('/(tabs)/history')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  check: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  title: {
    ...fontBase,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
    padding: 16,
    width: '100%',
  },
  label: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    ...fontBase,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
});
