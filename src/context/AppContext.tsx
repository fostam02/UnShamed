import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, State, ComplianceItem, Document, AuditLogEntry } from '@/types';

interface AppContextType {
  appState: AppState;
  addState: (state: Omit<State, 'id' | 'complianceItems' | 'documents' | 'auditLog' | 'createdAt' | 'updatedAt'>) => void;
  updateState: (id: string, state: Partial<State>) => void;
  removeState: (id: string) => void;
  setSelectedState: (id: string | null) => void;
  addComplianceItem: (stateId: string, item: Omit<ComplianceItem, 'id' | 'stateId'>) => void;
  updateComplianceItem: (stateId: string, itemId: string, updates: Partial<ComplianceItem>) => void;
  removeComplianceItem: (stateId: string, itemId: string) => void;
  addDocument: (stateId: string, document: Omit<Document, 'id' | 'stateId' | 'uploadedAt'>) => void;
  removeDocument: (stateId: string, documentId: string) => void;
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id'>) => void;
}

const initialState: AppState = {
  states: [],
  selectedStateId: null,
  isLoading: false,
  error: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(() => {
    console.log('Initializing AppState');
    const savedState = localStorage.getItem('unShamedState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        console.log('Loaded state from localStorage:', parsedState);
        return parsedState;
      } catch (error) {
        console.error('Error parsing saved state:', error);
        return initialState;
      }
    }
    return initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('unShamedState', JSON.stringify(appState));
  }, [appState]);

  const addState = (state: Omit<State, 'id' | 'complianceItems' | 'documents' | 'auditLog' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newState: State = {
      ...state,
      id: `state-${Date.now()}`,
      complianceItems: [],
      documents: [],
      auditLog: [],
      createdAt: now,
      updatedAt: now
    };

    setAppState((prev) => ({
      ...prev,
      states: [...prev.states, newState],
      selectedStateId: newState.id,
    }));
  };

  const updateState = (id: string, updates: Partial<State>) => {
    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === id ? { ...state, ...updates, updatedAt: new Date().toISOString() } : state
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
    item: Omit<ComplianceItem, 'id' | 'stateId'>
  ) => {
    const newItem: ComplianceItem = {
      ...item,
      id: `compliance-${Date.now()}`,
      stateId,
    };

    setAppState((prev) => {
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;

        return {
          ...state,
          complianceItems: [...state.complianceItems, newItem],
          updatedAt: new Date().toISOString()
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
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;

        const updatedItems = state.complianceItems.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );

        return {
          ...state,
          complianceItems: updatedItems,
          updatedAt: new Date().toISOString()
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
      const updatedStates = prev.states.map((state) => {
        if (state.id !== stateId) return state;

        return {
          ...state,
          complianceItems: state.complianceItems.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString()
        };
      });

      return {
        ...prev,
        states: updatedStates,
      };
    });
  };

  const addDocument = (stateId: string, document: Omit<Document, 'id' | 'stateId' | 'uploadedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `document-${Date.now()}`,
      stateId,
      uploadedAt: new Date().toISOString()
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === stateId
          ? {
              ...state,
              documents: [...state.documents, newDocument],
              updatedAt: new Date().toISOString()
            }
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
              updatedAt: new Date().toISOString()
            }
          : state
      ),
    }));
  };

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, 'id'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: entry.timestamp || new Date().toISOString()
    };

    setAppState((prev) => ({
      ...prev,
      states: prev.states.map((state) =>
        state.id === entry.stateId
          ? {
              ...state,
              auditLog: [newEntry, ...state.auditLog],
              updatedAt: new Date().toISOString()
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
    addAuditLogEntry,
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


