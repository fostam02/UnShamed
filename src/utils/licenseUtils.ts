
import { addDays, differenceInDays, format } from 'date-fns';
import { License, StateProfile, ComplianceItem } from '@/types';

/**
 * Checks if a license is expiring within the specified number of days
 */
export const isLicenseExpiringSoon = (license: License, daysThreshold: number = 30): boolean => {
  const today = new Date();
  const expirationDate = new Date(license.expirationDate);
  const thresholdDate = addDays(today, daysThreshold);
  
  return expirationDate <= thresholdDate && expirationDate > today;
};

/**
 * Formats a license renewal task for a given license
 */
export const formatLicenseRenewalTask = (
  license: License, 
  daysUntilExpiration: number
): Omit<ComplianceItem, 'id' | 'stateId' | 'documents'> => {
  return {
    title: `License Renewal: ${license.licenseType} (${license.licenseNumber})`,
    description: `Your ${license.licenseType} license for ${license.state} will expire on ${format(new Date(license.expirationDate), 'PPP')}. Please start the renewal process.`,
    dueDate: addDays(new Date(), Math.max(1, daysUntilExpiration - 15)).toISOString(),
    completed: false,
    priority: 'high',
  };
};

/**
 * Finds the corresponding state profile for a license
 */
export const findStateProfileForLicense = (
  license: License, 
  states: StateProfile[]
): StateProfile | undefined => {
  return states.find(state => state.abbreviation === license.state);
};

/**
 * Checks if a license renewal task already exists
 */
export const licenseRenewalTaskExists = (
  license: License,
  states: StateProfile[]
): boolean => {
  return states.some(state => 
    state.complianceItems.some(item => 
      item.title.includes(`License Renewal: ${license.licenseType}`) && 
      item.title.includes(license.licenseNumber)
    )
  );
};
