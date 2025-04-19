
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ClipboardList, Scale, FileWarning, Hand, PillIcon, UserX, FileX, HeartPulse, Bandage, AlertTriangle, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Format labels to remove underscores and capitalize properly
const formatLabel = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get the appropriate icon for each violation type
const getViolationIcon = (type: string) => {
  switch (type) {
    case 'delegation_error':
      return <Hand className="h-4 w-4" />;
    case 'improper_documentation':
      return <FileX className="h-4 w-4" />;
    case 'unprofessional_conduct':
      return <UserX className="h-4 w-4" />;
    case 'failure_to_supervise':
      return <AlertCircle className="h-4 w-4" />;
    case 'inappropriate_prescribing':
      return <PillIcon className="h-4 w-4" />;
    default:
      return <FileWarning className="h-4 w-4" />;
  }
};

// Get the appropriate icon for patient harm severity
const getPatientHarmIcon = (severity: string) => {
  switch (severity) {
    case 'minor':
      return <Bandage className="h-4 w-4 text-amber-500" />;
    case 'moderate':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case 'severe':
      return <Shield className="h-4 w-4 text-red-500" />;
    case 'death':
      return <HeartPulse className="h-4 w-4 text-red-700" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const DisciplinaryDetails = () => {
  const { appState } = useAppContext();
  
  // Get original states with disciplinary details
  const originalStatesWithDisciplinary = appState.states.filter(state => 
    state.isOriginalState && 
    state.disciplinaryDetails && 
    Object.keys(state.disciplinaryDetails).length > 0
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Disciplinary Details</h1>
        <p className="text-muted-foreground mt-2">
          Review disciplinary records across original states.
        </p>
      </div>
      
      {originalStatesWithDisciplinary.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {originalStatesWithDisciplinary.map(state => (
            <Card key={state.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 bg-accent/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-primary" />
                    {state.name}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2">
                    Original State
                  </Badge>
                </div>
                <CardDescription>
                  {state.description || 'No description available.'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-4">
                {state.disciplinaryDetails && (
                  <div className="space-y-2">
                    {Object.entries(state.disciplinaryDetails)
                      .filter(([key]) => ['outcome', 'date'].includes(key))
                      .map(([key, value]) => {
                        let icon, colorClass;
                        switch(key) {
                          case 'outcome':
                            icon = <ClipboardList className="h-5 w-5 text-primary" />;
                            colorClass = "text-primary";
                            break;
                          case 'date':
                            icon = <AlertCircle className="h-5 w-5 text-muted-foreground" />;
                            colorClass = "text-muted-foreground";
                            break;
                        }

                        return (
                          <TooltipProvider key={key}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 bg-accent/30 p-3 rounded-md">
                                  {icon}
                                  <div>
                                    <span className={`font-medium ${colorClass}`}>
                                      {formatLabel(key)}:
                                    </span>
                                    <span className="ml-2">
                                      {Array.isArray(value) ? value.join(', ') : value}
                                    </span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {formatLabel(key)} details for {state.name}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    
                    {/* Display patient harm information */}
                    {state.disciplinaryDetails.patientHarmOccurred && (
                      <div className="bg-accent/30 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <HeartPulse className="h-5 w-5 text-destructive" />
                          <span className="font-medium text-destructive">Patient Harm:</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          {state.disciplinaryDetails.patientHarmSeverity && (
                            <div className="flex items-center gap-2">
                              {getPatientHarmIcon(state.disciplinaryDetails.patientHarmSeverity)}
                              <span className="text-sm">
                                Severity: {formatLabel(state.disciplinaryDetails.patientHarmSeverity)}
                              </span>
                            </div>
                          )}
                          {state.disciplinaryDetails.patientHarmDescription && (
                            <p className="text-sm text-muted-foreground">
                              "{state.disciplinaryDetails.patientHarmDescription}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Display violation types with better formatting */}
                    {state.disciplinaryDetails.violationTypes && (
                      <div className="bg-accent/30 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <FileWarning className="h-5 w-5 text-destructive" />
                          <span className="font-medium text-destructive">Violation Types:</span>
                        </div>
                        <div className="ml-7 flex flex-wrap gap-2">
                          {Array.isArray(state.disciplinaryDetails.violationTypes) && 
                           state.disciplinaryDetails.violationTypes.map((type, index) => (
                            <HoverCard key={index}>
                              <HoverCardTrigger asChild>
                                <Badge 
                                  variant="outline" 
                                  className="flex items-center gap-1 py-1 px-2 hover:bg-accent cursor-help"
                                >
                                  {getViolationIcon(type)}
                                  <span>{formatLabel(type)}</span>
                                </Badge>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{formatLabel(type)}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Disciplinary action taken for {formatLabel(type.toLowerCase())} 
                                      violations.
                                    </p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link 
                        to={`/state/${state.id}?tab=disciplinary`}
                        className="text-primary hover:underline inline-flex items-center text-sm"
                      >
                        <span>View full details</span>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle>No Disciplinary Records</CardTitle>
            </div>
            <CardDescription>
              There are currently no disciplinary records for any original states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Disciplinary records will appear here once they are added to original state profiles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DisciplinaryDetails;
