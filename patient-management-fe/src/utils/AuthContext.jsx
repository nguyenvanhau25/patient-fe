import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, patientApi } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tìm patientId thật từ patient-service theo email
  const findPatientId = async (email) => {
    try {
      const res = await patientApi.getAll();
      const patients = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const matched = patients.find(p => p.email === email);
      return matched?.id || null;
    } catch (e) {
      console.warn('Could not find patientId:', e);
      return null;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, userId, email, role, fullName } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Với USER role, tìm patientId tương ứng
      let patientId = null;
      if (role !== 'ADMIN') {
        patientId = await findPatientId(email);
      }

      const userData = { userId, email, role, fullName, patientId };
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
      const refreshToken = localStorage.getItem('refreshToken');
      await authApi.logout(refreshToken);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
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
          const parsed = JSON.parse(savedUser);
          // Nếu user cũ chưa có patientId thì tìm lại
          if (!parsed.patientId && parsed.role !== 'ADMIN' && parsed.email) {
            const patientId = await findPatientId(parsed.email);
            parsed.patientId = patientId;
            localStorage.setItem('user', JSON.stringify(parsed));
          }
          setUser(parsed);
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