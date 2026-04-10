
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      
      // Fetch user data after login
      const validateResponse = await authApi.validate();
      const userData = { 
        email: validateResponse.data.email || credentials.email, 
        role: validateResponse.data.role 
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (data) => {
    try {
      await authApi.signup(data);
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Optional: Re-validate token with backend on refresh
          // const validateResponse = await authApi.validate();
          setUser(JSON.parse(savedUser));
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
