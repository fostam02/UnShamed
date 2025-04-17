import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useAuth();
  
  console.log('AdminRoute - userProfile:', userProfile);
  console.log('AdminRoute - role:', userProfile?.role);
  
  if (!userProfile || userProfile.role !== 'admin') {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" />;
  }

  console.log('Is admin, showing admin content');
  return <>{children}</>;
};



