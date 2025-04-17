
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { CalendarIcon, FileText, Printer } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { PrintOptions, ComplianceItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ComplianceTasks = () => {
  const { appState } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const printSectionRef = useRef<HTMLDivElement>(null);
  
  const [filter, setFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Print options state
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    includeTotalTasks: true,
    includeOverdueTasks: true,
    includeDueSoonTasks: true,
    includeUpcomingTasks: true,
    includeCompletedTasks: false,
    futureDaysToInclude: 30,
    showFullTaskDetails: false
  });
  
  // Get all tasks from all states
  const allTasks = appState.states.flatMap(state => 
    state.complianceItems.map(task => ({
      ...task,
      stateName: state.name,
      stateAbbreviation: state.abbreviation
    }))
  );
  
  // Apply filters
  const filteredTasks = allTasks.filter(task => {
    // State filter
    if (stateFilter !== 'all' && task.stateId !== stateFilter) {
      return false;
    }
    
    // Status filter
    if (filter === 'completed' && !task.completed) {
      return false;
    } else if (filter === 'overdue' && (task.completed || new Date(task.dueDate) > new Date())) {
      return false;
    } else if (filter === 'upcoming' && (task.completed || new Date(task.dueDate) < new Date())) {
      return false;
    } else if (filter === 'dueSoon' && (task.completed || !isWithinNextWeek(task.dueDate))) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.stateName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOrder === 'stateName') {
      return a.stateName.localeCompare(b.stateName);
    } else if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return (
        (priorityOrder[a.priority || 'medium'] || 2) - 
        (priorityOrder[b.priority || 'medium'] || 2)
      );
    }
    return 0;
  });
  
  function isWithinNextWeek(dateString: string): boolean {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const date = new Date(dateString);
    return isAfter(date, today) && isBefore(date, nextWeek);
  }
  
  // Handle print button click
  const handlePrint = () => {
    if (printSectionRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = printSectionRef.current.innerHTML;
      
      document.body.innerHTML = `
        <div style="padding: 20px;">
          <h1 style="text-align: center; margin-bottom: 20px;">Compliance Tasks Report</h1>
          ${printContents}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      toast({
        title: "Print Error",
        description: "Unable to generate print view",
        variant: "destructive",
      });
    }
  };
  
  // Update print options
  const handlePrintOptionChange = (key: keyof PrintOptions, value: any) => {
    setPrintOptions(prev => ({ ...prev, [key]: value }));
  };
  
  // Group tasks by state for the report
  const tasksByState = sortedTasks.reduce((groups, item) => {
    const group = groups[item.stateId] || [];
    group.push(item);
    groups[item.stateId] = group;
    return groups;
  }, {} as Record<string, typeof sortedTasks>);
  
  // Stats for summary
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.completed).length;
  const overdueTasks = allTasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;
  const dueSoonTasks = allTasks.filter(task => 
    !task.completed && isWithinNextWeek(task.dueDate)
  ).length;
  
  // Generate the report
  const tasksReport = () => {
    // Get state name map for quick lookup
    const stateNameMap: Record<string, string> = {};
    appState.states.forEach(state => {
      stateNameMap[state.id] = state.name;
    });
    
    const overdueTasks = sortedTasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date()
    );
    
    const dueSoonTasks = sortedTasks.filter(task => 
      !task.completed && isWithinNextWeek(task.dueDate)
    );
    
    // Fix: Correctly filter upcoming tasks that are not completed, not due soon, and within the future days range
    const upcomingTasks = sortedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const futureCutoff = addDays(today, printOptions.futureDaysToInclude);
      
      return (
        !task.completed && 
        isAfter(dueDate, addDays(today, 7)) && // After the "due soon" period (1 week)
        isBefore(dueDate, futureCutoff) // Within the future days to include
      );
    });
    
    const completedTasks = sortedTasks.filter(task => task.completed);
    
    return (
      <div className="space-y-6 print:text-black">
        <div className="print:mb-6">
          <h2 className="text-xl font-bold mb-2">Compliance Report Summary</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-2xl font-bold">{totalTasks}</div>
              <div className="text-sm">Total Tasks</div>
            </div>
            <div className="bg-red-100 p-3 rounded-md">
              <div className="text-2xl font-bold">{overdueTasks.length}</div>
              <div className="text-sm">Overdue Tasks</div>
            </div>
            <div className="bg-amber-100 p-3 rounded-md">
              <div className="text-2xl font-bold">{dueSoonTasks.length}</div>
              <div className="text-sm">Due Soon (7 days)</div>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <div className="text-sm">Completed Tasks</div>
            </div>
          </div>
        </div>
        
        {/* Detailed Tasks Sections */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {printOptions.includeOverdueTasks && overdueTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2 text-red-600 border-b border-red-200 pb-1">
                Overdue Tasks ({overdueTasks.length})
              </h3>
              
              {/* Group by state */}
              {Object.entries(tasksByState).map(([stateId, stateTasks]) => {
                const overdueTasks = stateTasks.filter(task => 
                  !task.completed && new Date(task.dueDate) < new Date()
                );
                
                if (overdueTasks.length === 0) return null;
                
                return (
                  <div key={`overdue-${stateId}`} className="mb-4">
                    <h4 className="font-medium mb-1">{stateNameMap[stateId] || "Unknown State"}</h4>
                    <ul className="space-y-2 pl-5">
                      {overdueTasks.map(task => (
                        <li key={task.id} className="border-l-2 border-red-400 pl-2">
                          <div className="font-medium">{task.title}</div>
                          {printOptions.showFullTaskDetails ? (
                            <div className="text-sm space-y-1 mt-1">
                              <div>Description: {task.description}</div>
                              {task.priority && <div>Priority: {task.priority}</div>}
                              <div>Due Date: {format(new Date(task.dueDate), "PPP")}</div>
                              <div>Status: <span className="text-red-600 font-medium">Overdue</span></div>
                              {task.completionNote && <div>Completion Note: {task.completionNote}</div>}
                              {task.reopenReason && <div>Reopen Reason: {task.reopenReason}</div>}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Due: {format(new Date(task.dueDate), "PPP")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Due Soon Tasks */}
          {printOptions.includeDueSoonTasks && dueSoonTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2 text-amber-600 border-b border-amber-200 pb-1">
                Due Soon Tasks ({dueSoonTasks.length})
              </h3>
              
              {/* Group by state */}
              {Object.entries(tasksByState).map(([stateId, stateTasks]) => {
                const dueSoonTasks = stateTasks.filter(task => 
                  !task.completed && isWithinNextWeek(task.dueDate)
                );
                
                if (dueSoonTasks.length === 0) return null;
                
                return (
                  <div key={`duesoon-${stateId}`} className="mb-4">
                    <h4 className="font-medium mb-1">{stateNameMap[stateId] || "Unknown State"}</h4>
                    <ul className="space-y-2 pl-5">
                      {dueSoonTasks.map(task => (
                        <li key={task.id} className="border-l-2 border-amber-400 pl-2">
                          <div className="font-medium">{task.title}</div>
                          {printOptions.showFullTaskDetails ? (
                            <div className="text-sm space-y-1 mt-1">
                              <div>Description: {task.description}</div>
                              {task.priority && <div>Priority: {task.priority}</div>}
                              <div>Due Date: {format(new Date(task.dueDate), "PPP")}</div>
                              <div>Status: <span className="text-amber-600 font-medium">Due Soon</span></div>
                              {task.completionNote && <div>Completion Note: {task.completionNote}</div>}
                              {task.reopenReason && <div>Reopen Reason: {task.reopenReason}</div>}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Due: {format(new Date(task.dueDate), "PPP")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Upcoming Tasks */}
          {printOptions.includeUpcomingTasks && upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2 text-blue-600 border-b border-blue-200 pb-1">
                Upcoming Tasks ({upcomingTasks.length}) - Next {printOptions.futureDaysToInclude} days
              </h3>
              
              {/* Group by state */}
              {Object.entries(tasksByState).map(([stateId, stateTasks]) => {
                // Fix: Use the same filter logic as the upcomingTasks variable
                const upcomingStateTasks = stateTasks.filter(task => {
                  const dueDate = new Date(task.dueDate);
                  const today = new Date();
                  const futureCutoff = addDays(today, printOptions.futureDaysToInclude);
                  
                  return (
                    !task.completed && 
                    isAfter(dueDate, addDays(today, 7)) && // After the "due soon" period (1 week)
                    isBefore(dueDate, futureCutoff) // Within the future days to include
                  );
                });
                
                if (upcomingStateTasks.length === 0) return null;
                
                return (
                  <div key={`upcoming-${stateId}`} className="mb-4">
                    <h4 className="font-medium mb-1">{stateNameMap[stateId] || "Unknown State"}</h4>
                    <ul className="space-y-2 pl-5">
                      {upcomingStateTasks.map(task => (
                        <li key={task.id} className="border-l-2 border-blue-400 pl-2">
                          <div className="font-medium">{task.title}</div>
                          {printOptions.showFullTaskDetails ? (
                            <div className="text-sm space-y-1 mt-1">
                              <div>Description: {task.description}</div>
                              {task.priority && <div>Priority: {task.priority}</div>}
                              <div>Due Date: {format(new Date(task.dueDate), "PPP")}</div>
                              <div>Status: <span className="text-blue-600 font-medium">Upcoming</span></div>
                              {task.completionNote && <div>Completion Note: {task.completionNote}</div>}
                              {task.reopenReason && <div>Reopen Reason: {task.reopenReason}</div>}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Due: {format(new Date(task.dueDate), "PPP")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Completed Tasks */}
          {printOptions.includeCompletedTasks && completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2 text-green-600 border-b border-green-200 pb-1">
                Completed Tasks ({completedTasks.length})
              </h3>
              
              {/* Group by state */}
              {Object.entries(tasksByState).map(([stateId, stateTasks]) => {
                const completedStateTasks = stateTasks.filter(task => task.completed);
                
                if (completedStateTasks.length === 0) return null;
                
                return (
                  <div key={`completed-${stateId}`} className="mb-4">
                    <h4 className="font-medium mb-1">{stateNameMap[stateId] || "Unknown State"}</h4>
                    <ul className="space-y-2 pl-5">
                      {completedStateTasks.map(task => (
                        <li key={task.id} className="border-l-2 border-green-400 pl-2">
                          <div className="font-medium">{task.title}</div>
                          {printOptions.showFullTaskDetails ? (
                            <div className="text-sm space-y-1 mt-1">
                              <div>Description: {task.description}</div>
                              {task.priority && <div>Priority: {task.priority}</div>}
                              <div>Due Date: {format(new Date(task.dueDate), "PPP")}</div>
                              <div>Status: <span className="text-green-600 font-medium">Completed</span></div>
                              {task.completionNote && <div>Completion Note: {task.completionNote}</div>}
                              {task.reopenReason && <div>Reopen Reason: {task.reopenReason}</div>}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Due: {format(new Date(task.dueDate), "PPP")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Compliance Tasks</h1>
          <p className="text-muted-foreground">
            Track and manage your compliance requirements
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={() => navigate('/add-task')} size="sm">
            Add New Task
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter and sort your compliance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="dueSoon">Due Soon</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {appState.states.map(state => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name} ({state.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="stateName">State Name</SelectItem>
                    <SelectItem value="title">Task Title</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-2">Print Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeTotalTasks" 
                      checked={printOptions.includeTotalTasks}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('includeTotalTasks', !!checked)
                      }
                    />
                    <Label htmlFor="includeTotalTasks">Include Total Tasks Summary</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeOverdueTasks" 
                      checked={printOptions.includeOverdueTasks}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('includeOverdueTasks', !!checked)
                      }
                    />
                    <Label htmlFor="includeOverdueTasks">Include Overdue Tasks</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeDueSoonTasks" 
                      checked={printOptions.includeDueSoonTasks}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('includeDueSoonTasks', !!checked)
                      }
                    />
                    <Label htmlFor="includeDueSoonTasks">Include Due Soon Tasks</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeUpcomingTasks" 
                      checked={printOptions.includeUpcomingTasks}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('includeUpcomingTasks', !!checked)
                      }
                    />
                    <Label htmlFor="includeUpcomingTasks">Include Upcoming Tasks</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeCompletedTasks" 
                      checked={printOptions.includeCompletedTasks}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('includeCompletedTasks', !!checked)
                      }
                    />
                    <Label htmlFor="includeCompletedTasks">Include Completed Tasks</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="futureDays" className="block mb-1">
                      Future days to include: {printOptions.futureDaysToInclude}
                    </Label>
                    <Input 
                      id="futureDays"
                      type="range"
                      min="7"
                      max="90"
                      value={printOptions.futureDaysToInclude}
                      onChange={(e) => 
                        handlePrintOptionChange('futureDaysToInclude', parseInt(e.target.value))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showFullTaskDetails" 
                      checked={printOptions.showFullTaskDetails}
                      onCheckedChange={(checked) => 
                        handlePrintOptionChange('showFullTaskDetails', !!checked)
                      }
                    />
                    <Label htmlFor="showFullTaskDetails">Show Full Task Details</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Task List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {sortedTasks.length} tasks found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedTasks.length > 0 ? (
                <div className="space-y-4">
                  {sortedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/states/${task.stateId}/tasks/${task.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        {task.priority && (
                          <Badge className={
                            task.priority === 'high' ? 'bg-red-500' : 
                            task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                          }>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {format(new Date(task.dueDate), "PP")}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{task.stateName}</span>
                        </div>
                        
                        <Badge variant={task.completed ? "outline" : "secondary"}>
                          {task.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks found matching your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Hidden print section */}
      <div className="hidden">
        <div ref={printSectionRef} className="p-4">
          {tasksReport()}
        </div>
      </div>
    </div>
  );
};

export default ComplianceTasks;
