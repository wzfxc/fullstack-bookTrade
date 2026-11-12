import { useId, type ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className, ...inputProps }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-0 focus:outline-indigo-600',
          error ? 'border-red-400' : 'border-gray-300',
          className,
        )}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

