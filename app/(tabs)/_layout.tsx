import { PlatformColor } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

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

  if (isLoading) {
    return <FullScreenLoader label="Cargando información..." />;
  }

  if (!isAuthenticated) {
    const { Redirect } = require('expo-router');
    return <Redirect href="/(auth)/welcome" />;
  }

  if (needsOnboarding) {
    const { Redirect } = require('expo-router');
    return <Redirect href="/onboarding/provider" />;
  }

  return (
    <NativeTabs
      screenListeners={{
        tabPress: (e: any) => {
          // Haptic feedback for tab presses
          if (process.env.EXPO_OS === 'ios') {
            require('expo-haptics').impactAsync(require('expo-haptics').ImpactFeedbackStyle.Light);
          }
        },
      }}
      screenOptions={{
        headerShown: false,
      }}>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Inicio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="invoices">
        <Icon sf="doc.text.fill" />
        <Label>Facturas</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon sf="clock.fill" />
        <Label>Historial</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <Icon sf="bolt.fill" />
        <Label>Cuentas</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
