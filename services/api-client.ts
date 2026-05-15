import Constants from 'expo-constants';

type RequestOptions = RequestInit & {
  token?: string | null;
};

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('API_BASE_URL no está configurada.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message ?? 'No se pudo completar la solicitud.', response.status);
  }

  return payload as T;
}
