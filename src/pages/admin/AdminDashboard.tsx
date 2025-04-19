import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  FileText,
  Settings,
  Database,
  Shield,
  UserCog,
  BarChart,
  Search,
  Mail,
  Bell,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = () => {
  const { appState } = useAppContext();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Mock data for admin dashboard
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active', states: 3 },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', status: 'active', states: 2 },
    { id: '3', name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'admin', status: 'active', states: 5 },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'user', status: 'inactive', states: 0 },
  ];

  const mockSystemStats = {
    totalUsers: 127,
    activeUsers: 98,
    totalStates: 342,
    documentsUploaded: 1256,
    tasksCompleted: 3789,
    averageComplianceRate: 87
  };

  const mockRecentActivity = [
    { id: '1', user: 'John Doe', action: 'Added a new state', timestamp: '2023-06-15T14:30:00Z' },
    { id: '2', user: 'Jane Smith', action: 'Uploaded a document', timestamp: '2023-06-15T13:45:00Z' },
    { id: '3', user: 'Admin', action: 'System maintenance', timestamp: '2023-06-15T12:00:00Z' },
    { id: '4', user: 'Robert Johnson', action: 'Completed compliance task', timestamp: '2023-06-15T10:15:00Z' },
    { id: '5', user: 'Emily Davis', action: 'Updated profile', timestamp: '2023-06-15T09:30:00Z' },
  ];

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User Deleted",
      description: "The user has been deleted from the system.",
      variant: "destructive"
    });
  };

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: "Your notification has been sent to all users.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm" onClick={() => setActiveTab('notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {mockSystemStats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total States</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemStats.totalStates}</div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemStats.documentsUploaded}</div>
            <p className="text-xs text-muted-foreground">
              Total documents uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemStats.averageComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all users
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                  <div className="col-span-2">User</div>
                  <div>Role</div>
                  <div>States</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {filteredUsers.length > 0 ? (
                  <div className="divide-y">
                    {filteredUsers.map(user => (
                      <div key={user.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                        <div className="col-span-2">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </div>
                        <div>{user.states}</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          >
                            {user.status === 'active' ?
                              <XCircle className="h-4 w-4 text-destructive" /> :
                              <CheckCircle className="h-4 w-4 text-green-600" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <div className="mr-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <UserCog className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.user}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send System Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationType">Notification Type</Label>
                  <select
                    id="notificationType"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="user">Regular Users Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationTitle">Title</Label>
                  <Input id="notificationTitle" placeholder="Enter notification title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationMessage">Message</Label>
                  <textarea
                    id="notificationMessage"
                    placeholder="Enter notification message"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notificationPriority">Priority</Label>
                  <select
                    id="notificationPriority"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <Button onClick={handleSendNotification}>
                  <Bell className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input id="systemName" defaultValue="UnShamed Compliance Tracker" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@unshamed.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <select
                    id="maintenanceMode"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="off">Off</option>
                    <option value="on">On</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI providers and settings for the Spark AI concierge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To configure AI providers and settings, please visit the dedicated AI Settings page.
                </p>
                <Button onClick={() => navigate('/admin/ai-settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Go to AI Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};