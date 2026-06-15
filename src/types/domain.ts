export type AuthProvider = 'email' | 'google' | 'apple';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider: AuthProvider;
  isVerified?: boolean;
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
  customerCode: string;
  customerName: string;
  serviceAddress: string;
  status: 'active' | 'suspended' | 'pending';
  isPrimary: boolean;
  lastSyncAt: string;
};

export type InvoiceStatus = 'pending' | 'paid' | 'processing' | 'expired' | 'cancelled';

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
  contractNumber: string;
  customerCode: string;
  serviceAddress: string;
  pdfUrl?: string;
};

export type PaymentMethodType = 'card' | 'mobile_money' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: PaymentStatus;
  paidAt: string;
  reference: string;
  receiptUrl?: string;
};

export type AppNotificationType =
  | 'new_invoice'
  | 'invoice_due'
  | 'invoice_expired'
  | 'payment_received'
  | 'payment_failed'
  | 'maintenance'
  | 'institutional'
  | 'support_reply';

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  channel: 'push' | 'sms' | 'email' | 'internal';
  readAt?: string;
  createdAt: string;
};

export type ApiResult<T> = {
  data: T;
  message?: string;
};
