// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js'; // Import authService
import PermissionsService from '../services/PermissionsService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tenantKey, setTenantKey] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedKey = localStorage.getItem('tenant_key');

    if (storedToken && storedUser && storedKey) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); 
      setTenantKey(storedKey)
    } else {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      setTenantKey(null);
    }
    setIsAuthInitializing(false);
  }, []);

   const login = (authData) => {
    setIsAuthenticated(true);
    setUser(authData.user);
    setToken(authData.token);
    setTenantKey(authData.tenant_key);
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('tenant_key', authData.tenant_key);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout via authService failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setTenantKey(null);
      setPermissions(null);
      setToken(null);
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const getUserPermissions = async () => {
  if (!user?.id || !tenantKey) {
    console.warn('getUserPermissions: Missing user or tenantKey');
    return null;
  }

  try {
    const data = await PermissionsService.userPermission(user.id, tenantKey);
    return data;
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return null;
  }
};

  return (
    <AuthContext.Provider value={{ getUserPermissions ,isAuthenticated, user, token, tenantKey, login, logout, isAuthInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};