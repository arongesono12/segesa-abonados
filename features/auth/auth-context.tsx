import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '@/features/auth/auth-service';
import { electricityApi } from '@/services/electricity-api';
import { deleteSecureItem, getSecureItem, saveSecureItem } from '@/services/storage';
import { ElectricAccount, User } from '@/types/domain';

const TOKEN_KEY = 'segesa.session.token';
const USER_KEY = 'segesa.session.user';
const ACCOUNTS_KEY = 'segesa.session.accounts';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  accounts: ElectricAccount[];
  primaryAccount: ElectricAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple', email: string, name: string) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  savePrimaryAccount: (account: ElectricAccount) => Promise<void>;
  setPrimaryAccount: (accountId: string) => Promise<void>;
  updateAccounts: (accounts: ElectricAccount[]) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<ElectricAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser, storedAccounts] = await Promise.all([
          getSecureItem(TOKEN_KEY),
          getSecureItem(USER_KEY),
          getSecureItem(ACCOUNTS_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAccounts(storedAccounts ? JSON.parse(storedAccounts) : []);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const persistSession = async (sessionToken: string, sessionUser: User, sessionAccounts: ElectricAccount[]) => {
    setToken(sessionToken);
    setUser(sessionUser);
    setAccounts(sessionAccounts);

    await Promise.all([
      saveSecureItem(TOKEN_KEY, sessionToken),
      saveSecureItem(USER_KEY, JSON.stringify(sessionUser)),
      saveSecureItem(ACCOUNTS_KEY, JSON.stringify(sessionAccounts)),
    ]);
  };

  const updateAccounts = async (nextAccounts: ElectricAccount[]) => {
    setAccounts(nextAccounts);
    await saveSecureItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
  };

  const value = useMemo<AuthContextValue>(() => {
    const primaryAccount = accounts.find((account) => account.isPrimary) ?? accounts[0] ?? null;

    return {
      token,
      user,
      accounts,
      primaryAccount,
      isAuthenticated: Boolean(token && user),
      isLoading,
      needsOnboarding: Boolean(token && user && !primaryAccount),
      login: async (email, password) => {
        const session = await authService.login(email, password);
        await persistSession(session.token, session.user, session.accounts);
      },
      register: async (name, email, password) => {
        const session = await authService.register(name, email, password);
        await persistSession(session.token, session.user, session.accounts);
      },
      socialLogin: async (provider, email, name) => {
        const session = await authService.socialLogin(provider, email, name);
        await persistSession(session.token, session.user, session.accounts);
      },
      recoverPassword: authService.recoverPassword,
      savePrimaryAccount: async (account) => {
        const nextAccounts = [account, ...accounts.filter((item) => item.id !== account.id)].map((item, index) => ({
          ...item,
          isPrimary: index === 0,
        }));
        await updateAccounts(nextAccounts);
      },
      setPrimaryAccount: async (accountId) => {
        const nextAccounts = await electricityApi.setPrimaryAccount(accountId);
        await updateAccounts(nextAccounts);
      },
      updateAccounts,
      logout: async () => {
        setToken(null);
        setUser(null);
        setAccounts([]);
        await Promise.all([deleteSecureItem(TOKEN_KEY), deleteSecureItem(USER_KEY), deleteSecureItem(ACCOUNTS_KEY)]);
      },
    };
  }, [accounts, isLoading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return context;
}
