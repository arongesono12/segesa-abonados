import { Link, router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { Screen } from "@/components/screen";
import { sharedStyles } from "@/components/shared-styles";
import { colors } from "@/theme/colors";

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={sharedStyles.title}>Gestiona tu flujo eléctrico</Text>
        <Text style={sharedStyles.subtitle}>
          Consulta facturas, paga con seguridad y mantén tus cuentas eléctricas
          sincronizadas.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Iniciar sesión"
          icon="log-in-outline"
          onPress={() => router.push("/(auth)/login")}
        />
        <AppButton
          title="Crear cuenta"
          icon="person-add-outline"
          variant="secondary"
          onPress={() => router.push("/(auth)/register")}
        />
      </View>

      <Text style={styles.terms}>
        Al continuar aceptas las condiciones de uso de la plataforma de
        abonados.
      </Text>
      <Link href="/(auth)/forgot-password" style={styles.link}>
        Recuperar contraseña
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    gap: 18,
    justifyContent: "center",
  },
  logo: {
    height: 82,
    width: 82,
  },
  actions: {
    gap: 12,
  },
  terms: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
