import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('petbloom_token') || localStorage.getItem('paw_ritual_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authService.getMe();
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('petbloom_token');
        localStorage.removeItem('paw_ritual_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.data.success) {
      localStorage.setItem('petbloom_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.data.success) {
      localStorage.setItem('petbloom_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('petbloom_token');
    localStorage.removeItem('paw_ritual_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await authService.getMe();
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (e) {
      console.warn('Failed to refresh user:', e.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
