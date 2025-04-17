import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AdminLayout } from './AdminLayout';

interface AdminPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ title, children }) => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
