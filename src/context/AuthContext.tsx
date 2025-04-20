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
        try {
          const { isAuthenticated: savedIsAuth, userProfile: savedProfile } = JSON.parse(savedAuth);
          if (savedIsAuth && savedProfile) {
            console.log('Found stored auth session');
            setIsAuthenticated(savedIsAuth);
            setUserProfile(savedProfile);
          } else {
            // Invalid stored auth data
            localStorage.removeItem('authUser');
          }
        } catch (parseError) {
          console.error('Error parsing stored auth:', parseError);
          localStorage.removeItem('authUser');
        }
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

      // Special handling for admin emails to set the role
      const isAdminEmail = email.toLowerCase().includes('admin') || email.toLowerCase() === 'nestertester5@testing.org' || email.toLowerCase() === 'gamedesign2030@gmail.com';

      if (isAdminEmail) {
        console.log('Admin email detected:', email);
      }

      // Standard login flow for non-admin users or if admin bypass didn't apply
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Fetch user profile from profiles table
        let profileData: any = null;
        const { data: fetchedProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);

          // If the profile doesn't exist, create a default one in memory
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating default profile');
            profileData = {
              first_name: data.user.email?.split('@')[0] || 'User',
              last_name: '',
              role: data.user.email?.toLowerCase().includes('admin') ? 'admin' : 'user',
              is_profile_complete: false,
              licenses: []
            };
          } else {
            throw profileError;
          }
        } else {
          profileData = fetchedProfile;
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
      console.log('Attempting to register user:', email, 'with name:', name);

      // Use Supabase authentication for registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        console.error('Registration error from Supabase:', error);
        throw error;
      }

      console.log('Registration response:', data);

      if (data.user) {
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        console.log('Creating profile for user:', data.user.id);

        // Create a profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: firstName || name,
              last_name: lastName || '',
              role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
              is_profile_complete: false,
              licenses: []
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        console.log('Profile created successfully');

        // Create user profile
        const userProfile: UserProfile = {
          id: data.user.id,
          firstName: firstName || name,
          lastName: lastName || '',
          email: email,
          licenses: [],
          isProfileComplete: false,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
        };

        // In development, we'll auto-confirm the email
        console.log('Auto-confirming email for development purposes');
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

  // Email confirmation is now disabled at the database level
  const resendConfirmationEmail = async (_email: string) => {
    // This function is now a no-op since email confirmation is disabled
    toast('Email confirmation is not required.');
    return;
  };

  // Email confirmation is now disabled at the database level
  const checkEmailConfirmation = async (_email: string): Promise<boolean> => {
    // Always return true since email confirmation is disabled
    return true;
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










