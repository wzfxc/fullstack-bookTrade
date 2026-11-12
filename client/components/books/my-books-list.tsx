'use client';

import { Library, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteMyBook, useMyBooks, isOptimisticBook } from '@/hooks/use-my-books';
import { BookCard } from './book-card';
import { BookGrid } from './book-grid';

export function MyBooksList() {
  const { data: books, isPending, isError, refetch } = useMyBooks();
  const { mutate: deleteBook, isPending: isDeleting, variables: deletingBookId } = useDeleteMyBook();

  if (isPending) {
    return <Spinner label="Loading your books" />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon={Library}
        title="You have not added any books"
        description="Use the form above to add your first book."
      />
    );
  }

  return (
    <BookGrid>
      {books.map((book) => {
        const isOptimistic = isOptimisticBook(book);
        const isBeingDeleted = isDeleting && deletingBookId === book.id;

        return (
          <BookCard
            key={book.id}
            book={book}
            href={isOptimistic ? undefined : `/books/${book.id}`}
            action={
              <Button
                variant="danger"
                className="w-full"
                disabled={isOptimistic || isBeingDeleted}
                isLoading={isBeingDeleted}
                loadingText="Deleting..."
                onClick={() => deleteBook(book.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            }
          />
        );
      })}
    </BookGrid>
  );
}

