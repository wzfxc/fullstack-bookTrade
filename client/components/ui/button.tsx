import { Loader2 } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600',
  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-indigo-600',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50 focus-visible:outline-red-600',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  loadingText,
  className,
  children,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variantClassNames[variant],
        className,
      )}
      {...buttonProps}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

