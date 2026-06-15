import { create } from 'zustand';

import { ElectricAccount, User } from '@/types/domain';

type AuthState = {
  token: string | null;
  user: User | null;
  accounts: ElectricAccount[];
  setSession: (token: string, user: User, accounts: ElectricAccount[]) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accounts: [],
  clearSession: () => set({ accounts: [], token: null, user: null }),
  setSession: (token, user, accounts) => set({ accounts, token, user }),
  token: null,
  user: null,
}));

export { AuthProvider, useAuth } from '@/features/auth/auth-context';
