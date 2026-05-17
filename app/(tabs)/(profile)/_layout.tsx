import { Stack } from 'expo-router/stack';

export default function ProfileStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerLargeTitleShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Perfil' }} />
    </Stack>
  );
}