export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  photoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBooks {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BooksQueryParams {
  page: number;
  limit: number;
  search: string;
}

export interface IncomingExchangeRequest {
  id: string;
  requesterId: string;
  ownerId: string;
  bookId: string;
  createdAt: string;
  requester: User;
  book: Book;
}

export interface UserProfile extends User {
  booksCount: number;
  incomingRequests: IncomingExchangeRequest[];
}
