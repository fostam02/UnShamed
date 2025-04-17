import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

export const StateDetails = () => {
  console.log('StateDetails component rendering');
  const { stateId } = useParams();
  const { appState } = useAppContext();

  console.log('StateId:', stateId);
  console.log('AppState:', appState);

  const state = appState.states.find(s => s.id === stateId);
  console.log('Found state:', state);

  if (!state) {
    console.log('State not found, rendering not found message');
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">State Not Found</h2>
          <p className="text-muted-foreground">The requested state could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
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

