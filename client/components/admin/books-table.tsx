'use client';

import { Library, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Pagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { useAdminDeleteBook, useAdminUsers } from '@/hooks/use-admin';
import { useBooks } from '@/hooks/use-books';
import { DataTable, TableCell, TableHeaderCell } from './data-table';

const BOOKS_PER_PAGE = 10;

export function BooksTable() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isPlaceholderData } = useBooks({
    page,
    limit: BOOKS_PER_PAGE,
    search: '',
  });
  const { data: users } = useAdminUsers();
  const { mutate: deleteBook, isPending: isDeleting, variables: deletingBookId } = useAdminDeleteBook();

  const ownerEmailById = useMemo(
    () => new Map(users?.map((user) => [user.id, user.email])),
    [users],
  );

  useEffect(() => {
    if (data && data.data.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data, page]);

  if (isPending) {
    return <Spinner label="Loading books" />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (data.data.length === 0) {
    return <EmptyState icon={Library} title="No books yet" />;
  }

  return (
    <>
      <DataTable>
        <thead>
          <tr>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Author</TableHeaderCell>
            <TableHeaderCell>Owner</TableHeaderCell>
            <TableHeaderCell className="w-32">
              <span className="sr-only">Actions</span>
            </TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {data.data.map((book) => {
            const isBeingDeleted = isDeleting && deletingBookId === book.id;

            return (
              <tr key={book.id}>
                <TableCell className="font-medium text-gray-900">{book.name}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{ownerEmailById.get(book.userId) ?? book.userId}</TableCell>
                <TableCell className="overflow-visible">
                  <Button
                    variant="danger"
                    disabled={isBeingDeleted}
                    isLoading={isBeingDeleted}
                    loadingText="Deleting..."
                    onClick={() => deleteBook(book.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
      <Pagination
        page={data.meta.page}
        totalPages={data.meta.totalPages}
        isDisabled={isPlaceholderData}
        onPageChange={setPage}
      />
    </>
  );
}

