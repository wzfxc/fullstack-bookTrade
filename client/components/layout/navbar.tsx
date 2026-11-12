'use client';

import {
  BookOpen,
  LayoutDashboard,
  Library,
  LogIn,
  LogOut,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

interface NavLinkProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}

function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/books" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          BookTrade
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/books" icon={Library}>
            Books
          </NavLink>

          {isInitialized && user && (
            <>
              <NavLink href="/me/books" icon={BookOpen}>
                My books
              </NavLink>
              <NavLink href="/profile" icon={UserIcon}>
                Profile
              </NavLink>
              {user.role === 'ADMIN' && (
                <NavLink href="/admin" icon={LayoutDashboard}>
                  Admin
                </NavLink>
              )}
              <span className="ml-2 hidden max-w-32 truncate text-sm text-gray-500 md:inline">
                {user.name}
              </span>
              <Button variant="secondary" className="ml-2" onClick={logout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </>
          )}

          {isInitialized && !user && (
            <>
              <NavLink href="/login" icon={LogIn}>
                Log in
              </NavLink>
              <NavLink href="/register" icon={UserPlus}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
