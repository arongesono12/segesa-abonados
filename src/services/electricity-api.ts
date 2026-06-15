import Constants from 'expo-constants';
import { apiRequest } from '@/services/api-client';
import { mockApi } from '@/services/mock-api';
import { AppNotification, ElectricAccount, ElectricityProvider, Invoice, InvoiceStatus, Payment, PaymentMethodType } from '@/types/domain';

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

  getInvoices(filters?: { year?: string; month?: string; status?: InvoiceStatus | 'all' }): Promise<Invoice[]> {
    if (USE_MOCK_API) return mockApi.getInvoices(filters);
    const params = new URLSearchParams();
    if (filters?.year) params.set('year', filters.year);
    if (filters?.month) params.set('month', filters.month);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    return apiRequest(`/invoices?${params.toString()}`);
  },

  getInvoice(invoiceId: string): Promise<Invoice> {
    if (USE_MOCK_API) return mockApi.getInvoice(invoiceId);
    return apiRequest(`/invoices/${invoiceId}`);
  },

  getPayments(): Promise<Payment[]> {
    if (USE_MOCK_API) return mockApi.getPayments();
    return apiRequest('/payments');
  },

  getNotifications(): Promise<AppNotification[]> {
    if (USE_MOCK_API) return mockApi.getNotifications();
    return apiRequest('/notifications');
  },

  markNotificationAsRead(notificationId: string): Promise<AppNotification[]> {
    if (USE_MOCK_API) return mockApi.markNotificationAsRead(notificationId);
    return apiRequest(`/notifications/${notificationId}/read`, { method: 'POST' });
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
