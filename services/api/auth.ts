/**
 * Authentication API Service
 * All API calls related to authentication
 */

import { api } from './client';
import type { User, LoginCredentials, LoginResponse } from '@/types/auth';

const AUTH_ENDPOINT = '/auth';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>(`${AUTH_ENDPOINT}/login`, credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post(`${AUTH_ENDPOINT}/logout`);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get<User>(`${AUTH_ENDPOINT}/me`);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<User>(`${AUTH_ENDPOINT}/profile`, data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post(`${AUTH_ENDPOINT}/change-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    const response = await api.post<{ token: string }>(`${AUTH_ENDPOINT}/refresh`);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },

  /**
   * Verify e-signature credentials
   */
  verifyESignature: async (username: string, password: string) => {
    const response = await api.post<{ valid: boolean }>(`${AUTH_ENDPOINT}/verify-signature`, {
      username,
      password,
    });
    return response.data;
  },
};
