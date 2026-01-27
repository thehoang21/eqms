/**
 * New Document Module
 * 
 * Components and utilities for creating new documents.
 */

// Document views
export { NewDocumentView } from '../single-document/NewDocumentView';
export { BatchDocumentView } from '../batch-document/BatchDocumentView';

// Modal
export { NewDocumentModal } from './NewDocumentModal';

// Workflow layout (re-export from shared)
export { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from '@/features/documents/shared/layouts';

// Review & Approval views
export { DocumentReviewView } from '../review-document/DocumentReviewView';
export { DocumentReviewViewWithBatch } from '../review-document/DocumentReviewViewWithBatch';
export { DocumentApprovalView } from '../approval-document/DocumentApprovalView';

// Batch navigation hook (re-export from hooks)
export { useBatchNavigation } from '@/features/documents/hooks';
export type { BatchDocument } from '@/features/documents/hooks';

// Tabs
export * from './new-tabs';
