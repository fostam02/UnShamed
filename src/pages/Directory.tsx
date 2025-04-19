
import React, { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter, Printer } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  states: Array<{name: string, id: string}>;
  role: string;
}

type SortField = 'lastName' | 'firstName' | 'stateName' | 'role';
type SortDirection = 'asc' | 'desc';

const Directory = () => {
  const { appState } = useAppContext();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('lastName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Get list of all states for the filter
  const allStates = useMemo(() => {
    const stateSet = new Set<string>();
    appState.states.forEach(state => {
      stateSet.add(state.name);
    });
    return ['all', ...Array.from(stateSet)].sort();
  }, [appState.states]);
  
  // Sort function for any field
  const sortByField = (a: ContactInfo, b: ContactInfo, field: SortField) => {
    if (field === 'stateName') {
      // For state sorting, use the first state name for comparison
      const valueA = a.states.map(s => s.name).join(', ');
      const valueB = b.states.map(s => s.name).join(', ');
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      const valueA = a[field];
      const valueB = b[field];
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
  };
  
  // Handle sort clicks
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If new field, set field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Extract all contacts from states and organize by role
  const { investigators, supervisingProviders, complianceMonitors } = useMemo(() => {
    // Use maps to group contacts by their name and role
    const investigatorMap = new Map<string, ContactInfo>();
    const supervisingProviderMap = new Map<string, ContactInfo>();
    const complianceMonitorMap = new Map<string, ContactInfo>();
    
    appState.states.forEach(state => {
      // Add investigator if exists
      if (state.investigator && state.investigator.name) {
        const nameParts = state.investigator.name.split(' ');
        const lastName = nameParts.length > 1 ? nameParts.pop() || '' : '';
        const firstName = nameParts.join(' ');
        const contactKey = `${firstName}-${lastName}-investigator`;
        
        if (investigatorMap.has(contactKey)) {
          // If already exists, just add this state to the states array
          const existingContact = investigatorMap.get(contactKey);
          if (existingContact) {
            existingContact.states.push({ name: state.name, id: state.id });
          }
        } else {
          // Create a new contact
          investigatorMap.set(contactKey, {
            id: `investigator-${state.id}`,
            firstName: firstName,
            lastName: lastName,
            phone: state.investigator.phone,
            email: state.investigator.email,
            states: [{ name: state.name, id: state.id }],
            role: 'Nurse Investigator'
          });
        }
      }
      
      // Add supervising provider if exists
      if (state.supervisingProvider && state.supervisingProvider.name) {
        const nameParts = state.supervisingProvider.name.split(' ');
        const lastName = nameParts.length > 1 ? nameParts.pop() || '' : '';
        const firstName = nameParts.join(' ');
        const contactKey = `${firstName}-${lastName}-provider`;
        
        if (supervisingProviderMap.has(contactKey)) {
          // If already exists, just add this state to the states array
          const existingContact = supervisingProviderMap.get(contactKey);
          if (existingContact) {
            existingContact.states.push({ name: state.name, id: state.id });
          }
        } else {
          // Create a new contact
          supervisingProviderMap.set(contactKey, {
            id: `provider-${state.id}`,
            firstName: firstName,
            lastName: lastName,
            phone: state.supervisingProvider.phone,
            email: state.supervisingProvider.email,
            states: [{ name: state.name, id: state.id }],
            role: 'Supervising Provider'
          });
        }
      }
      
      // Add compliance monitor if exists
      if (state.complianceMonitor && (state.complianceMonitor.name || state.complianceMonitor.monitorName)) {
        const fullName = state.complianceMonitor.name || state.complianceMonitor.monitorName || '';
        const nameParts = fullName.split(' ');
        const lastName = nameParts.length > 1 ? nameParts.pop() || '' : '';
        const firstName = nameParts.join(' ');
        const contactKey = `${firstName}-${lastName}-monitor`;
        
        if (complianceMonitorMap.has(contactKey)) {
          // If already exists, just add this state to the states array
          const existingContact = complianceMonitorMap.get(contactKey);
          if (existingContact) {
            existingContact.states.push({ name: state.name, id: state.id });
          }
        } else {
          // Create a new contact
          complianceMonitorMap.set(contactKey, {
            id: `monitor-${state.id}`,
            firstName: firstName,
            lastName: lastName,
            phone: state.complianceMonitor.phone,
            email: state.complianceMonitor.email || state.complianceMonitor.monitorEmail,
            states: [{ name: state.name, id: state.id }],
            role: 'Compliance Monitor'
          });
        }
      }
    });
    
    // Convert maps to arrays
    const investigators = Array.from(investigatorMap.values());
    const supervisingProviders = Array.from(supervisingProviderMap.values());
    const complianceMonitors = Array.from(complianceMonitorMap.values());
    
    return { investigators, supervisingProviders, complianceMonitors };
  }, [appState.states]);
  
  // Filter contacts based on selected state
  const filterByState = (contacts: ContactInfo[]) => {
    if (selectedState === 'all') {
      return contacts;
    }
    
    return contacts.filter(contact => 
      contact.states.some(state => state.name === selectedState)
    );
  };
  
  const SortableColumnHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => {
    return (
      <TableHead 
        className="cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          <span className="ml-1">
            {sortField === field ? (
              sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-20" />
            )}
          </span>
        </div>
      </TableHead>
    );
  };
  
  const ContactTable = ({ contacts }: { contacts: ContactInfo[] }) => {
    // Apply filtering and sorting
    const filteredContacts = filterByState(contacts);
    const sortedContacts = [...filteredContacts].sort((a, b) => sortByField(a, b, sortField));
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <SortableColumnHeader field="lastName">Last Name</SortableColumnHeader>
            <SortableColumnHeader field="firstName">First Name</SortableColumnHeader>
            <SortableColumnHeader field="stateName">State</SortableColumnHeader>
            <SortableColumnHeader field="role">Role</SortableColumnHeader>
            <TableHead>Contact Info</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts.length > 0 ? (
            sortedContacts.map(contact => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.lastName}</TableCell>
                <TableCell>{contact.firstName}</TableCell>
                <TableCell>
                  {contact.states.map(state => state.name).join(', ')}
                </TableCell>
                <TableCell>{contact.role}</TableCell>
                <TableCell>
                  {contact.email && <div>{contact.email}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                  {!contact.email && !contact.phone && <div>No contact information</div>}
                </TableCell>
                <TableCell className="text-right">
                  {contact.states.length === 1 ? (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/state/${contact.states[0].id}`)}>
                      View State
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {contact.states.map(state => (
                        <Button 
                          key={state.id} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/state/${state.id}`)}
                        >
                          {state.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">No contacts found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };
  
  // Combine all contacts for the "All" tab
  const allContacts = useMemo(() => {
    return [...investigators, ...supervisingProviders, ...complianceMonitors];
  }, [investigators, supervisingProviders, complianceMonitors]);
  
  // Count all contacts after filtering
  const filteredContactCounts = useMemo(() => {
    return {
      all: filterByState(allContacts).length,
      investigators: filterByState(investigators).length,
      providers: filterByState(supervisingProviders).length,
      monitors: filterByState(complianceMonitors).length
    };
  }, [allContacts, investigators, supervisingProviders, complianceMonitors, selectedState]);

  // Get the current active contacts based on tab
  const getCurrentContacts = () => {
    switch (activeTab) {
      case 'investigators':
        return investigators;
      case 'providers':
        return supervisingProviders;
      case 'monitors':
        return complianceMonitors;
      default:
        return allContacts;
    }
  };

  // Function to handle printing
  const handlePrint = () => {
    const contacts = getCurrentContacts();
    const filteredContacts = filterByState(contacts);
    const sortedContacts = [...filteredContacts].sort((a, b) => sortByField(a, b, sortField));
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Get the current filter and tab information
    const filterLabel = selectedState === 'all' ? 'All States' : selectedState;
    const tabLabel = (() => {
      switch (activeTab) {
        case 'investigators': return 'Nurse Investigators';
        case 'providers': return 'Supervising Providers';
        case 'monitors': return 'Compliance Monitors';
        default: return 'All Contacts';
      }
    })();
    
    // Create the print content
    printWindow.document.write(`
      <html>
        <head>
          <title>Contact Directory - ${tabLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { margin-bottom: 5px; }
            .info-line { margin-bottom: 15px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f0f0f0; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .no-print { display: none; }
            @media print {
              button { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Contact Directory - ${tabLabel}</h1>
          <div class="info-line">Filter: ${filterLabel}</div>
          <div class="info-line">Count: ${sortedContacts.length} contacts</div>
          <button class="no-print" onclick="window.print();">Print</button>
          <table>
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>State</th>
                <th>Role</th>
                <th>Contact Info</th>
              </tr>
            </thead>
            <tbody>
              ${sortedContacts.map(contact => `
                <tr>
                  <td>${contact.lastName}</td>
                  <td>${contact.firstName}</td>
                  <td>${contact.states.map(state => state.name).join(', ')}</td>
                  <td>${contact.role}</td>
                  <td>
                    ${contact.email ? `<div>${contact.email}</div>` : ''}
                    ${contact.phone ? `<div>${contact.phone}</div>` : ''}
                    ${!contact.email && !contact.phone ? '<div>No contact information</div>' : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            // Auto-trigger print dialog after content loads
            window.onload = function() {
              document.querySelector('button').focus();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Contact Directory</h1>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="flex items-center mr-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
          
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              {allStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Contacts ({filteredContactCounts.all})</TabsTrigger>
          <TabsTrigger value="investigators">Nurse Investigators ({filteredContactCounts.investigators})</TabsTrigger>
          <TabsTrigger value="providers">Supervising Providers ({filteredContactCounts.providers})</TabsTrigger>
          <TabsTrigger value="monitors">Compliance Monitors ({filteredContactCounts.monitors})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <ContactTable contacts={allContacts} />
        </TabsContent>
        
        <TabsContent value="investigators" className="mt-4">
          <ContactTable contacts={investigators} />
        </TabsContent>
        
        <TabsContent value="providers" className="mt-4">
          <ContactTable contacts={supervisingProviders} />
        </TabsContent>
        
        <TabsContent value="monitors" className="mt-4">
          <ContactTable contacts={complianceMonitors} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Directory;
