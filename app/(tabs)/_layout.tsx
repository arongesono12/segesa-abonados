import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { nativeUI, platformTabHeaderOptions, useNativeLayout } from '@/theme/native-ui';

const TAB_SCREENS = [
  { name: 'index', title: 'Inicio', icon: 'view-dashboard-outline' as const },
  { name: 'invoices', title: 'Facturas', icon: 'receipt-outline' as const },
  { name: 'history', title: 'Historial', icon: 'clock-outline' as const },
  { name: 'accounts', title: 'Cuentas', icon: 'lightning-bolt-outline' as const },
  { name: 'profile', title: 'Perfil', icon: 'account-outline' as const },
] as const;

export default function TabsLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const { isTablet, tabBarHeight } = useNativeLayout();

  if (isLoading) return <FullScreenLoader label="Cargando información..." />;
  if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
  if (needsOnboarding) return <Redirect href="/onboarding/provider" />;

  return (
    <Tabs
      screenOptions={{
        ...platformTabHeaderOptions(),
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.text,
          fontFamily: nativeUI.fontBold,
          fontWeight: '700',
          fontSize: Platform.select({ ios: 17, android: 18, default: 17 }),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelPosition: isTablet ? 'beside-icon' : 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: tabBarHeight,
          ...Platform.select({
            android: { elevation: 8 },
            ios: {},
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontFamily: nativeUI.fontMedium,
          fontSize: isTablet ? 13 : 11,
          fontWeight: '500',
          marginBottom: Platform.select({ ios: 0, android: 4, default: 0 }),
        },
        tabBarIconStyle: {
          marginTop: Platform.select({ ios: 0, android: 2, default: 0 }),
        },
      }}>
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={icon} color={color} size={isTablet ? size + 2 : size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
