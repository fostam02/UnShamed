
export interface DocumentFolder {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  stateId: string;
  type?: string;
  folderId?: string | null;
}

export interface StateProfile {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  complianceItems: ComplianceItem[];
  documents: Document[];
  documentFolders?: DocumentFolder[];
  auditLog: AuditLogEntry[];
  notes?: Note[];
  disciplinaryDetails: DisciplinaryDetails | null;
  complianceMonitor: ComplianceMonitor | null;
  investigator?: Investigator | null;
  supervisingProvider?: SupervisingProvider | null;
  isOriginalState?: boolean;
  initialResponseDueDate?: string;
  investigationNoticeDate?: string;
  associatedLicenseId?: string;
}

export interface ComplianceItem {
  id: string;
  stateId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  documents?: Document[];
  isRecurrent?: boolean;
  recurrencePattern?: RecurrencePattern;
  parentTaskId?: string;
  completionNote?: string;
  reopenReason?: string;
}

export interface AuditLogEntry {
  id: string;
  stateId: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  type?: 'request' | 'submission' | 'other' | string;
  date?: string;
}

export interface AppState {
  states: StateProfile[];
  selectedStateId: string | null;
  userProfile: UserProfile | null;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  licenses: License[];
  phone?: string;
  isProfileComplete?: boolean;
  primaryStateOfResidence?: string;
  dateOfBirth?: string;
  sexAssignedAtBirth?: 'male' | 'female' | 'other';
  genderIdentity?: string;
  race?: string;
  gamificationData?: GamificationData;
  consentToShare?: boolean;
}

export interface License {
  id: string;
  licenseNumber: string;
  licenseType: string;
  state: string;
  expirationDate: string;
  issuanceDate: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  type?: string;
  number?: string;
  isPrimary?: boolean;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  endByDate?: string;
  endAfterOccurrences?: number;
}

export interface DisciplinaryDetails {
  boardActions: string;
  malpracticeClaims: string;
  type?: string;
  startDate?: string;
  durationMonths?: number;
  description?: string;
  narrative?: string;
  reflection?: string;
  violationDescription?: string;
  violationTypes?: string[];
  otherViolationType?: string;
  outcome?: string;
  patientHarmOccurred?: boolean;
  patientHarmSeverity?: 'none' | 'minor' | 'moderate' | 'severe' | 'death';
  patientHarmDescription?: string;
}

export interface ComplianceMonitor {
  monitorName: string;
  monitorEmail: string;
  frequency: string;
  startDate: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface SupervisingProvider {
  name: string;
  phone?: string;
  email?: string;
}

export interface PrintOptions {
  includeTotalTasks: boolean;
  includeOverdueTasks: boolean;
  includeDueSoonTasks: boolean;
  includeUpcomingTasks: boolean;
  includeCompletedTasks: boolean;
  futureDaysToInclude: number;
  showFullTaskDetails: boolean;
}

export interface GamificationData {
  points: number;
  level: number;
  achievements: Achievement[];
  weeklyStreak: number;
  lastWeeklyLogin?: string;
  lastActivityDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: 'trophy' | 'star' | 'award' | 'zap';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Note {
  id: string;
  stateId: string;
  content: string;
  createdAt: string;
  createdBy: string;
  hasDueDate?: boolean;
  dueDate?: string;
  taskId?: string;
}

export interface Investigator {
  name: string;
  phone?: string;
  email?: string;
}
