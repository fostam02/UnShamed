import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { UserNav } from './UserNav';
import { Logo } from '../Logo';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { userProfile } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-semibold">UnShamed</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}



