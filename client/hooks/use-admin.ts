import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-keys';
import type { AdminBookFormValues } from '@/lib/schemas/book-schema';
import type { Book, User } from '@/lib/types';

export interface AdminAddBookVariables {
  userId: string;
  values: AdminBookFormValues;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => {
      const { data } = await api.get<User[]>('/admin/users');
      return data;
    },
  });
}

export function useAdminAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, values }: AdminAddBookVariables) => {
      const { data } = await api.post<Book>(`/admin/users/${userId}/books`, {
        name: values.name,
        author: values.author,
        photoUrl: values.photoUrl || undefined,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Book added for user');
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      queryClient.invalidateQueries({ queryKey: queryKeys.books });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBooks });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useAdminDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/admin/books/${bookId}`),
    onSuccess: () => {
      toast.success('Book deleted');
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      queryClient.invalidateQueries({ queryKey: queryKeys.books });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBooks });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
