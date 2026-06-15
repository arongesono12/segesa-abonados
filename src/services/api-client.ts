import { AxiosError, AxiosRequestConfig, create, Method } from 'axios';
import Constants from 'expo-constants';

type RequestOptions = RequestInit & {
  token?: string | null;
};

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

export const apiClient = create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

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
    throw new ApiError('API_BASE_URL no esta configurada.');
  }

  try {
    const config: AxiosRequestConfig = {
      data: options.body,
      headers: {
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers as Record<string, string> | undefined),
      },
      method: (options.method ?? 'GET') as Method,
      signal: options.signal ?? undefined,
      url: path,
    };

    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message ?? axiosError.message ?? 'No se pudo completar la solicitud.';
    throw new ApiError(message, axiosError.response?.status);
  }
}
