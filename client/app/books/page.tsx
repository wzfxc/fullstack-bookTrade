import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BooksView } from '@/components/books/books-view';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = { title: 'Books' };

export default function BooksPage() {
  return (
    <Suspense fallback={<Spinner label="Loading books" />}>
      <BooksView />
    </Suspense>
  );
}

