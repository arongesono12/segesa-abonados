import { z } from 'zod';

export const emailSchema = z.string().trim().email('Introduce un correo valido.');

export const passwordSchema = z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, 'Introduce tu nombre completo.'),
});

export const contractSchema = z.object({
  contractNumber: z.string().trim().min(4, 'Introduce un numero de contrato valido.'),
  providerId: z.string().trim().min(1, 'Selecciona un proveedor.'),
});

export const supportTicketSchema = z.object({
  message: z.string().trim().min(10, 'Describe el problema con mas detalle.'),
  subject: z.string().trim().min(3, 'Introduce un asunto.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ContractFormValues = z.infer<typeof contractSchema>;
export type SupportTicketFormValues = z.infer<typeof supportTicketSchema>;
