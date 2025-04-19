import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, CheckCircle, Clock, Mail, AlertTriangle, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Mock notification data - in a real app, this would come from a backend
const mockNotifications = [
  {
    id: '1',
    title: 'Task Due Tomorrow',
    description: 'Your compliance report for California is due tomorrow.',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'reminder',
    relatedStateId: 'state-123',
  },
  {
    id: '2',
    title: 'License Expiring Soon',
    description: 'Your RN license for New York will expire in 30 days.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'warning',
    relatedStateId: 'state-456',
  },
  {
    id: '3',
    title: 'Task Completed',
    description: 'Monthly report submission for Texas was successful.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: 'success',
    relatedStateId: 'state-789',
  },
];

const Notifications = () => {
  const { appState } = useAppContext();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    taskReminders: true,
    licenseExpiration: true,
    complianceDeadlines: true,
    weeklyDigest: false,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    toast({
      title: "All Notifications Marked as Read",
      description: `${unreadCount} notifications marked as read.`,
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    toast({
      title: "Settings Updated",
      description: `${setting} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return date > now ? 'Tomorrow' : 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ${date > now ? 'from now' : 'ago'}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.relatedStateId) {
      navigate(`/state/${notification.relatedStateId}`);
    }
    markAsRead(notification.id);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 border rounded-lg ${
                        !notification.read ? 'bg-accent/20' : ''}
                      } hover:bg-accent/10 transition-colors`}
                    >
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! No notifications at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.filter(n => !n.read).length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter(notification => !notification.read)
                    .map(notification => (
                      <div
                        key={notification.id}
                        className="flex items-start p-4 border rounded-lg bg-accent/20 hover:bg-accent/10 transition-colors"
                      >
                        <div className="mr-4 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                        </div>

                        <div className="flex ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    You have no unread notifications.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => handleSettingChange('email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => handleSettingChange('push', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="task-reminders" className="block mb-1">Task Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders for upcoming tasks and deadlines
                        </p>
                      </div>
                      <Switch
                        id="task-reminders"
                        checked={notificationSettings.taskReminders}
                        onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="license-expiration" className="block mb-1">License Expiration</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your licenses are about to expire
                        </p>
                      </div>
                      <Switch
                        id="license-expiration"
                        checked={notificationSettings.licenseExpiration}
                        onCheckedChange={(checked) => handleSettingChange('licenseExpiration', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compliance-deadlines" className="block mb-1">Compliance Deadlines</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications for important compliance deadlines
                        </p>
                      </div>
                      <Switch
                        id="compliance-deadlines"
                        checked={notificationSettings.complianceDeadlines}
                        onCheckedChange={(checked) => handleSettingChange('complianceDeadlines', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-digest" className="block mb-1">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of your compliance status
                        </p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
