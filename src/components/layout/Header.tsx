import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserNav } from './UserNav';

export function Header() {
  const { userProfile } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}


