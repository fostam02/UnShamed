
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Calendar, ClipboardList, Clock, CheckCircle, AlertTriangle, MailOpen } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ComplianceItem } from '@/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'due-soon' | 'overdue' | 'general' | 'update';
  date: string;
  read: boolean;
  stateId?: string;
  stateName?: string;
  taskId?: string;
}

const Notifications = () => {
  const { appState } = useAppContext();
  const { states } = appState;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<'7days' | '2weeks' | '1month'>('7days');
  
  // Generate notifications based on tasks
  useEffect(() => {
    const generatedNotifications: Notification[] = [];
    
    // Process all tasks from all states
    states.forEach(state => {
      state.complianceItems.forEach(task => {
        const daysRemaining = getDaysRemaining(task.dueDate);
        
        // Create overdue notifications
        if (!task.completed && daysRemaining < 0) {
          generatedNotifications.push({
            id: `overdue-${task.id}`,
            title: 'Task Overdue',
            message: `The task "${task.title}" for ${state.name} is overdue by ${Math.abs(daysRemaining)} days.`,
            type: 'overdue',
            date: new Date().toISOString(),
            read: false,
            stateId: state.id,
            stateName: state.name,
            taskId: task.id
          });
        }
        
        // Filter due soon notifications based on selected filter
        if (!task.completed) {
          let shouldInclude = false;
          let timeDescription = '';
          
          if (deadlineFilter === '7days' && daysRemaining >= 0 && daysRemaining <= 7) {
            shouldInclude = true;
            timeDescription = daysRemaining === 0 
              ? 'today' 
              : daysRemaining === 1 
                ? 'tomorrow' 
                : `in ${daysRemaining} days`;
          } else if (deadlineFilter === '2weeks' && daysRemaining >= 0 && daysRemaining <= 14) {
            shouldInclude = true;
            timeDescription = daysRemaining === 0 
              ? 'today' 
              : daysRemaining === 1 
                ? 'tomorrow' 
                : `in ${daysRemaining} days`;
          } else if (deadlineFilter === '1month' && daysRemaining >= 0 && daysRemaining <= 30) {
            shouldInclude = true;
            timeDescription = daysRemaining === 0 
              ? 'today' 
              : daysRemaining === 1 
                ? 'tomorrow' 
                : daysRemaining <= 7 
                  ? `in ${daysRemaining} days` 
                  : `in ${Math.ceil(daysRemaining / 7)} weeks`;
          }
          
          if (shouldInclude) {
            generatedNotifications.push({
              id: `duesoon-${task.id}-${daysRemaining}`,
              title: 'Upcoming Deadline',
              message: `The task "${task.title}" for ${state.name} is due ${timeDescription}.`,
              type: 'due-soon',
              date: new Date().toISOString(),
              read: false,
              stateId: state.id,
              stateName: state.name,
              taskId: task.id
            });
          }
        }
      });
      
      // Notification for initial response due date
      if (state.initialResponseDueDate) {
        const responseDaysRemaining = getDaysRemaining(state.initialResponseDueDate);
        let shouldIncludeResponse = false;
        
        if (deadlineFilter === '7days' && responseDaysRemaining >= 0 && responseDaysRemaining <= 7) {
          shouldIncludeResponse = true;
        } else if (deadlineFilter === '2weeks' && responseDaysRemaining >= 0 && responseDaysRemaining <= 14) {
          shouldIncludeResponse = true;
        } else if (deadlineFilter === '1month' && responseDaysRemaining >= 0 && responseDaysRemaining <= 30) {
          shouldIncludeResponse = true;
        }
        
        if (shouldIncludeResponse) {
          generatedNotifications.push({
            id: `response-${state.id}`,
            title: 'Initial Response Due Soon',
            message: `Your initial response to the ${state.name} Board of Nursing is due ${
              responseDaysRemaining === 0 
                ? 'today' 
                : responseDaysRemaining === 1 
                  ? 'tomorrow' 
                  : `in ${responseDaysRemaining} days`
            }.`,
            type: 'due-soon',
            date: new Date().toISOString(),
            read: false,
            stateId: state.id,
            stateName: state.name
          });
        } else if (responseDaysRemaining < 0) {
          generatedNotifications.push({
            id: `response-overdue-${state.id}`,
            title: 'Initial Response Overdue',
            message: `Your initial response to the ${state.name} Board of Nursing is overdue by ${Math.abs(responseDaysRemaining)} days.`,
            type: 'overdue',
            date: new Date().toISOString(),
            read: false,
            stateId: state.id,
            stateName: state.name
          });
        }
      }
    });
    
    // Add some demo general notifications
    if (states.length > 0) {
      generatedNotifications.push({
        id: 'welcome',
        title: 'Welcome to Nurse Navigator',
        message: 'Track your compliance requirements across multiple nursing board jurisdictions.',
        type: 'general',
        date: new Date().toISOString(),
        read: true
      });
      
      generatedNotifications.push({
        id: 'tip-1',
        title: 'Compliance Tip',
        message: 'Always keep copies of all correspondence with nursing boards in your documents section.',
        type: 'general',
        date: new Date().toISOString(),
        read: false
      });
      
      if (states.filter(s => s.isOriginalState).length > 0) {
        const originalState = states.find(s => s.isOriginalState);
        if (originalState) {
          generatedNotifications.push({
            id: `original-state-info`,
            title: 'Document Organization',
            message: `Set up folders for each of your active licenses to keep documentation organized for ${originalState.name} and any reciprocal actions.`,
            type: 'update',
            date: new Date().toISOString(),
            read: false
          });
        }
      }
    }
    
    setNotifications(generatedNotifications);
  }, [states, deadlineFilter]);
  
  // Get filter display text
  const getFilterDisplayText = () => {
    switch (deadlineFilter) {
      case '7days': return 'next 7 days';
      case '2weeks': return 'next 2 weeks';
      case '1month': return 'next month';
      default: return 'next 7 days';
    }
  };
  
  // Calculate days remaining for a date
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-nurse-primary">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <MailOpen className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      {states.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Add a state profile to start receiving notifications about your compliance requirements.
            </p>
            <Link to="/add-state">
              <Button>Add Your First State</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                {sortedNotifications.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {sortedNotifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 ${!notification.read ? 'bg-accent/30' : 'hover:bg-accent/10'}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex">
                              <div className="mr-4 mt-0.5">
                                {notification.type === 'overdue' ? (
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                ) : notification.type === 'due-soon' ? (
                                  <Clock className="h-5 w-5 text-amber-500" />
                                ) : notification.type === 'update' ? (
                                  <ClipboardList className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Bell className="h-5 w-5 text-nurse-primary" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-medium">
                                    {notification.title}
                                    {!notification.read && (
                                      <Badge className="ml-2 bg-nurse-primary px-1.5 py-0.5 text-[10px]">
                                        NEW
                                      </Badge>
                                    )}
                                  </h3>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(notification.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mb-2">{notification.message}</p>
                                {notification.stateId && (
                                  <div className="mt-2">
                                    <Link to={`/states/${notification.stateId}`}>
                                      <Button variant="link" className="p-0 h-auto text-nurse-primary">
                                        Go to {notification.stateName} profile
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                      <p className="text-muted-foreground text-center">
                        You don't have any notifications for the {getFilterDisplayText()}.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="unread" className="mt-4 space-y-4">
                {sortedNotifications.length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {sortedNotifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className="p-4 bg-accent/30"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex">
                              <div className="mr-4 mt-0.5">
                                {notification.type === 'overdue' ? (
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                ) : notification.type === 'due-soon' ? (
                                  <Clock className="h-5 w-5 text-amber-500" />
                                ) : notification.type === 'update' ? (
                                  <ClipboardList className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Bell className="h-5 w-5 text-nurse-primary" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-medium">
                                    {notification.title}
                                    <Badge className="ml-2 bg-nurse-primary px-1.5 py-0.5 text-[10px]">
                                      NEW
                                    </Badge>
                                  </h3>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(notification.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mb-2">{notification.message}</p>
                                {notification.stateId && (
                                  <div className="mt-2">
                                    <Link to={`/states/${notification.stateId}`}>
                                      <Button variant="link" className="p-0 h-auto text-nurse-primary">
                                        Go to {notification.stateName} profile
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Unread Notifications</h3>
                      <p className="text-muted-foreground text-center">
                        You've caught up with all your notifications for the {getFilterDisplayText()}!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
            
            <Select 
              value={deadlineFilter} 
              onValueChange={(value) => setDeadlineFilter(value as '7days' | '2weeks' | '1month')}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Next 7 Days</SelectItem>
                <SelectItem value="2weeks">Next 2 Weeks</SelectItem>
                <SelectItem value="1month">Next Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                In a full application, this section would allow you to set up email notifications and reminder preferences. 
                Currently, notifications are generated for:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  Overdue tasks and deadlines
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Tasks due within 7 days
                </li>
                <li className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-nurse-primary" />
                  Initial response deadlines
                </li>
                <li className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-nurse-primary" />
                  General updates and compliance tips
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Notifications;
