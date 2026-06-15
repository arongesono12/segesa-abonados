import { electricityApi } from './electricity-api';
import { fileService } from './file.service';

export const invoiceService = {
  getInvoices: electricityApi.getInvoices,
  getInvoice: electricityApi.getInvoice,
  getPaidInvoices: electricityApi.getPaidInvoices,
  getPendingInvoices: electricityApi.getPendingInvoices,
  async createInvoicePdf(invoiceNumber: string, content: string) {
    return fileService.writeTextDocument(`factura-${invoiceNumber}.pdf`, content);
  },
  async shareInvoicePdf(invoiceNumber: string, content: string) {
    const uri = await fileService.writeTextDocument(`factura-${invoiceNumber}.pdf`, content);
    await fileService.shareFile(uri, `Factura ${invoiceNumber}`);
    return uri;
  },
};
