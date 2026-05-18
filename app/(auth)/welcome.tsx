import { router } from 'expo-router';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { TextLink } from '@/components/text-link';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI, useNativeLayout } from '@/theme/native-ui';

const benefits = [
  { icon: 'receipt-outline' as const, label: 'Facturas al día' },
  { icon: 'credit-card-outline' as const, label: 'Pagos seguros' },
  { icon: 'lightning-bolt-outline' as const, label: 'Contratos vinculados' },
] as const;

export default function WelcomeScreen() {
  const { isTablet } = useNativeLayout();

  return (
    <Screen topInset>
      <View style={styles.container}>
        <View style={[styles.hero, isTablet && styles.heroTablet]}>
          <View style={styles.heroCopy}>
            <Text style={styles.brand}>SEGESA Abonados</Text>
            <Text style={styles.heroTitle}>Gestiona tu electricidad desde el móvil</Text>
            <Text style={styles.heroSub}>
              Consulta facturas, vincula contratos y confirma pagos sin desplazarte.
            </Text>
          </View>
          <View style={styles.heroImageWrap}>
            <Image
              accessibilityLabel="Clientes usando servicios digitales"
              resizeMode="contain"
              source={require('@/public/images/peopleicon.png')}
              style={styles.heroImage}
            />
          </View>
        </View>

        <View style={styles.benefits}>
          {benefits.map((b) => (
            <View key={b.label} style={styles.benefitChip}>
              <View style={styles.benefitIcon}>
                <PlatformIcon name={b.icon} color={colors.primary} size={20} />
              </View>
              <Text style={styles.benefitLabel}>{b.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctas}>
          <AppButton
            title="Iniciar sesión"
            icon="login"
            onPress={() => router.push('/(auth)/login')}
          />
          <AppButton
            title="Crear cuenta"
            icon="account-plus-outline"
            variant="secondary"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.terms}>
            Al continuar aceptas las condiciones de uso de la plataforma.
          </Text>
          <TextLink title="Recuperar contraseña" onPress={() => router.push('/(auth)/forgot-password')} />
        </View>

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: nativeUI.radius,
    minHeight: 330,
    overflow: 'hidden',
    padding: 20,
    ...nativeUI.curveStyle,
  },
  heroTablet: { minHeight: 400 },
  heroCopy: { gap: 10, zIndex: 1 },
  brand: {
    color: colors.primaryLight,
    fontFamily: nativeUI.fontBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontSize: Platform.select({ ios: 31, android: 29, default: 30 }),
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    maxWidth: 340,
  },
  heroSub: {
    ...fontBase,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  heroImageWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: -12,
    marginTop: 8,
  },
  heroImage: {
    height: '100%',
    maxHeight: 210,
    width: '104%',
  },
  benefits: {
    flexDirection: 'row',
    gap: 8,
  },
  benefitChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 86,
    padding: 10,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  benefitLabel: {
    color: colors.text,
    fontFamily: nativeUI.fontBold,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
  },
  ctas: { gap: 11 },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  terms: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
