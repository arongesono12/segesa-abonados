export type SupportTicketStatus = 'open' | 'in_progress' | 'closed';

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  createdAt: string;
};
