import { useQuery } from '@tanstack/react-query';

import { paymentService } from '@/services/payment.service';

export function usePayments() {
  return useQuery({
    queryFn: () => paymentService.getPayments(),
    queryKey: ['payments'],
  });
}
