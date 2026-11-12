'use client';

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRequestExchange } from '@/hooks/use-request-exchange';

export function RequestExchangeButton({ bookId }: { bookId: string }) {
  const { mutate: requestExchange, isPending } = useRequestExchange();

  return (
    <Button
      type="button"
      disabled={isPending}
      isLoading={isPending}
      loadingText="Sending..."
      onClick={() => requestExchange(bookId)}
    >
      <Send className="h-4 w-4" aria-hidden="true" />
      Request exchange
    </Button>
  );
}

