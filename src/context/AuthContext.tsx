import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<any>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load auth state from localStorage on initial render
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('authUser');
      if (savedAuth) {
        const { isAuthenticated: savedIsAuth, userProfile: savedProfile } = JSON.parse(savedAuth);
        setIsAuthenticated(savedIsAuth);
        setUserProfile(savedProfile);
      }
    } catch (err) {
      console.error('Error loading auth state from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);

      // For demo purposes, allow any login
      if (email && password) {
        // Create a mock user profile
        const mockProfile: UserProfile = {
          id: 'user-123',
          firstName: 'Demo',
          lastName: 'User',
          email: email,
          licenses: [],
          isProfileComplete: false
        };

        // Add admin role if email contains 'admin'
        if (email.includes('admin')) {
          (mockProfile as any).role = 'admin';
        } else {
          (mockProfile as any).role = 'user';
        }

        setIsAuthenticated(true);
        setUserProfile(mockProfile);

        // Save to localStorage for persistence
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile: mockProfile
        }));

        return { user: mockProfile };
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // For demo purposes, simulate successful registration
      if (email && password && name) {
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        // Create a mock user profile
        const mockProfile: UserProfile = {
          id: `user-${Date.now()}`,
          firstName: firstName || name,
          lastName: lastName || '',
          email: email,
          licenses: [],
          isProfileComplete: false
        };

        // Add user role
        (mockProfile as any).role = 'user';

        setIsAuthenticated(true);
        setUserProfile(mockProfile);

        // Save to localStorage for persistence
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile: mockProfile
        }));

        return { user: mockProfile };
      }

      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // For demo purposes, just clear the state
      setIsAuthenticated(false);
      setUserProfile(null);

      // Clear localStorage
      localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);

    // Update localStorage
    localStorage.setItem('authUser', JSON.stringify({
      isAuthenticated,
      userProfile: updatedProfile
    }));
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      // For demo purposes, just show a success message
      toast('Confirmation email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userProfile,
      login,
      logout,
      register,
      updateUserProfile,
      resendConfirmationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};










