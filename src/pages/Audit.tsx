import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Audit = () => {
  const columns = [
    {
      accessorKey: 'timestamp',
      header: 'Time',
    },
    {
      accessorKey: 'action',
      header: 'Action',
    },
    {
      accessorKey: 'user',
      header: 'User',
    },
    {
      accessorKey: 'details',
      header: 'Details',
    },
  ];

  const data = [
    {
      timestamp: new Date().toLocaleString(),
      action: 'Login',
      user: 'john.doe@example.com',
      details: 'Successful login',
    },
    // Add more audit entries as needed
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
};
