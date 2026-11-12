import { ArrowLeft, FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <FileQuestion className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          404 Error
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to books
          </Link>
        </div>
      </div>
    </div>
  );
}

