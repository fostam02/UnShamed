import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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

    // Start loading
    setIsLoading(true);

    try {
      console.log('Attempting direct registration with:', { email, username });
      
      // First, check if the user already exists in profiles
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
        
      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        throw new Error('Error checking if user already exists');
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        throw new Error('An account with this email already exists');
      }
      
      // Generate a unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a profile directly in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            first_name: username,
            last_name: '',
            role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
            is_profile_complete: false,
            licenses: [],
            password_hash: btoa(password) // Simple encoding, not secure but works for demo
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error('Failed to create user profile');
      }
      
      console.log('Profile created successfully, bypassing Supabase Auth');
      
      // Store auth info in localStorage to simulate a logged-in user
      const userProfile = {
        id: userId,
        firstName: username,
        lastName: '',
        email: email,
        licenses: [],
        isProfileComplete: false,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
      };
      
      localStorage.setItem('authUser', JSON.stringify({
        isAuthenticated: true,
        userProfile
      }));
      
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
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
