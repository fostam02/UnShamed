import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await context.login(email, password);
      // Don't navigate here - let the component handle navigation
      // This prevents race conditions with state updates
      return result;
    } catch (error) {
      console.error('Login error in useAuth:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      await context.logout();

      // Force a page reload to clear any in-memory state
      console.log('Redirecting to login page...');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error in useAuth:', error);
      // Even if there's an error, try to redirect to login
      window.location.href = '/login';
    }
  };

  return {
    ...context,
    login,
    logout,
  };
};
