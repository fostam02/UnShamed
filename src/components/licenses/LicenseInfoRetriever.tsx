
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { License } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface LicenseInfoRetrieverProps {
  licenseNumber: string;
  licenseType: string;
  state: string;
  onLicenseInfoFound: (licenseInfo: Partial<License>) => void;
}

const LicenseInfoRetriever: React.FC<LicenseInfoRetrieverProps> = ({
  licenseNumber,
  licenseType,
  state,
  onLicenseInfoFound
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLicenseInfo = async () => {
    if (!licenseNumber || !state || !licenseType) {
      toast({
        title: "Missing Information",
        description: "Please provide license number, type, and state to search",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // This is a placeholder for the actual API integration
      // In a real implementation, this would call a backend API that scrapes 
      // or integrates with state licensing databases
      
      toast({
        title: "Feature Coming Soon",
        description: "Auto-retrieval of license information will be available in a future update",
      });
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In the future, this would return actual license data
      // onLicenseInfoFound({
      //   expirationDate: "2025-12-31T00:00:00.000Z",
      //   status: 'active',
      //   issuanceDate: "2020-01-01T00:00:00.000Z"
      // });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retrieve license information. Please enter manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={fetchLicenseInfo}
      disabled={isLoading || !licenseNumber || !state || !licenseType}
      className="w-full mt-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Retrieve License Info (Coming Soon)
        </>
      )}
    </Button>
  );
};

export default LicenseInfoRetriever;
