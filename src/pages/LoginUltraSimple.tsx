import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types';

const LoginUltraSimple = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First try the hook-based login
      const result = await login(email, password);

      if (result.success) {
        setSuccess('Login successful! Redirecting...');

        // Also perform a direct login to ensure localStorage is set
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
          name: email.split('@')[0]
        };

        // If admin, also set admin auth
        if (isAdminEmail) {
          sessionStorage.setItem('adminAuth', 'true');
        }

        // Set auth data directly in localStorage
        localStorage.setItem('authUser', JSON.stringify({
          isAuthenticated: true,
          userProfile: profile
        }));

        // Force a full page reload to ensure all state is properly initialized
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
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
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>For demo purposes, you can use any email and password.</p>
          <p>Include "admin" in the email to get admin access.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginUltraSimple;

