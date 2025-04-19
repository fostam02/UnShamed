
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, Pencil, Save, User, UserPlus, UserX, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LicenseManagement from '@/components/licenses/LicenseManagement';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  sexAssignedAtBirth: z.enum(["male", "female", "other"], {
    required_error: "Sex assigned at birth is required",
  }),
  genderIdentity: z.string().min(1, { message: "Gender identity is required" }),
  race: z.string().min(1, { message: "Race is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const GENDER_IDENTITIES = [
  "Man", "Woman", "Non-binary", "Transgender Man", "Transgender Woman", 
  "Genderqueer", "Genderfluid", "Agender", "Two-Spirit", "Prefer not to say", "Other"
];

const RACES = [
  "American Indian or Alaska Native", "Asian", "Black or African American", 
  "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", 
  "White", "Two or more races", "Other", "Prefer not to say"
];

interface Delegate {
  id: string;
  email: string;
  name: string;
  accessLevel: 'view' | 'manage';
  dateAdded: string;
}

const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [delegates, setDelegates] = useState<Delegate[]>(() => {
    const savedDelegates = localStorage.getItem('nurseDelegates');
    return savedDelegates ? JSON.parse(savedDelegates) : [];
  });
  const [newDelegateEmail, setNewDelegateEmail] = useState('');
  const [newDelegateName, setNewDelegateName] = useState('');
  const [newDelegateAccess, setNewDelegateAccess] = useState<'view' | 'manage'>('view');
  
  const [editDelegateId, setEditDelegateId] = useState<string | null>(null);
  const [editDelegateName, setEditDelegateName] = useState('');
  const [editDelegateEmail, setEditDelegateEmail] = useState('');
  const [editDelegateAccess, setEditDelegateAccess] = useState<'view' | 'manage'>('view');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const defaultValues: Partial<ProfileFormValues> = {
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    dateOfBirth: userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth) : undefined,
    sexAssignedAtBirth: (userProfile?.sexAssignedAtBirth as any) || undefined,
    genderIdentity: userProfile?.genderIdentity || "",
    race: userProfile?.race || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateUserProfile({
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString(),
    });
    
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved successfully."
    });
  };

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
    
    setIsEditDialogOpen(false);
    setEditDelegateId(null);
    
    toast({
      title: "Delegate Updated",
      description: `${editDelegateName}'s information has been updated.`,
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Personal Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="licenses">Professional Licenses</TabsTrigger>
          <TabsTrigger value="delegates">Delegates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details
                </CardDescription>
              </div>
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              placeholder="Enter your first name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              placeholder="Enter your last name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!isEditing}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sexAssignedAtBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sex Assigned at Birth</FormLabel>
                          <Select
                            disabled={!isEditing}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sex assigned at birth" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="genderIdentity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Identity</FormLabel>
                          <Select
                            disabled={!isEditing}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender identity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDER_IDENTITIES.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Race</FormLabel>
                          <Select
                            disabled={!isEditing}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select race" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RACES.map((race) => (
                                <SelectItem key={race} value={race}>
                                  {race}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              disabled={!isEditing} 
                              placeholder="Enter your email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              placeholder="Enter your phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="licenses">
          <LicenseManagement />
        </TabsContent>
        
        <TabsContent value="delegates">
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
            <Card className="mt-6">
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
            <Card className="mt-6">
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
        </TabsContent>
      </Tabs>
      
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

export default UserProfile;

