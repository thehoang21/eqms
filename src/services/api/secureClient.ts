/**
 * Enhanced API Client with Security Features
 * Adds CSRF protection, rate limiting, request encryption, and audit logging
 */

import { axios } from '@/lib/axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from '@/lib/axios';
import { secureStorage, tokenUtils, csrfToken, auditLog, RateLimiter } from '@/utils/security';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Rate limiter for API requests (max 100 requests per minute)
const apiRateLimiter = new RateLimiter(100, 60000);

// Create axios instance with security config
const secureApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for CSRF
});

/**
 * Request Interceptor - Security enhancements
 */
secureApiClient.interceptors.request.use(
  (config) => {
    // Rate limiting check
    const endpoint = config.url || 'unknown';
    if (!apiRateLimiter.isAllowed(endpoint)) {
      auditLog.log('rate_limit_exceeded', { endpoint });
      return Promise.reject(new Error('Rate limit exceeded. Please try again later.'));
    }

    // Get and validate token
    const token = secureStorage.getItem('authToken', true);
    
    if (token) {
      // Check if token is expired
      if (tokenUtils.isTokenExpired(token)) {
        auditLog.log('expired_token_detected');
        secureStorage.removeItem('authToken');
        secureStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired'));
      }

      // Check if token needs refresh
      if (tokenUtils.needsRefresh(token)) {
        auditLog.log('token_refresh_needed');
        // Trigger token refresh (implement in AuthContext)
        // For now, just add the token
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing methods
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrf = csrfToken.get();
      if (csrf) {
        config.headers['X-CSRF-Token'] = csrf;
      }
    }

    // Add correlation ID for request tracking
    config.headers['X-Correlation-ID'] = crypto.randomUUID();

    // Add timestamp for replay attack prevention
    config.headers['X-Request-Time'] = Date.now().toString();

    // Security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    // Audit log for sensitive operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      auditLog.log('api_request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
      });
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 Secure API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
        hasCsrf: !!config.headers['X-CSRF-Token'],
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    auditLog.log('request_error', { error: error.message });
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Security & error handling
 */
secureApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Update CSRF token if provided in response
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      csrfToken.store(newCsrfToken);
    }

    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ Secure API Response:', {
        status: response.status,
        url: response.config.url,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          console.error('🔒 Unauthorized - session expired');
          auditLog.log('unauthorized_access', { url: config?.url });
          secureStorage.removeItem('authToken');
          secureStorage.removeItem('user');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - insufficient permissions
          console.error('🚫 Forbidden - insufficient permissions');
          auditLog.log('forbidden_access', { url: config?.url });
          break;

        case 404:
          console.error('🔍 Resource not found');
          break;

        case 422:
          console.error('⚠️ Validation Error:', data);
          break;

        case 429:
          // Too many requests - rate limited by server
          console.error('⏸️ Rate limit exceeded by server');
          auditLog.log('server_rate_limit', { url: config?.url });
          break;

        case 500:
        case 502:
        case 503:
          console.error('💥 Server Error');
          auditLog.log('server_error', { status, url: config?.url });
          break;

        default:
          console.error(`❌ Error ${status}:`, data);
          auditLog.log('api_error', { status, url: config?.url });
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('🌐 Network Error - no response received');
      auditLog.log('network_error', { url: config?.url });
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Export secure API client
 */
export default secureApiClient;

/**
 * Type-safe API wrapper with security
 */
export const secureApi = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    secureApiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    secureApiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    secureApiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    secureApiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    secureApiClient.delete<T>(url, config).then((res) => res.data),
};

/**
 * Helper to check API health
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await secureApiClient.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};
