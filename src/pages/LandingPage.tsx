import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#0f172a',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          Welcome to UnShamed
        </h1>
        
        <p style={{
          fontSize: '18px',
          marginBottom: '32px',
          color: '#94a3b8'
        }}>
          Your compliance tracking solution
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Having trouble with registration?
            </h2>
            
            <p style={{
              fontSize: '16px',
              marginBottom: '24px',
              color: '#94a3b8'
            }}>
              Try our simplified registration process that works even when our database is experiencing issues.
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/register-simple"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'medium',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Create Account (Simple Mode)
              </Link>
              
              <Link
                to="/login-simple"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid #4f46e5',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'medium',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Sign In (Simple Mode)
              </Link>
            </div>
          </div>
          
          <div style={{
            marginTop: '24px',
            fontSize: '14px',
            color: '#94a3b8'
          }}>
            <p>
              Want to try the standard registration process?{' '}
              <Link
                to="/register"
                style={{
                  color: '#4f46e5',
                  textDecoration: 'underline'
                }}
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
