import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';

export function useRequestExchange() {
  return useMutation({
    mutationFn: (bookId: string) => api.post(`/books/${bookId}/exchange`),
    onSuccess: () => toast.success('Exchange request sent to the book owner'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

