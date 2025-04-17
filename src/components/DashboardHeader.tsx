import React from 'react';
import { UserNav } from './UserNav';
import { ThemeToggle } from './theme-toggle';
import { Link } from 'react-router-dom';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
