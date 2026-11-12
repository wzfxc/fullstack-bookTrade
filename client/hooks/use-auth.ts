import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/api-error';
import { api } from '@/lib/api';
import { clearAuthToken, saveAuthToken } from '@/lib/auth-token';
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
} from '@/lib/schemas/auth-schemas';
import type { User } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

async function authenticate(credentials: LoginFormValues): Promise<User> {
  const { data: session } = await api.post<{ accessToken: string }>('/auth/login', credentials);
  saveAuthToken(session.accessToken);

  const { data: user } = await api.get<User>('/auth/me');
  return user;
}

function useCompleteAuthentication() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return (user: User) => {
    setUser(user);
    toast.success(`Welcome, ${user.name}`);
    router.push('/books');
  };
}

export function useLogin() {
  const completeAuthentication = useCompleteAuthentication();

  return useMutation({
    mutationFn: authenticate,
    onSuccess: completeAuthentication,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegister() {
  const completeAuthentication = useCompleteAuthentication();

  return useMutation({
    mutationFn: async ({ name, email, password }: RegisterFormValues) => {
      await api.post('/auth/register', { name, email, password });
      return authenticate({ email, password });
    },
    onSuccess: completeAuthentication,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const { data } = await api.post<{ message: string }>('/auth/forgot-password', values);
      return data;
    },
    onSuccess: () => toast.success('Password reset link sent to your email'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { token: string; newPassword: string }) => {
      const { data } = await api.post<{ message: string }>('/auth/reset-password', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in.');
      router.push('/login');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return () => {
    clearAuthToken();
    clearUser();
    queryClient.clear();
    router.push('/login');
    toast.success('Logged out');
  };
}
