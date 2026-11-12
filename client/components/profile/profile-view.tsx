'use client';

import { ArrowRightLeft, BookOpen } from 'lucide-react';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useProfile } from '@/hooks/use-profile';
import { IncomingRequestsTable } from './incoming-requests-table';
import { ProfileForm } from './profile-form';

export function ProfileView() {
  const { data: profile, isPending, isError, refetch } = useProfile();

  if (isPending) {
    return <Spinner label="Loading profile" />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Books</p>
            <p className="text-2xl font-bold text-gray-900">{profile.booksCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <ArrowRightLeft className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Incoming Requests</p>
            <p className="text-2xl font-bold text-gray-900">{profile.incomingRequests.length}</p>
          </div>
        </div>
      </div>

      <ProfileForm profile={profile} />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Incoming exchange requests</h2>
          <p className="text-sm text-gray-600">
            Readers who have requested to trade for your books.
          </p>
        </div>
        <IncomingRequestsTable requests={profile.incomingRequests} />
      </section>
    </div>
  );
}

