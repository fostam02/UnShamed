import React from 'react';
import { Card } from '@/components/ui/card';

interface AdminPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AdminPageLayout = ({ title, children }: AdminPageLayoutProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {children}
    </div>
  );
};