/**
 * API Services Index
 * Export all API services from here
 */

export { api, uploadFile } from './client';
export { documentApi } from './documents';
export { taskApi } from './tasks';
export { authApi } from './auth';

// Re-export types for convenience
export type * from '@/types';
