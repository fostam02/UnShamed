
import React, { useState, useEffect } from 'react';
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
  const { login, resendConfirmationEmail, checkEmailConfirmation } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [isAdminEmail, setIsAdminEmail] = useState(false);

  // Get the page they were trying to visit before being redirected to login
  const from = (location.state as LocationState)?.from?.pathname || '/';

  // Check if the email is an admin email
  const checkIfAdminEmail = (email: string) => {
    return email.toLowerCase().includes('admin');
  };

  // Update admin status when email changes
  useEffect(() => {
    setIsAdminEmail(checkIfAdminEmail(email));
  }, [email]);

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

      // Specific error message for unconfirmed email
      if (error.message?.includes('Email not confirmed')) {
        setIsEmailNotConfirmed(true);
        toast({
          title: "Email Not Verified",
          description: "Please verify your email address before logging in. Click 'Resend confirmation email' below.",
          variant: "destructive"
        });
      } else {
        setIsEmailNotConfirmed(false);
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
      // First check if the email is already confirmed
      const isConfirmed = await checkEmailConfirmation(email);

      if (isConfirmed) {
        toast({
          title: "Email Already Confirmed",
          description: "This email is already confirmed. You can log in with your password."
        });
        return;
      }

      // If not confirmed, resend the confirmation email
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

            {isEmailNotConfirmed && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800 mb-2">
                  Your email address has not been verified. Please check your inbox for a verification email or click below to receive a new one.
                </p>
                {isAdminEmail && (
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Admin account detected:</strong> Email confirmation will be bypassed for admin accounts. You can proceed with login.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendConfirmation}
                  className="w-full text-sm bg-amber-100 hover:bg-amber-200 border-amber-300"
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














