import { Stack } from 'expo-router/stack';

export default function InvoicesStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerLargeTitleShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Facturas' }} />
    </Stack>
  );
}