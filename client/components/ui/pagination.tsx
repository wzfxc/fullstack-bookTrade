import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, isDisabled = false, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="secondary"
        disabled={isDisabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <Button
        variant="secondary"
        disabled={isDisabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

