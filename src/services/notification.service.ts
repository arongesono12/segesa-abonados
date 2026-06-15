import Constants from 'expo-constants';

import { electricityApi } from '@/services/electricity-api';
import { AppNotification } from '@/types/domain';

type ExpoNotifications = typeof import('expo-notifications');

const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === 'storeClient';

let notificationsModule: ExpoNotifications | null = null;
let notificationHandlerConfigured = false;

async function getNotificationsModule() {
  if (isExpoGo) return null;

  notificationsModule ??= await import('expo-notifications');

  if (!notificationHandlerConfigured) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationHandlerConfigured = true;
  }

  return notificationsModule;
}

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    return electricityApi.getNotifications();
  },

  async markAsRead(notificationId: string) {
    return electricityApi.markNotificationAsRead(notificationId);
  },

  async requestPermissions() {
    const Notifications = await getNotificationsModule();
    if (!Notifications) return { granted: false, status: 'denied' as const };

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return current;

    return Notifications.requestPermissionsAsync();
  },

  async scheduleLocalNotification(title: string, body: string) {
    const Notifications = await getNotificationsModule();
    if (!Notifications) return null;

    return Notifications.scheduleNotificationAsync({
      content: { body, title },
      trigger: null,
    });
  },
};
