import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-keys';
import type { BookFormValues } from '@/lib/schemas/book-schema';
import type { Book } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

const OPTIMISTIC_ID_PREFIX = 'optimistic-';

export function isOptimisticBook(book: Book): boolean {
  return book.id.startsWith(OPTIMISTIC_ID_PREFIX);
}

function sortByName(books: Book[]): Book[] {
  return [...books].sort((first, second) => first.name.localeCompare(second.name));
}

export function useMyBooks() {
  return useQuery({
    queryKey: queryKeys.myBooks,
    queryFn: async () => {
      const { data } = await api.get<Book[]>('/me/books');
      return data;
    },
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (values: BookFormValues) => {
      const { data } = await api.post<Book>('/me/books', {
        name: values.name,
        author: values.author,
        photoUrl: values.photoUrl || undefined,
      });
      return data;
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.myBooks });
      const previousBooks = queryClient.getQueryData<Book[]>(queryKeys.myBooks);
      const timestamp = new Date().toISOString();
      const optimisticBook: Book = {
        id: `${OPTIMISTIC_ID_PREFIX}${crypto.randomUUID()}`,
        name: values.name,
        author: values.author,
        photoUrl: values.photoUrl || null,
        userId: currentUser?.id ?? '',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      queryClient.setQueryData<Book[]>(queryKeys.myBooks, (books = []) =>
        sortByName([...books, optimisticBook]),
      );

      return { previousBooks };
    },
    onError: (_error, _values, context) => {
      queryClient.setQueryData(queryKeys.myBooks, context?.previousBooks);
      toast.error('Could not add the book. Your changes were rolled back.');
    },
    onSuccess: () => toast.success('Book added'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBooks });
      queryClient.invalidateQueries({ queryKey: queryKeys.books });
    },
  });
}

export function useDeleteMyBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => api.delete(`/me/books/${bookId}`),
    onSuccess: () => {
      toast.success('Book deleted');
      queryClient.invalidateQueries({ queryKey: queryKeys.myBooks });
      queryClient.invalidateQueries({ queryKey: queryKeys.books });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

