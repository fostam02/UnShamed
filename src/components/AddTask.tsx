
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import TaskSelector from './TaskSelector';

const AddTask = () => {
  const { stateId } = useParams();
  const navigate = useNavigate();
  const { addComplianceItem, appState } = useAppContext();
  const { toast } = useToast();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!stateId) {
      toast({
        title: "Error",
        description: "State ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    // Check if state exists by looking it up in the appState
    const stateExists = appState.states.some(state => state.id === stateId);
    if (!stateExists) {
      toast({
        title: "Error",
        description: "State not found",
        variant: "destructive",
      });
      return;
    }
    
    addComplianceItem(stateId, {
      title: taskTitle,
      description,
      dueDate: dueDate.toISOString(),
      completed: false,
      priority: priority as 'low' | 'medium' | 'high',
    });
    
    toast({
      title: "Success",
      description: "Task added successfully",
    });
    
    navigate(`/state/${stateId}`);
  };
  
  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Compliance Task</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <TaskSelector 
              value={taskTitle} 
              onChange={setTaskTitle}
              id="taskTitle"
              className="w-full"
            />
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task details..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(`/state/${stateId}`)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTask;
