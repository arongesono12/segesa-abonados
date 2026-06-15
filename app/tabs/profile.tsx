import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionRow } from '@/components/action-row';
import { AppButton } from '@/components/app-button';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';

export default function ProfileScreen() {
  const { user, primaryAccount, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/welcome');
  };

  const initials = user?.name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'JM';

  return (
    <Screen topInset>
      <Text style={styles.title}>Mi perfil</Text>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Juan Mba'}</Text>
        <Text style={styles.role}>Titular de la cuenta</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Informacion personal</Text>
        <InfoRow label="Cliente" value={user?.name ?? 'Juan Mba'} />
        <InfoRow label="Telefono" value="+240 222 123 456" />
        <InfoRow label="Correo" value={user?.email ?? 'juan.mba@email.com'} />
        <InfoRow label="Contrasena" value="********" />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Mis contratos</Text>
        <View style={styles.contractRow}>
          <Text style={styles.contract}>{primaryAccount?.contractNumber ?? '00012345'}</Text>
          <StatusBadge label="Activo" tone="success" />
        </View>
        <ActionRow icon="plus-circle-outline" title="Agregar otro contrato" onPress={() => router.push('/onboarding/provider')} />
      </View>

      <AppButton title="Cerrar sesion" variant="danger" onPress={handleLogout} />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 32,
    textAlign: 'center',
  },
  identity: {
    alignItems: 'center',
    gap: 5,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  avatarText: {
    color: colors.surface,
    fontFamily: nativeUI.fontBlack,
    fontSize: 22,
    fontWeight: '900',
  },
  name: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 17,
    fontWeight: '900',
  },
  role: {
    ...fontBase,
    color: colors.muted,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  section: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  fieldLabel: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 12,
  },
  fieldValue: {
    ...fontBase,
    color: colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
  },
  contractRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  contract: {
    ...fontBase,
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
});
