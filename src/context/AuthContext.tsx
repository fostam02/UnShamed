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

  // Load auth state from localStorage and verify with Supabase
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // First check localStorage
        const savedAuth = localStorage.getItem('authUser');
        let localAuthValid = false;
        let localUserProfile = null;

        if (savedAuth) {
          try {
            const { isAuthenticated: savedIsAuth, userProfile: savedProfile } = JSON.parse(savedAuth);
            if (savedIsAuth && savedProfile) {
              console.log('Found stored auth session');
              localAuthValid = true;
              localUserProfile = savedProfile;
            } else {
              // Invalid stored auth data
              console.log('Invalid stored auth data, removing');
              localStorage.removeItem('authUser');
            }
          } catch (parseError) {
            console.error('Error parsing stored auth:', parseError);
            localStorage.removeItem('authUser');
          }
        }

        // Then check Supabase session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting Supabase session:', sessionError);
          // If there's an error but we have local auth, use that
          if (localAuthValid) {
            setIsAuthenticated(true);
            setUserProfile(localUserProfile);
          }
        } else if (sessionData?.session) {
          console.log('Found active Supabase session');

          // We have an active Supabase session
          const userId = sessionData.session.user.id;

          // If we have local auth with matching ID, use that
          if (localAuthValid && localUserProfile.id === userId) {
            setIsAuthenticated(true);
            setUserProfile(localUserProfile);
          } else {
            // Otherwise fetch the profile from Supabase
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

              if (profileError) {
                console.error('Error fetching profile from Supabase:', profileError);
                // Create a default profile
                const defaultProfile: UserProfile = {
                  id: userId,
                  firstName: sessionData.session.user.email?.split('@')[0] || 'User',
                  lastName: '',
                  email: sessionData.session.user.email || '',
                  licenses: [],
                  isProfileComplete: false,
                  role: sessionData.session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'user'
                };

                setIsAuthenticated(true);
                setUserProfile(defaultProfile);

                // Save to localStorage
                localStorage.setItem('authUser', JSON.stringify({
                  isAuthenticated: true,
                  userProfile: defaultProfile
                }));
              } else {
                // Create user profile from Supabase data
                const userProfile: UserProfile = {
                  id: userId,
                  firstName: profileData.first_name || '',
                  lastName: profileData.last_name || '',
                  email: sessionData.session.user.email || '',
                  licenses: profileData.licenses || [],
                  isProfileComplete: !!profileData.is_profile_complete,
                  role: profileData.role as 'admin' | 'user' || 'user'
                };

                setIsAuthenticated(true);
                setUserProfile(userProfile);

                // Save to localStorage
                localStorage.setItem('authUser', JSON.stringify({
                  isAuthenticated: true,
                  userProfile
                }));
              }
            } catch (error) {
              console.error('Error in profile fetch process:', error);
            }
          }
        } else {
          console.log('No active Supabase session found');
          // No Supabase session, but we might have valid local auth
          if (localAuthValid) {
            setIsAuthenticated(true);
            setUserProfile(localUserProfile);
          }
        }
      } catch (err) {
        console.error('Error in auth state loading process:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);

      // Special handling for admin emails to set the role
      const isAdminEmail = email.toLowerCase().includes('admin') ||
                          email.toLowerCase() === 'nestertester5@testing.org' ||
                          email.toLowerCase() === 'gamedesign2030@gmail.com';

      if (isAdminEmail) {
        console.log('Admin email detected:', email);
      }

      // First check if this user exists in the profiles table with direct password
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (!profileError && profileData && profileData.password_hash) {
          console.log('Found user in profiles table with password_hash');

          // Check if password matches (simple check for demo purposes)
          const inputPasswordHash = btoa(password);

          if (profileData.password_hash === inputPasswordHash) {
            console.log('Password matches, creating session');

            // Create user profile
            const userProfile: UserProfile = {
              id: profileData.id,
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              email: profileData.email || '',
              licenses: profileData.licenses || [],
              isProfileComplete: !!profileData.is_profile_complete,
              role: profileData.role as 'admin' | 'user' || 'user'
            };

            setIsAuthenticated(true);
            setUserProfile(userProfile);

            // Save to localStorage
            localStorage.setItem('authUser', JSON.stringify({
              isAuthenticated: true,
              userProfile
            }));

            return { user: userProfile };
          }
        }
      } catch (directLoginError) {
        console.log('Error in direct login attempt:', directLoginError);
        // Continue to standard Supabase auth
      }

      // Standard login flow using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
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
      // First clear local state
      setIsAuthenticated(false);
      setUserProfile(null);
      localStorage.removeItem('authUser');

      // Then sign out from Supabase
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out from Supabase:', error);
          // Continue anyway since we've already cleared local state
        }
      } catch (supabaseError) {
        console.error('Exception during Supabase signOut:', supabaseError);
        // Continue anyway since we've already cleared local state
      }

      console.log('Logout successful');
    } catch (error) {
      console.error('Error in logout process:', error);
      // Even if there's an error, try to clear local state
      try {
        setIsAuthenticated(false);
        setUserProfile(null);
        localStorage.removeItem('authUser');
      } catch (clearError) {
        console.error('Error clearing local state during logout:', clearError);
      }
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










