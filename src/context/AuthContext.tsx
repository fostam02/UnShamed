import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const authData = localStorage.getItem('authUser');
    if (authData) {
      try {
        const { isAuthenticated, userProfile } = JSON.parse(authData);
        setIsAuthenticated(isAuthenticated);
        setUserProfile(userProfile);
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const isAdminEmail = email.toLowerCase().includes('admin') ||
                          email.toLowerCase() === 'nestertester5@testing.org' ||
                          email.toLowerCase() === 'gamedesign2030@gmail.com';

      const profile: UserProfile = {
        id: `user_${Date.now()}`,
        firstName: email.split('@')[0],
        lastName: '',
        email: email.toLowerCase(),
        role: isAdminEmail ? 'admin' : 'user',
        isProfileComplete: true,
        // Add name property for components that expect it
        name: email.split('@')[0]
      };

      // If admin, also set admin auth
      if (isAdminEmail) {
        sessionStorage.setItem('adminAuth', 'true');
      }

      localStorage.setItem('authUser', JSON.stringify({
        isAuthenticated: true,
        userProfile: profile
      }));

      setIsAuthenticated(true);
      setUserProfile(profile);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Clearing authentication data...');

      // Clear all auth-related data from localStorage and sessionStorage
      localStorage.removeItem('authUser');
      localStorage.removeItem('unShamedState'); // Also clear app state
      sessionStorage.removeItem('adminAuth');

      // Clear all other potential auth tokens
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('token') || key.includes('auth') || key.includes('user'))) {
          localStorage.removeItem(key);
        }
      }

      // Update state
      setIsAuthenticated(false);
      setUserProfile(null);

      console.log('AuthContext: Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
