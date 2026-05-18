import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionRow } from '@/components/action-row';
import { AppIconName, PlatformIcon } from '@/components/platform-icon';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { fontBase, nativeUI } from '@/theme/native-ui';
import { AuthProvider } from '@/types/domain';

const providerMeta: Record<AuthProvider, { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = {
  email: { label: 'Correo electrónico', icon: 'email-outline' },
  google: { label: 'Google', icon: 'google' },
  apple: { label: 'Apple', icon: 'apple' },
};

export default function ProfileScreen() {
  const { user, primaryAccount, accounts, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const initials = user?.name
    .split(' ')
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';
  const provider = user ? providerMeta[user.authProvider] : null;

  return (
    <Screen>
      <ScreenHeader title="Perfil" />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {provider ? (
            <View style={styles.providerBadge}>
              <MaterialCommunityIcons name={provider.icon} size={14} color={colors.primary} />
              <Text style={styles.providerLabel}>Acceso mediante {provider.label}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.section}>Cuenta principal</Text>
        {primaryAccount ? (
          <>
            <InfoRow label="Proveedor" value={primaryAccount.providerName} />
            <InfoRow label="Contrato" value={primaryAccount.contractNumber} />
            <InfoRow label="Dirección" value={primaryAccount.serviceAddress} />
            <InfoRow label="Estado" value={primaryAccount.status === 'active' ? 'Activa' : primaryAccount.status} last />
          </>
        ) : (
          <Text style={styles.empty}>No has vinculado ninguna cuenta eléctrica todavía.</Text>
        )}
      </View>

      {accounts.length > 0 ? (
        <View style={styles.detailCard}>
          <Text style={styles.section}>Contratos vinculados</Text>
          <Text style={styles.empty}>{accounts.length} contrato{accounts.length !== 1 ? 's' : ''} en tu perfil</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <ActionRow icon="lightning-bolt-outline" onPress={() => router.push('/(tabs)/accounts')} title="Gestionar cuentas" />
        <ActionRow destructive icon="logout" onPress={handleLogout} title="Cerrar sesión" />
      </View>
    </Screen>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
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
  avatarInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    ...fontBase,
    color: colors.textSoft,
    fontSize: 14,
  },
  providerBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 3,
  },
  providerLabel: {
    ...fontBase,
    color: colors.muted,
    fontSize: 13,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: nativeUI.radius,
    borderWidth: 1,
    padding: 16,
    ...nativeUI.curveStyle,
    ...nativeUI.cardShadow,
  },
  section: {
    color: colors.text,
    fontFamily: nativeUI.fontBlack,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  infoRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  fieldLabel: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
  },
  fieldValue: {
    color: colors.text,
    flex: 1,
    fontFamily: nativeUI.fontBold,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
  empty: {
    ...fontBase,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
});
