
import { useEffect } from 'react';
import { License, StateProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { differenceInDays } from 'date-fns';
import { 
  isLicenseExpiringSoon, 
  formatLicenseRenewalTask, 
  findStateProfileForLicense, 
  licenseRenewalTaskExists 
} from '@/utils/licenseUtils';

/**
 * Hook to manage license expiration monitoring and task creation
 */
export const useLicenseExpiration = () => {
  const { toast } = useToast();
  const { appState, addComplianceItem } = useAppContext();
  
  /**
   * Check a collection of licenses for upcoming expirations
   */
  const checkLicenses = (licenses: License[]) => {
    if (!licenses || !licenses.length) return;
    
    licenses.forEach(license => {
      const today = new Date();
      const expirationDate = new Date(license.expirationDate);
      
      // Check if license is expiring soon
      if (isLicenseExpiringSoon(license)) {
        const daysUntilExpiration = differenceInDays(expirationDate, today);
        
        // Check if a task already exists
        if (!licenseRenewalTaskExists(license, appState.states)) {
          createRenewalTask(license, daysUntilExpiration);
        }
      }
    });
  };
  
  /**
   * Create a renewal task for the expiring license
   */
  const createRenewalTask = (license: License, daysUntilExpiration: number) => {
    const stateProfile = findStateProfileForLicense(license, appState.states);
    
    if (!stateProfile) {
      // No state profile exists for this license state
      toast({
        title: "License Expiring Soon",
        description: `Your ${license.licenseType} license (${license.licenseNumber}) for ${license.state} will expire in ${daysUntilExpiration} days. Please renew it soon.`,
        variant: "destructive", // Changed from "warning" to "destructive" which is a supported variant
      });
      return;
    }
    
    // Create compliance task
    const taskData = formatLicenseRenewalTask(license, daysUntilExpiration);
    addComplianceItem(stateProfile.id, taskData);
    
    toast({
      title: "License Renewal Task Created",
      description: `A task has been created to remind you to renew your ${license.licenseType} license for ${license.state}.`,
    });
  };
  
  return { checkLicenses };
};
