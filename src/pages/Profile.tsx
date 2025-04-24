import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { License } from '@/types';
import { PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  primaryStateOfResidence: string;
}

const US_STATES = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' }
];

const LICENSE_TYPES = [
  'RN', 'LPN', 'NP/APRN', 'CNS', 'CRNA', 'CNM', 'PA', 'MD', 'DO', 'Other'
];

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    dateOfBirth: userProfile?.dateOfBirth || '',
    primaryStateOfResidence: userProfile?.primaryStateOfResidence || '',
  });
  
  const [licenses, setLicenses] = useState<License[]>(userProfile?.licenses || []);
  const [newLicense, setNewLicense] = useState<Partial<License>>({
    licenseType: '',
    licenseNumber: '',
    state: '',
    expirationDate: '',
    issuanceDate: '',
    status: 'active',
    isPrimary: false
  });
  
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [isAddingLicense, setIsAddingLicense] = useState(false);
  
  useEffect(() => {
    if (userProfile) {
      setPersonalInfo(prev => ({
        ...prev,
        ...userProfile
      }));
    }
  }, [userProfile]);

  const handleInputChange = (field: keyof typeof personalInfo, event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };
  
  const handleSavePersonalInfo = async () => {
    try {
      await updateUserProfile({
        ...userProfile,
        ...personalInfo
      });
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile changes. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewLicenseChange = (field: keyof License, value: string) => {
    setNewLicense(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddLicense = async () => {
    if (!newLicense.licenseNumber || !newLicense.licenseType || !newLicense.state) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required license fields (License Number, Type, and State).",
        variant: "destructive"
      });
      return;
    }
    
    const licenseId = `license-${Date.now()}`;
    const license: License = {
      id: licenseId,
      licenseNumber: newLicense.licenseNumber,
      licenseType: newLicense.licenseType,
      state: newLicense.state,
      expirationDate: newLicense.expirationDate || '',
      issuanceDate: newLicense.issuanceDate || '',
      status: newLicense.status as 'active' | 'inactive' | 'pending' | 'expired',
      isPrimary: licenses.length === 0 ? true : newLicense.isPrimary || false
    };

    const updatedLicenses = [...licenses, license];
    
    try {
      await updateUserProfile({
        ...userProfile,
        licenses: updatedLicenses
      });
      
      setLicenses(updatedLicenses);
      toast({
        title: "License Added",
        description: "Your new license has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save license. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditLicense = (licenseId: string) => {
    setEditingLicenseId(licenseId);
    const licenseToEdit = licenses.find(l => l.id === licenseId);
    if (licenseToEdit) {
      setNewLicense(licenseToEdit);
    }
  };
  
  const handleUpdateLicense = () => {
    if (!editingLicenseId) return;
    
    const updatedLicenses = licenses.map(license => 
      license.id === editingLicenseId 
        ? { ...license, ...newLicense, id: license.id } 
        : license
    );
    
    setLicenses(updatedLicenses);
    updateUserProfile({
      ...userProfile,
      licenses: updatedLicenses
    });
    
    setEditingLicenseId(null);
    setNewLicense({
      licenseType: '',
      licenseNumber: '',
      state: '',
      expirationDate: '',
      issuanceDate: '',
      status: 'active',
      isPrimary: false
    });
    
    toast({
      title: "License Updated",
      description: "The license information has been updated.",
    });
  };
  
  const handleDeleteLicense = (licenseId: string) => {
    const updatedLicenses = licenses.filter(license => license.id !== licenseId);
    
    // If we're deleting the primary license, make the first remaining one primary
    if (licenses.find(l => l.id === licenseId)?.isPrimary && updatedLicenses.length > 0) {
      updatedLicenses[0].isPrimary = true;
    }
    
    setLicenses(updatedLicenses);
    updateUserProfile({
      ...userProfile,
      licenses: updatedLicenses
    });
    
    toast({
      title: "License Removed",
      description: "The license has been removed from your profile.",
    });
  };
  
  const handleSetPrimaryLicense = (licenseId: string) => {
    const updatedLicenses = licenses.map(license => ({
      ...license,
      isPrimary: license.id === licenseId
    }));
    
    setLicenses(updatedLicenses);
    updateUserProfile({
      ...userProfile,
      licenses: updatedLicenses
    });
    
    toast({
      title: "Primary License Updated",
      description: "Your primary license has been updated.",
    });
  };
  
  const cancelLicenseEdit = () => {
    setEditingLicenseId(null);
    setIsAddingLicense(false);
    setNewLicense({
      licenseType: '',
      licenseNumber: '',
      state: '',
      expirationDate: '',
      issuanceDate: '',
      status: 'active',
      isPrimary: false
    });
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Tabs defaultValue="personal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={personalInfo.firstName} 
                    onChange={(e) => handleInputChange('firstName', e)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={personalInfo.lastName} 
                    onChange={(e) => handleInputChange('lastName', e)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={personalInfo.email} 
                    onChange={handleInputChange} 
                    disabled 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    value={personalInfo.phone} 
                    onChange={(e) => handleInputChange('phone', e)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth"
                    type="date" 
                    value={personalInfo.dateOfBirth} 
                    onChange={(e) => handleInputChange('dateOfBirth', e)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryStateOfResidence">Primary State of Residence</Label>
                  <Select 
                    value={personalInfo.primaryStateOfResidence} 
                    onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, primaryStateOfResidence: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state.abbreviation} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="licenses">
          <Card>
            <CardHeader>
              <CardTitle>Professional Licenses</CardTitle>
              <CardDescription>
                Manage your nursing and healthcare licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Existing Licenses */}
              {licenses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {licenses.map(license => (
                    <div key={license.id} className="border rounded-lg p-4">
                      {editingLicenseId === license.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="licenseType">License Type</Label>
                              <Select 
                                value={newLicense.licenseType} 
                                onValueChange={(value) => handleNewLicenseChange('licenseType', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select license type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {LICENSE_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="licenseNumber">License Number</Label>
                              <Input 
                                id="licenseNumber" 
                                value={newLicense.licenseNumber} 
                                onChange={(e) => handleNewLicenseChange('licenseNumber', e.target.value)} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Select 
                                value={newLicense.state} 
                                onValueChange={(value) => handleNewLicenseChange('state', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {US_STATES.map(state => (
                                    <SelectItem key={state.abbreviation} value={state.name}>
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select 
                                value={newLicense.status} 
                                onValueChange={(value) => handleNewLicenseChange('status', value as any)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="issuanceDate">Issuance Date</Label>
                              <Input 
                                id="issuanceDate" 
                                type="date" 
                                value={newLicense.issuanceDate} 
                                onChange={(e) => handleNewLicenseChange('issuanceDate', e.target.value)} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="expirationDate">Expiration Date</Label>
                              <Input 
                                id="expirationDate" 
                                type="date" 
                                value={newLicense.expirationDate} 
                                onChange={(e) => handleNewLicenseChange('expirationDate', e.target.value)} 
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button onClick={handleUpdateLicense}>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button variant="outline" onClick={cancelLicenseEdit}>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg flex items-center">
                                {license.licenseType} - {license.licenseNumber}
                                {license.isPrimary && (
                                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                    Primary
                                  </span>
                                )}
                              </h3>
                              <p className="text-muted-foreground">{license.state}</p>
                              <div className="mt-2 text-sm">
                                <p>Status: <span className="font-medium">{license.status}</span></p>
                                {license.issuanceDate && (
                                  <p>Issued: <span className="font-medium">{new Date(license.issuanceDate).toLocaleDateString()}</span></p>
                                )}
                                {license.expirationDate && (
                                  <p>Expires: <span className="font-medium">{new Date(license.expirationDate).toLocaleDateString()}</span></p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {!license.isPrimary && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSetPrimaryLicense(license.id)}
                                >
                                  Set as Primary
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditLicense(license.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteLicense(license.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <p className="text-muted-foreground">No licenses added yet</p>
                </div>
              )}
              
              {/* Add New License */}
              {isAddingLicense ? (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Add New License</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseType">License Type</Label>
                        <Select 
                          value={newLicense.licenseType} 
                          onValueChange={(value) => handleNewLicenseChange('licenseType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                          <SelectContent>
                            {LICENSE_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input 
                          id="licenseNumber" 
                          value={newLicense.licenseNumber} 
                          onChange={(e) => handleNewLicenseChange('licenseNumber', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select 
                          value={newLicense.state} 
                          onValueChange={(value) => handleNewLicenseChange('state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map(state => (
                              <SelectItem key={state.abbreviation} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newLicense.status} 
                          onValueChange={(value) => handleNewLicenseChange('status', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issuanceDate">Issuance Date</Label>
                        <Input 
                          id="issuanceDate" 
                          type="date" 
                          value={newLicense.issuanceDate} 
                          onChange={(e) => handleNewLicenseChange('issuanceDate', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expirationDate">Expiration Date</Label>
                        <Input 
                          id="expirationDate" 
                          type="date" 
                          value={newLicense.expirationDate} 
                          onChange={(e) => handleNewLicenseChange('expirationDate', e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddLicense}>
                        <Save className="mr-2 h-4 w-4" />
                        Save License
                      </Button>
                      <Button variant="outline" onClick={cancelLicenseEdit}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingLicense(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New License
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userProfile?.email || ''} 
                  disabled 
                />
                <p className="text-sm text-muted-foreground">
                  Your email address is used for login and notifications
                </p>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="text-destructive border-destructive">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;






