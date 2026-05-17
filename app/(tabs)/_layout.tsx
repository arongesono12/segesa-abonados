import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/features/auth/auth-context';

export default function TabsLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();

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
        tabPress: () => {
          if (process.env.EXPO_OS === 'ios') {
            require('expo-haptics').impactAsync(require('expo-haptics').ImpactFeedbackStyle.Light);
          }
        },
      }}>
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf="house.fill" />
        <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(invoices)">
        <NativeTabs.Trigger.Icon sf="doc.text.fill" />
        <NativeTabs.Trigger.Label>Facturas</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(history)">
        <NativeTabs.Trigger.Icon sf="clock.fill" />
        <NativeTabs.Trigger.Label>Historial</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(accounts)">
        <NativeTabs.Trigger.Icon sf="bolt.fill" />
        <NativeTabs.Trigger.Label>Cuentas</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.fill" />
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}