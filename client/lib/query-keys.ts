import type { BooksQueryParams } from './types';

export const queryKeys = {
  books: ['books'] as const,
  booksList: (params: BooksQueryParams) => ['books', 'list', params] as const,
  bookDetails: (bookId: string) => ['books', 'details', bookId] as const,
  myBooks: ['me', 'books'] as const,
  adminUsers: ['admin', 'users'] as const,
};

