import axios from 'axios';
import type { ApiResponse } from '../types';

export const AUTH_UNAUTHORIZED_EVENT = 'preproute:unauthorized';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('preproute_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('preproute_token');
      localStorage.removeItem('preproute_user');
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Please check your internet connection, DNS, or backend URL.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
    }
    if (error.response?.status === 401) {
      return 'Your session is invalid or expired. Please log in again.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response && error.response.status >= 500) {
      return 'The server is having trouble right now. Please try again shortly.';
    }
    const data = error.response?.data as
      | {
          message?: string;
          error?: string;
          errors?: Record<string, string[]> | string[] | Array<{ msg?: string; message?: string; path?: string }>;
        }
      | undefined;

    if (data?.errors) {
      if (Array.isArray(data.errors)) {
        const fieldMessages = data.errors
          .map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              const message = item.msg ?? item.message ?? 'Validation error';
              return item.path ? `${item.path}: ${message}` : message;
            }
            return String(item);
          })
          .filter(Boolean);

        if (fieldMessages.length > 0) {
          return [...new Set(fieldMessages)].join(', ');
        }
      }
      const fieldMessages = Object.entries(data.errors).flatMap(([field, messages]) =>
        (Array.isArray(messages) ? messages : [String(messages)]).map((message) => `${field}: ${message}`)
      );
      if (fieldMessages.length > 0) {
        return fieldMessages.join(', ');
      }
    }

    return data?.message ?? data?.error ?? error.message ?? 'Something went wrong.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  const isSuccess = response.success === true || response.status === 'success';

  if (!isSuccess) {
    throw new Error(response.message ?? 'The API request was not successful.');
  }

  return response.data;
}
