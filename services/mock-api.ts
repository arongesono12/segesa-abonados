import {
  ElectricAccount,
  ElectricityProvider,
  Invoice,
  Payment,
  PaymentMethodType,
  User,
} from '@/types/domain';
import { getSecureItem, saveSecureItem } from '@/services/storage';

const MOCK_STATE_KEY = 'segesa.mock.state';

type MockState = {
  accounts: ElectricAccount[];
  invoices: Invoice[];
  payments: Payment[];
};

const providers: ElectricityProvider[] = [
  { id: 'segesa', name: 'SEGESA', country: 'Guinea Ecuatorial', logoColor: '#1D4ED8', supportPhone: '+240 333 000 000' },
  { id: 'eneo', name: 'ENEO Cameroun', country: 'Camerun', logoColor: '#1877C9', supportPhone: '+237 233 000 000' },
  { id: 'ikeja', name: 'Ikeja Electric', country: 'Nigeria', logoColor: '#E8B923', supportPhone: '+234 700 000 000' },
];

let accounts: ElectricAccount[] = [];
let invoices: Invoice[] = [];
let payments: Payment[] = [];
let hasHydratedState = false;

function wait(ms = 550) {
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
    }
  } finally {
    hasHydratedState = true;
  }
}

async function persistState() {
  await saveSecureItem(MOCK_STATE_KEY, JSON.stringify({ accounts, invoices, payments } satisfies MockState));
}

function seedInvoices(accountId: string) {
  if (invoices.some((invoice) => invoice.accountId === accountId)) {
    return;
  }

  invoices = [
    ...invoices,
    {
      id: `${accountId}-inv-001`,
      accountId,
      invoiceNumber: 'SE-2026-0048',
      period: 'Abril 2026',
      issueDate: '2026-05-01',
      dueDate: '2026-05-20',
      amount: 48500,
      currency: 'XAF',
      status: 'pending',
      kwh: 342,
    },
    {
      id: `${accountId}-inv-002`,
      accountId,
      invoiceNumber: 'SE-2026-0037',
      period: 'Marzo 2026',
      issueDate: '2026-04-01',
      dueDate: '2026-04-20',
      amount: 42100,
      currency: 'XAF',
      status: 'paid',
      kwh: 301,
    },
  ];
}

export const mockApi = {
  async login(email: string, password: string) {
    await hydrateState();
    await wait();
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Correo o contraseña no válidos.');
    }

    return {
      token: 'mock-session-token',
      user: { id: 'user-1', name: 'Cliente SEGESA', email, authProvider: 'email' } satisfies User,
      accounts,
    };
  },

  async register(name: string, email: string, password: string) {
    await hydrateState();
    await wait();
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      throw new Error('Completa el formulario con datos válidos.');
    }

    accounts = [];
    invoices = [];
    payments = [];
    await persistState();

    return {
      token: 'mock-session-token',
      user: { id: 'user-1', name, email, authProvider: 'email' } satisfies User,
      accounts,
    };
  },

  async socialLogin(provider: 'google' | 'apple', email: string, name: string) {
    await hydrateState();
    await wait();
    accounts = [];
    invoices = [];
    payments = [];
    await persistState();

    return {
      token: 'mock-session-token',
      user: { id: 'user-1', name, email, authProvider: provider } satisfies User,
      accounts,
    };
  },

  async recoverPassword(email: string) {
    await wait();
    if (!email.includes('@')) {
      throw new Error('Introduce un correo válido.');
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
    const normalizedContract = contractNumber.trim();

    if (!provider || normalizedContract.length < 5) {
      throw new Error('No pudimos validar esta cuenta con el proveedor.');
    }

    const existingAccount = accounts.find(
      (account) => account.providerId === providerId && account.contractNumber === normalizedContract,
    );
    const account: ElectricAccount =
      existingAccount ??
      ({
        id: `acct-${providerId}-${Date.now()}`,
        providerId,
        providerName: provider.name,
        contractNumber: normalizedContract,
        customerName: 'Aron Esono',
        serviceAddress: 'Malabo II, Bioko Norte',
        status: 'active',
        isPrimary: true,
        lastSyncAt: new Date().toISOString(),
      } satisfies ElectricAccount);
    const promotedAccount = { ...account, isPrimary: true, lastSyncAt: new Date().toISOString() };

    accounts = [
      promotedAccount,
      ...accounts.filter((item) => item.id !== account.id).map((item) => ({ ...item, isPrimary: false })),
    ];
    seedInvoices(account.id);
    await persistState();
    return promotedAccount;
  },

  async getAccounts() {
    await hydrateState();
    await wait(350);
    return accounts;
  },

  async getPendingInvoices() {
    await hydrateState();
    await wait(350);
    return invoices.filter(
      (invoice) => invoice.status === 'pending' || invoice.status === 'expired' || invoice.status === 'processing',
    );
  },

  async getPaidInvoices() {
    await hydrateState();
    await wait(350);
    return invoices.filter((invoice) => invoice.status === 'paid');
  },

  async getInvoice(invoiceId: string) {
    await hydrateState();
    await wait(350);
    const invoice = invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
    }

    return invoice;
  },

  async getPayments() {
    await hydrateState();
    await wait(350);
    return payments;
  },

  async payInvoice(invoiceId: string, method: PaymentMethodType) {
    await hydrateState();
    await wait(900);
    const invoice = invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
    }

    if (invoice.status === 'paid') {
      throw new Error('Esta factura ya está pagada.');
    }

    invoice.status = 'paid';

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId,
      amount: invoice.amount,
      currency: invoice.currency,
      method,
      status: 'confirmed',
      paidAt: new Date().toISOString(),
      reference: `PAY-${Math.floor(Math.random() * 900000) + 100000}`,
    };

    payments = [payment, ...payments];
    await persistState();
    return payment;
  },

  async syncCustomer() {
    await hydrateState();
    await wait(650);
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
