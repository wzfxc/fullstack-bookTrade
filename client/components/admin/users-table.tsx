'use client';

import { Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useAdminUsers } from '@/hooks/use-admin';
import { cn } from '@/lib/cn';
import { DataTable, TableCell, TableHeaderCell } from './data-table';

export function UsersTable() {
  const { data: users, isPending, isError, refetch } = useAdminUsers();

  if (isPending) {
    return <Spinner label="Loading users" />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (users.length === 0) {
    return <EmptyState icon={Users} title="No users yet" />;
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell className="w-28">Role</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700',
                )}
              >
                {user.role}
              </span>
            </TableCell>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

