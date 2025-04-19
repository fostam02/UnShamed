import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusCircle,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowRight,
  BarChart3,
  ListChecks,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { appState } = useAppContext();
  const { userProfile } = useAuth();

  // Count states
  const stateCount = appState.states.length;

  // Count compliance items
  const complianceItems = appState.states.flatMap(state => state.complianceItems);
  const completedItems = complianceItems.filter(item => item.completed).length;
  const pendingItems = complianceItems.filter(item => !item.completed).length;

  // Get upcoming deadlines (next 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingDeadlines = complianceItems
    .filter(item => {
      if (item.completed) return false;
      const dueDate = new Date(item.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Mock notifications
  const unreadNotifications = 3;

  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate days until due
  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.firstName || 'User'}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/add-state">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add State
            </Link>
          </Button>
        </div>
      </div>

      {stateCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No States Added Yet</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your first state to start tracking your compliance requirements across different jurisdictions.
            </p>
            <Button asChild>
              <Link to="/add-state">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First State
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                States
              </CardTitle>
              <div className="text-2xl font-bold">{stateCount}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stateCount === 1
                  ? 'You are tracking 1 state'
                  : `You are tracking ${stateCount} states`}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/">
                  View All States
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Tasks
              </CardTitle>
              <div className="text-2xl font-bold">{complianceItems.length}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>{completedItems} completed</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  <span>{pendingItems} pending</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/tasks')}>
                View All Tasks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Notifications
              </CardTitle>
              <div className="text-2xl font-bold">{unreadNotifications}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {unreadNotifications === 1
                  ? 'You have 1 unread notification'
                  : `You have ${unreadNotifications} unread notifications`}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/notifications">
                  View Notifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Tasks due in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0, 5).map(item => {
                    const state = appState.states.find(s => s.id === item.stateId);
                    return (
                      <div key={item.id} className="flex items-start">
                        <div className="mr-4 mt-0.5">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.title}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {getDaysUntilDue(item.dueDate)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {state?.name || 'Unknown State'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {formatDate(item.dueDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-muted-foreground">No upcoming deadlines for the next 7 days</p>
                </div>
              )}
            </CardContent>
            {upcomingDeadlines.length > 5 && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/tasks')}>
                  View All Deadlines
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/add-state">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New State
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/profile">
                  <FileText className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  View Notifications
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/audit-log">
                  <ListChecks className="mr-2 h-4 w-4" />
                  View Audit Log
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}




