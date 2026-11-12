'use client';

import { ArrowLeft, BookX } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useBook } from '@/hooks/use-books';
import { formatDate } from '@/lib/format';
import { useAuthStore } from '@/stores/auth-store';
import { BookCover } from './book-cover';
import { RequestExchangeButton } from './request-exchange-button';

const BackToBooksLink = () => (
  <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline">
    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    Back to books
  </Link>
);

export function BookDetails({ bookId }: { bookId: string }) {
  const { data: book, isPending, isError } = useBook(bookId);
  const currentUser = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (isPending) {
    return <Spinner label="Loading book" />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={BookX}
        title="Book not found"
        description="It may have been removed by its owner."
        action={<BackToBooksLink />}
      />
    );
  }

  const isOwner = currentUser?.id === book.userId;

  const renderExchangeSection = () => {
    if (!isInitialized) {
      return null;
    }

    if (!currentUser) {
      return (
        <p className="text-sm text-gray-600">
          <Link href="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>{' '}
          to request an exchange.
        </p>
      );
    }

    if (isOwner) {
      return <p className="text-sm text-gray-600">This book is in your collection.</p>;
    }

    return <RequestExchangeButton bookId={book.id} />;
  };

  return (
    <div className="space-y-6">
      <BackToBooksLink />
      <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[16rem_minmax(0,1fr)]">
        <BookCover photoUrl={book.photoUrl} title={book.name} className="max-w-64 rounded-xl" />
        <div className="min-w-0 space-y-4">
          <div className="space-y-1">
            <h1 className="break-words text-3xl font-bold tracking-tight text-gray-900">{book.name}</h1>
            <p className="break-words text-lg text-gray-600">by {book.author}</p>
          </div>
          <p className="text-sm text-gray-500">Added on {formatDate(book.createdAt)}</p>
          <div className="pt-2">{renderExchangeSection()}</div>
        </div>
      </div>
    </div>
  );
}

