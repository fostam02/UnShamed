import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// The admin password - in a real app, this would be stored securely
// and validated on the server side
const ADMIN_PASSWORD = 'admin123';

interface AdminAuthProps {
  children: React.ReactNode;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Check if user is an admin
  const isAdmin = userProfile?.role === 'admin';

  // Check if admin is already authorized from session storage
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  // Handle lock timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate server validation with a timeout
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthorized(true);
        sessionStorage.setItem('adminAuth', 'true');
        toast({
          title: "Access Granted",
          description: "Welcome to the Admin Panel",
        });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Lock after 3 failed attempts
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTimer(30); // Lock for 30 seconds
          toast({
            title: "Too Many Failed Attempts",
            description: "Admin access has been temporarily locked. Please try again later.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Access Denied",
            description: `Incorrect password. ${3 - newAttempts} attempts remaining.`,
            variant: "destructive"
          });
        }
      }
      setIsLoading(false);
      setPassword('');
    }, 1000);
  };

  // If user is not an admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // If admin is authorized, show the admin content
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Otherwise, show the password form
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Admin Authentication</CardTitle>
          </div>
          <CardDescription>
            Please enter the admin password to access the admin panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLocked || isLoading}
                    required
                  />
                </div>
              </div>
              
              {isLocked && (
                <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">
                  Too many failed attempts. Please wait {lockTimer} seconds before trying again.
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLocked || isLoading || !password.trim()}
            >
              {isLoading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
