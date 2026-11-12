import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <div className="mt-6">{children}</div>
      <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>
    </div>
  );
}

