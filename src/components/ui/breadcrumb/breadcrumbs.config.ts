import { ROUTES } from "@/app/routes.constants";
import type { BreadcrumbItem } from "./Breadcrumb";

// ============================================================================
// Helper: Dashboard root item (always the first item)
// ============================================================================
const dashboard = (navigate?: (path: string) => void): BreadcrumbItem => ({
  label: "Dashboard",
  onClick: navigate ? () => navigate(ROUTES.DASHBOARD) : undefined,
});

// ============================================================================
// BREADCRUMB DEFINITIONS
// Organized by module. Each function returns BreadcrumbItem[].
// Use `navigate` param to make parent items clickable.
// ============================================================================

// --- Equipment ---
export const equipmentManagement = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Equipment Management", isActive: true },
];

// --- Change Control ---
export const changeControl = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Change Controls", isActive: true },
];

// --- Audit Trail ---
export const auditTrail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Audit Trail", isActive: true },
];

export const auditTrailDetail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Audit Trail", onClick: navigate ? () => navigate(ROUTES.AUDIT_TRAIL) : undefined },
  { label: "Audit Trail Detail", isActive: true },
];

// --- Report ---
export const report = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Reports & Analytics", isActive: true },
];

// --- Deviations ---
export const deviations = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Deviations & NCs", isActive: true },
];

// --- CAPA ---
export const capa = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "CAPA Management", isActive: true },
];

// --- Complaints ---
export const complaints = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Complaints Management", isActive: true },
];

// --- Supplier ---
export const supplier = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Supplier Management", isActive: true },
];

// --- Product ---
export const product = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Product Management", isActive: true },
];

// --- Regulatory ---
export const regulatory = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Regulatory Management", isActive: true },
];

// --- Risk Management ---
export const riskManagement = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Risk Management", isActive: true },
];

// --- User Manual ---
export const userManual = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "User Manual", isActive: true },
];

// ============================================================================
// DOCUMENT MODULE
// ============================================================================

export const documentList = (
  navigate?: (path: string) => void,
  activeTab?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control" },
  { label: activeTab === "owned" ? "Documents Owned By Me" : "All Documents", isActive: true },
];

export const archivedDocuments = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control" },
  { label: "Archived Documents", isActive: true },
];

export const knowledgeBase = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control" },
  { label: "Knowledge Base", isActive: true },
];

export const newDocument = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "All Documents", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "New Document", isActive: true },
];

export const documentDetail = (
  navigate?: (path: string) => void,
  options?: { fromArchive?: boolean }
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control" },
  { label: options?.fromArchive ? "Archived Documents" : "All Documents" },
  { label: "Document Details", isActive: true },
];

// --- Document Revisions ---
export const revisionList = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "All Revisions", isActive: true },
];

export const revisionsOwnedByMe = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Revisions Owned By Me", isActive: true },
];

export const pendingDocuments = (
  navigate?: (path: string) => void,
  activeTab?: string
): BreadcrumbItem[] => {
  const tabLabels: Record<string, string> = {
    "pending-review": "Pending My Review",
    "pending-approval": "Pending My Approval",
  };
  return [
    dashboard(navigate),
    { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
    { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
    { label: tabLabels[activeTab || ""] || "Pending Documents", isActive: true },
  ];
};

export const requestControlledCopy = (
  navigate?: (path: string) => void,
  documentId?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: documentId || "Request Controlled Copy", isActive: true },
];

export const standaloneRevision = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "All Documents", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Upgrade Revision", isActive: true },
];

export const revisionWorkspace = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "All Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Revision Workspace", isActive: true },
];

export const newRevision = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "All Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Impact Analysis", isActive: true },
];

export const revisionDetail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "All Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Document Revision Details", isActive: true },
];

export const revisionReview = (
  navigate?: (path: string) => void,
  onBack?: () => void,
  documentId?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Pending My Review", onClick: onBack },
  { label: "Review Revision" },
  { label: documentId || "", isActive: true },
];

export const revisionApproval = (
  navigate?: (path: string) => void,
  onBack?: () => void,
  documentId?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Document Revisions", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.REVISIONS.ALL) : undefined },
  { label: "Pending My Approval", onClick: onBack },
  { label: "Approve Revision" },
  { label: documentId || "", isActive: true },
];

// --- Controlled Copies ---
export const controlledCopies = (
  navigate?: (path: string) => void,
  activeTab?: string
): BreadcrumbItem[] => {
  const tabLabels: Record<string, string> = {
    all: "All Controlled Copies",
    ready: "Ready for Distribution",
    distributed: "Distributed Copies",
  };
  return [
    dashboard(navigate),
    { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
    { label: "Controlled Copies", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.CONTROLLED_COPIES.ALL) : undefined },
    { label: tabLabels[activeTab || "all"] || "All Controlled Copies", isActive: true },
  ];
};

export const controlledCopyDetail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Document Control", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.ALL) : undefined },
  { label: "Controlled Copies", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.CONTROLLED_COPIES.ALL) : undefined },
  { label: "All Controlled Copies", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.CONTROLLED_COPIES.ALL) : undefined },
  { label: "Controlled Copy Details", isActive: true },
];

export const destroyControlledCopy = (
  navigate?: (path: string) => void,
  reportType?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Controlled Copies", onClick: navigate ? () => navigate(ROUTES.DOCUMENTS.CONTROLLED_COPIES.ALL) : undefined },
  { label: reportType ? `Report ${reportType}` : "Destroy Report", isActive: true },
];

// ============================================================================
// TRAINING MODULE
// ============================================================================

export const trainingMaterials = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", isActive: true },
];

export const uploadMaterial = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Upload Material", isActive: true },
];

export const materialDetail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Material Detail", isActive: true },
];

export const materialEdit = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Edit Training Material", isActive: true },
];

export const materialNewRevision = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Upgrade Revision", isActive: true },
];

export const materialUsageReport = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Usage Report", isActive: true },
];

export const materialReview = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Review Material", isActive: true },
];

export const materialApproval = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Training Materials", onClick: navigate ? () => navigate(ROUTES.TRAINING.TRAINING_MATERIALS) : undefined },
  { label: "Approve Material", isActive: true },
];

export const coursesList = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Courses List", isActive: true },
];

export const courseDetail = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Course Detail", isActive: true },
];

export const courseEdit = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Edit Course", isActive: true },
];

export const courseCreate = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Create Training", isActive: true },
];

export const courseProgress = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Courses List", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Training Progress", isActive: true },
];

export const courseResultEntry = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Courses List", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Result Entry", isActive: true },
];

export const coursePendingApproval = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Pending Approval", isActive: true },
];

export const coursePendingReview = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Course Inventory", onClick: navigate ? () => navigate(ROUTES.TRAINING.COURSES_LIST) : undefined },
  { label: "Pending Review", isActive: true },
];

export const trainingMatrix = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Compliance Tracking" },
  { label: "Training Matrix", isActive: true },
];

export const courseStatus = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Compliance Tracking" },
  { label: "Course Status", isActive: true },
];

export const employeeTrainingFiles = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Records & Archive" },
  { label: "Employee Training Files", isActive: true },
];

export const exportRecords = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Training Management" },
  { label: "Records & Archive" },
  { label: "Export Records", isActive: true },
];

// ============================================================================
// SETTINGS MODULE
// ============================================================================

export const userManagement = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "User Management", isActive: true },
];

export const addUser = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "User Management", onClick: navigate ? () => navigate(ROUTES.SETTINGS.USERS) : undefined },
  { label: "Add User", isActive: true },
];

export const editUser = (
  navigate?: (path: string) => void,
  employeeId?: string
): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "User Management", onClick: navigate ? () => navigate(ROUTES.SETTINGS.USERS) : undefined },
  { label: employeeId || "Edit User", isActive: true },
];

export const rolePermissions = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "Role & Permissions", isActive: true },
];

export const roleDetail = (
  navigate?: (path: string) => void,
  mode?: "new" | "edit" | "view",
  roleName?: string
): BreadcrumbItem[] => {
  const labels: Record<string, string> = {
    new: "New Role",
    edit: "Edit Role",
    view: "Role Details",
  };
  return [
    dashboard(navigate),
    { label: "Settings" },
    { label: "Role & Permissions", onClick: navigate ? () => navigate(ROUTES.SETTINGS.ROLES) : undefined },
    { label: labels[mode || "view"] || roleName || "Role Details", isActive: true },
  ];
};

export const dictionaries = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "Dictionaries", isActive: true },
];

export const configuration = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "Configuration", isActive: true },
];

export const systemInformation = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Settings" },
  { label: "System Information", isActive: true },
];

// --- My Tasks ---
export const myTasks = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "My Tasks", isActive: true },
];

// --- Notifications ---
export const notifications = (navigate?: (path: string) => void): BreadcrumbItem[] => [
  dashboard(navigate),
  { label: "Notifications", isActive: true },
];

// ============================================================================
// CONVENIENCE: Object export for easy access
// ============================================================================

const breadcrumbs = {
  // Simple modules
  equipmentManagement,
  changeControl,
  auditTrail,
  auditTrailDetail,
  report,
  deviations,
  capa,
  complaints,
  supplier,
  product,
  regulatory,
  riskManagement,
  userManual,

  // Documents
  documentList,
  archivedDocuments,
  knowledgeBase,
  newDocument,
  documentDetail,
  revisionList,
  revisionsOwnedByMe,
  pendingDocuments,
  requestControlledCopy,
  standaloneRevision,
  revisionWorkspace,
  newRevision,
  revisionDetail,
  revisionReview,
  revisionApproval,
  controlledCopies,
  controlledCopyDetail,
  destroyControlledCopy,

  // Training
  trainingMaterials,
  uploadMaterial,
  materialDetail,
  materialEdit,
  materialNewRevision,
  materialUsageReport,
  materialReview,
  materialApproval,
  coursesList,
  courseDetail,
  courseEdit,
  courseCreate,
  courseProgress,
  courseResultEntry,
  coursePendingApproval,
  coursePendingReview,
  trainingMatrix,
  courseStatus,
  employeeTrainingFiles,
  exportRecords,

  // My Tasks & Notifications
  myTasks,
  notifications,

  // Settings
  userManagement,
  addUser,
  editUser,
  rolePermissions,
  roleDetail,
  dictionaries,
  configuration,
  systemInformation,
};

export default breadcrumbs;
