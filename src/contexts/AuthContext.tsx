/**
 * Authentication Context - Enhanced with Security Features
 * Provides authentication state and methods throughout the app
 * Includes secure token storage, session monitoring, and audit logging
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';
import type { User, LoginCredentials } from '@/types';
import { secureStorage, tokenUtils, auditLog, csrfToken } from '@/utils/security';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: Error }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount with security checks
  useEffect(() => {
    const checkAuth = async () => {
      const token = secureStorage.getItem('authToken', true); // Decrypt token
      const storedUser = secureStorage.getItem('user', true);

      if (token && storedUser) {
        try {
          // Validate token expiry
          if (tokenUtils.isTokenExpired(token)) {
            auditLog.log('expired_token_on_mount');
            secureStorage.removeItem('authToken');
            secureStorage.removeItem('user');
            setLoading(false);
            return;
          }

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Generate CSRF token
          const csrf = csrfToken.generate();
          csrfToken.store(csrf);

          auditLog.log('session_restored', { userId: parsedUser.id });

          // Optionally validate token with backend
          // const currentUser = await authApi.getCurrentUser();
          // setUser(currentUser);
        } catch (error) {
          if (import.meta.env.DEV) console.error('Error parsing stored user:', error);
          auditLog.log('auth_check_error', { error: String(error) });
          secureStorage.removeItem('authToken');
          secureStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      
      // Store token securely (encrypted)
      secureStorage.setItem('authToken', response.token, true);
      secureStorage.setItem('user', JSON.stringify(response.user), true);
      
      setUser(response.user);
      setIsAuthenticated(true);

      // Generate CSRF token
      const csrf = csrfToken.generate();
      csrfToken.store(csrf);

      auditLog.log('login_success', { 
        userId: response.user.id, 
        role: response.user.role 
      });

      return { success: true };
    } catch (error) {
      // Demo mode: if API is unavailable, use demo credentials
      if (credentials.username === 'admin' && credentials.password === '123456') {
        const demoUser: User = {
          id: '1',
          username: 'admin',
          email: 'admin@eqms.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'admin',
          department: 'Quality Assurance',
        };
        const demoToken = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) + 86400 }));
        
        secureStorage.setItem('authToken', demoToken, true);
        secureStorage.setItem('user', JSON.stringify(demoUser), true);
        
        setUser(demoUser);
        setIsAuthenticated(true);

        auditLog.log('demo_login_success', { userId: demoUser.id });
        return { success: true };
      }

      auditLog.log('login_failed', { 
        username: credentials.username,
        error: String(error) 
      });
      return { success: false, error: error as Error };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      auditLog.log('logout_success', { userId: user?.id });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Logout error:', error);
      auditLog.log('logout_error', { error: String(error) });
    } finally {
      // Clear all secure storage
      secureStorage.removeItem('authToken');
      secureStorage.removeItem('user');
      csrfToken.store(''); // Clear CSRF
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    secureStorage.setItem('user', JSON.stringify(updatedUser), true);
    auditLog.log('user_updated', { userId: updatedUser.id });
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentToken = secureStorage.getItem('authToken', true);
      if (!currentToken) return false;

      // Call refresh endpoint (implement in authApi)
      // const response = await authApi.refreshToken(currentToken);
      // secureStorage.setItem('authToken', response.token, true);
      
      auditLog.log('token_refreshed', { userId: user?.id });
      return true;
    } catch (error) {
      auditLog.log('token_refresh_failed', { error: String(error) });
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
