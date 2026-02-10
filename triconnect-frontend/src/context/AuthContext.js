import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkModeState] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('refreshUser error', err);
      return null;
    }
  };

  const signUp = async (userData) => {
    const response = await authAPI.userSignUp(userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const signIn = async (credentials) => {
    const response = await authAPI.userSignIn(credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const adminSignUp = async (adminData) => {
    const response = await authAPI.adminSignUp(adminData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const googleLogin = async (googleData) => {
    const response = await authAPI.googleLogin(googleData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const toggleDarkMode = async (enabled) => {
    setDarkModeState(enabled);
    localStorage.setItem('darkMode', enabled ? 'true' : 'false');
    if (enabled) document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
    
    // Persist to backend if user is logged in
    if (token) {
      try {
        const data = new FormData();
        data.append('theme', enabled ? 'dark' : 'light');
        await authAPI.updateProfile(data);
      } catch (err) {
        console.warn('Failed to persist theme to backend');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signUp,
        signIn,
        adminSignUp,
        googleLogin,
        logout,
        refreshUser,
        setUser,
        darkMode,
        toggleDarkMode,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
