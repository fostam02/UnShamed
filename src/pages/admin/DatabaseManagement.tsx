import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Download, Upload, RefreshCw, HardDrive, Clock, AlertTriangle } from 'lucide-react';

// Sample backup data
const backupHistory = [
  { id: 1, date: '2023-10-15 03:00 AM', size: '1.2 GB', status: 'Completed', type: 'Automated' },
  { id: 2, date: '2023-10-14 03:00 AM', size: '1.1 GB', status: 'Completed', type: 'Automated' },
  { id: 3, date: '2023-10-13 03:00 AM', size: '1.2 GB', status: 'Completed', type: 'Automated' },
  { id: 4, date: '2023-10-12 03:00 AM', size: '1.1 GB', status: 'Completed', type: 'Automated' },
  { id: 5, date: '2023-10-10 11:45 AM', size: '1.1 GB', status: 'Completed', type: 'Manual' },
];

export default function DatabaseManagement() {
  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Database Management</h1>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Database Management</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle>Database Status</CardTitle>
            </div>
            <CardDescription>
              Current database status and storage usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-muted-foreground">4.2 GB / 10 GB</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Database Size</span>
                <p className="text-lg font-medium">4.2 GB</p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Connections</span>
                <p className="text-lg font-medium">12 active</p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <p className="text-lg font-medium">Today, 03:00 AM</p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <p className="text-lg font-medium text-green-500">Healthy</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Run Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Backup & Restore</CardTitle>
            </div>
            <CardDescription>
              Manage database backups and restoration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Restore
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Backup Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Frequency</span>
                  <p className="text-sm">Daily at 03:00 AM</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Retention</span>
                  <p className="text-sm">30 days</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Storage Location</h3>
              <p className="text-sm">Amazon S3 (us-east-1)</p>
              <p className="text-xs text-muted-foreground">Bucket: unshamed-backups</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Backup History</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Logs
              </Button>
            </div>
            <CardDescription>
              Recent database backup history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.type}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {backup.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Download</Button>
                      <Button variant="ghost" size="sm">Restore</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




