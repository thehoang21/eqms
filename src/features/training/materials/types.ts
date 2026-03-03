// ─── Training Material Types ────────────────────────────────────────────────
// Single source of truth for all Training Material related types.
// Import from here instead of re-declaring in each view file.

export type MaterialStatus =
  | "Draft"
  | "Pending Review"
  | "Pending Approval"
  | "Approved"
  | "Obsoleted";

export type MaterialFileType = "Video" | "PDF" | "Image" | "Document";

// ─── Core Entity ────────────────────────────────────────────────────────────
/** Minimal interface used by the list view and mock data */
export interface TrainingMaterial {
  id: string;
  materialId: string;
  title: string;
  description: string;
  type: MaterialFileType;
  version: string;
  department: string;
  status: MaterialStatus;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  fileSizeBytes: number;
  usageCount: number;
  linkedCourses: string[];
}

// ─── Extended Entity ─────────────────────────────────────────────────────────
/** Extended interface with reviewer / approver workflow fields */
export interface TrainingMaterialDetail extends TrainingMaterial {
  reviewer: string;
  approver: string;
  reviewedAt?: string;
  approvedAt?: string;
  reviewComment?: string;
  approvalComment?: string;
  externalUrl?: string;
}

// ─── Workflow ────────────────────────────────────────────────────────────────
export const WORKFLOW_STEPS: MaterialStatus[] = [
  "Draft",
  "Pending Review",
  "Pending Approval",
  "Approved",
  "Obsoleted",
];
