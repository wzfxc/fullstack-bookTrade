import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-3 text-gray-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="break-words text-base font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 max-w-md break-words text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

