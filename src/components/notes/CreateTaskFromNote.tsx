
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface CreateTaskFromNoteProps {
  stateId: string;
  note: Note;
  onTaskCreated: () => void;
  onCancel: () => void;
}

const CreateTaskFromNote: React.FC<CreateTaskFromNoteProps> = ({ 
  stateId, 
  note, 
  onTaskCreated, 
  onCancel 
}) => {
  const { addComplianceItem, updateNote } = useAppContext();
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState('medium');

  const handleCreateTask = () => {
    if (!taskTitle || !dueDate) {
      return; // Validation handled by form
    }

    // Create new compliance item
    const newTask = {
      title: taskTitle,
      description: `Task created from note: ${note.content}`,
      dueDate: dueDate.toISOString(),
      completed: false,
      priority: priority as 'low' | 'medium' | 'high',
    };

    addComplianceItem(stateId, newTask);

    // Update the note to reference the task
    updateNote(stateId, note.id, {
      hasDueDate: true,
      dueDate: dueDate.toISOString(),
      taskId: `compliance-${Date.now()}` // This matches how tasks are created in addComplianceItem
    });

    onTaskCreated();
  };

  return (
    <div className="mt-4 p-4 border border-primary/20 rounded-md bg-accent">
      <h4 className="font-medium mb-4">Create Task from Note</h4>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taskTitle">Task Title</Label>
          <Input
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
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
            <PopoverContent className="w-auto p-0">
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
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} disabled={!taskTitle || !dueDate}>
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskFromNote;
