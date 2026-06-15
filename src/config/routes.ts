export const routes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    linkContract: '/auth/link-contract',
  },
  tabs: {
    home: '/tabs/home',
    invoices: '/tabs/invoices',
    payments: '/tabs/payments',
    support: '/tabs/support',
    profile: '/tabs/profile',
  },
  payments: {
    method: '/payments/method',
    confirmation: '/payments/confirmation',
    success: '/payments/success',
    failed: '/payments/failed',
  },
} as const;
