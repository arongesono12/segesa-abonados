import { create } from 'zustand';

type NotificationState = {
  unreadCount: number;
  setUnreadCount: (unreadCount: number) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  unreadCount: 0,
}));
