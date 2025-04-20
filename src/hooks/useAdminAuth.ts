import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  useEffect(() => {
    // Check if admin is authorized from session storage
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAdminAuthorized(true);
    }
  }, []);

  const authorizeAdmin = () => {
    setIsAdminAuthorized(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const deauthorizeAdmin = () => {
    setIsAdminAuthorized(false);
    sessionStorage.removeItem('adminAuth');
  };

  return {
    isAdminAuthorized,
    authorizeAdmin,
    deauthorizeAdmin
  };
};
