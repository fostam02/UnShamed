
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, UserX, Users, Pencil } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Delegate {
  id: string;
  email: string;
  name: string;
  accessLevel: 'view' | 'manage';
  dateAdded: string;
}

const DelegateManagement = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  // In a real implementation, this would come from the backend
  const [delegates, setDelegates] = useState<Delegate[]>(() => {
    const savedDelegates = localStorage.getItem('nurseDelegates');
    return savedDelegates ? JSON.parse(savedDelegates) : [];
  });
  
  const [newDelegateEmail, setNewDelegateEmail] = useState('');
  const [newDelegateName, setNewDelegateName] = useState('');
  const [newDelegateAccess, setNewDelegateAccess] = useState<'view' | 'manage'>('view');
  
  // Edit delegate state
  const [editDelegateId, setEditDelegateId] = useState<string | null>(null);
  const [editDelegateName, setEditDelegateName] = useState('');
  const [editDelegateEmail, setEditDelegateEmail] = useState('');
  const [editDelegateAccess, setEditDelegateAccess] = useState<'view' | 'manage'>('view');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const addDelegate = () => {
    if (!newDelegateEmail || !newDelegateName) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and email for the delegate.",
        variant: "destructive",
      });
      return;
    }
    
    const newDelegate: Delegate = {
      id: `delegate-${Date.now()}`,
      email: newDelegateEmail,
      name: newDelegateName,
      accessLevel: newDelegateAccess,
      dateAdded: new Date().toISOString(),
    };
    
    const updatedDelegates = [...delegates, newDelegate];
    setDelegates(updatedDelegates);
    localStorage.setItem('nurseDelegates', JSON.stringify(updatedDelegates));
    
    // Reset form
    setNewDelegateEmail('');
    setNewDelegateName('');
    setNewDelegateAccess('view');
    
    toast({
      title: "Delegate Added",
      description: `${newDelegateName} has been added as a delegate.`,
    });
  };
  
  const removeDelegate = (id: string) => {
    const updatedDelegates = delegates.filter(delegate => delegate.id !== id);
    setDelegates(updatedDelegates);
    localStorage.setItem('nurseDelegates', JSON.stringify(updatedDelegates));
    
    toast({
      title: "Delegate Removed",
      description: "The delegate has been removed from your account.",
    });
  };
  
  const openEditDialog = (delegate: Delegate) => {
    setEditDelegateId(delegate.id);
    setEditDelegateName(delegate.name);
    setEditDelegateEmail(delegate.email);
    setEditDelegateAccess(delegate.accessLevel);
    setIsEditDialogOpen(true);
  };
  
  const saveEditedDelegate = () => {
    if (!editDelegateId || !editDelegateName || !editDelegateEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and email for the delegate.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedDelegates = delegates.map(delegate => 
      delegate.id === editDelegateId 
        ? {
            ...delegate,
            name: editDelegateName,
            email: editDelegateEmail,
            accessLevel: editDelegateAccess
          }
        : delegate
    );
    
    setDelegates(updatedDelegates);
    localStorage.setItem('nurseDelegates', JSON.stringify(updatedDelegates));
    
    // Reset form and close dialog
    setIsEditDialogOpen(false);
    setEditDelegateId(null);
    
    toast({
      title: "Delegate Updated",
      description: `${editDelegateName}'s information has been updated.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Delegate Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Manage Delegates
          </CardTitle>
          <CardDescription>
            Give trusted individuals limited access to manage your compliance tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="delegateName" className="block text-sm font-medium mb-1">
                Delegate Name
              </label>
              <Input
                id="delegateName"
                placeholder="John Doe"
                value={newDelegateName}
                onChange={(e) => setNewDelegateName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="delegateEmail" className="block text-sm font-medium mb-1">
                Delegate Email
              </label>
              <Input
                id="delegateEmail"
                type="email"
                placeholder="delegate@example.com"
                value={newDelegateEmail}
                onChange={(e) => setNewDelegateEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="accessLevel" className="block text-sm font-medium mb-1">
              Access Level
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="view"
                  name="accessLevel"
                  value="view"
                  checked={newDelegateAccess === 'view'}
                  onChange={() => setNewDelegateAccess('view')}
                  className="mr-2"
                />
                <label htmlFor="view">View Only</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manage"
                  name="accessLevel"
                  value="manage"
                  checked={newDelegateAccess === 'manage'}
                  onChange={() => setNewDelegateAccess('manage')}
                  className="mr-2"
                />
                <label htmlFor="manage">Full Management</label>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              View Only: Can view tasks and documents<br />
              Full Management: Can add, edit, and complete tasks
            </p>
          </div>
          
          <Button onClick={addDelegate} className="w-full md:w-auto" type="button">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Delegate
          </Button>
        </CardContent>
      </Card>
      
      {delegates.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Delegates</CardTitle>
            <CardDescription>
              People who currently have access to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delegates.map((delegate) => (
                <div key={delegate.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{delegate.name}</h3>
                    <p className="text-sm text-muted-foreground">{delegate.email}</p>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {delegate.accessLevel === 'view' ? 'View Only' : 'Full Management'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(delegate)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <UserX className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Delegate</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {delegate.name} as a delegate? 
                            They will lose all access to your account immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeDelegate(delegate.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Delegates Added</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't added any delegates yet. Add a delegate to give someone limited access to your account.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Edit Delegate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delegate</DialogTitle>
            <DialogDescription>
              Update the delegate's information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="editDelegateName" className="block text-sm font-medium mb-1">
                Delegate Name
              </label>
              <Input
                id="editDelegateName"
                placeholder="John Doe"
                value={editDelegateName}
                onChange={(e) => setEditDelegateName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="editDelegateEmail" className="block text-sm font-medium mb-1">
                Delegate Email
              </label>
              <Input
                id="editDelegateEmail"
                type="email"
                placeholder="delegate@example.com"
                value={editDelegateEmail}
                onChange={(e) => setEditDelegateEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="editAccessLevel" className="block text-sm font-medium mb-1">
                Access Level
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="editView"
                    name="editAccessLevel"
                    value="view"
                    checked={editDelegateAccess === 'view'}
                    onChange={() => setEditDelegateAccess('view')}
                    className="mr-2"
                  />
                  <label htmlFor="editView">View Only</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="editManage"
                    name="editAccessLevel"
                    value="manage"
                    checked={editDelegateAccess === 'manage'}
                    onChange={() => setEditDelegateAccess('manage')}
                    className="mr-2"
                  />
                  <label htmlFor="editManage">Full Management</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedDelegate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DelegateManagement;
