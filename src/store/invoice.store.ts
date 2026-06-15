import { create } from 'zustand';

import { Invoice } from '@/types/domain';

type InvoiceState = {
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
};

export const useInvoiceStore = create<InvoiceState>((set) => ({
  selectedInvoice: null,
  setSelectedInvoice: (selectedInvoice) => set({ selectedInvoice }),
}));
