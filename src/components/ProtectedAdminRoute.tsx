import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useAuth();
  
  console.log('ProtectedAdminRoute - User Profile:', userProfile); // Debug log

  if (!userProfile || userProfile.role !== 'admin') {
    console.log('Access denied - redirecting to home'); // Debug log
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};