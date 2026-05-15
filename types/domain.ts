export type AuthProvider = 'email' | 'google' | 'apple';

export type User = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
};

export type ElectricityProvider = {
  id: string;
  name: string;
  country: string;
  logoColor: string;
  supportPhone: string;
};

export type ElectricAccount = {
  id: string;
  providerId: string;
  providerName: string;
  contractNumber: string;
  customerName: string;
  serviceAddress: string;
  status: 'active' | 'suspended' | 'pending';
  isPrimary: boolean;
  lastSyncAt: string;
};

export type InvoiceStatus = 'pending' | 'paid' | 'processing' | 'expired';

export type Invoice = {
  id: string;
  accountId: string;
  invoiceNumber: string;
  period: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  kwh: number;
};

export type PaymentMethodType = 'card' | 'mobile_money' | 'bank_transfer';

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: 'confirmed' | 'processing' | 'failed';
  paidAt: string;
  reference: string;
};

export type ApiResult<T> = {
  data: T;
  message?: string;
};
