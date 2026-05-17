import { Stack } from 'expo-router/stack';

export default function HistoryStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerLargeTitleShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Historial' }} />
    </Stack>
  );
}