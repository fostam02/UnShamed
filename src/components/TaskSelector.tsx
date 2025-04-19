
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TASK_OPTIONS = [
  "BON Hearing or Meeting",
  "Orientation with Compliance Monitor",
  "Required CEU(s)",
  "Compliance Report (Self-Report)",
  "Compliance Report (Supervisor Report)",
  "Submission of Compliance",
  "Monetary Fee Payment",
  "Other"
];

interface TaskSelectorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ 
  value, 
  onChange, 
  id = "taskTitle",
  className = ""
}) => {
  const [selectedTaskType, setSelectedTaskType] = useState<string>(
    TASK_OPTIONS.includes(value) ? value : "Other"
  );
  const [customTaskTitle, setCustomTaskTitle] = useState<string>(
    !TASK_OPTIONS.includes(value) && value !== "Other" ? value : ""
  );

  useEffect(() => {
    // Update local state when value prop changes
    if (TASK_OPTIONS.includes(value)) {
      setSelectedTaskType(value);
      setCustomTaskTitle("");
    } else if (value) {
      setSelectedTaskType("Other");
      setCustomTaskTitle(value);
    }
  }, [value]);

  const handleTaskTypeChange = (newType: string) => {
    setSelectedTaskType(newType);
    if (newType !== "Other") {
      onChange(newType);
      setCustomTaskTitle("");
    } else {
      onChange(customTaskTitle || "Other");
    }
  };

  const handleCustomTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCustomTask = e.target.value;
    setCustomTaskTitle(newCustomTask);
    onChange(newCustomTask || "Other");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>Task Title</Label>
      <Select value={selectedTaskType} onValueChange={handleTaskTypeChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select a task type" />
        </SelectTrigger>
        <SelectContent>
          {TASK_OPTIONS.map((task) => (
            <SelectItem key={task} value={task}>
              {task}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedTaskType === "Other" && (
        <div className="mt-2">
          <Label htmlFor={`${id}-custom`}>Custom Task Title</Label>
          <Input
            id={`${id}-custom`}
            value={customTaskTitle}
            onChange={handleCustomTaskChange}
            placeholder="Enter custom task title"
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default TaskSelector;
