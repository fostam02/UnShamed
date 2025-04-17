import React from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DatabaseManagement = () => {
  return (
    <AdminPageLayout title="Database Management">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={67} className="mb-2" />
              <p className="text-sm text-muted-foreground">67% of 100GB used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">124</p>
              <p className="text-sm text-muted-foreground">Current active database connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2 hours ago</p>
              <p className="text-sm text-muted-foreground">Size: 2.3GB</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Backup Management</h3>
          <div className="flex space-x-2">
            <Button>Create Backup</Button>
            <Button variant="outline">Schedule Backup</Button>
            <Button variant="outline">View Backup History</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance</h3>
          <div className="flex space-x-2">
            <Button variant="outline">Optimize Tables</Button>
            <Button variant="outline">Repair Database</Button>
            <Button variant="destructive">Clear Cache</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Backups</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Size</th>
                <th className="text-left">Status</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-02-20 14:30</td>
                <td>2.3GB</td>
                <td>Completed</td>
                <td>
                  <Button variant="link">Download</Button>
                </td>
              </tr>
              <tr>
                <td>2024-02-19 14:30</td>
                <td>2.2GB</td>
                <td>Completed</td>
                <td>
                  <Button variant="link">Download</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
};