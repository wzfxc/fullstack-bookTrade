import type { Metadata } from 'next';
import { AuthGate } from '@/components/auth/auth-gate';
import { AddBookForm } from '@/components/books/add-book-form';
import { MyBooksList } from '@/components/books/my-books-list';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'My books' };

export default function MyBooksPage() {
  return (
    <>
      <PageHeader title="My books" description="Manage the books you are willing to exchange." />
      <AuthGate>
        <AddBookForm />
        <MyBooksList />
      </AuthGate>
    </>
  );
}

