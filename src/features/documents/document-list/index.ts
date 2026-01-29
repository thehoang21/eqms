/**
 * Document List Module
 * 
 * Contains views and components for document listing, creation, review, and approval.
 */

// Main document list view
export { DocumentsView } from '../views/DocumentsView';

// Single document creation
export { NewDocumentView } from './single-document/NewDocumentView';
export { SingleDocumentView } from './single-document/SingleDocumentView';

// Review & Approval
export { DocumentReviewView } from './review-document/DocumentReviewView';
export { DocumentReviewViewWithBatch } from './review-document/DocumentReviewViewWithBatch';
export { DocumentApprovalView } from './approval-document/DocumentApprovalView';

// Tabs (re-exported from new-document for backwards compatibility)
export * from './new-document/new-tabs';
