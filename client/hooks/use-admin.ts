import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-keys';
import type { User } from '@/lib/types';

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => {
      const { data } = await api.get<User[]>('/admin/users');
      return data;
    },
  });
}

export function useAdminDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/admin/books/${bookId}`),
    onSuccess: () => {
      toast.success('Book deleted');
      queryClient.invalidateQueries({ queryKey: queryKeys.books });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

