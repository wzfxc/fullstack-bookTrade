'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useAddBook } from '@/hooks/use-my-books';
import { bookSchema, type BookFormValues } from '@/lib/schemas/book-schema';

export function AddBookForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: { name: '', author: '', photoUrl: '' },
  });
  const { mutate: addBook, isPending } = useAddBook();

  const onSubmit = (values: BookFormValues) => {
    reset();
    addBook(values, { onError: () => reset(values) });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mb-10 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">Add a book</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <TextField label="Title" error={errors.name?.message} {...register('name')} />
        <TextField label="Author" error={errors.author?.message} {...register('author')} />
        <TextField
          label="Photo URL (optional)"
          type="url"
          placeholder="https://example.com/cover.jpg"
          error={errors.photoUrl?.message}
          {...register('photoUrl')}
        />
      </div>
      <Button type="submit" disabled={isPending} isLoading={isPending} loadingText="Adding...">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add book
      </Button>
    </form>
  );
}

