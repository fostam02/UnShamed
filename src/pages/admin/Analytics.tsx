import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, BarChart } from '@/components/ui/charts';

export const Analytics = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">System Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={[]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};