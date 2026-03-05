/**
 * Revision Workspace Tabs
 *
 * All tab components used in RevisionWorkspaceView are exported from here.
 * Workspace-specific tabs live in this directory.
 * Shared tabs are re-exported so the workspace imports from one place.
 */

// Revision-specific DocumentTab
export { DocumentTab, type UploadedFile } from './DocumentTab/DocumentTab';
export { FilePreview } from './DocumentTab/FilePreview';

// Workspace-specific new tabs
export { WorkingNotesTab } from './WorkingNotesTab/WorkingNotesTab';
export { InfoFromDocumentTab } from './InfoFromDocumentTab/InfoFromDocumentTab';
export { WorkspaceReviewersTab } from './ReviewersTab/WorkspaceReviewersTab';
export { WorkspaceApproversTab } from './ApproversTab/WorkspaceApproversTab';

// Shared tabs re-exported (single import point for the workspace)
export {
  GeneralTab,
  TrainingTab,
  SignaturesTab,
  AuditTab,
} from '@/features/documents/shared/tabs';
