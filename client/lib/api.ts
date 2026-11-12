import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';
import { clearAuthToken, getAuthToken } from './auth-token';

const SESSION_EXPIRED_TOAST_ID = 'session-expired';
const CREDENTIAL_ENDPOINTS = ['/auth/login', '/auth/register'];

let handleSessionExpired: () => void = () => window.location.assign('/login');

export function registerSessionExpiredHandler(handler: () => void): void {
  handleSessionExpired = handler;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
});

api.interceptors.request.use((requestConfig) => {
  const token = getAuthToken();

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const isUnauthorized = isAxiosError(error) && error.response?.status === 401;
    const isCredentialRequest = CREDENTIAL_ENDPOINTS.includes(
      isAxiosError(error) ? (error.config?.url ?? '') : '',
    );

    if (isUnauthorized && !isCredentialRequest) {
      clearAuthToken();
      useAuthStore.getState().clearUser();
      toast.error('Session expired, please log in again', { id: SESSION_EXPIRED_TOAST_ID });
      handleSessionExpired();
    }

    return Promise.reject(error);
  },
);

