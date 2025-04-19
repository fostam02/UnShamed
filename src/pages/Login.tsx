
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  const { login, resendConfirmationEmail } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get the page they were trying to visit before being redirected to login
  const from = (location.state as LocationState)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });
      navigate(from);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error);

      // Specific error message for unconfirmed email
      if (error.message?.includes('Email not confirmed')) {
        toast({
          title: "Email Not Verified",
          description: "Please check your email inbox and verify your email address before logging in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Failed",
          description: error?.message || "Invalid credentials. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await resendConfirmationEmail(email);
      toast({
        title: "Confirmation Email Sent",
        description: "Please check your email inbox for the verification link."
      });
    } catch (error: any) {
      toast({
        title: "Failed to Resend",
        description: error?.message || "Could not resend confirmation email.",
        variant: "destructive"
      });
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {error?.message?.includes('Email not confirmed') && (
              <Button
                type="button"
                variant="link"
                onClick={handleResendConfirmation}
                className="w-full mt-2 text-sm"
              >
                Resend confirmation email
              </Button>
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
              disabled={!email}
            >
              Resend confirmation email
            </Button>
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

export default Login;














