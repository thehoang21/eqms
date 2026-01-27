/**
 * Revision Tabs
 * 
 * Tab components for document revision workflow.
 * DocumentTab has view/edit mode specific to revisions.
 * GeneralTab and other shared tabs are re-exported from shared/tabs.
 */

// Revision-specific DocumentTab (has view mode for revisions)
export { DocumentTab, type UploadedFile } from './DocumentTab/DocumentTab';
export { FilePreview } from './DocumentTab/FilePreview';

// Re-export shared tabs for convenience
export { 
  GeneralTab,
  TrainingTab, 
  SignaturesTab, 
  AuditTab 
} from '@/features/documents/shared/tabs';
