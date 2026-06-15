import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PlatformIcon } from '@/components/platform-icon';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { nativeUI, useNativeLayout } from '@/theme/native-ui';

const TAB_SCREENS = [
  { name: 'home', title: 'Inicio', icon: 'home-outline' as const },
  { name: 'invoices', title: 'Facturas', icon: 'receipt-outline' as const },
  { name: 'payments', title: 'Pagos', icon: 'clock-outline' as const },
  { name: 'support', title: 'Soporte', icon: 'alert-outline' as const },
  { name: 'profile', title: 'Perfil', icon: 'account-outline' as const },
] as const;

export default function TabsLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const { isTablet, tabBarHeight } = useNativeLayout();

  if (isLoading) return <FullScreenLoader label="Cargando informacion..." />;
  if (!isAuthenticated) return <Redirect href="/auth/welcome" />;
  if (needsOnboarding) return <Redirect href="/onboarding/provider" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelPosition: isTablet ? 'beside-icon' : 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: tabBarHeight,
          paddingBottom: Platform.select({ ios: 0, android: 2, default: 0 }),
          paddingTop: Platform.select({ ios: 5, android: 0, default: 5 }),
          ...Platform.select({
            android: { elevation: 8 },
            ios: {},
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontFamily: nativeUI.fontMedium,
          fontSize: isTablet ? 12 : 10,
          fontWeight: '800',
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <PlatformIcon name={icon} color={color} size={isTablet ? size + 2 : size} weight="medium" />
            ),
          }}
        />
      ))}
      <Tabs.Screen name="accounts" options={{ href: null }} />
    </Tabs>
  );
}
