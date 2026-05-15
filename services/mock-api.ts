import {
  ElectricAccount,
  ElectricityProvider,
  Invoice,
  Payment,
  PaymentMethodType,
  User,
} from '@/types/domain';

const providers: ElectricityProvider[] = [
  { id: 'segesa', name: 'SEGESA', country: 'Guinea Ecuatorial', logoColor: '#006B5F', supportPhone: '+240 333 000 000' },
  { id: 'eneo', name: 'ENEO Cameroun', country: 'Camerun', logoColor: '#1877C9', supportPhone: '+237 233 000 000' },
  { id: 'ikeja', name: 'Ikeja Electric', country: 'Nigeria', logoColor: '#E8B923', supportPhone: '+234 700 000 000' },
];

let accounts: ElectricAccount[] = [];
let invoices: Invoice[] = [];
let payments: Payment[] = [];

function wait(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedInvoices(accountId: string) {
  invoices = [
    {
      id: 'inv-001',
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
      id: 'inv-002',
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
    await wait();
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      throw new Error('Completa el formulario con datos válidos.');
    }

    accounts = [];
    invoices = [];
    payments = [];

    return {
      token: 'mock-session-token',
      user: { id: 'user-1', name, email, authProvider: 'email' } satisfies User,
      accounts,
    };
  },

  async socialLogin(provider: 'google' | 'apple', email: string, name: string) {
    await wait();
    accounts = [];
    invoices = [];
    payments = [];

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
    await wait();
    return providers;
  },

  async validateAccount(providerId: string, contractNumber: string) {
    await wait();
    const provider = providers.find((item) => item.id === providerId);

    if (!provider || contractNumber.trim().length < 5) {
      throw new Error('No pudimos validar esta cuenta con el proveedor.');
    }

    const account: ElectricAccount = {
      id: `acct-${Date.now()}`,
      providerId,
      providerName: provider.name,
      contractNumber: contractNumber.trim(),
      customerName: 'Aron Esono',
      serviceAddress: 'Malabo II, Bioko Norte',
      status: 'active',
      isPrimary: true,
      lastSyncAt: new Date().toISOString(),
    };

    accounts = [account];
    seedInvoices(account.id);
    return account;
  },

  async getAccounts() {
    await wait(350);
    return accounts;
  },

  async getPendingInvoices() {
    await wait(350);
    return invoices.filter((invoice) => invoice.status === 'pending' || invoice.status === 'expired');
  },

  async getPaidInvoices() {
    await wait(350);
    return invoices.filter((invoice) => invoice.status === 'paid');
  },

  async getInvoice(invoiceId: string) {
    await wait(350);
    const invoice = invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
    }

    return invoice;
  },

  async getPayments() {
    await wait(350);
    return payments;
  },

  async payInvoice(invoiceId: string, method: PaymentMethodType) {
    await wait(900);
    const invoice = invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      throw new Error('Factura no encontrada.');
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
    return payment;
  },

  async syncCustomer() {
    await wait(650);
    accounts = accounts.map((account) => ({ ...account, lastSyncAt: new Date().toISOString() }));
    return accounts;
  },
};
