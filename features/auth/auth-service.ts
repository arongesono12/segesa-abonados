import { mockApi } from '@/services/mock-api';

export const authService = {
  login: mockApi.login,
  register: mockApi.register,
  socialLogin: mockApi.socialLogin,
  recoverPassword: mockApi.recoverPassword,
};
