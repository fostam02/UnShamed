import React from 'react';
import { DataTable } from '@/components/ui/data-table';

export const Audit = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Audit Log</h1>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <input type="date" className="input" />
            <select className="select">
              <option>All Actions</option>
              <option>Login</option>
              <option>Data Modification</option>
              <option>Settings Change</option>
            </select>
          </div>
          <button className="btn">Export Log</button>
        </div>

        <DataTable 
          columns={[
            { header: 'Timestamp', accessorKey: 'timestamp' },
            { header: 'User', accessorKey: 'user' },
            { header: 'Action', accessorKey: 'action' },
            { header: 'Details', accessorKey: 'details' }
          ]}
          data={[]}
        />
      </div>
    </div>
  );
};