import { Redirect } from 'expo-router';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/features/auth/auth-context';

export default function Index() {
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

  if (isLoading) {
    return <FullScreenLoader label="Preparando tu cuenta..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding/provider" />;
  }

  return <Redirect href="/(tabs)" />;
}
