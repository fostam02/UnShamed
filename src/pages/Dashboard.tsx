import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  // Calculate metrics
  const totalStates = appState.states.length;
  const activeStates = appState.states.filter(s => s.status === 'active').length;
  const pendingItems = appState.states.reduce((acc, state) => 
    acc + (state.complianceItems?.filter(item => !item.completed).length || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/add-state')}>Add New State</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total States</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStates}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active States</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeStates}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingItems}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your States</h2>
        {appState.states.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appState.states.map(state => (
              <Card key={state.id} className="cursor-pointer hover:bg-accent/50" 
                    onClick={() => navigate(`/state/${state.id}`)}>
                <CardHeader>
                  <CardTitle>{state.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Status: {state.status}</p>
                  <p className="text-sm text-muted-foreground">
                    Pending Items: {state.complianceItems?.filter(item => !item.completed).length || 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No states added yet.</p>
            <Button className="mt-4" onClick={() => navigate('/add-state')}>
              Add Your First State
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}




