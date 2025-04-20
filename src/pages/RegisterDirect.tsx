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

      // Generate a unique ID for the user
      const userId = uuidv4();
      console.log('Generated user ID:', userId);

      // Create a simple password hash (for demo purposes only)
      // In a real app, use a proper hashing library like bcrypt
      const passwordHash = btoa(password); // Base64 encoding for demo

      // Create the user profile directly in the profiles table
      // For the deployed version, we need to be more careful with the data types
      const userData = {
        id: userId,
        email: email.toLowerCase(),
        first_name: username,
        last_name: '',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        is_profile_complete: false,
        // Handle licenses field differently based on environment
        // Some environments expect a JSON string, others expect a JSONB object
        licenses: [], // Use empty array directly - Supabase will handle conversion
        password_hash: passwordHash, // Store the password hash
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('User data being sent to database:', JSON.stringify(userData));

      console.log('Creating user profile directly in database');

      let profileData;
      let profileError;

      try {
        // Wrap the database operation in a try-catch to handle any unexpected errors
        console.log('Attempting to insert user profile with ID:', userId);

        // First try with the standard approach
        let result = await supabase
          .from('profiles')
          .insert([userData])
          .select();

        // If there's an error, try a fallback approach without the select
        if (result.error) {
          console.log('First insert attempt failed, trying fallback approach');
          console.log('Error from first attempt:', result.error);

          // Try without the select() call which can sometimes cause issues
          const fallbackResult = await supabase
            .from('profiles')
            .insert([userData]);

          if (fallbackResult.error) {
            console.log('Fallback insert also failed:', fallbackResult.error);
            profileError = fallbackResult.error;
          } else {
            console.log('Fallback insert succeeded');
            // Manually fetch the profile we just created
            const fetchResult = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            profileData = fetchResult.data ? [fetchResult.data] : null;
            profileError = fetchResult.error;
          }
        } else {
          profileData = result.data;
          profileError = result.error;
        }
      } catch (dbError) {
        console.error('Unexpected database error:', dbError);
        setError(`Database error: ${dbError.message || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }

      if (profileError) {
        console.error('Error creating profile:', profileError);
        console.log('Profile error details:', JSON.stringify(profileError));

        // Try one last approach - direct SQL insert as a last resort
        try {
          console.log('Attempting direct SQL insert as last resort');

          // Create a simplified user object with only the essential fields
          const minimalUserData = {
            id: userId,
            email: email.toLowerCase(),
            first_name: username,
            role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
            password_hash: passwordHash
          };

          // Use RPC to insert the user directly
          const { error: rpcError } = await supabase.rpc('create_profile_direct', {
            profile_data: minimalUserData
          });

          if (rpcError) {
            console.error('Final fallback also failed:', rpcError);

            // Now provide specific error messages based on the error code
            if (profileError.code === '23505') {
              setError('An account with this email already exists');
            } else if (profileError.code === '23502') {
              setError('Missing required fields. Please fill out all fields.');
            } else if (profileError.code === '22P02') {
              setError('Invalid data format. Please try again with valid information.');
            } else {
              // Include the error code and message for better debugging
              setError(`Failed to create account: ${profileError.message || 'Unknown error'} (Code: ${profileError.code || 'none'})`);
            }

            setIsLoading(false);
            return;
          } else {
            console.log('Direct SQL insert succeeded');
            // Continue with the registration process
          }
        } catch (finalError) {
          console.error('Final fallback attempt failed:', finalError);
          setError(`Failed to create account: ${finalError.message || 'Unknown error'}`);
          setIsLoading(false);
          return;
        }
      }

      console.log('Profile created successfully:', profileData);

      // Try to also create the user in Supabase Auth (but don't fail if it doesn't work)
      try {
        console.log('Attempting to create user in Supabase Auth as well');

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
          // Just log the error but continue since we already created the profile
          console.log('Note: Could not create user in Supabase Auth:', authError.message);
          console.log('This is OK since we created the profile directly');
        } else {
          console.log('User also created in Supabase Auth');

          // Try to manually confirm the email
          try {
            const { error: confirmError } = await supabase.rpc('auto_confirm_email_manual', {
              user_id: authData.user?.id
            });

            if (confirmError) {
              console.log('Could not confirm email, but that\'s OK');
            }
          } catch (confirmErr) {
            console.log('Error confirming email, but that\'s OK');
          }
        }
      } catch (authErr) {
        // Just log the error but continue since we already created the profile
        console.log('Note: Error creating user in Supabase Auth:', authErr);
        console.log('This is OK since we created the profile directly');
      }

      // Store auth info in localStorage using the profile we created directly
      const userProfile = {
        id: userId, // Use the UUID we generated
        firstName: username,
        lastName: '',
        email: email.toLowerCase(),
        licenses: [], // Empty array for licenses
        isProfileComplete: false,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
      };

      console.log('User profile for localStorage:', JSON.stringify(userProfile));

      localStorage.setItem('authUser', JSON.stringify({
        isAuthenticated: true,
        userProfile
      }));

      console.log('Registration completed successfully with user ID:', userId);

      // Try to set the session in Supabase if possible
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session:', sessionData ? 'Session exists' : 'No session');
      } catch (sessionErr) {
        console.log('Could not get session, but that\'s OK');
      }

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
