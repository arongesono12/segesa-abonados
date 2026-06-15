import { emailSchema, passwordSchema } from './validators';

export function validateEmail(email: string) {
  return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string) {
  return passwordSchema.safeParse(password).success;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}
