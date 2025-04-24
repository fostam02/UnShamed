import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
// useToast is not used directly here anymore, AuthContext handles toasts
// import { useToast } from '@/hooks/use-toast';
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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Removed resendConfirmationEmail, checkEmailConfirmation from context usage
  // Removed toast hook usage
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removed isLoading state as it is managed in AuthContext
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  // Removed isAdminEmail state

  // Get the page they were trying to visit before being redirected to login
  const from = (location.state as LocationState)?.from?.pathname || '/';

  // Removed checkIfAdminEmail function
  // Removed useEffect related to isAdminEmail

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password"); // Simple feedback
      return;
    }

    // isLoading is managed in AuthContext
    setIsEmailNotConfirmed(false); // Reset confirmation status on new attempt

    try {
      // AuthContext login now returns { user, error }
      const { user, error } = await login(email, password);

      if (error) {
        console.error('Login failed:', error);
        // Check error message for specific cases
        if (error.message && error.message.includes('Email not confirmed')) {
          setIsEmailNotConfirmed(true);
          // AuthContext already shows a toast for this
        }
        // AuthContext shows generic error toast otherwise
      } else if (user) {
        // Login successful, AuthContext handles the success toast
        console.log("Login successful, navigating...");
        navigate(from, { replace: true }); // Use replace to prevent back button going to login
      } else {
        // Handle unexpected case where login doesn't error but returns no user
        console.error('Login returned no user and no error.');
        alert('An unexpected issue occurred during login. Please try again.');
      }

    } catch (error: any) {
      // Catch any unexpected errors not handled by the login promise return
      console.error('Unhandled login exception:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      // isLoading is managed in AuthContext
    }
  };

  // Removed handleResendConfirmation function entirely

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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {isEmailNotConfirmed && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 mb-2">
                  Your email address has not been verified. Please check your inbox for a verification email from Supabase.
                </p>
                {/* Removed admin bypass message and resend button */}
                {/* If a resend mechanism is needed, it should likely be triggered */}
                {/* via a separate API call or Supabase function, not the old context method */}
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

            {/* Removed the resend confirmation button here */}
          </div>
        </div>

        {/* Updated demo instructions */}
        <div className="text-center text-sm text-muted-foreground">
           <p>Login using your registered email and password.</p>
           <p>Admin access is determined by the user role set in the database.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
