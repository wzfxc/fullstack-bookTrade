import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TableChildrenProps {
  children?: ReactNode;
  className?: string;
}

export function DataTable({ children }: TableChildrenProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[36rem] table-fixed text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHeaderCell({ children, className }: TableChildrenProps) {
  return (
    <th
      scope="col"
      className={cn('bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500', className)}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableChildrenProps) {
  return <td className={cn('truncate border-t border-gray-100 px-4 py-3 text-gray-700', className)}>{children}</td>;
}
