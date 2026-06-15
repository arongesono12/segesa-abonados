import { SupportTicket } from '@/types/support.types';

type CreateSupportTicketInput = {
  subject: string;
  message: string;
};

export const supportService = {
  async createTicket(input: CreateSupportTicketInput): Promise<SupportTicket> {
    return {
      id: `ticket-${Date.now()}`,
      createdAt: new Date().toISOString(),
      message: input.message,
      status: 'open',
      subject: input.subject,
    };
  },
};
