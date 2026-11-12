'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const SEARCH_DEBOUNCE_MILLISECONDS = 400;

interface SearchBarProps {
  appliedSearch: string;
  onSearch: (search: string) => void;
}

export function SearchBar({ appliedSearch, onSearch }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(appliedSearch);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MILLISECONDS);

  useEffect(() => {
    if (debouncedSearch !== appliedSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, appliedSearch, onSearch]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search by title or author"
        aria-label="Search books"
        maxLength={100}
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
      />
    </div>
  );
}

