import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { ActionRow } from '@/components/action-row';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

export default function ProfileScreen() {
  const { user, primaryAccount, accounts, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (process.env.EXPO_OS === 'ios') {
      const haptics = require('expo-haptics');
      haptics.notificationAsync(haptics.NotificationFeedbackType.Warning);
    }
    router.replace('/(auth)/welcome');
  };

  const initials = user?.name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 }}>
        Perfil
      </Text>
      <View style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 8,
        borderCurve: 'continuous',
        borderWidth: 1,
        padding: 16,
        gap: 6,
      }}>
        <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: '900' }}>
          {user?.name}
        </Text>
        <Text selectable style={{ color: colors.textSoft, fontSize: 15, marginTop: 6 }}>
          {user?.email}
        </Text>
        <Text selectable style={{ color: colors.textSoft, fontSize: 15, marginTop: 6 }}>
          Acceso mediante {user?.authProvider}
        </Text>
      </View>
      <View style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 8,
        borderCurve: 'continuous',
        borderWidth: 1,
        padding: 16,
        gap: 8,
      }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: 8 }}>
          Cuenta principal
        </Text>
        <Text selectable style={{ color: colors.textSoft, fontSize: 15, marginTop: 6 }}>
          {primaryAccount?.providerName ?? 'Sin cuenta principal'}
        </Text>
        <Text selectable style={{ color: colors.textSoft, fontSize: 15, marginTop: 6 }}>
          {primaryAccount?.contractNumber ?? 'Completa la configuración inicial'}
        </Text>
      </View>
      <Link href="/(tabs)/accounts" asChild>
        <AppButton title="Gestionar cuentas" sfIcon="bolt.fill" variant="secondary" onPress={() => {}} />
      </Link>
      <AppButton title="Cerrar sesión" sfIcon="arrow.right.square" variant="ghost" onPress={handleLogout} />
    </Screen>
  );
}
