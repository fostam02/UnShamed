
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { DisciplinaryDetailsForm } from './DisciplinaryDetailsForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface DisciplinaryDetailsSectionProps {
  stateId: string;
}

export function DisciplinaryDetailsSection({ stateId }: DisciplinaryDetailsSectionProps) {
  const { appState } = useAppContext();
  
  // Find the selected state
  const state = appState.states.find(state => state.id === stateId);
  
  if (!state) {
    return (
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Error</CardTitle>
          </div>
          <CardDescription>
            Could not find the selected state. Please select a state from the dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // If this is not an original state, show an informational message
  if (!state.isOriginalState) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-info" />
            <CardTitle>Reciprocal State</CardTitle>
          </div>
          <CardDescription>
            Disciplinary details are only applicable to original states. This is a reciprocal state that is under discipline due to action in the original state.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Disciplinary Details</h2>
      <p className="text-muted-foreground">
        This information helps us better understand your experience and support you through this process.
      </p>
      
      <DisciplinaryDetailsForm 
        stateId={stateId} 
        existingDetails={state.disciplinaryDetails}
      />
    </div>
  );
}
