/**
 * Template Tabs
 * 
 * Tab components for template creation/editing workflow.
 * DocumentTab has template-specific functionality.
 * GeneralTab and other shared tabs are re-exported from shared/tabs.
 */

// Template-specific DocumentTab
export { DocumentTab, type UploadedFile } from './DocumentTab/DocumentTab';
export { FilePreview } from './DocumentTab/FilePreview';

// Re-export shared tabs for convenience
export { 
  GeneralTab,
  TrainingTab, 
  SignaturesTab, 
  AuditTab,
  type GeneralTabFormData,
} from '@/features/documents/shared/tabs';
