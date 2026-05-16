import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { sharedStyles } from '@/components/shared-styles';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase } from '@/theme/native-ui';

export default function ProfileScreen() {
  const { user, primaryAccount, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <Screen>
      <Text style={sharedStyles.title}>Perfil</Text>
      <View style={sharedStyles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Text style={styles.meta}>Acceso mediante {user?.authProvider}</Text>
      </View>
      <View style={sharedStyles.card}>
        <Text style={styles.section}>Cuenta principal</Text>
        <Text style={styles.meta}>{primaryAccount?.providerName ?? 'Sin cuenta principal'}</Text>
        <Text style={styles.meta}>{primaryAccount?.contractNumber ?? 'Completa la configuración inicial'}</Text>
      </View>
      <AppButton title="Gestionar cuentas" icon="flash-outline" variant="secondary" onPress={() => router.push('/(tabs)/accounts')} />
      <AppButton title="Cerrar sesión" icon="log-out-outline" variant="ghost" onPress={handleLogout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    ...fontBase,
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  section: {
    ...fontBase,
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  meta: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 15,
    marginTop: 6,
  },
});
