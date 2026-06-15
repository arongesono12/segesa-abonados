import { getSecureItem, saveSecureItem } from '@/services/storage';
import {
  AppNotification,
  ElectricAccount,
  ElectricityProvider,
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentMethodType,
  User,
} from '@/types/domain';

const MOCK_STATE_KEY = 'segesa.mock.state';

type MockState = {
  accounts: ElectricAccount[];
  invoices: Invoice[];
  payments: Payment[];
  notifications: AppNotification[];
};

type InvoiceFilters = {
  year?: string;
  month?: string;
  status?: InvoiceStatus | 'all';
};

const providers: ElectricityProvider[] = [
  { id: 'segesa', name: 'SEGESA', country: 'Guinea Ecuatorial', logoColor: '#0057D9', supportPhone: '+240 333 000 000' },
];

const validContracts = new Set(['00012345', 'SEG-123456', 'CN-003256']);

let accounts: ElectricAccount[] = [];
let invoices: Invoice[] = [];
let payments: Payment[] = [];
let notifications: AppNotification[] = [];
let hasHydratedState = false;

function wait(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hydrateState() {
  if (hasHydratedState) return;

  try {
    const storedState = await getSecureItem(MOCK_STATE_KEY);

    if (storedState) {
      const parsedState = JSON.parse(storedState) as Partial<MockState>;
      accounts = Array.isArray(parsedState.accounts) ? parsedState.accounts : [];
      invoices = Array.isArray(parsedState.invoices) ? parsedState.invoices : [];
      payments = Array.isArray(parsedState.payments) ? parsedState.payments : [];
      notifications = Array.isArray(parsedState.notifications) ? parsedState.notifications : [];
    }
  } finally {
    hasHydratedState = true;
  }
}

async function persistState() {
  await saveSecureItem(MOCK_STATE_KEY, JSON.stringify({ accounts, invoices, payments, notifications } satisfies MockState));
}

function createNotification(input: Omit<AppNotification, 'id' | 'createdAt' | 'readAt'>) {
  const notification: AppNotification = {
    id: `ntf-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  notifications = [notification, ...notifications];
}

function buildAccount(provider: ElectricityProvider, contractNumber: string): ElectricAccount {
  return {
    id: `acct-${provider.id}-${contractNumber}`,
    providerId: provider.id,
    providerName: provider.name,
    contractNumber,
    customerCode: 'CL-2026-0001',
    customerName: 'Juan Mba',
    serviceAddress: 'Malabo, Barrio Centro',
    status: 'active',
    isPrimary: true,
    lastSyncAt: new Date().toISOString(),
  };
}

function invoiceFor(account: ElectricAccount, index: number, status: InvoiceStatus, period: string, amount: number, kwh: number): Invoice {
  const monthNumber = String(5 - index).padStart(2, '0');
  const year = index >= 5 ? '2024' : '2025';

  return {
    id: `${account.id}-inv-${index + 1}`,
    accountId: account.id,
    invoiceNumber: `F-${year}-${monthNumber}-${String(123 + index * 23).padStart(4, '0')}`,
    period,
    issueDate: `${year}-${monthNumber}-05`,
    dueDate: `${year}-${monthNumber}-30`,
    amount,
    currency: 'XAF',
    status,
    kwh,
    contractNumber: account.contractNumber,
    customerCode: account.customerCode,
    serviceAddress: account.serviceAddress,
    pdfUrl: `mock://facturas/${account.contractNumber}/${year}-${monthNumber}.pdf`,
  };
}

function seedInvoices(accountId: string) {
  const account = accounts.find((item) => item.id === accountId);
  if (!account || invoices.some((invoice) => invoice.accountId === accountId)) return;

  invoices = [
    invoiceFor(account, 0, 'pending', 'Mayo 2025', 25000, 500),
    invoiceFor(account, 1, 'paid', 'Abril 2025', 24500, 490),
    invoiceFor(account, 2, 'paid', 'Marzo 2025', 23800, 476),
    invoiceFor(account, 3, 'paid', 'Febrero 2025', 22900, 458),
    invoiceFor(account, 4, 'paid', 'Enero 2025', 23100, 462),
    invoiceFor(account, 5, 'expired', 'Diciembre 2024', 25000, 510),
  ];

  createNotification({
    body: 'Tu factura de Mayo 2025 ya esta disponible para consulta y pago.',
    channel: 'internal',
    title: 'Nueva factura disponible',
    type: 'new_invoice',
  });
}

function getFilteredInvoices(filters: InvoiceFilters = {}) {
  return invoices.filter((invoice) => {
    const statusMatches = !filters.status || filters.status === 'all' || invoice.status === filters.status;
    const yearMatches = !filters.year || invoice.issueDate.startsWith(filters.year);
    const monthMatches = !filters.month || invoice.issueDate.slice(5, 7) === filters.month.padStart(2, '0');
    return statusMatches && yearMatches && monthMatches;
  });
}

function toUser(name: string, email: string, phone?: string): User {
  return { authProvider: 'email', email, id: 'user-1', isVerified: false, name, phone };
}

export const mockApi = {
  async login(email: string, password: string) {
    await hydrateState();
    await wait();
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Correo o contrasena no validos.');
    }

    return {
      accounts,
      token: 'mock-session-token',
      user: { ...toUser('Juan Mba', email, '+240 222 123 456'), isVerified: true },
    };
  },

  async register(name: string, email: string, password: string, phone?: string) {
    await hydrateState();
    await wait();
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      throw new Error('Completa el formulario con datos validos.');
    }

    accounts = [];
    invoices = [];
    payments = [];
    notifications = [];
    await persistState();

    return {
      accounts,
      token: 'mock-session-token',
      user: toUser(name, email, phone),
    };
  },

  async socialLogin(provider: 'google' | 'apple', email: string, name: string) {
    await hydrateState();
    await wait();
    accounts = [];
    invoices = [];
    payments = [];
    notifications = [];
    await persistState();

    return {
      accounts,
      token: 'mock-session-token',
      user: { authProvider: provider, email, id: 'user-1', isVerified: true, name } satisfies User,
    };
  },

  async recoverPassword(email: string) {
    await wait();
    if (!email.includes('@')) {
      throw new Error('Introduce un correo valido.');
    }
  },

  async sendOtp(destination: string) {
    await wait(300);
    if (destination.trim().length < 6) {
      throw new Error('Introduce un telefono o correo valido.');
    }
    return { expiresInSeconds: 300, maskedDestination: destination.replace(/^(.{2}).+(@|$)/, '$1***$2') };
  },

  async verifyOtp(code: string) {
    await wait(300);
    if (code !== '123456') {
      throw new Error('Codigo OTP incorrecto. Usa 123456 para la demo.');
    }
  },

  async getProviders() {
    await hydrateState();
    await wait();
    return providers;
  },

  async validateAccount(providerId: string, contractNumber: string) {
    await hydrateState();
    await wait();
    const provider = providers.find((item) => item.id === providerId);
    const normalizedContract = contractNumber.trim().toUpperCase();

    if (!provider || !validContracts.has(normalizedContract)) {
      throw new Error('El contrato no existe o no pertenece a SEGESA.');
    }

    const existingAccount = accounts.find(
      (account) => account.providerId === providerId && account.contractNumber === normalizedContract,
    );
    const account = existingAccount ?? buildAccount(provider, normalizedContract);
    const promotedAccount = { ...account, isPrimary: true, lastSyncAt: new Date().toISOString() };

    accounts = [
      promotedAccount,
      ...accounts.filter((item) => item.id !== account.id).map((item) => ({ ...item, isPrimary: false })),
    ];
    seedInvoices(promotedAccount.id);
    await persistState();
    return promotedAccount;
  },

  async getAccounts() {
    await hydrateState();
    await wait(250);
    return accounts;
  },

  async getInvoices(filters?: InvoiceFilters) {
    await hydrateState();
    await wait(250);
    return getFilteredInvoices(filters);
  },

  async getPendingInvoices() {
    await hydrateState();
    await wait(250);
    return getFilteredInvoices({ status: 'pending' }).concat(getFilteredInvoices({ status: 'expired' }));
  },

  async getPaidInvoices() {
    await hydrateState();
    await wait(250);
    return getFilteredInvoices({ status: 'paid' });
  },

  async getInvoice(invoiceId: string) {
    await hydrateState();
    await wait(250);
    const invoice = invoices.find((item) => item.id === invoiceId || item.invoiceNumber === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
    }

    return invoice;
  },

  async getPayments() {
    await hydrateState();
    await wait(250);
    return payments;
  },

  async payInvoice(invoiceId: string, method: PaymentMethodType) {
    await hydrateState();
    await wait(900);
    const invoice = invoices.find((item) => item.id === invoiceId || item.invoiceNumber === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
    }

    if (invoice.status === 'paid') {
      throw new Error('Esta factura ya esta pagada.');
    }

    invoice.status = 'paid';

    const payment: Payment = {
      amount: invoice.amount,
      currency: invoice.currency,
      id: `pay-${Date.now()}`,
      invoiceId: invoice.id,
      method,
      paidAt: new Date().toISOString(),
      receiptUrl: `mock://comprobantes/${invoice.invoiceNumber}.pdf`,
      reference: `TRX${Math.floor(Math.random() * 9000000) + 1000000}`,
      status: 'completed',
    };

    payments = [payment, ...payments];
    createNotification({
      body: `Recibimos tu pago de ${invoice.amount.toLocaleString('es-GQ')} XAF para la factura ${invoice.invoiceNumber}.`,
      channel: 'push',
      title: 'Pago recibido',
      type: 'payment_received',
    });
    await persistState();
    return payment;
  },

  async getNotifications() {
    await hydrateState();
    await wait(200);
    return notifications;
  },

  async markNotificationAsRead(notificationId: string) {
    await hydrateState();
    notifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, readAt: new Date().toISOString() } : notification,
    );
    await persistState();
    return notifications;
  },

  async syncCustomer() {
    await hydrateState();
    await wait(500);
    accounts = accounts.map((account) => ({ ...account, lastSyncAt: new Date().toISOString() }));
    accounts.forEach((account) => seedInvoices(account.id));
    await persistState();
    return accounts;
  },

  async setPrimaryAccount(accountId: string) {
    await hydrateState();
    await wait(250);

    if (!accounts.some((account) => account.id === accountId)) {
      throw new Error('Cuenta no encontrada.');
    }

    accounts = accounts.map((account) => ({ ...account, isPrimary: account.id === accountId }));
    await persistState();
    return accounts;
  },
};
