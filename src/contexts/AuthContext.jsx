
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          // If token is invalid or expired, clear it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to check authentication status', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [API_URL]);

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: 'Account created successfully!',
        description: 'Please login with your credentials.',
        duration: 5000,
      });

      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message,
        duration: 5000,
      });
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.user.name}!`,
        duration: 3000,
      });

      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message,
        duration: 5000,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      duration: 3000,
    });
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
