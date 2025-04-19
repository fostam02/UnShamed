import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const Reports = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Compliance metrics and charts */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>State Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {/* State performance metrics */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* User activity metrics */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};