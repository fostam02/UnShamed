import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, StateProfile, ComplianceItem, Document, AuditLogEntry, RecurrencePattern, DisciplinaryDetails, ComplianceMonitor, Note, DocumentFolder } from '../types';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

interface AppContextType {
  appState: AppState;
  addState: (state: Omit<StateProfile, 'id'>) => void;
  updateState: (id: string, state: Partial<StateProfile>) => void;
  removeState: (id: string) => void;
  setSelectedState: (id: string | null) => void;
  addComplianceItem: (stateId: string, item: Omit<ComplianceItem, 'id' | 'stateId' | 'documents'>) => void;
  updateComplianceItem: (stateId: string, itemId: string, updates: Partial<ComplianceItem>) => void;
  removeComplianceItem: (stateId: string, itemId: string) => void;
  addDocument: (stateId: string, document: Omit<Document, 'id'>) => void;
  removeDocument: (stateId: string, documentId: string) => void;
  addDocumentFolder: (stateId: string, folder: Omit<DocumentFolder, 'id'>) => void;
  removeDocumentFolder: (stateId: string, folderId: string) => void;
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id'>) => void;
  removeAuditLogEntry: (entryId: string) => void;
  updateDisciplinaryDetails: (stateId: string, details: DisciplinaryDetails) => void;
  updateComplianceMonitor: (stateId: string, monitor: ComplianceMonitor) => void;
  addNote: (stateId: string, note: Omit<Note, 'id' | 'stateId'>) => void;
  updateNote: (stateId: string, noteId: string, updates: Partial<Note>) => void;
  removeNote: (stateId: string, noteId: string) => void;
}

const initialState: AppState = {
  states: [],
  selectedStateId: null,
  userProfile: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(() => {
    console.log('Initializing AppState');
    const savedState = localStorage.getItem('nurseNavigatorState');
    const parsedState = savedState ? JSON.parse(savedState) : initialState;
    console.log('Initial state:', parsedState);
    return parsedState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('nurseNavigatorState', JSON.stringify(appState));
  }, [appState]);

  // Helper function to generate recurrent tasks
  const generateRecurrentTasks = (
    baseTask: ComplianceItem,
    recurrencePattern: RecurrencePattern
  ): ComplianceItem[] => {
    const recurrentTasks: ComplianceItem[] = [];
    const baseDueDate = new Date(baseTask.dueDate);
    let currentDate = baseDueDate;
    
    // Determine how many occurrences to generate
    const maxOccurrences = recurrencePattern.endAfterOccurrences || 12; // Default to 12 if not specified
    const endDate = recurrencePattern.endByDate 
      ? new Date(recurrencePattern.endByDate)
      : addYears(baseDueDate, 2); // Default to 2 years if no end date
      
    for (let i = 1; i < maxOccurrences; i++) {
      // Calculate next date based on frequency
      let nextDate: Date;
      
      switch (recurrencePattern.frequency) {
        case 'daily':
          nextDate = addDays(currentDate, recurrencePattern.interval);
          break;
        case 'weekly':
          nextDate = addWeeks(currentDate, recurrencePattern.interval);
          break;
        case 'monthly':
          nextDate = addMonths(currentDate, recurrencePattern.interval);
          break;
        case 'quarterly':
          nextDate = addMonths(currentDate, 3 * recurrencePattern.interval);
          break;
        case 'yearly':
          nextDate = addYears(currentDate, recurrencePattern.interval);
          break;
        default:
          nextDate = addMonths(currentDate, recurrencePattern.interval);
      }
      
      // Check if we've passed the end date
      if (recurrencePattern.endByDate && nextDate > endDate) {
        break;
      }
      
      // Create the recurrent task
      const recurrentTask: ComplianceItem = {
        ...baseTask,
        id: `compliance-${Date.now()}-${i}`,
        dueDate: nextDate.toISOString(),
        parentTaskId: baseTask.id,
        completed: false
      };
      
      recurrentTasks.push(recurrentTask);
      currentDate = nextDate;
    }
    
    return recurrentTasks;
  };

  const addState = (state: Omit<StateProfile, 'id'>) => {
    const newState: StateProfile = {
      ...state,
      id: `state-${Date.now()}`,
      complianceItems: [],
      auditLog: [],
      documents: [],
      documentFolders: [],
      notes: [],
      disciplinaryDetails: null,
      complianceMonitor: null,
    };

    setAppState((prev) => ({
      ...prev,
      states: [...prev.states, newState],
      selectedStateId: newState.id,
    }));
  };

  const updateState = (id: string, updates: Partial<StateProfile>) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === id ? { ...state, ...updates } : state
      ),
    }));
  };

  const removeState = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.filter((state) => state.id !== id),
      selectedStateId: prev.selectedStateId === id ? null : prev.selectedStateId,
    }));
  };

  const setSelectedState = (id: string | null) => {
    setAppState((prev) => ({
      ...prev,
      selectedStateId: id,
    }));
  };

  const addComplianceItem = (
    stateId: string,
    item: Omit<ComplianceItem, 'id' | 'stateId' | 'documents'>
  ) => {
    const newItem: ComplianceItem = {
      ...item,
      id: `compliance-${Date.now()}`,
      stateId,
      documents: [],
    };

    setAppState((prev) => {
      // Find the state we're updating
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;
        
        // Add the main task
        let updatedComplianceItems = [...state.complianceItems, newItem];
        
        // If the task is recurrent, generate the recurrent tasks
        if (newItem.isRecurrent && newItem.recurrencePattern) {
          const recurrentTasks = generateRecurrentTasks(newItem, newItem.recurrencePattern);
          updatedComplianceItems = [...updatedComplianceItems, ...recurrentTasks];
        }
        
        return {
          ...state,
          complianceItems: updatedComplianceItems,
        };
      });
      
      return {
        ...prev,
        states: updatedStates,
      };
    });
  };

  const updateComplianceItem = (
    stateId: string,
    itemId: string,
    updates: Partial<ComplianceItem>
  ) => {
    setAppState((prev) => {
      // Find the state to update
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;
        
        // Update the compliance item
        const updatedItems = state.complianceItems.map((item) => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        
        // If this is a recurrent task and the recurrence pattern was updated
        const updatedItem = updatedItems.find(item => item.id === itemId);
        if (
          updatedItem && 
          updatedItem.isRecurrent && 
          updates.recurrencePattern && 
          !updatedItem.parentTaskId // Only regenerate if this is the parent task
        ) {
          // Remove all child tasks
          const filteredItems = updatedItems.filter(
            item => !item.parentTaskId || item.parentTaskId !== itemId
          );
          
          // Generate new recurrent tasks
          const recurrentTasks = generateRecurrentTasks(
            updatedItem, 
            updatedItem.recurrencePattern
          );
          
          return {
            ...state,
            complianceItems: [...filteredItems, ...recurrentTasks],
          };
        }
        
        return {
          ...state,
          complianceItems: updatedItems,
        };
      });
      
      return {
        ...prev,
        states: updatedStates,
      };
    });
  };

  const removeComplianceItem = (stateId: string, itemId: string) => {
    setAppState((prev) => {
      // Find the state to update
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;
        
        // Get the item being removed to check if it's a parent task
        const itemToRemove = state.complianceItems.find(item => item.id === itemId);
        
        if (itemToRemove && itemToRemove.isRecurrent && !itemToRemove.parentTaskId) {
          // If removing a parent task, also remove all child tasks
          return {
            ...state,
            complianceItems: state.complianceItems.filter(
              (item) => item.id !== itemId && item.parentTaskId !== itemId
            ),
          };
        } else {
          // Otherwise just remove the specified task
          return {
            ...state,
            complianceItems: state.complianceItems.filter(
              (item) => item.id !== itemId
            ),
          };
        }
      });
      
      return {
        ...prev,
        states: updatedStates,
      };
    });
  };

  const addDocument = (stateId: string, document: Omit<Document, 'id'>) => {
    const newDocument: Document = {
      ...document,
      id: `document-${Date.now()}`,
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId
          ? { ...state, documents: [...state.documents, newDocument] }
          : state
      ),
    }));
  };

  const removeDocument = (stateId: string, documentId: string) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId
          ? {
              ...state,
              documents: state.documents.filter((doc) => doc.id !== documentId),
            }
          : state
      ),
    }));
  };

  const addDocumentFolder = (stateId: string, folder: Omit<DocumentFolder, 'id'>) => {
    const newFolder: DocumentFolder = {
      ...folder,
      id: `folder-${Date.now()}`,
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId
          ? { 
              ...state, 
              documentFolders: state.documentFolders 
                ? [...state.documentFolders, newFolder] 
                : [newFolder] 
            }
          : state
      ),
    }));
  };

  const removeDocumentFolder = (stateId: string, folderId: string) => {
    setAppState((prev) => {
      // Find the state we're updating
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;
        
        // Remove the folder
        const updatedFolders = state.documentFolders?.filter(
          (folder) => folder.id !== folderId
        ) || [];
        
        // Update any documents in that folder to no longer be in a folder
        const updatedDocuments = state.documents.map((doc) => 
          doc.folderId === folderId ? { ...doc, folderId: null } : doc
        );
        
        return {
          ...state,
          documentFolders: updatedFolders,
          documents: updatedDocuments,
        };
      });
      
      return {
        ...prev,
        states: updatedStates,
      };
    });
  };

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === entry.stateId
          ? { ...state, auditLog: [newEntry, ...state.auditLog] }
          : state
      ),
    }));
  };

  const removeAuditLogEntry = (entryId: string) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) => ({
        ...state,
        auditLog: state.auditLog.filter((entry) => entry.id !== entryId),
      })),
    }));
  };
  
  const updateDisciplinaryDetails = (stateId: string, details: DisciplinaryDetails) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId ? { ...state, disciplinaryDetails: details } : state
      ),
    }));
  };
  
  const updateComplianceMonitor = (stateId: string, monitor: ComplianceMonitor) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId ? { ...state, complianceMonitor: monitor } : state
      ),
    }));
  };

  const addNote = (stateId: string, note: Omit<Note, 'id' | 'stateId'>) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      stateId,
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId
          ? { 
              ...state, 
              notes: state.notes ? [newNote, ...state.notes] : [newNote] 
            }
          : state
      ),
    }));

    return newNote;
  };

  const updateNote = (stateId: string, noteId: string, updates: Partial<Note>) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId && state.notes
          ? {
              ...state,
              notes: state.notes.map((note) =>
                note.id === noteId ? { ...note, ...updates } : note
              ),
            }
          : state
      ),
    }));
  };

  const removeNote = (stateId: string, noteId: string) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId && state.notes
          ? {
              ...state,
              notes: state.notes.filter((note) => note.id !== noteId),
            }
          : state
      ),
    }));
  };

  const contextValue: AppContextType = {
    appState,
    addState,
    updateState,
    removeState,
    setSelectedState,
    addComplianceItem,
    updateComplianceItem,
    removeComplianceItem,
    addDocument,
    removeDocument,
    addDocumentFolder,
    removeDocumentFolder,
    addAuditLogEntry,
    removeAuditLogEntry,
    updateDisciplinaryDetails,
    updateComplianceMonitor,
    addNote,
    updateNote,
    removeNote,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

