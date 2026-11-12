import type { Metadata } from 'next';
import { BookDetails } from '@/components/books/book-details';

export const metadata: Metadata = { title: 'Book details' };

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BookDetails bookId={id} />;
}

