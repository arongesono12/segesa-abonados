import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';
import { platformTabHeaderOptions, useNativeLayout } from '@/theme/native-ui';

export default function TabsLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const { isTablet, tabBarHeight } = useNativeLayout();

  if (isLoading) {
    return <FullScreenLoader label="Cargando información..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding/provider" />;
  }

  return (
    <Tabs
      screenOptions={{
        ...platformTabHeaderOptions(),
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        tabBarLabelPosition: isTablet ? 'beside-icon' : 'below-icon',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: tabBarHeight,
          paddingBottom: isTablet ? 10 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 14 : 12,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Facturas',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Cuentas',
          tabBarIcon: ({ color, size }) => <Ionicons name="flash-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
