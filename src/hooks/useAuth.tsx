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
      await context.login(email, password);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await context.logout();
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  return {
    ...context,
    login,
    logout,
  };
};
