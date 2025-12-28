/**
 * Document Management API Service
 * All API calls related to documents
 */

import { api } from './client';
import type { Document, DocumentFilter, PaginatedResponse } from '@/types/document';

const DOCUMENTS_ENDPOINT = '/documents';

export const documentApi = {
  /**
   * Get all documents with filters and pagination
   */
  getDocuments: async (filters?: DocumentFilter, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.owner && { owner: filters.owner }),
    });

    const response = await api.get<PaginatedResponse<Document>>(
      `${DOCUMENTS_ENDPOINT}?${params}`
    );
    return response.data;
  },

  /**
   * Get document by ID
   */
  getDocumentById: async (id: string) => {
    const response = await api.get<Document>(`${DOCUMENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new document
   */
  createDocument: async (data: Partial<Document>) => {
    const response = await api.post<Document>(DOCUMENTS_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update document
   */
  updateDocument: async (id: string, data: Partial<Document>) => {
    const response = await api.put<Document>(`${DOCUMENTS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string) => {
    const response = await api.delete(`${DOCUMENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Approve document with e-signature
   */
  approveDocument: async (id: string, signature: { username: string; password: string; reason: string }) => {
    const response = await api.post(`${DOCUMENTS_ENDPOINT}/${id}/approve`, signature);
    return response.data;
  },

  /**
   * Get document versions
   */
  getDocumentVersions: async (id: string) => {
    const response = await api.get(`${DOCUMENTS_ENDPOINT}/${id}/versions`);
    return response.data;
  },

  /**
   * Export documents to CSV
   */
  exportDocuments: async (filters?: DocumentFilter) => {
    const params = new URLSearchParams({
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await api.get(`${DOCUMENTS_ENDPOINT}/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
