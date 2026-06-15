import { useQuery } from '@tanstack/react-query';

import { invoiceService } from '@/services/invoice.service';

export function useInvoices(status: 'pending' | 'paid' | 'all' = 'pending') {
  return useQuery({
    queryFn: () => {
      if (status === 'all') return invoiceService.getInvoices();
      return status === 'pending' ? invoiceService.getPendingInvoices() : invoiceService.getPaidInvoices();
    },
    queryKey: ['invoices', status],
  });
}
