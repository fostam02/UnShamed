
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

const GENDER_IDENTITIES = [
  "Man", "Woman", "Non-binary", "Transgender Man", "Transgender Woman", 
  "Genderqueer", "Genderfluid", "Agender", "Two-Spirit", "Prefer not to say", "Other"
];

const RACES = [
  "American Indian or Alaska Native", "Asian", "Black or African American", 
  "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", 
  "White", "Two or more races", "Other", "Prefer not to say"
];

const CreateProfile = () => {
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    sexAssignedAtBirth: '' as 'male' | 'female' | 'other' | '',
    genderIdentity: '',
    race: '',
    phone: '',
    consentToShare: false,
    primaryStateOfResidence: '',
    licenses: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure sexAssignedAtBirth is one of the allowed values
    const sexAssignedAtBirth = formData.sexAssignedAtBirth || undefined;
    
    updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      sexAssignedAtBirth: sexAssignedAtBirth as 'male' | 'female' | 'other' | undefined,
      genderIdentity: formData.genderIdentity,
      race: formData.race,
      primaryStateOfResidence: formData.primaryStateOfResidence,
      consentToShare: formData.consentToShare,
      isProfileComplete: true
    });
    
    toast({
      title: "Profile Created",
      description: "Your profile has been successfully created."
    });
    
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>
            Fill out your personal information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  type="date" 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <Label>Sex Assigned at Birth</Label>
                <RadioGroup 
                  defaultValue={formData.sexAssignedAtBirth}
                  onValueChange={(value) => handleSelectChange('sexAssignedAtBirth', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="genderIdentity">Gender Identity</Label>
                <Select 
                  value={formData.genderIdentity} 
                  onValueChange={(value) => handleSelectChange('genderIdentity', value)}
                >
                  <SelectTrigger id="genderIdentity" className="w-full">
                    <SelectValue placeholder="Select gender identity" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {GENDER_IDENTITIES.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="race">Race</Label>
                <Select 
                  value={formData.race} 
                  onValueChange={(value) => handleSelectChange('race', value)}
                >
                  <SelectTrigger id="race" className="w-full">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {RACES.map((race) => (
                      <SelectItem key={race} value={race}>
                        {race}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentToShare"
                  name="consentToShare"
                  checked={formData.consentToShare}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consentToShare: !!checked }))}
                />
                <Label htmlFor="consentToShare" className="cursor-pointer">
                  I consent to share my demographic information to help UnShamed fight racial disparities, 
                  discrimination, and systemic bias by identifying patterns of inequity
                </Label>
              </div>
              <Button type="submit">Create Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProfile;
