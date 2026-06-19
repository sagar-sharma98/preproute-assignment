import { api } from './client';
import { unwrapApiResponse } from './client';
import type { ApiResponse, AuthPayload } from '../types';

export async function login(userId: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthPayload>>('/auth/login', { userId, password });
  return unwrapApiResponse(data);
}
