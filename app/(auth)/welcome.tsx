import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";

export default function WelcomeScreen() {
  const { isTablet } = useNativeLayout();

  return (
    <Screen>
      <View style={{ flex: 1, gap: 18, justifyContent: "center" }}>
        <Image
          source={{ uri: "sf=bolt.circle.fill", width: 82, height: 82 }}
          style={{ width: 82, height: 82, tintColor: colors.primary, alignSelf: "center" }}
        />
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: "800", lineHeight: 36, textAlign: "center" }}>
          Gestiona tu flujo eléctrico
        </Text>
        <Text style={{ color: colors.textSoft, fontSize: 16, lineHeight: 24, textAlign: "center" }}>
          Consulta facturas, paga con seguridad y mantén tus cuentas eléctricas
          sincronizadas.
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <Link href="/(auth)/login" asChild>
          <AppButton title="Iniciar sesión" sfIcon="arrow.right.circle" variant="primary" onPress={() => {}} />
        </Link>
        <Link href="/(auth)/register" asChild>
          <AppButton title="Crear cuenta" sfIcon="person.badge.plus" variant="secondary" onPress={() => {}} />
        </Link>
      </View>

      <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: "center" }}>
        Al continuar aceptas las condiciones de uso de la plataforma de
        abonados.
      </Text>
      <Link href="/(auth)/forgot-password" asChild>
        <Pressable>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "700", textAlign: "center" }}>
            Recuperar contraseña
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
