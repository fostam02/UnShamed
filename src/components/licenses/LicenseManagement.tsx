import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { License } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LicenseInfoRetriever from './LicenseInfoRetriever';
import { useLicenseExpiration } from '@/hooks/useLicenseExpiration';

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

const LICENSE_TYPES = [
  'Registered Nurse (RN)',
  'Licensed Practical Nurse (LPN)',
  'Nurse Practitioner (NP)',
  'Clinical Nurse Specialist (CNS)',
  'Certified Registered Nurse Anesthetist (CRNA)',
  'Certified Nurse-Midwife (CNM)',
  'Advanced Practice Registered Nurse (APRN)',
  'Licensed Vocational Nurse (LVN)',
  'Certified Nursing Assistant (CNA)',
  'Board of Pharmacy (BOP)',
  'Drug Enforcement Administration (DEA)',
  'Other'
];

const LicenseManagement: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { checkLicenses } = useLicenseExpiration();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<string | null>(null);
  const [licenseToEdit, setLicenseToEdit] = useState<License | null>(null);
  
  const [newLicense, setNewLicense] = useState({
    licenseNumber: '',
    licenseType: '',
    state: '',
    expirationDate: undefined as Date | undefined,
    issuanceDate: undefined as Date | undefined,
    status: 'active' as 'active' | 'inactive' | 'pending' | 'expired',
    isPrimary: false
  });
  
  const [editLicense, setEditLicense] = useState({
    licenseNumber: '',
    licenseType: '',
    state: '',
    expirationDate: undefined as Date | undefined,
    issuanceDate: undefined as Date | undefined,
    status: 'active' as 'active' | 'inactive' | 'pending' | 'expired',
    isPrimary: false
  });
  
  const handleLicenseChange = (field: string, value: string | Date | boolean) => {
    setNewLicense(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEditLicenseChange = (field: string, value: string | Date | boolean) => {
    setEditLicense(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const openEditDialog = (license: License) => {
    setLicenseToEdit(license);
    setEditLicense({
      licenseNumber: license.licenseNumber,
      licenseType: license.licenseType,
      state: license.state,
      expirationDate: new Date(license.expirationDate),
      issuanceDate: license.issuanceDate ? new Date(license.issuanceDate) : undefined,
      status: license.status as 'active' | 'inactive' | 'pending' | 'expired',
      isPrimary: license.isPrimary
    });
    setIsEditDialogOpen(true);
  };
  
  const saveEditedLicense = () => {
    if (!licenseToEdit) return;
    
    if (!editLicense.licenseNumber || !editLicense.licenseType || !editLicense.state || !editLicense.expirationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedLicenses = userProfile?.licenses.map(license => {
      if (license.id === licenseToEdit.id) {
        return {
          ...license,
          licenseNumber: editLicense.licenseNumber,
          licenseType: editLicense.licenseType,
          state: editLicense.state,
          expirationDate: editLicense.expirationDate.toISOString(),
          issuanceDate: editLicense.issuanceDate ? editLicense.issuanceDate.toISOString() : license.issuanceDate,
          status: editLicense.status,
          isPrimary: editLicense.isPrimary
        };
      }
      
      if (editLicense.isPrimary && license.id !== licenseToEdit.id) {
        return {
          ...license,
          isPrimary: false
        };
      }
      
      return license;
    }) || [];
    
    updateUserProfile({
      licenses: updatedLicenses
    });
    
    setIsEditDialogOpen(false);
    setLicenseToEdit(null);
    
    toast({
      title: "License Updated",
      description: `Your ${editLicense.licenseType} license has been updated.`
    });
  };
  
  const addLicense = () => {
    if (!newLicense.licenseNumber || !newLicense.licenseType || !newLicense.state || !newLicense.expirationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const license: License = {
      id: Date.now().toString(),
      licenseNumber: newLicense.licenseNumber,
      licenseType: newLicense.licenseType,
      state: newLicense.state,
      expirationDate: newLicense.expirationDate.toISOString(),
      issuanceDate: newLicense.issuanceDate ? newLicense.issuanceDate.toISOString() : new Date().toISOString(),
      status: newLicense.status,
      isPrimary: newLicense.isPrimary || (userProfile?.licenses.length === 0)
    };
    
    const updatedLicenses = [...(userProfile?.licenses || [])];
    
    if (license.isPrimary) {
      updatedLicenses.forEach(lic => {
        lic.isPrimary = false;
      });
    }
    
    updatedLicenses.push(license);
    
    updateUserProfile({
      licenses: updatedLicenses
    });
    
    checkLicenses([license]);
    
    setIsAddDialogOpen(false);
    setNewLicense({
      licenseNumber: '',
      licenseType: '',
      state: '',
      expirationDate: undefined,
      issuanceDate: undefined,
      status: 'active',
      isPrimary: false
    });
    
    toast({
      title: "License Added",
      description: `Your ${license.licenseType} license has been added.`
    });
  };
  
  const confirmDeleteLicense = (licenseId: string) => {
    setLicenseToDelete(licenseId);
  };
  
  const deleteLicense = () => {
    if (!licenseToDelete) return;
    
    const updatedLicenses = userProfile?.licenses.filter(license => license.id !== licenseToDelete) || [];
    
    if (userProfile?.licenses.find(l => l.id === licenseToDelete)?.isPrimary && updatedLicenses.length > 0) {
      updatedLicenses[0].isPrimary = true;
    }
    
    updateUserProfile({
      licenses: updatedLicenses
    });
    
    setLicenseToDelete(null);
    
    toast({
      title: "License Removed",
      description: "The license has been removed from your profile."
    });
  };
  
  const setAsPrimary = (licenseId: string) => {
    const updatedLicenses = userProfile?.licenses.map(license => ({
      ...license,
      isPrimary: license.id === licenseId
    })) || [];
    
    updateUserProfile({
      licenses: updatedLicenses
    });
    
    toast({
      title: "Primary License Updated",
      description: "Your primary license has been updated."
    });
  };
  
  useEffect(() => {
    if (userProfile?.licenses) {
      checkLicenses(userProfile.licenses);
    }
  }, [userProfile?.licenses]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Professional Licenses</CardTitle>
          <CardDescription>
            Manage your professional licenses and certifications
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New License</DialogTitle>
              <DialogDescription>
                Enter your professional license information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select 
                    value={newLicense.licenseType} 
                    onValueChange={(value) => handleLicenseChange('licenseType', value)}
                  >
                    <SelectTrigger id="licenseType">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="licenseState">State</Label>
                  <Select 
                    value={newLicense.state} 
                    onValueChange={(value) => handleLicenseChange('state', value)}
                  >
                    <SelectTrigger id="licenseState">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter license number"
                    value={newLicense.licenseNumber}
                    onChange={(e) => handleLicenseChange('licenseNumber', e.target.value)}
                  />
                  
                  <LicenseInfoRetriever
                    licenseNumber={newLicense.licenseNumber}
                    licenseType={newLicense.licenseType}
                    state={newLicense.state}
                    onLicenseInfoFound={(info) => {
                      if (info.expirationDate) {
                        handleLicenseChange('expirationDate', new Date(info.expirationDate));
                      }
                      if (info.issuanceDate) {
                        handleLicenseChange('issuanceDate', new Date(info.issuanceDate));
                      }
                      if (info.status) {
                        handleLicenseChange('status', info.status);
                      }
                    }}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newLicense.expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newLicense.expirationDate ? format(newLicense.expirationDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newLicense.expirationDate}
                        onSelect={(date) => handleLicenseChange('expirationDate', date!)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addLicense}>
                Add License
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {userProfile?.licenses && userProfile.licenses.length > 0 ? (
          <div className="space-y-4">
            {userProfile.licenses.map((license) => (
              <div key={license.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium flex items-center">
                    {license.licenseType}
                    {license.isPrimary && (
                      <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {license.state} - {license.licenseNumber}
                  </p>
                  <p className="text-sm">
                    Expires: {new Date(license.expirationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(license)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!license.isPrimary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setAsPrimary(license.id)}
                    >
                      Set as Primary
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove License</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this license?
                          {license.isPrimary && " This is your primary license."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => confirmDeleteLicense(license.id)}>
                          Remove License
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border rounded-md border-dashed">
            <p className="text-muted-foreground mb-4">You haven't added any professional licenses yet.</p>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First License
            </Button>
          </div>
        )}
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit License</DialogTitle>
            <DialogDescription>
              Update your professional license information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="editLicenseType">License Type</Label>
                <Select 
                  value={editLicense.licenseType} 
                  onValueChange={(value) => handleEditLicenseChange('licenseType', value)}
                >
                  <SelectTrigger id="editLicenseType">
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="editLicenseState">State</Label>
                <Select 
                  value={editLicense.state} 
                  onValueChange={(value) => handleEditLicenseChange('state', value)}
                >
                  <SelectTrigger id="editLicenseState">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="editLicenseNumber">License Number</Label>
                <Input
                  id="editLicenseNumber"
                  placeholder="Enter license number"
                  value={editLicense.licenseNumber}
                  onChange={(e) => handleEditLicenseChange('licenseNumber', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <Label>Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editLicense.expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editLicense.expirationDate ? format(editLicense.expirationDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editLicense.expirationDate}
                      onSelect={(date) => handleEditLicenseChange('expirationDate', date!)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="col-span-2">
                <Label>Status</Label>
                <Select 
                  value={editLicense.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'pending' | 'expired') => 
                    handleEditLicenseChange('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select license status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsPrimary"
                    checked={editLicense.isPrimary}
                    onChange={(e) => handleEditLicenseChange('isPrimary', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="editIsPrimary">Set as primary license</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedLicense}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={!!licenseToDelete} 
        onOpenChange={(open) => !open && setLicenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this license? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLicenseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteLicense}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default LicenseManagement;

