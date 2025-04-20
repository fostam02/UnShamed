
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    console.log('Register button clicked');

    // Validate form
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Register the user
    setIsLoading(true);

    try {
      console.log('Attempting to register with:', { email, username });

      // Direct Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username,
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log('Registration successful:', data);

      // Create profile in the profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: username,
              last_name: '',
              role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
              is_profile_complete: false,
              licenses: []
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('Profile created successfully');
        }
      }

      toast({
        title: "Account Created",
        description: "You've successfully registered and can now log in.",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error?.message || "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/images/logo.png"
            alt="UnShamed Phoenix Logo"
            className="w-32 h-32"
          />
          <h1 className="text-3xl font-bold text-center">UnShamed</h1>
          <p className="text-muted-foreground text-center">Compliance Tracker</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Register to start tracking your compliance status
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors"
                disabled={isLoading}
                onClick={handleRegister}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;


