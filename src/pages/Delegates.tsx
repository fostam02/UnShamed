import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Users, 
  Mail, 
  Phone, 
  User, 
  Shield, 
  Clock, 
  FileText, 
  Trash2, 
  Edit, 
  Save, 
  X 
} from 'lucide-react';

// Mock delegate data - in a real app, this would come from a backend
const mockDelegates = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    role: 'attorney',
    permissions: {
      viewDocuments: true,
      uploadDocuments: true,
      editProfile: false,
      manageCompliance: true
    },
    states: ['all']
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 987-6543',
    role: 'assistant',
    permissions: {
      viewDocuments: true,
      uploadDocuments: true,
      editProfile: true,
      manageCompliance: false
    },
    states: ['state-123', 'state-456']
  }
];

const Delegates = () => {
  const { appState } = useAppContext();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [delegates, setDelegates] = useState(mockDelegates);
  const [isAddingDelegate, setIsAddingDelegate] = useState(false);
  const [editingDelegateId, setEditingDelegateId] = useState<string | null>(null);
  
  const [newDelegate, setNewDelegate] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'assistant',
    permissions: {
      viewDocuments: true,
      uploadDocuments: false,
      editProfile: false,
      manageCompliance: false
    },
    states: ['all']
  });
  
  const handleDelegateChange = (field: string, value: any) => {
    setNewDelegate(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    setNewDelegate(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };
  
  const handleStateSelection = (stateId: string) => {
    setNewDelegate(prev => {
      // If "all" is selected, clear other selections
      if (stateId === 'all') {
        return {
          ...prev,
          states: ['all']
        };
      }
      
      // If a specific state is selected, remove "all" if present
      const newStates = prev.states.includes('all')
        ? [stateId]
        : prev.states.includes(stateId)
          ? prev.states.filter(id => id !== stateId)
          : [...prev.states, stateId];
          
      return {
        ...prev,
        states: newStates.length === 0 ? ['all'] : newStates
      };
    });
  };
  
  const handleAddDelegate = () => {
    if (!newDelegate.name || !newDelegate.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and email for the delegate.",
        variant: "destructive"
      });
      return;
    }
    
    const delegateId = `delegate-${Date.now()}`;
    const delegate = {
      ...newDelegate,
      id: delegateId
    };
    
    setDelegates(prev => [...prev, delegate]);
    
    setIsAddingDelegate(false);
    setNewDelegate({
      name: '',
      email: '',
      phone: '',
      role: 'assistant',
      permissions: {
        viewDocuments: true,
        uploadDocuments: false,
        editProfile: false,
        manageCompliance: false
      },
      states: ['all']
    });
    
    toast({
      title: "Delegate Added",
      description: `${delegate.name} has been added as a delegate.`,
    });
  };
  
  const handleEditDelegate = (delegateId: string) => {
    const delegateToEdit = delegates.find(d => d.id === delegateId);
    if (delegateToEdit) {
      setNewDelegate(delegateToEdit);
      setEditingDelegateId(delegateId);
    }
  };
  
  const handleUpdateDelegate = () => {
    if (!editingDelegateId) return;
    
    const updatedDelegates = delegates.map(delegate => 
      delegate.id === editingDelegateId 
        ? { ...newDelegate, id: delegate.id } 
        : delegate
    );
    
    setDelegates(updatedDelegates);
    
    setEditingDelegateId(null);
    setNewDelegate({
      name: '',
      email: '',
      phone: '',
      role: 'assistant',
      permissions: {
        viewDocuments: true,
        uploadDocuments: false,
        editProfile: false,
        manageCompliance: false
      },
      states: ['all']
    });
    
    toast({
      title: "Delegate Updated",
      description: "The delegate information has been updated.",
    });
  };
  
  const handleDeleteDelegate = (delegateId: string) => {
    setDelegates(prev => prev.filter(delegate => delegate.id !== delegateId));
    
    toast({
      title: "Delegate Removed",
      description: "The delegate has been removed.",
    });
  };
  
  const cancelDelegateEdit = () => {
    setEditingDelegateId(null);
    setIsAddingDelegate(false);
    setNewDelegate({
      name: '',
      email: '',
      phone: '',
      role: 'assistant',
      permissions: {
        viewDocuments: true,
        uploadDocuments: false,
        editProfile: false,
        manageCompliance: false
      },
      states: ['all']
    });
  };
  
  const getStateName = (stateId: string) => {
    if (stateId === 'all') return 'All States';
    const state = appState.states.find(s => s.id === stateId);
    return state ? state.name : 'Unknown State';
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'attorney': return 'Attorney';
      case 'assistant': return 'Assistant';
      case 'family': return 'Family Member';
      case 'colleague': return 'Colleague';
      default: return 'Other';
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Delegates</h1>
        {!isAddingDelegate && !editingDelegateId && (
          <Button onClick={() => setIsAddingDelegate(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Delegate
          </Button>
        )}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About Delegates</CardTitle>
          <CardDescription>
            Delegates are people you authorize to help manage your compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Delegates can be attorneys, family members, or colleagues who help you manage your 
            compliance requirements. You can control what each delegate can access and which 
            states they can help with.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 mr-3 mt-0.5 text-nurse-primary" />
              <div>
                <h3 className="font-medium">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  Delegates can only access what you explicitly grant permission for.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 mt-0.5 text-nurse-primary" />
              <div>
                <h3 className="font-medium">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  Let trusted people help you stay on top of compliance requirements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Delegate Form */}
      {(isAddingDelegate || editingDelegateId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingDelegateId ? 'Edit Delegate' : 'Add New Delegate'}</CardTitle>
            <CardDescription>
              {editingDelegateId 
                ? 'Update the delegate information and permissions' 
                : 'Enter information about the person you want to add as a delegate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Basic Information</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="states">State Access</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter delegate's name" 
                      value={newDelegate.name}
                      onChange={(e) => handleDelegateChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter delegate's email" 
                      value={newDelegate.email}
                      onChange={(e) => handleDelegateChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter delegate's phone" 
                      value={newDelegate.phone}
                      onChange={(e) => handleDelegateChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={newDelegate.role} 
                      onValueChange={(value) => handleDelegateChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attorney">Attorney</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="viewDocuments" className="block mb-1">View Documents</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow delegate to view your uploaded documents
                      </p>
                    </div>
                    <Switch 
                      id="viewDocuments" 
                      checked={newDelegate.permissions.viewDocuments}
                      onCheckedChange={(checked) => handlePermissionChange('viewDocuments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="uploadDocuments" className="block mb-1">Upload Documents</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow delegate to upload documents on your behalf
                      </p>
                    </div>
                    <Switch 
                      id="uploadDocuments" 
                      checked={newDelegate.permissions.uploadDocuments}
                      onCheckedChange={(checked) => handlePermissionChange('uploadDocuments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="editProfile" className="block mb-1">Edit Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow delegate to edit your profile information
                      </p>
                    </div>
                    <Switch 
                      id="editProfile" 
                      checked={newDelegate.permissions.editProfile}
                      onCheckedChange={(checked) => handlePermissionChange('editProfile', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="manageCompliance" className="block mb-1">Manage Compliance</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow delegate to mark compliance tasks as complete
                      </p>
                    </div>
                    <Switch 
                      id="manageCompliance" 
                      checked={newDelegate.permissions.manageCompliance}
                      onCheckedChange={(checked) => handlePermissionChange('manageCompliance', checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="states" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allStates" 
                      checked={newDelegate.states.includes('all')}
                      onCheckedChange={() => handleStateSelection('all')}
                    />
                    <Label htmlFor="allStates">Access to All States</Label>
                  </div>
                  
                  {!newDelegate.states.includes('all') && (
                    <div className="mt-4">
                      <Label className="block mb-2">Select Specific States</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                        {appState.states.map(state => (
                          <div key={state.id} className="flex items-center space-x-2">
                            <Switch 
                              id={`state-${state.id}`} 
                              checked={newDelegate.states.includes(state.id)}
                              onCheckedChange={() => handleStateSelection(state.id)}
                            />
                            <Label htmlFor={`state-${state.id}`}>{state.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-2 mt-6">
              {editingDelegateId ? (
                <Button onClick={handleUpdateDelegate}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Delegate
                </Button>
              ) : (
                <Button onClick={handleAddDelegate}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Delegate
                </Button>
              )}
              <Button variant="outline" onClick={cancelDelegateEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Delegates List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Delegates</CardTitle>
          <CardDescription>
            People who can help manage your compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {delegates.length > 0 ? (
            <div className="space-y-4">
              {delegates.map(delegate => (
                <div key={delegate.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 mr-2 text-nurse-primary" />
                        <h3 className="font-semibold text-lg">{delegate.name}</h3>
                        <span className="ml-2 text-xs bg-accent px-2 py-1 rounded-full">
                          {getRoleLabel(delegate.role)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{delegate.email}</span>
                        </div>
                        {delegate.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{delegate.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {delegate.permissions.viewDocuments && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              View Documents
                            </span>
                          )}
                          {delegate.permissions.uploadDocuments && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Upload Documents
                            </span>
                          )}
                          {delegate.permissions.editProfile && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Edit Profile
                            </span>
                          )}
                          {delegate.permissions.manageCompliance && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              Manage Compliance
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-sm font-medium mt-3">State Access:</h4>
                        <div className="flex flex-wrap gap-2">
                          {delegate.states.includes('all') ? (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                              All States
                            </span>
                          ) : (
                            delegate.states.map(stateId => (
                              <span key={stateId} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                {getStateName(stateId)}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditDelegate(delegate.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteDelegate(delegate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Delegates Added</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any delegates yet. Delegates can help you manage your compliance requirements.
              </p>
              <Button onClick={() => setIsAddingDelegate(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Delegate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Delegates;
