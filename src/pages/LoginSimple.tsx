import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginSimple = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Reset error
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      console.log('Attempting local login for:', email);

      // Check if user exists in local storage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('User not found. Please check your email or register a new account.');
        setIsLoading(false);
        return;
      }

      // Verify password
      const passwordHash = btoa(password);
      if (user.passwordHash !== passwordHash) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Login successful - create user profile
      const userProfile = {
        id: user.userId,
        firstName: user.username,
        lastName: '',
        email: user.email.toLowerCase(),
        licenses: [],
        isProfileComplete: false,
        role: user.role || 'user'
      };

      // Store in localStorage
      localStorage.setItem('authUser', JSON.stringify({
        isAuthenticated: true,
        userProfile
      }));

      console.log('Local login successful');

      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Login failed. Please try again.');
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
        }}>Sign In</h1>

        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '24px',
          textAlign: 'center'
        }}>Log in to access your compliance dashboard</p>

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

        <div style={{ marginBottom: '24px' }}>
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
            placeholder="Enter your password"
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

        <button
          onClick={handleLogin}
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
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '16px'
        }}>
          Don't have an account?
        </div>

        <Link
          to="/register-simple"
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
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginSimple;
