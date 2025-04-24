import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const StateDetails = () => {
  console.log('StateDetails component rendering');
  const { stateId } = useParams();
  const { appState } = useAppContext();
  const navigate = useNavigate();

  console.log('StateId:', stateId);
  console.log('AppState:', appState);

  // If stateId is undefined or not a string, use the first state or null
  const effectiveStateId = stateId || (appState.states.length > 0 ? appState.states[0].id : null);

  // Find the state by ID
  const state = effectiveStateId ? appState.states.find(s => s.id === effectiveStateId) : null;
  console.log('Found state:', state);

  if (!state) {
    console.log('State not found, rendering not found message');
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">State Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested state could not be found.</p>
            <Button
              variant="outline"
              onClick={() => navigate('/states')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to States
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/states')}
          className="flex items-center gap-2 mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to States
        </Button>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{state.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            state.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {state.status}
          </span>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-2">
              <p><span className="text-muted-foreground">Abbreviation:</span> {state.abbreviation}</p>
              <p><span className="text-muted-foreground">Status:</span> {state.status}</p>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Compliance Summary</h2>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Total Items:</span>{' '}
                {state.complianceItems?.length || 0}
              </p>
              <p>
                <span className="text-muted-foreground">Completed:</span>{' '}
                {state.complianceItems?.filter(item => item.completed).length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Items */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Compliance Items</h2>
          <div className="space-y-4">
            {state.complianceItems?.map(item => (
              <div key={item.id} className="border rounded p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

