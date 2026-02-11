/**
 * Document Creation Module
 * 
 * Components and utilities for creating new documents.
 * Simple single-step document creation workflow.
 */

// Document views
export { NewDocumentView } from './NewDocumentView';
export { SingleDocumentView } from './SingleDocumentView';

// Workflow layout (re-export from shared)
export { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from '@/features/documents/shared/layouts';

// Batch navigation hook (re-export from hooks)
export { useBatchNavigation } from '@/features/documents/hooks';
export type { BatchDocument } from '@/features/documents/hooks';

// Tabs
export * from './new-tabs';
