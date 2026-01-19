export { NewDocumentView } from '../single-document/NewDocumentView';
export { BatchDocumentView } from '../batch-document/BatchDocumentView';
// Note: NewTemplateView belongs to template-library feature, not re-exported here
export { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from "@/features/documents/shared/layouts";
export { DocumentReviewView } from "../review-document/DocumentReviewView";
export { DocumentReviewViewWithBatch } from "../review-document/DocumentReviewViewWithBatch";
export { DocumentApprovalView } from "../approval-document/DocumentApprovalView";
export { useBatchNavigation } from "./useBatchNavigation";
export type { BatchDocument } from "./useBatchNavigation";
