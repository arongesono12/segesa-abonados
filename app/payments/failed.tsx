import { router } from 'expo-router';

import { AppButton } from '@/components/app-button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';

export default function PaymentFailedScreen() {
  return (
    <Screen>
      <EmptyState icon="alert-outline" title="Pago fallido" message="No pudimos confirmar la operacion." />
      <AppButton title="Intentar de nuevo" icon="credit-card-outline" onPress={() => router.back()} />
    </Screen>
  );
}
