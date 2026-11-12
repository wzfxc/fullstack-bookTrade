'use client';

import { QueryClientProvider, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { api, registerSessionExpiredHandler } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-token';
import type { User } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

function AuthInitializer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const markInitialized = useAuthStore((state) => state.markInitialized);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      queryClient.clear();
      router.replace('/login');
    });
  }, [queryClient, router]);

  useEffect(() => {
    if (!getAuthToken()) {
      markInitialized();
      return;
    }

    api
      .get<User>('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => undefined)
      .finally(markInitialized);
  }, [setUser, markInitialized]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

