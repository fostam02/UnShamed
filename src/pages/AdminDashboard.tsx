import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Users, Settings, Shield, Bell, Database } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const AdminDashboard = () => {
  const { userProfile } = useAuth();

  const adminFeatures = [
    {
      title: "User Management",
      icon: <Users className="h-6 w-6" />,
      description: "Manage user accounts and permissions",
      link: "/admin/users"
    },
    {
      title: "AI Settings",
      icon: <Settings className="h-6 w-6" />,
      description: "Configure AI assistance settings",
      link: "/admin/ai-settings"
    },
    {
      title: "Security Settings",
      icon: <Shield className="h-6 w-6" />,
      description: "Manage security and access controls",
      link: "/admin/security"
    },
    {
      title: "System Notifications",
      icon: <Bell className="h-6 w-6" />,
      description: "Configure system-wide notifications",
      link: "/admin/notifications"
    },
    {
      title: "Database Management",
      icon: <Database className="h-6 w-6" />,
      description: "Manage database and backups",
      link: "/admin/database"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg">Welcome, {userProfile?.firstName} {userProfile?.lastName}</p>
              <p className="text-sm text-muted-foreground">Role: {userProfile?.role}</p>
              <p className="text-sm text-muted-foreground">Email: {userProfile?.email}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <Link to={feature.link}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              View System Logs
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Backup Database
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </AdminLayout>
  );
};

