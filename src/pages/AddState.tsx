
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { StateProfile, License } from '@/types';
import { AlertCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const normalizeLicenseType = (licenseType: string): string => {
  const type = licenseType.toUpperCase();
  
  if (type === 'NP' || type === 'APRN') {
    return 'NP/APRN';
  }
  
  return type;
};

export const AddState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appState, addState } = useAppContext();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { states } = appState;
  
  const originalState = states.find(state => state.isOriginalState);
  const [availableLicenses, setAvailableLicenses] = useState<License[]>([]);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [licenseWarning, setLicenseWarning] = useState<string | null>(null);
  
  // Change from single license ID to array of license IDs
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [selectedStateName, setSelectedStateName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    status: 'active',
    description: '',
    isOriginalState: false,
    investigationNoticeDate: '',
    initialResponseDueDate: '',
    investigator: {
      name: '',
      phone: '',
      email: ''
    },
    supervisingProvider: {
      name: '',
      phone: '',
      email: ''
    },
    complianceMonitor: {
      name: '',
      phone: '',
      email: '',
      frequency: 'monthly',
      startDate: new Date().toISOString(),
    }
  });
  
  const [useSameProvider, setUseSameProvider] = useState(false);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stateType = queryParams.get('type');
    
    if (stateType === 'reciprocal') {
      setFormData(prev => ({
        ...prev,
        isOriginalState: false
      }));
    }
  }, [location.search]);
  
  useEffect(() => {
    if (useSameProvider && originalState && originalState.supervisingProvider) {
      setFormData(prev => ({
        ...prev,
        supervisingProvider: {
          name: originalState.supervisingProvider?.name || '',
          phone: originalState.supervisingProvider?.phone || '',
          email: originalState.supervisingProvider?.email || ''
        }
      }));
    }
  }, [useSameProvider, originalState]);
  
  useEffect(() => {
    if (userProfile?.licenses) {
      setAvailableLicenses(userProfile.licenses);
    }
  }, [userProfile?.licenses, states]);
  
  const handleLicenseSelect = (licenseId: string) => {
    // Don't allow licenses from different states
    const selectedLicense = availableLicenses.find(license => license.id === licenseId);
    if (!selectedLicense) return;
    
    const stateInfo = US_STATES.find(s => s.name === selectedLicense.state || s.abbreviation === selectedLicense.state);
    if (!stateInfo) return;
    
    if (selectedLicenses.length > 0) {
      const firstLicense = availableLicenses.find(license => license.id === selectedLicenses[0]);
      if (!firstLicense) return;
      
      const firstLicenseState = US_STATES.find(s => s.name === firstLicense.state || s.abbreviation === firstLicense.state);
      if (!firstLicenseState || firstLicenseState.name !== stateInfo.name) {
        setLicenseError(`You can only select multiple licenses from the same state. You already selected a license from ${firstLicenseState?.name || firstLicense.state}.`);
        return;
      }
    } else {
      // First license selection sets the state
      setFormData(prev => ({
        ...prev,
        name: stateInfo.name,
        abbreviation: stateInfo.abbreviation
      }));
      setSelectedStateName(stateInfo.name);
    }
    
    // Toggle selection
    if (selectedLicenses.includes(licenseId)) {
      setSelectedLicenses(prev => prev.filter(id => id !== licenseId));
    } else {
      setSelectedLicenses(prev => [...prev, licenseId]);
    }
    
    setLicenseWarning(null);
    setLicenseError(null);
    
    // Check if this state profile with these licenses already exists
    const existingStateWithSameLicenses = states.find(
      state => state.name === stateInfo.name &&
      state.associatedLicenseId &&
      selectedLicenses.some(id => id === state.associatedLicenseId)
    );
    
    if (existingStateWithSameLicenses) {
      setLicenseWarning(`You already have a ${stateInfo.name} profile associated with one or more of these licenses. Only create another profile if the board has given you separate compliance requirements.`);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isOriginalState: checked
    }));
  };
  
  const handleStateSelect = (stateName: string) => {
    const selectedState = US_STATES.find(state => state.name === stateName);
    if (selectedState) {
      setFormData(prev => ({
        ...prev,
        name: selectedState.name,
        abbreviation: selectedState.abbreviation
      }));
      
      setSelectedStateName(selectedState.name);
      setSelectedLicenses([]);
      setLicenseWarning(null);
      setLicenseError(null);
      
      // Find licenses for this state to suggest to the user
      const stateAbbreviation = selectedState.abbreviation;
      const matchingLicenses = availableLicenses.filter(
        license => license.state === selectedState.name || license.state === stateAbbreviation
      );
      
      if (matchingLicenses.length > 0) {
        // We don't auto-select any licenses, but let the user know they can select licenses
        setLicenseWarning(`You have ${matchingLicenses.length} license(s) for ${selectedState.name}. You can select multiple licenses if they are all from this state.`);
      }
    }
  };
  
  const handlePersonChange = (type: 'investigator' | 'supervisingProvider' | 'complianceMonitor', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  const handleSameProviderChange = (checked: boolean) => {
    setUseSameProvider(checked);
  };

  const handleRemoveLicense = (licenseId: string) => {
    setSelectedLicenses(prev => prev.filter(id => id !== licenseId));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (availableLicenses.length > 0 && selectedLicenses.length === 0) {
      setLicenseError("Please select at least one license to associate with this state profile");
      return;
    }
    
    if (licenseError) {
      return;
    }
    
    // Use the first selected license as the primary associated license ID
    const primaryLicenseId = selectedLicenses[0] || '';
    
    const newState: Omit<StateProfile, 'id'> = {
      name: formData.name,
      abbreviation: formData.abbreviation,
      description: formData.description,
      isOriginalState: formData.isOriginalState,
      investigationNoticeDate: formData.investigationNoticeDate,
      initialResponseDueDate: formData.initialResponseDueDate,
      associatedLicenseId: primaryLicenseId,
      investigator: {
        name: formData.investigator.name,
        phone: formData.investigator.phone,
        email: formData.investigator.email
      },
      complianceItems: [],
      documents: [],
      auditLog: [],
      disciplinaryDetails: null,
      complianceMonitor: {
        monitorName: formData.complianceMonitor.name,
        monitorEmail: formData.complianceMonitor.email,
        frequency: formData.complianceMonitor.frequency,
        startDate: formData.complianceMonitor.startDate,
        name: formData.complianceMonitor.name,
        email: formData.complianceMonitor.email,
        phone: formData.complianceMonitor.phone
      },
      supervisingProvider: {
        name: formData.supervisingProvider.name,
        phone: formData.supervisingProvider.phone,
        email: formData.supervisingProvider.email
      }
    };
    
    // To support multiple licenses, we can either:
    // 1. Create separate state profiles for each license (not ideal)
    // 2. Store all selected license IDs in the first state profile (better approach)
    
    // For now, we'll store just the first license in associatedLicenseId
    // In the future, we could extend the StateProfile type to include an array of associatedLicenseIds
    
    addState(newState);
    
    toast({
      title: 'State Added',
      description: `${formData.name} has been added successfully with ${selectedLicenses.length} associated license(s).`
    });
    
    navigate('/states');
  };

  // Get licenses that match the selected state
  const getFilteredLicenses = () => {
    if (!selectedStateName) return availableLicenses;
    
    return availableLicenses.filter(license => {
      const licenseState = license.state;
      return US_STATES.some(state => 
        (state.name === selectedStateName || state.abbreviation === selectedStateName) && 
        (licenseState === state.name || licenseState === state.abbreviation)
      );
    });
  };
  
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New State</h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        {userProfile?.licenses && userProfile.licenses.length > 0 ? (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Associated Licenses:
            </label>
            
            {/* Selected licenses display */}
            {selectedLicenses.length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-sm text-muted-foreground">Selected licenses:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLicenses.map(licenseId => {
                    const license = availableLicenses.find(l => l.id === licenseId);
                    if (!license) return null;
                    return (
                      <div key={licenseId} className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>{license.state} - {license.licenseType} ({license.licenseNumber})</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-1 ml-1" 
                          onClick={() => handleRemoveLicense(licenseId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* License selection */}
            <div className="border rounded-md p-3">
              <p className="text-sm mb-2">Add licenses from {selectedStateName || "a state"}</p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {getFilteredLicenses().length > 0 ? (
                  getFilteredLicenses().map((license) => (
                    <div key={license.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`license-${license.id}`}
                        checked={selectedLicenses.includes(license.id)}
                        onCheckedChange={() => handleLicenseSelect(license.id)}
                      />
                      <label 
                        htmlFor={`license-${license.id}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {license.state} - {license.licenseType} ({license.licenseNumber})
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {selectedStateName 
                      ? `No licenses found for ${selectedStateName}` 
                      : "Select a state to see available licenses"}
                  </div>
                )}
              </div>
            </div>
            
            {licenseError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{licenseError}</AlertDescription>
              </Alert>
            )}
            {licenseWarning && (
              <Alert className="mt-2 border-yellow-500 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-700">Warning</AlertTitle>
                <AlertDescription className="text-yellow-700">{licenseWarning}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Licenses Found</AlertTitle>
            <AlertDescription>
              You don't have any licenses added to your profile. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={() => navigate('/profile')}
              >
                Add licenses in your profile settings
              </Button>
            </AlertDescription>
          </Alert>
        )}
      
        <div className="mb-4">
          <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
            State:
          </label>
          <Select value={formData.name} onValueChange={handleStateSelect} disabled={selectedLicenses.length > 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.abbreviation} value={state.name}>
                  {state.name} ({state.abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLicenses.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              State is determined by your selected licenses
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
          />
        </div>
        
        <div className="mb-4 flex items-center">
          <Checkbox 
            id="isOriginalState" 
            checked={formData.isOriginalState}
            onCheckedChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="isOriginalState" className="text-sm">
            Is Original State
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="investigationNoticeDate" className="block text-gray-700 text-sm font-bold mb-2">
            Investigation Notice Date:
          </label>
          <input
            type="date"
            id="investigationNoticeDate"
            name="investigationNoticeDate"
            value={formData.investigationNoticeDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="initialResponseDueDate" className="block text-gray-700 text-sm font-bold mb-2">
            Initial Response Due Date:
          </label>
          <input
            type="date"
            id="initialResponseDueDate"
            name="initialResponseDueDate"
            value={formData.initialResponseDueDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-2">Investigator Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="investigatorName" className="block text-sm font-medium mb-1">
                Investigator Name
              </label>
              <Input
                id="investigatorName"
                placeholder="Enter investigator name"
                value={formData.investigator.name}
                onChange={(e) => handlePersonChange('investigator', 'name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="investigatorPhone" className="block text-sm font-medium mb-1">
                Investigator Phone
              </label>
              <Input
                id="investigatorPhone" 
                placeholder="Enter investigator phone"
                value={formData.investigator.phone}
                onChange={(e) => handlePersonChange('investigator', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="investigatorEmail" className="block text-sm font-medium mb-1">
                Investigator Email
              </label>
              <Input
                id="investigatorEmail"
                type="email"
                placeholder="Enter investigator email"
                value={formData.investigator.email}
                onChange={(e) => handlePersonChange('investigator', 'email', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-2">Supervising Provider Information</h3>
          
          {!formData.isOriginalState && originalState && originalState.supervisingProvider && (
            <div className="mb-3 flex items-center">
              <Checkbox 
                id="useSameProvider" 
                checked={useSameProvider}
                onCheckedChange={handleSameProviderChange}
                className="mr-2"
              />
              <label htmlFor="useSameProvider" className="text-sm">
                Use same provider as Original State
              </label>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supervisingProviderName" className="block text-sm font-medium mb-1">
                Provider Name
              </label>
              <Input
                id="supervisingProviderName"
                placeholder="Enter provider name"
                value={formData.supervisingProvider.name}
                onChange={(e) => handlePersonChange('supervisingProvider', 'name', e.target.value)}
                disabled={useSameProvider}
              />
            </div>
            <div>
              <label htmlFor="supervisingProviderPhone" className="block text-sm font-medium mb-1">
                Provider Phone
              </label>
              <Input
                id="supervisingProviderPhone" 
                placeholder="Enter provider phone"
                value={formData.supervisingProvider.phone}
                onChange={(e) => handlePersonChange('supervisingProvider', 'phone', e.target.value)}
                disabled={useSameProvider}
              />
            </div>
            <div>
              <label htmlFor="supervisingProviderEmail" className="block text-sm font-medium mb-1">
                Provider Email
              </label>
              <Input
                id="supervisingProviderEmail"
                type="email"
                placeholder="Enter provider email"
                value={formData.supervisingProvider.email}
                onChange={(e) => handlePersonChange('supervisingProvider', 'email', e.target.value)}
                disabled={useSameProvider}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-2">Compliance Monitor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complianceMonitorName" className="block text-sm font-medium mb-1">
                Monitor Name
              </label>
              <Input
                id="complianceMonitorName"
                placeholder="Enter monitor name"
                value={formData.complianceMonitor.name}
                onChange={(e) => handlePersonChange('complianceMonitor', 'name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complianceMonitorPhone" className="block text-sm font-medium mb-1">
                Monitor Phone
              </label>
              <Input
                id="complianceMonitorPhone" 
                placeholder="Enter monitor phone"
                value={formData.complianceMonitor.phone}
                onChange={(e) => handlePersonChange('complianceMonitor', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complianceMonitorEmail" className="block text-sm font-medium mb-1">
                Monitor Email
              </label>
              <Input
                id="complianceMonitorEmail"
                type="email"
                placeholder="Enter monitor email"
                value={formData.complianceMonitor.email}
                onChange={(e) => handlePersonChange('complianceMonitor', 'email', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button type="submit">
            Add State
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/states')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddState;


