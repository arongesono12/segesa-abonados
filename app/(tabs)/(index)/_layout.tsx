import { Stack } from 'expo-router/stack';

export default function IndexStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerLargeTitleShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
    </Stack>
  );
}