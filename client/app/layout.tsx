import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'BookTrade', template: '%s | BookTrade' },
  description: 'Discover books and exchange them with other readers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
