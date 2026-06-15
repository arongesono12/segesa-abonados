import Constants from 'expo-constants';

type AppExtra = {
  apiBaseUrl?: string;
  useMockApi?: boolean;
  googleClientId?: string;
  appleTeamId?: string;
  appleKeyId?: string;
};

export const env = (Constants.expoConfig?.extra ?? {}) as AppExtra;
