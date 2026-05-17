import { Image, Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { formatMoney } from '@/utils/format';

export default function PaymentConfirmationScreen() {
  const { reference, amount, currency } = useLocalSearchParams<{ reference: string; amount: string; currency: string }>();

  return (
    <Screen scroll={false}>
      <View style={{
        alignItems: 'center',
        flex: 1,
        gap: 16,
        justifyContent: 'center',
      }}>
        <View style={{
          alignItems: 'center',
          backgroundColor: colors.primary,
          borderRadius: 40,
          borderCurve: 'continuous',
          height: 80,
          justifyContent: 'center',
          width: 80,
        }}>
          <Image
            source={{ uri: 'sf=checkmark' }}
            style={{ width: 44, height: 44, tintColor: colors.surface }}
          />
        </View>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' }}>
          Pago confirmado
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24, textAlign: 'center' }}>
          El backend confirmó el pago y la factura fue actualizada en tu historial.
        </Text>
        <View style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 8,
          borderCurve: 'continuous',
          borderWidth: 1,
          gap: 8,
          marginTop: 8,
          padding: 16,
          width: '100%',
        }}>
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '700' }}>Importe</Text>
          <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8, fontVariant: ['tabular-nums'] }}>
            {formatMoney(Number(amount ?? 0), currency ?? 'XAF')}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '700' }}>Referencia</Text>
          <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8 }}>
            {reference}
          </Text>
        </View>
      </View>

      <Link href="/(tabs)" asChild>
        <AppButton title="Volver al dashboard" sfIcon="house.fill" onPress={() => {}} />
      </Link>
      <Link href="/(tabs)/history" asChild>
        <AppButton title="Ver historial" sfIcon="clock.fill" variant="secondary" onPress={() => {}} />
      </Link>
    </Screen>
  );
}
