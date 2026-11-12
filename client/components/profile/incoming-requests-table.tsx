import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { DataTable, TableCell, TableHeaderCell } from '@/components/admin/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/format';
import type { IncomingExchangeRequest } from '@/lib/types';

interface IncomingRequestsTableProps {
  requests: IncomingExchangeRequest[];
}

export function IncomingRequestsTable({ requests }: IncomingRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No incoming exchange requests"
        description="When another reader requests one of your books, it will appear here."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <TableHeaderCell>Requested Book</TableHeaderCell>
          <TableHeaderCell>Requester</TableHeaderCell>
          <TableHeaderCell>Requester Email</TableHeaderCell>
          <TableHeaderCell className="w-36">Date</TableHeaderCell>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <TableCell className="font-medium text-gray-900">
              <Link href={`/books/${request.book.id}`} className="text-indigo-600 hover:underline">
                {request.book.name}
              </Link>{' '}
              <span className="text-gray-500">by {request.book.author}</span>
            </TableCell>
            <TableCell className="font-medium text-gray-900">{request.requester.name}</TableCell>
            <TableCell>
              <a
                href={`mailto:${request.requester.email}`}
                className="text-indigo-600 hover:underline"
              >
                {request.requester.email}
              </a>
            </TableCell>
            <TableCell>{formatDate(request.createdAt)}</TableCell>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

