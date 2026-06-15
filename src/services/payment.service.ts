import { electricityApi } from './electricity-api';

export const paymentService = {
  getPayments: electricityApi.getPayments,
  payInvoice: electricityApi.payInvoice,
};
