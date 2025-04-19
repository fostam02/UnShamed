import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditLogEntry } from '@/types';
import { Calendar, Clock, FileText, User, Filter } from 'lucide-react';
import { format } from 'date-fns';

const AuditLog = () => {
  const { appState } = useAppContext();
  const [filters, setFilters] = useState({
    stateId: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });

  // Get all audit log entries from all states
  const allAuditEntries = appState.states.flatMap(state => 
    state.auditLog.map(entry => ({
      ...entry,
      stateName: state.name,
    }))
  );

  // Apply filters
  const filteredEntries = allAuditEntries.filter(entry => {
    // Filter by state
    if (filters.stateId !== 'all' && entry.stateId !== filters.stateId) {
      return false;
    }
    
    // Filter by type
    if (filters.type !== 'all' && entry.type !== filters.type) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom && new Date(entry.timestamp) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(entry.timestamp) > new Date(filters.dateTo)) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm && !entry.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort by timestamp (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      stateId: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
    });
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stateFilter">State</Label>
              <Select 
                value={filters.stateId} 
                onValueChange={(value) => handleFilterChange('stateId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {appState.states.map(state => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typeFilter">Type</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                  <SelectItem value="submission">Submission</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input 
                id="dateFrom" 
                type="date" 
                value={filters.dateFrom} 
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input 
                id="dateTo" 
                type="date" 
                value={filters.dateTo} 
                onChange={(e) => handleFilterChange('dateTo', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Input 
                placeholder="Search in descriptions..." 
                value={filters.searchTerm} 
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)} 
              />
            </div>
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Audit Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="font-medium">{entry.action}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{entry.description}</p>
                  
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="h-3 w-3 mr-1" />
                      State: {entry.stateName}
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      User: {entry.user}
                    </div>
                    
                    {entry.type && (
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          entry.type === 'request' 
                            ? 'bg-blue-100 text-blue-800' 
                            : entry.type === 'submission'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.type}
                        </span>
                      </div>
                    )}
                    
                    {entry.date && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Event Date: {new Date(entry.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No audit log entries found</p>
              {Object.values(filters).some(value => value !== 'all' && value !== '') && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters to see all entries
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
