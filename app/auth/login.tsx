import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { AppButton } from "@/components/app-button";
import { SegesaLogo } from "@/components/brand/SegesaLogo";
import { PlatformIcon } from "@/components/platform-icon";
import { Screen } from "@/components/screen";
import { TextLink } from "@/components/text-link";
import { useAuth } from "@/features/auth/auth-context";
import { colors } from "@/theme/colors";
import { fontBase, nativeUI } from "@/theme/native-ui";
import {
  getErrorMessage,
  validateEmail,
  validatePassword,
} from "@/utils/validation";

export default function LoginScreen() {
  const { login } = useAuth();
  const { height } = useWindowDimensions();
  const compact = height < 780;
  const tight = height < 700;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    const phoneDigits = identifier.replace(/\D/g, "");
    const isValidIdentifier =
      validateEmail(identifier) || phoneDigits.length >= 6;

    if (!isValidIdentifier || !validatePassword(password)) {
      setError(
        "Introduce un telefono o correo valido y una contrasena de al menos 6 caracteres.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const loginEmail = validateEmail(identifier)
        ? identifier
        : `${phoneDigits}@telefono.segesa.local`;
      await login(loginEmail, password);
      router.replace("/");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen topInset>
      <View
        style={[styles.logoWrap, { marginTop: tight ? 28 : compact ? 42 : 72 }]}
      >
        <SegesaLogo large={!compact && !tight} />
      </View>

      <View
        style={[
          styles.form,
          {
            gap: tight ? 14 : compact ? 16 : 20,
            marginTop: tight ? 30 : compact ? 42 : 66,
          },
        ]}
      >
        <Text
          style={[styles.title, { fontSize: tight ? 29 : compact ? 32 : 36 }]}
        >
          Iniciar sesion
        </Text>

        <View style={[styles.fieldGroup, { gap: tight ? 8 : 10 }]}>
          <Text style={[styles.label, { fontSize: tight ? 18 : 20 }]}>
            Telefono o Correo
          </Text>
          <View style={[styles.inputBox, { minHeight: tight ? 52 : 60 }]}>
            <PlatformIcon
              name="cellphone"
              color={colors.muted}
              size={tight ? 20 : 22}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setIdentifier}
              placeholder="Teléfono / Email"
              placeholderTextColor={colors.muted}
              style={[styles.input, { fontSize: tight ? 16 : 18 }]}
              textContentType="emailAddress"
              value={identifier}
            />
          </View>
        </View>

        <View style={[styles.fieldGroup, { gap: tight ? 8 : 10 }]}>
          <Text style={[styles.label, { fontSize: tight ? 18 : 20 }]}>
            Contrasena
          </Text>
          <View style={[styles.inputBox, { minHeight: tight ? 52 : 60 }]}>
            <PlatformIcon
              name="lock-outline"
              color={colors.muted}
              size={tight ? 20 : 22}
            />
            <TextInput
              autoComplete="current-password"
              onChangeText={setPassword}
              placeholder="Ingresa tu contrasena"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
              style={[styles.input, { fontSize: tight ? 16 : 18 }]}
              textContentType="password"
              value={password}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowPassword((value) => !value)}
            >
              <PlatformIcon
                name="eye-outline"
                color={colors.muted}
                size={tight ? 24 : 27}
              />
            </Pressable>
          </View>
        </View>

        <TextLink
          title="Olvidaste tu contrasena?"
          onPress={() => router.push("/auth/forgot-password")}
          align="left"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton
          title="Iniciar sesion"
          loading={isSubmitting}
          onPress={handleLogin}
          style={[
            styles.button,
            { marginTop: tight ? 18 : 26, minHeight: tight ? 54 : 62 },
          ]}
        />
      </View>

      <View
        style={[styles.footer, { marginTop: tight ? 24 : compact ? 34 : 48 }]}
      >
        <Text style={[styles.footerText, { fontSize: tight ? 16 : 18 }]}>
          No tienes cuenta?
        </Text>
        <TextLink
          title="Registrate"
          onPress={() => router.push("/auth/register")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: "center",
  },
  form: {
    gap: 20,
  },
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: "900",
  },
  fieldGroup: {},
  label: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontWeight: "900",
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#D5D9E1",
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 18,
  },
  input: {
    ...fontBase,
    color: colors.text,
    flex: 1,
  },
  button: {
    marginTop: 26,
    minHeight: 62,
  },
  error: {
    ...fontBase,
    color: colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
  footerText: {
    ...fontBase,
    color: colors.text,
  },
});
