
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, ClipboardList, FileText, Plus, User, FileCheck } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { License } from '@/types';
import StateCardActions from '@/components/states/StateCardActions';

export const StateProfiles = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();
  const { userProfile } = useAuth();
  const { states } = appState;
  
  console.log('StateProfiles render:', { states, userProfile });

  const handleAddReciprocalState = () => {
    // Navigate with query parameter to indicate this is a reciprocal state
    navigate('/add-state?type=reciprocal');
  };

  // Function to get license details by ID
  const getLicenseById = (licenseId: string): License | undefined => {
    return userProfile?.licenses?.find(license => license.id === licenseId);
  };

  // Function to get all licenses associated with a state
  const getLicensesByStateId = (stateId: string): License[] => {
    if (!userProfile?.licenses) return [];
    
    const state = states.find(s => s.id === stateId);
    if (!state || !state.associatedLicenseId) return [];
    
    // Check if the associatedLicenseId is a comma-separated string of IDs
    if (state.associatedLicenseId.includes(',')) {
      const licenseIds = state.associatedLicenseId.split(',');
      return licenseIds
        .map(id => userProfile.licenses?.find(license => license.id === id.trim()))
        .filter((license): license is License => license !== undefined);
    } else {
      // Handle single license case
      const license = getLicenseById(state.associatedLicenseId);
      return license ? [license] : [];
    }
  };

  // Function to get the primary contact name for a state
  const getPrimaryContactName = (state: any) => {
    if (state.complianceMonitor?.name) {
      return {
        name: state.complianceMonitor.name,
        role: 'Compliance Monitor'
      };
    } else if (state.complianceMonitor?.monitorName) {
      return {
        name: state.complianceMonitor.monitorName,
        role: 'Compliance Monitor'
      };
    } else if (state.investigator?.name) {
      return {
        name: state.investigator.name,
        role: 'Investigator'
      };
    }
    return null;
  };

  // Function to render the license information
  const renderLicenseInfo = (licenses: License[]) => {
    if (licenses.length === 0) return null;

    return (
      <div className="mt-3 border-t pt-3">
        {licenses.map(license => (
          <div key={license.id} className="flex items-center text-sm mb-1 last:mb-0">
            <FileCheck className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-medium">
              {license.licenseType}: {license.licenseNumber}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">State Profiles</h1>
        <Link to="/add-state">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add State
          </Button>
        </Link>
      </div>

      {states.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No States Added Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start by adding the original state where disciplinary action was initiated.
            </p>
            <Link to="/add-state">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First State
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Original State of Discipline</CardTitle>
            </CardHeader>
            <CardContent>
              {states.filter(state => state.isOriginalState).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {states
                    .filter(state => state.isOriginalState)
                    .map(state => {
                      const totalTasks = state.complianceItems.length;
                      const completedTasks = state.complianceItems.filter(item => item.completed).length;
                      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                      const associatedLicenses = getLicensesByStateId(state.id);
                      const primaryContact = getPrimaryContactName(state);
                      
                      return (
                        <div key={state.id} className="relative">
                          <StateCardActions 
                            stateId={state.id} 
                            stateName={state.name}
                            isReciprocal={false}
                          />
                          <Link to={`/state/${state.id}`}>
                            <div className="border rounded-lg p-4 hover:bg-accent/40 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{state.name}</h3>
                                  <Badge className="mt-1">Original</Badge>
                                </div>
                                <div className="text-3xl font-bold text-nurse-primary">{state.abbreviation}</div>
                              </div>
                              
                              {renderLicenseInfo(associatedLicenses)}
                              
                              <div className="space-y-3 mt-4">
                                {primaryContact && (
                                  <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">{primaryContact.role}:</span>
                                    <span className="font-medium">{primaryContact.name}</span>
                                  </div>
                                )}
                                
                                {state.initialResponseDueDate && (
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">Response Due:</span>
                                    <span className="font-medium">
                                      {new Date(state.initialResponseDueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center text-sm">
                                  <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-muted-foreground mr-1">Tasks:</span>
                                  <span className="font-medium">
                                    {completedTasks}/{totalTasks} Completed
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No original state added yet.</p>
                  <Link to="/add-state">
                    <Button>Add Original State</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reciprocal States</CardTitle>
            </CardHeader>
            <CardContent>
              {states.filter(state => !state.isOriginalState).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {states
                    .filter(state => !state.isOriginalState)
                    .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation))
                    .map(state => {
                      const totalTasks = state.complianceItems.length;
                      const completedTasks = state.complianceItems.filter(item => item.completed).length;
                      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                      const associatedLicenses = getLicensesByStateId(state.id);
                      const primaryContact = getPrimaryContactName(state);
                      
                      return (
                        <div key={state.id} className="relative">
                          <StateCardActions 
                            stateId={state.id} 
                            stateName={state.name}
                            isReciprocal={true}
                          />
                          <Link to={`/state/${state.id}`}>
                            <div className="border rounded-lg p-4 hover:bg-accent/40 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{state.name}</h3>
                                  <Badge variant="outline" className="mt-1">Reciprocal</Badge>
                                </div>
                                <div className="text-3xl font-bold text-nurse-secondary">{state.abbreviation}</div>
                              </div>
                              
                              {renderLicenseInfo(associatedLicenses)}
                              
                              <div className="space-y-3 mt-4">
                                {primaryContact && (
                                  <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">{primaryContact.role}:</span>
                                    <span className="font-medium">{primaryContact.name}</span>
                                  </div>
                                )}
                                
                                {state.initialResponseDueDate && (
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-muted-foreground mr-1">Response Due:</span>
                                    <span className="font-medium">
                                      {new Date(state.initialResponseDueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-center text-sm">
                                  <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-muted-foreground mr-1">Tasks:</span>
                                  <span className="font-medium">
                                    {completedTasks}/{totalTasks} Completed
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No reciprocal states added yet.</p>
                  <Button 
                    onClick={handleAddReciprocalState} 
                    className="bg-nurse-secondary hover:bg-nurse-secondary/90"
                  >
                    Add Reciprocal State
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StateProfiles;




