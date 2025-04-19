
import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Note } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow, format } from 'date-fns';
import { FileText, Calendar, Trash, PlusCircle, Printer, Clock } from 'lucide-react';
import CreateTaskFromNote from './CreateTaskFromNote';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface NotesLogProps {
  stateId: string;
}

const NotesLog: React.FC<NotesLogProps> = ({ stateId }) => {
  const { appState, addNote, removeNote } = useAppContext();
  const { toast } = useToast();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showCreateTask, setShowCreateTask] = useState<string | null>(null);
  const printableContentRef = useRef<HTMLDivElement>(null);
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());

  const stateNotes = appState.states.find(s => s.id === stateId)?.notes || [];
  const stateName = appState.states.find(s => s.id === stateId)?.name || 'State';

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const noteDate = useCustomDate && customDate ? customDate.toISOString() : new Date().toISOString();

    addNote(stateId, {
      content: newNoteContent,
      createdAt: noteDate,
      createdBy: "Current User", // This would be replaced with the actual user in a real app
    });

    setNewNoteContent('');
    
    toast({
      title: "Success",
      description: "Note added successfully",
    });
  };

  const handleRemoveNote = (noteId: string) => {
    removeNote(stateId, noteId);
    
    toast({
      title: "Success",
      description: "Note removed successfully",
    });
  };

  const handleShowCreateTask = (noteId: string) => {
    setShowCreateTask(noteId === showCreateTask ? null : noteId);
  };

  const handleTaskCreated = () => {
    setShowCreateTask(null);
    
    toast({
      title: "Success",
      description: "Task created from note",
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the printable content
    const printableContent = printableContentRef.current;
    if (!printableContent) return;
    
    // Create a new document with proper print styling
    printWindow.document.write(`
      <html>
        <head>
          <title>Disciplinary Notes for ${stateName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.5;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 10px;
            }
            .note {
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #ddd;
              page-break-inside: avoid;
            }
            .note-date {
              font-size: 0.8em;
              color: #666;
              margin-bottom: 5px;
            }
            .note-content {
              white-space: pre-wrap;
            }
            .task-indicator {
              font-size: 0.8em;
              color: #0066cc;
              margin-top: 5px;
            }
            @media print {
              .header { margin-bottom: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Disciplinary Notes for ${stateName}</h1>
            <p>Printed on ${new Date().toLocaleDateString()}</p>
          </div>
          ${printableContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Notes Log
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="print:hidden"
            title="Print notes"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2 print:hidden">
            <Textarea
              placeholder="Add a new note about your case..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="custom-date"
                checked={useCustomDate}
                onCheckedChange={setUseCustomDate}
              />
              <Label htmlFor="custom-date" className="cursor-pointer">
                Use custom date (for late entry)
              </Label>
            </div>
            
            {useCustomDate && (
              <div className="mb-2">
                <Label className="text-sm mb-1 block">Select date and time:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mb-2",
                        !customDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {customDate ? format(customDate, "PPP p") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
                    <CalendarComponent
                      mode="single"
                      selected={customDate}
                      onSelect={(date) => {
                        // Preserve time from existing date if available
                        if (date && customDate) {
                          const newDate = new Date(date);
                          newDate.setHours(customDate.getHours());
                          newDate.setMinutes(customDate.getMinutes());
                          setCustomDate(newDate);
                        } else {
                          setCustomDate(date);
                        }
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto bg-white dark:bg-gray-800 border")}
                    />
                    {customDate && (
                      <div className="p-3 border-t border-border bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="time-input">Time:</Label>
                          <input
                            id="time-input"
                            type="time"
                            className="px-2 py-1 border rounded bg-white dark:bg-gray-700"
                            value={customDate ? `${String(customDate.getHours()).padStart(2, '0')}:${String(customDate.getMinutes()).padStart(2, '0')}` : ''}
                            onChange={(e) => {
                              if (customDate && e.target.value) {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = new Date(customDate);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                setCustomDate(newDate);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <Button onClick={handleAddNote} className="w-full">
              Add Note
            </Button>
          </div>

          <div className="space-y-4 mt-6">
            {stateNotes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No notes yet. Add your first note above.</p>
            ) : (
              <div>
                {/* Visible notes for regular viewing */}
                <div className="space-y-4">
                  {stateNotes.map((note: Note) => (
                    <div key={note.id} className="p-4 border rounded-md space-y-2 print:break-inside-avoid">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(note.createdAt), 'MMMM d, yyyy - h:mm a')}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 print:hidden">
                          {!note.taskId && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleShowCreateTask(note.id)}
                              title="Create task from this note"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveNote(note.id)}
                            title="Delete note"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      
                      {note.taskId && (
                        <div className="text-sm text-primary flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          Task created from this note
                        </div>
                      )}
                      
                      {showCreateTask === note.id && (
                        <CreateTaskFromNote 
                          stateId={stateId} 
                          note={note} 
                          onTaskCreated={handleTaskCreated} 
                          onCancel={() => setShowCreateTask(null)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Hidden div for printing purposes */}
                <div ref={printableContentRef} className="hidden">
                  {stateNotes.map((note: Note) => (
                    <div key={note.id} className="note">
                      <div className="note-date">
                        {format(new Date(note.createdAt), 'MMMM d, yyyy - h:mm a')}
                      </div>
                      <div className="note-content">{note.content}</div>
                      {note.taskId && (
                        <div className="task-indicator">
                          Task created from this note
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesLog;
