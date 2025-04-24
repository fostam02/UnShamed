// User and Authentication Types
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  primaryStateOfResidence?: string;
  licenses?: License[];
  isProfileComplete?: boolean;
  role?: 'admin' | 'user';
  name?: string; // Added for components that expect it
}

export interface License {
  id: string;
  licenseType: string;
  licenseNumber: string;
  state: string;
  expirationDate?: string;
  issuanceDate?: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  isPrimary: boolean;
}

// State Types
export interface State {
  id: string;
  name: string;
  abbreviation: string;
  status?: 'active' | 'inactive' | 'pending';
  isOriginalState: boolean;
  boardUrl?: string;
  renewalFrequency?: string;
  renewalDeadline?: string;
  complianceItems: ComplianceItem[];
  documents: Document[];
  auditLog: AuditLogEntry[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields that might be accessed directly
  associatedLicenseId?: string;
  initialResponseDueDate?: string;
  investigationNoticeDate?: string;
  investigator?: any;
  complianceMonitor?: any;
  supervisingProvider?: any;
  // New metadata field for additional properties
  metadata?: {
    associatedLicenseId?: string;
    initialResponseDueDate?: string;
    investigationNoticeDate?: string;
    investigator?: any;
    complianceMonitor?: any;
    supervisingProvider?: any;
    disciplinaryDetails?: any;
    [key: string]: any;
  };
}

export interface ComplianceItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  documentIds?: string[];
  stateId: string;
  priority?: 'low' | 'medium' | 'high';
  recurring?: boolean;
  recurringInterval?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  expiresAt?: string;
  stateId: string;
  size?: number;
  tags?: string[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  stateId: string;
  type?: 'request' | 'submission' | 'other';
  date?: string;
}

// Application State
export interface AppState {
  states: State[];
  selectedStateId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'warning' | 'success' | 'info';
  relatedStateId?: string;
}

// Delegate Types
export interface Delegate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'attorney' | 'assistant' | 'family' | 'colleague' | 'other';
  permissions: {
    viewDocuments: boolean;
    uploadDocuments: boolean;
    editProfile: boolean;
    manageCompliance: boolean;
  };
  states: string[]; // 'all' or array of state IDs
}
