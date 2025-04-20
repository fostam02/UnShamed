import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginSimple = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdminEmail, setIsAdminEmail] = useState(false);

  // Get the page they were trying to visit before being redirected to login
  const from = (location.state as LocationState)?.from?.pathname || '/';

  // Check if the email is an admin email or a special test email
  const checkIfAdminEmail = (email: string) => {
    return email.toLowerCase().includes('admin') || 
           email.toLowerCase() === 'nestertester5@testing.org' ||
           email.toLowerCase() === 'gamedesign2030@gmail.com';
  };

  // Update admin status when email changes
  useEffect(() => {
    setIsAdminEmail(checkIfAdminEmail(email));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      // Check if this is a special email that should bypass normal authentication
      if (isAdminEmail) {
        console.log('Special email detected, checking profiles table first');
        
        // First check if the user exists in the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
          
        if (!profileError && profileData) {
          console.log('Profile found, creating session manually');
          
          // Create a user profile
          const userProfile = {
            id: profileData.id,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: email,
            licenses: profileData.licenses || [],
            isProfileComplete: !!profileData.is_profile_complete,
            role: profileData.role || 'user'
          };
          
          // Store in localStorage to simulate a logged-in user
          localStorage.setItem('authUser', JSON.stringify({
            isAuthenticated: true,
            userProfile
          }));
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect to the page they were trying to access
          setTimeout(() => {
            navigate(from);
          }, 1000);
          
          return;
        }
      }
      
      // Standard login flow if special handling didn't apply
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Special handling for email confirmation errors
        if (error.message && error.message.includes('Email not confirmed')) {
          if (isAdminEmail) {
            // For admin emails, we'll bypass the confirmation
            console.log('Bypassing email confirmation for admin account');
            
            // Create a mock user profile
            const adminProfile = {
              id: `admin_${Date.now()}`,
              firstName: 'Admin',
              lastName: 'User',
              email: email,
              licenses: [],
              isProfileComplete: true,
              role: 'admin'
            };
            
            // Store in localStorage
            localStorage.setItem('authUser', JSON.stringify({
              isAuthenticated: true,
              userProfile: adminProfile
            }));
            
            setSuccess('Login successful! Redirecting...');
            
            // Redirect to the page they were trying to access
            setTimeout(() => {
              navigate(from);
            }, 1000);
            
            return;
          } else {
            setError('Email not confirmed. Please check your inbox for a verification email.');
          }
        } else {
          throw error;
        }
      } else if (data.user) {
        console.log('Login successful:', data);
        
        // Fetch user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        let userProfile;
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          
          // If the profile doesn't exist, create a default one
          userProfile = {
            id: data.user.id,
            firstName: data.user.email?.split('@')[0] || 'User',
            lastName: '',
            email: data.user.email || '',
            licenses: [],
            isProfileComplete: false,
            role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
          };
        } else {
          userProfile = {
            id: data.user.id,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: data.user.email || '',
            licenses: profileData.licenses || [],
            isProfileComplete: !!profileData.is_profile_complete,
            role: profileData.role || 'user'
          };
        }
        
        // Store in localStorage
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile
        }));
        
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to the page they were trying to access
        setTimeout(() => {
          navigate(from);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setSuccess('Confirmation email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Error resending confirmation email:', error);
      setError(error?.message || 'Could not resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold">UnShamed</h1>
          <p className="text-muted-foreground">Compliance Tracker</p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-muted-foreground mb-6">
            Login to access your compliance dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {error && error.includes('Email not confirmed') && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800 mb-2">
                  Your email address has not been verified. Please check your inbox for a verification email or click below to receive a new one.
                </p>
                {isAdminEmail && (
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Special account detected:</strong> Email confirmation will be bypassed. You can proceed with login.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendConfirmation}
                  className="w-full text-sm bg-amber-100 hover:bg-amber-200 border-amber-300"
                  disabled={isLoading}
                >
                  Resend confirmation email
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create account
              </Link>
            </p>

            <Button
              type="button"
              variant="link"
              onClick={handleResendConfirmation}
              className="text-sm text-muted-foreground hover:text-primary"
              disabled={!email || isLoading}
            >
              Resend confirmation email
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>For demo purposes, you can use any email and password.</p>
          <p>Include "admin" in the email to get admin access.</p>
          <p>The emails "nestertester5@testing.org" and "gamedesign2030@gmail.com" are also pre-approved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;
