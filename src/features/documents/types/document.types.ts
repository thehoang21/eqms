/**
 * Core Document Types
 * 
 * Shared type definitions used across the documents feature.
 */

// Document type - Abbreviated aliases used in mock data and display
// Full names from @/types/documentTypes are the canonical business names
export type DocumentTypeAbbrev = 
  | "SOP" 
  | "Policy" 
  | "Form" 
  | "Report" 
  | "Specification" 
  | "Protocol";

// Re-export full-name DocumentType from canonical source and extend with abbreviations
import type { DocumentType as DocumentTypeFullName } from '@/types/documentTypes';
export type DocumentType = DocumentTypeFullName | DocumentTypeAbbrev;
export { DOCUMENT_TYPES, DOCUMENT_TYPE_CODES, DOCUMENT_TYPE_LABELS } from '@/types/documentTypes';

// Document status enum - Single source of truth for all document statuses
export type DocumentStatus = 
  | "Draft" 
  | "Active"
  | "Pending Review" 
  | "Pending Approval" 
  | "Approved" 
  | "Pending Training" 
  | "Ready for Publishing" 
  | "Published" 
  | "Effective" 
  | "Archive"
  | "Obsoleted"
  | "Closed - Cancelled";

// View type for document lists
export type DocumentViewType = "all" | "owned-by-me";

// Table column configuration
export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

// Document entity
export interface Document {
  id: string;
  documentId: string;
  title: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
  effectiveDate: string;
  validUntil: string;
  author: string;
  department: string;
  created: string;
  openedBy: string;
  description?: string;
  hasRelatedDocuments?: boolean;
}

// Uploaded file type
export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
}

// Parent/Related document types
export interface ParentDocument {
  id: string;
  documentId: string;
  title: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
}

export interface RelatedDocument {
  id: string;
  documentId: string;
  title: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
  relationshipType: 'reference' | 'supersedes' | 'child';
}

// Batch document for navigation
export interface BatchDocument {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'current';
}

// Controlled copy request
export interface ControlledCopyRequest {
  documentId: string;
  locationId: string;
  locationName: string;
  reason: string;
  quantity: number;
  signature: string;
  selectedDocuments: string[];
}
