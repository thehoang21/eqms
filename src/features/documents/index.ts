/**
 * Documents Feature
 * 
 * Main entry point for the documents feature module.
 * This feature handles all document-related functionality including:
 * - Document listing and viewing
 * - Document creation and editing
 * - Document review and approval workflows
 * - Document revisions
 * - Controlled copies management
 * - Template library
 * - Archived documents
 */

// =============================================================================
// TYPES (explicit exports to avoid conflicts)
// =============================================================================
export type {
  DocumentType,
  DocumentStatus,
  DocumentViewType,
  TableColumn,
  Document,
  UploadedFile,
  ControlledCopyRequest,
} from './types/document.types';

export type {
  ArchivedDocument,
  RetentionStatus,
  RestoreRequest,
  AuditLogEntry,
  RetentionFilter,
} from './types/archived.types';

export type {
  ControlledCopyStatus,
  CurrentStage,
  ControlledCopy,
  DistributionLocation,
  DocumentToPrint,
} from './types/controlled-copy.types';

// =============================================================================
// HOOKS
// =============================================================================
export { useBatchNavigation } from './hooks';
export type { BatchDocument, UseBatchNavigationReturn } from './hooks';

// =============================================================================
// SHARED COMPONENTS & LAYOUTS
// =============================================================================
export { DocumentFilters, CreateLinkModal } from './shared/components';
export { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from './shared/layouts';

// Shared Tabs
export { 
  GeneralTab,
  TrainingTab, 
  SignaturesTab, 
  AuditTab,
  DocumentRelationships,
} from './shared/tabs';

// =============================================================================
// DOCUMENT LIST & VIEWS
// =============================================================================
export { DocumentsView } from './views/DocumentsView';
export { DetailDocumentView } from './document-detail/DetailDocumentView';

// Document Creation
export { NewDocumentView } from './document-list/single-document/NewDocumentView';
export { SingleDocumentView } from './document-list/single-document/SingleDocumentView';

// Document Review & Approval
export { DocumentReviewView } from './document-list/review-document/DocumentReviewView';
export { DocumentReviewViewWithBatch } from './document-list/review-document/DocumentReviewViewWithBatch';
export { DocumentApprovalView } from './document-list/approval-document/DocumentApprovalView';

// =============================================================================
// DOCUMENT REVISIONS
// =============================================================================
export { RevisionListView } from './document-revisions/views/RevisionListView';
export { RevisionsOwnedByMeView } from './document-revisions/views/RevisionsOwnedByMeView';
export { PendingDocumentsView } from './document-revisions/views/PendingDocumentsView';
export { NewRevisionView } from './document-revisions/components/NewRevisionView';
export { RevisionWorkspaceView } from './document-revisions/components/RevisionWorkspaceView';
export { StandaloneRevisionView } from './document-revisions/components/StandaloneRevisionView';
export { RevisionReviewView } from './document-revisions/review-revision/RevisionReviewView';
export { RevisionApprovalView } from './document-revisions/approval-revision/RevisionApprovalView';

// =============================================================================
// CONTROLLED COPIES
// =============================================================================
export { ControlledCopiesView } from './controlled-copies/ControlledCopiesView';
export { ControlledCopyDetailView } from './controlled-copies/detail/ControlledCopyDetailView';
export { DestroyControlledCopyView } from './controlled-copies/components/DestroyControlledCopyView';
export { RequestControlledCopyView } from './views/RequestControlledCopyView';


// =============================================================================
// ARCHIVED DOCUMENTS
// =============================================================================
export { ArchivedDocumentsView } from './archived-documents/ArchivedDocumentsView';
