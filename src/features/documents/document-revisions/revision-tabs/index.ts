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

// Shared tabs still available (GeneralTab / TrainingTab for backward compat if needed)
export { GeneralTab } from '@/features/documents/shared/tabs';
export type { GeneralTabFormData } from '@/features/documents/shared/tabs';

// Revision workspace-local tab implementations (identical UI to detail-revision/tabs)
export { GeneralInformationTab } from './GeneralInformation/GeneralInformationTab';
export type { GeneralInformationDocumentDetail } from './GeneralInformation/GeneralInformationTab';
export { TrainingInformationTab } from './TrainingInformationTab/TrainingInformationTab';
export { SignaturesTab } from './SignaturesTab/SignaturesTab';
export { AuditTrailTab } from './AuditTrailTab/AuditTrailTab';
