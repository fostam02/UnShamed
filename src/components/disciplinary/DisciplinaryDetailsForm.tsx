import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@/context/AppContext';
import { DisciplinaryDetails, StateProfile } from '@/types';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { 
  UploadCloud, 
  FileText, 
  Calendar, 
  FileCheck, 
  FileWarning, 
  ClipboardCheck,
  Shield,
  HeartPulse,
  AlertTriangle,
  Bandage
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type ViolationType = {
  id: string;
  label: string;
  description?: string;
};

const violationTypes: ViolationType[] = [
  { id: 'improper_documentation', label: 'Improper documentation' },
  { id: 'medication_error', label: 'Medication error' },
  { id: 'impairment', label: 'Impairment (drugs/alcohol)' },
  { id: 'mental_health', label: 'Mental health concerns' },
  { id: 'scope_of_practice', label: 'Working outside scope of practice' },
  { id: 'fraud', label: 'Fraud or falsification of records' },
  { id: 'sexual_boundary', label: 'Sexual boundary violation' },
  { id: 'social_media', label: 'Social media misuse' },
  { id: 'hipaa', label: 'HIPAA violation' },
  { id: 'criminal_charge', label: 'Criminal charge unrelated to practice' },
  { id: 'delegation_error', label: 'Delegation error' },
  { id: 'inappropriate_prescribing', label: 'Inappropriate prescribing' },
  { id: 'controlled_substances', label: 'Misuse of controlled substances (prescribing or personal use)' },
  { id: 'failure_to_report', label: 'Failure to report (e.g., abuse, colleague impairment)' },
  { id: 'neglect', label: 'Neglect of duty or abandonment of patient' },
  { id: 'invalid_license', label: 'Practicing without a valid or active license' },
  { id: 'failure_to_supervise', label: 'Failure to supervise (e.g., students or subordinate staff)' },
  { id: 'protocol_failure', label: 'Failure to follow institutional or state-specific protocols' },
  { id: 'misrepresentation', label: 'Misrepresentation of credentials or qualifications' },
  { id: 'conflict_of_interest', label: 'Conflict of interest or unethical financial relationships' },
  { id: 'unprofessional_conduct', label: 'Unprofessional conduct (general/undefined)' },
  { id: 'billing_fraud', label: 'Inaccurate billing or insurance fraud (e.g., Medicare fraud)' },
  { id: 'unapproved_treatments', label: 'Use of unapproved or experimental treatments' },
  { id: 'probation_violation', label: 'Violation of probation or terms of previous board discipline' },
  { id: 'cme_failure', label: 'Failure to maintain continuing education or CME requirements' },
  { id: 'other', label: 'Other' }
];

const outcomeOptions = [
  { value: 'reprimand', label: 'Reprimand' },
  { value: 'probation', label: 'Probation' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'revocation', label: 'Revocation' },
  { value: 'voluntary_surrender', label: 'Voluntary surrender' },
  { value: 'pending', label: 'Still pending' }
];

interface DisciplinaryDetailsFormProps {
  stateId: string;
  existingDetails?: DisciplinaryDetails | null;
  onComplete?: () => void;
}

export function DisciplinaryDetailsForm({ stateId, existingDetails, onComplete }: DisciplinaryDetailsFormProps) {
  const { appState, updateDisciplinaryDetails } = useAppContext();
  const { toast } = useToast();
  const [selectedViolations, setSelectedViolations] = useState<string[]>(
    existingDetails?.violationTypes || []
  );
  const [otherViolationText, setOtherViolationText] = useState<string>(
    existingDetails?.otherViolationType || ''
  );
  const [showOtherField, setShowOtherField] = useState<boolean>(
    selectedViolations.includes('other')
  );
  const [patientHarmOccurred, setPatientHarmOccurred] = useState<boolean>(
    existingDetails?.patientHarmOccurred || false
  );
  
  const form = useForm({
    defaultValues: {
      narrative: existingDetails?.narrative || '',
      reflection: existingDetails?.reflection || '',
      violationDescription: existingDetails?.violationDescription || '',
      outcome: existingDetails?.outcome || '',
      startDate: existingDetails?.startDate || '',
      durationMonths: existingDetails?.durationMonths || 0,
      otherViolationType: existingDetails?.otherViolationType || '',
      patientHarmOccurred: existingDetails?.patientHarmOccurred || false,
      patientHarmSeverity: existingDetails?.patientHarmSeverity || 'none',
      patientHarmDescription: existingDetails?.patientHarmDescription || '',
    },
  });

  const onSubmit = (data: any) => {
    const updatedDetails: DisciplinaryDetails = {
      ...data,
      violationTypes: selectedViolations,
      otherViolationType: otherViolationText,
      patientHarmOccurred: patientHarmOccurred,
    };

    updateDisciplinaryDetails(stateId, updatedDetails);
    
    toast({
      title: "Disciplinary details saved",
      description: "Your information has been saved securely.",
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleViolationToggle = (violationId: string) => {
    setSelectedViolations(prev => {
      if (prev.includes(violationId)) {
        const newList = prev.filter(id => id !== violationId);
        
        if (violationId === 'other') {
          setShowOtherField(false);
        }
        
        return newList;
      } else {
        const newList = [...prev, violationId];
        
        if (violationId === 'other') {
          setShowOtherField(true);
        }
        
        return newList;
      }
    });
  };

  const states = appState.states.map(state => ({
    value: state.abbreviation,
    label: state.name
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-accent/10">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Your story matters. This section helps us identify systemic patterns and offer better support 
            to others going through similar experiences. You are not alone.
          </p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Experience</CardTitle>
              <CardDescription>
                Share your story in a safe, supportive environment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="narrative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Story</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please share what happened, why you believe it happened, and any contributing factors (e.g., mental health, burnout, retaliation, systemic issues)."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us understand the full context of your experience.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reflection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reflection (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What would you have done differently (if anything)?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your insights can help others in similar situations.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Violation Details</CardTitle>
              <CardDescription>
                Information about the specific violation as recorded by your licensing board.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="violationDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exact wording of violation</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please enter the exact wording from the Board document"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Copy the verbatim text from your Board notification.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Upload Documents (Optional)</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOCX, JPG, PNG (MAX. 10MB)
                          </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" multiple />
                      </label>
                    </div>
                    <FormDescription>
                      Upload Board letters, settlement agreements, or other relevant documents.
                    </FormDescription>
                  </FormItem>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Violation Categories</CardTitle>
              <CardDescription>
                Select all categories that apply to your situation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {violationTypes.map((violation) => (
                  <div key={violation.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={violation.id}
                      checked={selectedViolations.includes(violation.id)}
                      onCheckedChange={() => handleViolationToggle(violation.id)}
                    />
                    <label
                      htmlFor={violation.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {violation.label}
                    </label>
                  </div>
                ))}
              </div>
              
              {showOtherField && (
                <div className="mt-4">
                  <FormItem>
                    <FormLabel>Please specify other violation type</FormLabel>
                    <Input
                      value={otherViolationText}
                      onChange={(e) => setOtherViolationText(e.target.value)}
                      placeholder="Please describe the violation type"
                    />
                  </FormItem>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-destructive" />
                Patient Harm Assessment
              </CardTitle>
              <CardDescription>
                This information helps us understand the impact of disciplinary incidents on patient outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="patient-harm"
                    checked={patientHarmOccurred}
                    onCheckedChange={setPatientHarmOccurred}
                  />
                  <label
                    htmlFor="patient-harm"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Was a patient harmed as a result of this incident?
                  </label>
                </div>

                {patientHarmOccurred && (
                  <>
                    <FormField
                      control={form.control}
                      name="patientHarmSeverity"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Severity of Patient Harm</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="minor" id="harm-minor" />
                                <label htmlFor="harm-minor" className="text-sm font-medium leading-none flex items-center gap-1">
                                  <Bandage className="h-4 w-4 text-amber-500" />
                                  Minor (temporary or minimal harm)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="harm-moderate" />
                                <label htmlFor="harm-moderate" className="text-sm font-medium leading-none flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                  Moderate (required additional treatment)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="severe" id="harm-severe" />
                                <label htmlFor="harm-severe" className="text-sm font-medium leading-none flex items-center gap-1">
                                  <Shield className="h-4 w-4 text-red-500" />
                                  Severe (permanent consequences)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="death" id="harm-death" />
                                <label htmlFor="harm-death" className="text-sm font-medium leading-none flex items-center gap-1">
                                  <HeartPulse className="h-4 w-4 text-red-700" />
                                  Death
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Select the level that best describes the outcome for the patient(s).
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="patientHarmDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe the patient harm</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide details about the nature of the harm and any context necessary for understanding the situation."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This information helps us understand patterns of harm and supports the development of preventative measures.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outcome</CardTitle>
              <CardDescription>
                Details about the disciplinary action taken.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disciplinary Outcome</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {outcomeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="durationMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter 0 if not applicable or still pending.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full md:w-auto">
            Save Disciplinary Details
          </Button>
        </form>
      </Form>
    </div>
  );
}
