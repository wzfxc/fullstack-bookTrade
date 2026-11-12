'use client';

import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { useAdminUsers } from '@/hooks/use-admin';
import { cn } from '@/lib/cn';
import type { User } from '@/lib/types';
import { AddUserBookModal } from './add-user-book-modal';
import { DataTable, TableCell, TableHeaderCell } from './data-table';

export function UsersTable() {
  const { data: users, isPending, isError, refetch } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    <>
      <DataTable>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell className="w-28">Role</TableHeaderCell>
            <TableHeaderCell className="w-36">
              <span className="sr-only">Actions</span>
            </TableHeaderCell>
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
                    user.role === 'ADMIN'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-gray-100 text-gray-700',
                  )}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="overflow-visible">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedUser(user)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Book
                </Button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </DataTable>

      <AddUserBookModal
        targetUser={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}
