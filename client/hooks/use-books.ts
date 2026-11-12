import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { Book, BooksQueryParams, PaginatedBooks } from '@/lib/types';

export function useBooks(params: BooksQueryParams) {
  return useQuery({
    queryKey: queryKeys.booksList(params),
    queryFn: async () => {
      const { data } = await api.get<PaginatedBooks>('/books', {
        params: { page: params.page, limit: params.limit, search: params.search || undefined },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useBook(bookId: string) {
  return useQuery({
    queryKey: queryKeys.bookDetails(bookId),
    queryFn: async () => {
      const { data } = await api.get<Book>(`/books/${bookId}`);
      return data;
    },
  });
}

