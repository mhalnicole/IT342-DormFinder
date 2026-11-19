import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dormfinder_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('dormfinder_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response && response.success && response.data) {
          setUser(response.data);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response && response.success && response.data) {
      const authData = response.data;
      localStorage.setItem('dormfinder_token', authData.token);
      setToken(authData.token);
      setUser(authData);
      return authData;
    }
    throw new Error((response && response.message) || 'Login failed');
  };

  const register = async (registerData) => {
    const response = await api.post('/auth/register', registerData);
    if (response && response.success && response.data) {
      const authData = response.data;
      localStorage.setItem('dormfinder_token', authData.token);
      setToken(authData.token);
      setUser(authData);
      return authData;
    }
    throw new Error((response && response.message) || 'Registration failed');
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout', {});
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('dormfinder_token');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    role: user ? user.role : null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
