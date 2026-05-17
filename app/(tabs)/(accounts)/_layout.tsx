import { Stack } from 'expo-router/stack';

export default function AccountsStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerLargeTitleShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Cuentas' }} />
    </Stack>
  );
}