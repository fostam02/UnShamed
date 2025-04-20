import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminAuth } from './AdminAuth';

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for authentication and admin status
    const authData = localStorage.getItem('authUser');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setIsAuthenticated(parsedData.isAuthenticated === true);
        setIsAdmin(parsedData.userProfile?.role === 'admin');
      } catch (error) {
        console.error('Error parsing auth data:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // First check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Then check if user is an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is an admin, wrap the content with AdminAuth
  return <AdminAuth>{children}</AdminAuth>;
};
