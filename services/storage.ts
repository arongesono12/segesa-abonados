import * as SecureStore from 'expo-secure-store';

export async function saveSecureItem(key: string, value: string) {
  if (process.env.EXPO_OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: string) {
  if (process.env.EXPO_OS === 'web') {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export async function deleteSecureItem(key: string) {
  if (process.env.EXPO_OS === 'web') {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
