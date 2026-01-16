import { Role, PermissionGroup, Permission } from "./types";

// GxP-compliant permission groups
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "documents",
    name: "Document Management",
    description: "Document lifecycle, version control, and distribution",
    order: 1,
    permissions: [
      { id: "doc_view", module: "documents", action: "view", label: "View Documents", description: "Access and read approved documents", requiresAudit: false },
      { id: "doc_create", module: "documents", action: "create", label: "Create Documents", description: "Create new documents and drafts", requiresAudit: true },
      { id: "doc_edit", module: "documents", action: "edit", label: "Edit Documents", description: "Modify document content and metadata", requiresAudit: true },
      { id: "doc_review", module: "documents", action: "review", label: "Review Documents", description: "Participate in document review workflows", requiresAudit: true },
      { id: "doc_approve", module: "documents", action: "approve", label: "Approve Documents", description: "Final approval authority for documents", requiresAudit: true },
      { id: "doc_print", module: "documents", action: "export", label: "Print/Controlled Copy", description: "Generate controlled copies", requiresAudit: true },
      { id: "doc_archive", module: "documents", action: "archive", label: "Archive Documents", description: " retire and archive obsolete documents", requiresAudit: true },
      { id: "doc_delete", module: "documents", action: "delete", label: "Delete Documents", description: "Permanently remove documents (Admin only)", requiresAudit: true },
    ],
  },
  {
    id: "change_control",
    name: "Change Control (MOC)",
    description: "Change request initiation, impact assessment, and implementation",
    order: 2,
    permissions: [
      { id: "cc_view", module: "change_control", action: "view", label: "View Changes", description: "View change requests and logs", requiresAudit: false },
      { id: "cc_create", module: "change_control", action: "create", label: "Initiate Change", description: "Create new change requests (CR)", requiresAudit: true },
      { id: "cc_edit", module: "change_control", action: "edit", label: "Edit Change Request", description: "Modify CR details and plans", requiresAudit: true },
      { id: "cc_review", module: "change_control", action: "review", label: "Impact Assessment", description: "Perform impact assessment review", requiresAudit: true },
      { id: "cc_approve", module: "change_control", action: "approve", label: "Approve Changes", description: "Authorize change implementation", requiresAudit: true },
      { id: "cc_close", module: "change_control", action: "close", label: "Close Change Request", description: "Verify effectiveness and close CR", requiresAudit: true },
    ],
  },
  {
    id: "capa",
    name: "CAPA Management",
    description: "Corrective and Preventive Actions tracking",
    order: 3,
    permissions: [
      { id: "capa_view", module: "capa", action: "view", label: "View CAPA", description: "View CAPA records", requiresAudit: false },
      { id: "capa_create", module: "capa", action: "create", label: "Initiate CAPA", description: "Create new CAPA records", requiresAudit: true },
      { id: "capa_edit", module: "capa", action: "edit", label: "Edit CAPA", description: "Update CAPA investigation and plans", requiresAudit: true },
      { id: "capa_review", module: "capa", action: "review", label: "Review CAPA", description: "Review investigation results", requiresAudit: true },
      { id: "capa_approve", module: "capa", action: "approve", label: "Approve CAPA Plan", description: "Approve action plan implementation", requiresAudit: true },
      { id: "capa_close", module: "capa", action: "close", label: "Effectiveness Check", description: "Verify effectiveness and close CAPA", requiresAudit: true },
    ],
  },
  {
    id: "deviations",
    name: "Deviation Management",
    description: "Deviation reporting and investigation",
    order: 4,
    permissions: [
      { id: "dev_view", module: "deviations", action: "view", label: "View Deviations", description: "Access deviation records", requiresAudit: false },
      { id: "dev_create", module: "deviations", action: "create", label: "Report Deviation", description: "Log new deviation events", requiresAudit: true },
      { id: "dev_edit", module: "deviations", action: "edit", label: "Investigate Deviation", description: "Document root cause analysis", requiresAudit: true },
      { id: "dev_approve", module: "deviations", action: "approve", label: "Approve Deviation", description: "Approve disposition and closure", requiresAudit: true },
    ],
  },
  {
    id: "training",
    name: "Training Management",
    description: "Training requirements, records and quizzes",
    order: 5,
    permissions: [
      { id: "train_view", module: "training", action: "view", label: "View My Training", description: "View personal training status", requiresAudit: false },
      { id: "train_manage_view", module: "training", action: "view", label: "View All Training", description: "View organization-wide training matrix", requiresAudit: false },
      { id: "train_create", module: "training", action: "create", label: "Create Courses", description: "Create training modules and quizzes", requiresAudit: true },
      { id: "train_assign", module: "training", action: "assign", label: "Assign Training", description: "Assign training to users/roles", requiresAudit: true },
      { id: "train_grade", module: "training", action: "review", label: "Grade Assessments", description: "Review and grade employee assessments", requiresAudit: true },
    ],
  },
  {
    id: "risk_management",
    name: "Risk Management",
    description: "Risk assessment, FMEA, and mitigation",
    order: 6,
    permissions: [
      { id: "risk_view", module: "risk_management", action: "view", label: "View Risk Registry", description: "View risk assessments", requiresAudit: false },
      { id: "risk_create", module: "risk_management", action: "create", label: "Create Assessment", description: "Initiate new risk assessment", requiresAudit: true },
      { id: "risk_edit", module: "risk_management", action: "edit", label: "Update Risk", description: "Modify risk scores and mitigation", requiresAudit: true },
      { id: "risk_approve", module: "risk_management", action: "approve", label: "Approve Risk Assessment", description: "Approve risk levels", requiresAudit: true },
    ],
  },
  {
    id: "supplier_quality",
    name: "Supplier Quality",
    description: "Supplier qualification, audits, and scorecards",
    order: 7,
    permissions: [
      { id: "supp_view", module: "supplier_quality", action: "view", label: "View Suppliers", description: "View approved supplier list", requiresAudit: false },
      { id: "supp_create", module: "supplier_quality", action: "create", label: "Onboard Supplier", description: "Add new supplier for qualification", requiresAudit: true },
      { id: "supp_audit", module: "supplier_quality", action: "review", label: "Perform Audit", description: "Log supplier audit results", requiresAudit: true },
      { id: "supp_approve", module: "supplier_quality", action: "approve", label: "Approve Supplier", description: "Approve supplier status", requiresAudit: true },
    ],
  },
  {
    id: "audit_trail",
    name: "Audit Trail & Logs",
    description: "System audit logs, compliance reporting, and e-signatures",
    order: 8,
    permissions: [
      { id: "audit_view", module: "audit_trail", action: "view", label: "View Audit Logs", description: "Access comprehensive audit trail", requiresAudit: false },
      { id: "audit_export", module: "audit_trail", action: "export", label: "Export Audit Logs", description: "Export logs for regulatory inspection", requiresAudit: true },
    ],
  },
  {
    id: "user_management",
    name: "User & Role Management",
    description: "User accounts, roles, and security settings",
    order: 9,
    permissions: [
      { id: "user_view", module: "user_management", action: "view", label: "View Users", description: "View user directory", requiresAudit: false },
      { id: "user_create", module: "user_management", action: "create", label: "Create Users", description: "Provision new user accounts", requiresAudit: true },
      { id: "user_edit", module: "user_management", action: "edit", label: "Edit Users", description: "Update user profiles and roles", requiresAudit: true },
      { id: "user_reset", module: "user_management", action: "edit", label: "Reset Password", description: "Trigger password reset for users", requiresAudit: true },
      { id: "role_manage", module: "user_management", action: "edit", label: "Manage Roles", description: "Create and modify system roles", requiresAudit: true },
    ],
  },
  {
    id: "settings",
    name: "System Settings",
    description: "General configuration, dictionaries, and parameters",
    order: 10,
    permissions: [
      { id: "settings_view", module: "settings", action: "view", label: "View Configuration", description: "View system settings", requiresAudit: false },
      { id: "settings_edit", module: "settings", action: "edit", label: "Edit Configuration", description: "Modify system parameters", requiresAudit: true },
    ],
  },
];

// Predefined GxP-compliant roles
export const MOCK_ROLES: Role[] = [
  {
    id: "1",
    name: "System Administrator",
    description: "Full system access with all permissions. Responsible for system configuration and user management.",
    type: "system",
    isActive: true,
    userCount: 2,
    color: "bg-red-50 text-red-700 border-red-200",
    createdDate: "2024-01-15",
    modifiedDate: "2024-01-15",
    permissions: PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.id)), // All permissions
  },
  {
    id: "2",
    name: "QA Manager",
    description: "Quality Assurance oversight. Can approve documents, review CAPAs, and access audit trails.",
    type: "system",
    isActive: true,
    userCount: 5,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    createdDate: "2024-01-15",
    modifiedDate: "2024-06-20",
    permissions: [
      "doc_view", "doc_review", "doc_approve", "doc_archive", "doc_print",
      "train_view", "train_create", "train_assign", "train_manage_view",
      "capa_view", "capa_approve", "capa_close",
      "cc_view", "cc_review", "cc_approve", "cc_close",
      "dev_view", "dev_approve",
      "risk_view", "risk_approve",
      "supp_view", "supp_audit", "supp_approve",
      "audit_view", "audit_export",
      "user_view", "user_create", "user_edit",
      "settings_view",
    ],
  },
  {
    id: "3",
    name: "Department Head",
    description: "Department-level document management and team supervision. Can create and edit documents within department scope.",
    type: "system",
    isActive: true,
    userCount: 8,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    createdDate: "2024-01-15",
    modifiedDate: "2024-03-10",
    permissions: [
      "doc_view", "doc_create", "doc_edit", "doc_review", "doc_print",
      "train_view", "train_assign", "train_grade",
      "capa_view", "capa_create", "capa_edit", "capa_review",
      "cc_view", "cc_create", "cc_edit",
      "dev_view", "dev_create", "dev_edit",
      "risk_view", "risk_create", "risk_edit",
      "supp_view",
      "user_view",
    ],
  },
  {
    id: "4",
    name: "Document Owner",
    description: "Document creation and maintenance. Primary author for controlled documents.",
    type: "custom",
    isActive: true,
    userCount: 15,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    createdDate: "2024-02-01",
    modifiedDate: "2024-08-15",
    permissions: [
      "doc_view", "doc_create", "doc_edit",
      "train_view",
      "capa_view", "capa_create",
      "cc_view", "cc_create",
      "dev_view", "dev_create",
    ],
  },
  {
    id: "5",
    name: "Reviewer",
    description: "Document review workflow participant. Can review documents but not approve.",
    type: "custom",
    isActive: true,
    userCount: 12,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    createdDate: "2024-02-01",
    modifiedDate: "2024-05-22",
    permissions: [
      "doc_view", "doc_review",
      "train_view",
      "capa_view",
      "cc_view", "cc_review",
      "dev_view",
    ],
  },
  {
    id: "6",
    name: "Standard User",
    description: "Basic read-only access. Can view approved documents and assigned training.",
    type: "custom",
    isActive: true,
    userCount: 45,
    color: "bg-slate-50 text-slate-700 border-slate-200",
    createdDate: "2024-01-15",
    modifiedDate: "2024-01-15",
    permissions: [
      "doc_view",
      "train_view",
      "capa_view",
      "cc_view",
      "dev_view",
    ],
  },
  {
    id: "7",
    name: "Auditor",
    description: "Internal/external auditor access. Read-only with audit trail export capability.",
    type: "system",
    isActive: true,
    userCount: 3,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    createdDate: "2024-03-01",
    modifiedDate: "2024-03-01",
    permissions: [
      "doc_view",
      "train_view",
      "capa_view",
      "cc_view",
      "dev_view",
      "audit_view", "audit_export",
    ],
  },
];

// Permission action colors for visual distinction
export const getActionColor = (action: string) => {
  switch (action) {
    case "view":
      return "text-slate-600";
    case "create":
      return "text-emerald-600";
    case "edit":
      return "text-blue-600";
    case "delete":
      return "text-red-600";
    case "approve":
      return "text-purple-600";
    case "review":
      return "text-cyan-600";
    case "archive":
      return "text-amber-600";
    case "export":
      return "text-indigo-600";
    case "assign":
      return "text-teal-600";
    case "close":
      return "text-orange-600";
    default:
      return "text-slate-600";
  }
};

// ALCOA+ compliance helper
export const isALCOAPlusRequired = (permissionId: string): boolean => {
  for (const group of PERMISSION_GROUPS) {
    const permission = group.permissions.find(p => p.id === permissionId);
    if (permission) {
      return permission.requiresAudit;
    }
  }
  return false;
};
