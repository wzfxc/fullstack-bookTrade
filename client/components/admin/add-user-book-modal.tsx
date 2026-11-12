'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useAdminAddBook } from '@/hooks/use-admin';
import { adminBookSchema, type AdminBookFormValues } from '@/lib/schemas/book-schema';
import type { User } from '@/lib/types';

interface AddUserBookModalProps {
  targetUser: User | null;
  onClose: () => void;
}

export function AddUserBookModal({ targetUser, onClose }: AddUserBookModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminBookFormValues>({
    resolver: zodResolver(adminBookSchema),
    defaultValues: { name: '', author: '', photoUrl: '' },
  });

  const { mutate: addBookForUser, isPending } = useAdminAddBook();

  useEffect(() => {
    if (targetUser) {
      reset({ name: '', author: '', photoUrl: '' });
    }
  }, [targetUser, reset]);

  useEffect(() => {
    if (!targetUser) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetUser, isPending, onClose]);

  if (!targetUser) {
    return null;
  }

  const onSubmit = (values: AdminBookFormValues) => {
    addBookForUser(
      { userId: targetUser.id, values },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-book-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-xs"
      onClick={() => {
        if (!isPending) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="add-user-book-modal-title"
              className="truncate text-lg font-semibold text-gray-900"
            >
              Add book for {targetUser.name}
            </h2>
            <p className="truncate text-sm text-gray-500">{targetUser.email}</p>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <TextField
            label="Title"
            placeholder="The Pragmatic Programmer"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="Author"
            placeholder="Andrew Hunt, David Thomas"
            error={errors.author?.message}
            {...register('author')}
          />
          <TextField
            label="Photo URL (optional)"
            type="url"
            placeholder="https://example.com/cover.jpg"
            error={errors.photoUrl?.message}
            {...register('photoUrl')}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              loadingText="Adding..."
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

