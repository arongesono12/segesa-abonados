import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI, useNativeLayout } from '@/theme/native-ui';

const benefits = [
  { icon: 'receipt-outline' as const, label: 'Facturas al dia' },
  { icon: 'card-outline' as const, label: 'Pagos seguros' },
  { icon: 'flash-outline' as const, label: 'Cuentas vinculadas' },
];

export default function WelcomeScreen() {
  const { isTablet } = useNativeLayout();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[styles.banner, isTablet && styles.bannerTablet]}>
          <View style={styles.bannerCopy}>
            <Text style={styles.brand}>SEGESA Abonados</Text>
            <Text style={styles.title}>Gestiona tu electricidad desde el movil</Text>
            <Text style={styles.subtitle}>
              Consulta facturas, vincula contratos y confirma pagos sin desplazarte.
            </Text>
          </View>

          <View style={styles.imageWrap}>
            <Image
              accessibilityLabel="Clientes usando servicios digitales"
              resizeMode="contain"
              source={require('@/public/images/peopleicon.png')}
              style={styles.heroImage}
            />
          </View>
        </View>

        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit.label} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon} color={colors.primary} size={20} />
              </View>
              <Text style={styles.benefitText}>{benefit.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Iniciar sesion"
            icon="log-in-outline"
            onPress={() => router.push('/(auth)/login')}
            style={styles.primaryButton}
          />
          <AppButton
            title="Crear cuenta"
            icon="person-add-outline"
            variant="secondary"
            onPress={() => router.push('/(auth)/register')}
            style={styles.secondaryButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.terms}>Al continuar aceptas las condiciones de uso de la plataforma.</Text>
          <Link href="/(auth)/forgot-password" style={styles.link}>
            Recuperar contrasena
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    justifyContent: 'space-between',
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: nativeUI.radius,
    minHeight: 390,
    overflow: 'hidden',
    padding: 20,
  },
  bannerTablet: {
    minHeight: 460,
  },
  bannerCopy: {
    gap: 10,
    zIndex: 1,
  },
  brand: {
    ...fontBase,
    color: '#D7F4EA',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    ...fontBase,
    color: colors.surface,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 37,
  },
  subtitle: {
    ...fontBase,
    color: '#E5F7F2',
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 380,
  },
  imageWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: -16,
    marginTop: 4,
  },
  heroImage: {
    height: '100%',
    maxHeight: 265,
    width: '112%',
  },
  benefits: {
    flexDirection: 'row',
    gap: 10,
  },
  benefitItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 96,
    padding: 12,
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
  benefitText: {
    ...fontBase,
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    borderColor: colors.primaryDark,
    borderWidth: 1,
    minHeight: 58,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    minHeight: 56,
    width: '100%',
    ...nativeUI.cardShadow,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  terms: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  link: {
    ...fontBase,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
