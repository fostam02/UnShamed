import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { DisciplinaryDetailsSection } from '@/components/disciplinary/DisciplinaryDetailsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import EditStateForm from '@/components/states/EditStateForm';
import { useToast } from '@/hooks/use-toast';
import DeleteStateDialog from '@/components/states/DeleteStateDialog';
import NotesLog from '@/components/notes/NotesLog';
import DocumentsSection from '@/components/documents/DocumentsSection';

const StateDetail = () => {
  const { stateId } = useParams<{ stateId: string }>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const isEditing = searchParams.get('edit') === 'true';
  const { appState, setSelectedState, updateState, removeState } = useAppContext();
  const [activeTab, setActiveTab] = useState(tabParam || 'tasks');
  const [showEditDialog, setShowEditDialog] = useState(isEditing);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (stateId) {
      setSelectedState(stateId);
    }
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    setShowEditDialog(isEditing);
    
    return () => {
      setSelectedState(null);
    };
  }, [stateId, tabParam, isEditing, setSelectedState]);
  
  const state = appState.states.find((s) => s.id === stateId);
  
  if (!state) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>State Not Found</CardTitle>
            <CardDescription>The state you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/states">
              <Button>Back to State Profiles</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    navigate(`/state/${stateId}`);
  };

  const handleSaveState = (updatedState: any) => {
    updateState(stateId, updatedState);
    toast({
      title: "State Updated",
      description: `${state.name} has been updated successfully.`,
      variant: "default",
    });
    handleCloseEditDialog();
  };

  const handleOpenEditDialog = () => {
    setShowEditDialog(true);
    navigate(`/state/${stateId}?edit=true`);
  };

  const handleDelete = () => {
    removeState(stateId);
    toast({
      title: "State Deleted",
      description: `${state.name} has been deleted successfully.`,
      variant: "default",
    });
    navigate('/states');
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{state.name}</h1>
          <p className="text-muted-foreground">{state.description || 'No description available.'}</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={handleOpenEditDialog} variant="outline" className="flex items-center">
            <Pencil className="h-4 w-4 mr-2" />
            Edit State
          </Button>
          <Button 
            onClick={() => setShowDeleteDialog(true)} 
            variant="outline" 
            className="flex items-center text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete State
          </Button>
          <Link to={`/states/${stateId}/add-task`}>
            <Button>Add Task</Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="audits">Audit Log</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <div className="grid grid-cols-1 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Compliance Tasks</h3>
              {state.complianceItems.length > 0 ? (
                <div className="space-y-4">
                  {state.complianceItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Due: </span>
                            <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No compliance tasks yet. Add some tasks to get started.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          {stateId && <DocumentsSection stateId={stateId} />}
        </TabsContent>
        
        <TabsContent value="notes">
          {stateId && <NotesLog stateId={stateId} />}
        </TabsContent>
        
        <TabsContent value="audits">
          <div className="grid grid-cols-1 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Audit Log</h3>
              {state.auditLog.length > 0 ? (
                <div className="space-y-4">
                  {state.auditLog.map((entry) => (
                    <div key={entry.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{entry.action}</h4>
                          <p className="text-sm">{entry.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        By: {entry.user}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No audit log entries yet.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="disciplinary">
          {stateId && <DisciplinaryDetailsSection stateId={stateId} />}
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          navigate(`/state/${stateId}`);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {state.name}</DialogTitle>
            <DialogDescription>
              Make changes to the state profile information below.
            </DialogDescription>
          </DialogHeader>
          <EditStateForm 
            state={state} 
            onSave={handleSaveState} 
            onCancel={handleCloseEditDialog} 
          />
        </DialogContent>
      </Dialog>

      <DeleteStateDialog
        stateName={state.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDelete}
        isReciprocal={!state.isOriginalState}
      />
    </div>
  );
};

export default StateDetail;
