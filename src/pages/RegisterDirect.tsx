import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const RegisterDirect = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    // Reset states
    setError('');
    setSuccess('');

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check for offensive content in email or username
    const offensiveRegex = /fuck|shit|ass|bitch|cunt|dick/i;
    if (offensiveRegex.test(email) || offensiveRegex.test(username)) {
      setError('Please use appropriate language in your email and username');
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      console.log('Attempting direct registration with:', { email, username });

      try {
        // First, check if the user already exists in profiles
        const { data: existingProfiles, error: checkError } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email.toLowerCase())
          .limit(1);

        if (checkError) {
          console.error('Error checking existing profile:', checkError);
          // Continue with registration instead of throwing an error
          console.log('Continuing with registration despite check error');
        } else if (existingProfiles && existingProfiles.length > 0) {
          setError('An account with this email already exists');
          setIsLoading(false);
          return;
        }
      } catch (checkErr) {
        console.error('Exception during user existence check:', checkErr);
        // Continue with registration instead of failing
        console.log('Continuing with registration despite check exception');
      }

      try {
        console.log('Creating user with Supabase Auth first');

        // Step 1: Create the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: password,
          options: {
            data: {
              full_name: username
            }
          }
        });

        if (authError) {
          console.error('Error creating user with Supabase Auth:', authError);
          if (authError.message.includes('User already registered')) {
            setError('An account with this email already exists');
          } else {
            console.log('Auth error details:', JSON.stringify(authError));
            setError('Failed to create account: ' + (authError.message || 'Unknown error'));
          }
          setIsLoading(false);
          return;
        }

        if (!authData.user) {
          console.error('No user returned from Supabase Auth');
          setError('Failed to create account: No user ID returned');
          setIsLoading(false);
          return;
        }

        // Check if email confirmation is required
        if (authData.user.email_confirmed_at === null) {
          console.log('Email confirmation may be required, checking auto-confirm trigger');

          // Wait a moment for the auto-confirm trigger to run
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if the email has been auto-confirmed
          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError) {
            console.error('Error checking user confirmation status:', userError);
          } else if (userData.user && userData.user.email_confirmed_at === null) {
            console.log('Email still not confirmed, attempting to force confirmation');

            // Try to manually confirm the email with SQL
            try {
              const { error: confirmError } = await supabase.rpc('auto_confirm_email_manual', {
                user_id: authData.user.id
              });

              if (confirmError) {
                console.error('Error manually confirming email:', confirmError);
              } else {
                console.log('Email manually confirmed successfully');
              }
            } catch (confirmErr) {
              console.error('Exception during manual email confirmation:', confirmErr);
            }
          } else {
            console.log('Email has been auto-confirmed successfully');
          }
        }

        const userId = authData.user.id;
        console.log('User created successfully with ID:', userId);

        // Step 2: Create the profile in the profiles table
        const userData = {
          id: userId,
          email: email.toLowerCase(),
          first_name: username,
          last_name: '',
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
          is_profile_complete: false,
          licenses: []
        };

        console.log('Attempting to create profile with data:', JSON.stringify(userData));

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([userData])
          .select();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          console.log('Profile error details:', JSON.stringify(profileError));
          setError('Account created but profile setup failed: ' + (profileError.message || 'Unknown error'));
          setIsLoading(false);
          return;
        }

        console.log('Profile created successfully:', profileData);
      } catch (insertErr: any) {
        console.error('Exception during registration process:', insertErr);
        // Provide more detailed error information
        const errorMessage = insertErr?.message || 'Unknown error';
        console.log('Error details:', JSON.stringify(insertErr));

        // Check if this is a network error
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (errorMessage.includes('permission') || errorMessage.includes('access')) {
          setError('Permission denied. Please try again or contact support.');
        } else {
          setError(`Registration failed: ${errorMessage}`);
        }

        setIsLoading(false);
        return;
      }

      console.log('Registration completed successfully');

      // Store auth info in localStorage
      const userProfile = {
        id: userId,
        firstName: username,
        lastName: '',
        email: email.toLowerCase(),
        licenses: [],
        isProfileComplete: false,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
      };

      localStorage.setItem('authUser', JSON.stringify({
        isAuthenticated: true,
        userProfile
      }));

      // Also set the session in Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session:', sessionData);

      setSuccess('Account created successfully! Redirecting to dashboard...');

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      console.log('Full error details:', JSON.stringify(error));
      setError(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#0f172a'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px',
          textAlign: 'center'
        }}>Create Account</h1>

        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '24px',
          textAlign: 'center'
        }}>Register to start tracking your compliance status</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'medium',
            color: 'white'
          }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'medium',
            color: 'white'
          }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'medium',
            color: 'white'
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 'medium',
            color: 'white'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#22c55e',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#4f46e5aa' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'medium',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '16px'
        }}>
          Already have an account?
        </div>

        <Link
          to="/login"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #334155',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'medium',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterDirect;
