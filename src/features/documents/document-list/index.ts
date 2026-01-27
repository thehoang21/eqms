/**
 * Document List Module
 * 
 * Contains views and components for document listing, creation, review, and approval.
 */

// Main document list view
export { DocumentsView } from '../views/DocumentsView';

// Single & Batch document creation
export { NewDocumentView } from './single-document/NewDocumentView';
export { SingleDocumentView } from './single-document/SingleDocumentView';
export { BatchDocumentView } from './batch-document/BatchDocumentView';

// Review & Approval
export { DocumentReviewView } from './review-document/DocumentReviewView';
export { DocumentReviewViewWithBatch } from './review-document/DocumentReviewViewWithBatch';
export { DocumentApprovalView } from './approval-document/DocumentApprovalView';

// Modal
export { NewDocumentModal } from './new-document/NewDocumentModal';

// Tabs (re-exported from new-document for backwards compatibility)
export * from './new-document/new-tabs';
