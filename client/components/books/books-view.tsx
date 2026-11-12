'use client';

import { BookX, Library } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { useBooks } from '@/hooks/use-books';
import { BookCard } from './book-card';
import { BookGrid } from './book-grid';
import { SearchBar } from './search-bar';

const BOOKS_PER_PAGE = 12;

interface QueryChanges {
  page?: number;
  search?: string;
}

export function BooksView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(Number.parseInt(searchParams.get('page') ?? '1', 10) || 1, 1);
  const search = searchParams.get('search') ?? '';

  const { data, isPending, isError, refetch, isPlaceholderData } = useBooks({
    page,
    limit: BOOKS_PER_PAGE,
    search,
  });

  const updateQuery = useCallback(
    ({ page: nextPage, search: nextSearch }: QueryChanges) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextSearch !== undefined) {
        if (nextSearch) {
          params.set('search', nextSearch);
        } else {
          params.delete('search');
        }
        params.delete('page');
      }

      if (nextPage !== undefined) {
        if (nextPage > 1) {
          params.set('page', String(nextPage));
        } else {
          params.delete('page');
        }
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback((nextSearch: string) => updateQuery({ search: nextSearch }), [updateQuery]);

  const renderContent = () => {
    if (isPending) {
      return <Spinner label="Loading books" />;
    }

    if (isError) {
      return <ErrorState onRetry={refetch} />;
    }

    if (data.data.length === 0) {
      return search ? (
        <EmptyState
          icon={BookX}
          title="No books found"
          description={`Nothing matches “${search}”. Try a different title or author.`}
        />
      ) : (
        <EmptyState
          icon={Library}
          title="No books yet"
          description="Be the first to add a book to the exchange."
        />
      );
    }

    return (
      <>
        <BookGrid>
          {data.data.map((book) => (
            <BookCard key={book.id} book={book} href={`/books/${book.id}`} />
          ))}
        </BookGrid>
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          isDisabled={isPlaceholderData}
          onPageChange={(nextPage) => updateQuery({ page: nextPage })}
        />
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Browse books"
        description="Find a book you like and send its owner an exchange request."
        action={<SearchBar appliedSearch={search} onSearch={handleSearch} />}
      />
      {renderContent()}
    </>
  );
}

