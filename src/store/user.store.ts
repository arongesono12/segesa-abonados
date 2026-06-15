import { create } from 'zustand';

import { User } from '@/types/domain';

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  setUser: (user) => set({ user }),
  user: null,
}));
