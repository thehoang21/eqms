/**
 * Document Revisions Module
 * 
 * Contains views and components for document revision management.
 */

// List Views
export { RevisionListView } from './views/RevisionListView';
export { RevisionsOwnedByMeView } from './views/RevisionsOwnedByMeView';
export { PendingDocumentsView } from './views/PendingDocumentsView';

// Revision Creation & Workspace
export { NewRevisionView } from './components/NewRevisionView';
export { RevisionWorkspaceView } from './components/RevisionWorkspaceView';
export { StandaloneRevisionView } from './components/StandaloneRevisionView';
export { MultiDocumentUpload } from './components/MultiDocumentUpload';

// Review & Approval
export { RevisionReviewView } from './review-revision/RevisionReviewView';
export { RevisionReviewViewWithBatch } from './review-revision/RevisionReviewViewWithBatch';
export { RevisionApprovalView } from './approval-revision/RevisionApprovalView';

// Tabs
export * from './revision-tabs';
