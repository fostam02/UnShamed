import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminAuth } from './AdminAuth';

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated } = useAuth();
  
  // First check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Then check if user is an admin
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If user is an admin, wrap the content with AdminAuth
  return <AdminAuth>{children}</AdminAuth>;
};
