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
  checkEmailConfirmation: (email: string) => Promise<boolean>;
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

      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Fetch user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // Create user profile from Supabase data
        const userProfile: UserProfile = {
          id: data.user.id,
          firstName: profileData?.first_name || '',
          lastName: profileData?.last_name || '',
          email: data.user.email || '',
          licenses: profileData?.licenses || [],
          isProfileComplete: !!profileData?.is_profile_complete,
          role: profileData?.role || 'user'
        };

        setIsAuthenticated(true);
        setUserProfile(userProfile);

        // Save to localStorage for persistence
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile
        }));

        return { user: userProfile };
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Use Supabase authentication for registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        // Create a profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: firstName || name,
              last_name: lastName || '',
              role: 'user',
              is_profile_complete: false,
              licenses: []
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        // Create user profile
        const userProfile: UserProfile = {
          id: data.user.id,
          firstName: firstName || name,
          lastName: lastName || '',
          email: email,
          licenses: [],
          isProfileComplete: false,
          role: 'user'
        };

        setIsAuthenticated(true);
        setUserProfile(userProfile);

        // Save to localStorage for persistence
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile
        }));

        return { user: userProfile };
      }

      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local state
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      toast('Confirmation email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error;
    }
  };

  const checkEmailConfirmation = async (email: string): Promise<boolean> => {
    try {
      // This is a workaround since Supabase doesn't provide a direct way to check email confirmation
      // We'll try to sign in with an invalid password and check if the error is about confirmation
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'invalid_password_to_check_confirmation',
      });

      // If the error mentions email not confirmed, we know it's not confirmed
      if (error?.message?.includes('Email not confirmed')) {
        return false;
      }

      // If we get any other error (like invalid credentials), the email is likely confirmed
      // but the password is wrong, which is what we expect
      return true;
    } catch (error) {
      console.error('Error checking email confirmation:', error);
      // Default to true to avoid blocking users unnecessarily
      return true;
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
      resendConfirmationEmail,
      checkEmailConfirmation
    }}>
      {children}
    </AuthContext.Provider>
  );
};










