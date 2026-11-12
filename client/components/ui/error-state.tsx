import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { EmptyState } from './empty-state';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'We could not load this content.', onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={message}
      action={
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}

