import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to send a password reset email
      // For demo purposes, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for password reset instructions"
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive"
      });
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
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent password reset instructions to:
              </p>
              <p className="font-medium">{email}</p>
              <p className="text-sm text-muted-foreground mt-4">
                If you don't see the email, check your spam folder or make sure you entered the correct email address.
              </p>
              
              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link to="/login">
                    Return to Login
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
              <p className="text-muted-foreground mb-6">
                Enter your email address and we'll send you instructions to reset your password.
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>
            </>
          )}
        </div>
        
        <Button variant="ghost" className="w-full" asChild>
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
