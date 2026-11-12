import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Book } from '@/lib/types';
import { BookCover } from './book-cover';

interface BookCardProps {
  book: Book;
  href?: string;
  action?: ReactNode;
}

export function BookCard({ book, href, action }: BookCardProps) {
  const content = (
    <>
      <BookCover photoUrl={book.photoUrl} title={book.name} />
      <div className="min-w-0 space-y-1 p-4">
        <h3 className="line-clamp-2 break-words font-semibold text-gray-900" title={book.name}>
          {book.name}
        </h3>
        <p className="truncate text-sm text-gray-600" title={book.author}>
          {book.author}
        </p>
      </div>
    </>
  );

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {href ? (
        <Link href={href} className="block min-w-0 flex-1">
          {content}
        </Link>
      ) : (
        <div className="min-w-0 flex-1">{content}</div>
      )}
      {action && <div className="border-t border-gray-100 p-3">{action}</div>}
    </article>
  );
}

