import Constants from 'expo-constants';
import { apiRequest } from '@/services/api-client';
import { mockApi } from '@/services/mock-api';
import { ElectricAccount, ElectricityProvider, Invoice, Payment, PaymentMethodType } from '@/types/domain';

const USE_MOCK_API = Constants.expoConfig?.extra?.useMockApi ?? true;

export const electricityApi = {
  getProviders(): Promise<ElectricityProvider[]> {
    if (USE_MOCK_API) return mockApi.getProviders();
    return apiRequest('/providers');
  },

  validateAccount(providerId: string, contractNumber: string): Promise<ElectricAccount> {
    if (USE_MOCK_API) return mockApi.validateAccount(providerId, contractNumber);
    return apiRequest('/accounts/validate', {
      method: 'POST',
      body: JSON.stringify({ providerId, contractNumber }),
    });
  },

  getAccounts(): Promise<ElectricAccount[]> {
    if (USE_MOCK_API) return mockApi.getAccounts();
    return apiRequest('/accounts');
  },

  getPendingInvoices(): Promise<Invoice[]> {
    if (USE_MOCK_API) return mockApi.getPendingInvoices();
    return apiRequest('/invoices?status=pending');
  },

  getPaidInvoices(): Promise<Invoice[]> {
    if (USE_MOCK_API) return mockApi.getPaidInvoices();
    return apiRequest('/invoices?status=paid');
  },

  getInvoice(invoiceId: string): Promise<Invoice> {
    if (USE_MOCK_API) return mockApi.getInvoice(invoiceId);
    return apiRequest(`/invoices/${invoiceId}`);
  },

  getPayments(): Promise<Payment[]> {
    if (USE_MOCK_API) return mockApi.getPayments();
    return apiRequest('/payments');
  },

  payInvoice(invoiceId: string, method: PaymentMethodType): Promise<Payment> {
    if (USE_MOCK_API) return mockApi.payInvoice(invoiceId, method);
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, method }),
    });
  },

  syncCustomer(): Promise<ElectricAccount[]> {
    if (USE_MOCK_API) return mockApi.syncCustomer();
    return apiRequest('/customer/sync', { method: 'POST' });
  },

  setPrimaryAccount(accountId: string): Promise<ElectricAccount[]> {
    if (USE_MOCK_API) return mockApi.setPrimaryAccount(accountId);
    return apiRequest(`/accounts/${accountId}/primary`, { method: 'POST' });
  },
};
