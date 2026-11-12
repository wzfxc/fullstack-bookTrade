'use client';

import { Library, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { BooksTable } from './books-table';
import { UsersTable } from './users-table';

type AdminTab = 'users' | 'books';

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'books', label: 'Books', icon: Library },
] as const;

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  return (
    <div className="space-y-6">
      <div role="tablist" className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {activeTab === 'users' ? <UsersTable /> : <BooksTable />}
    </div>
  );
}

