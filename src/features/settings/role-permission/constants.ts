import { Role, PermissionGroup, Permission } from "./types";

// GxP-compliant permission groups
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "documents",
    name: "Document Management",
    description: "Document lifecycle and version control",
    order: 1,
    permissions: [
      {
        id: "doc_view",
        module: "documents",
        action: "view",
        label: "View Documents",
        description: "Access and read documents",
        requiresAudit: false,
      },
      {
        id: "doc_create",
        module: "documents",
        action: "create",
        label: "Create Documents",
        description: "Create new documents and drafts",
        requiresAudit: true,
      },
      {
        id: "doc_edit",
        module: "documents",
        action: "edit",
        label: "Edit Documents",
        description: "Modify document content",
        requiresAudit: true,
      },
      {
        id: "doc_review",
        module: "documents",
        action: "review",
        label: "Review Documents",
        description: "Perform document review workflow",
        requiresAudit: true,
      },
      {
        id: "doc_approve",
        module: "documents",
        action: "approve",
        label: "Approve Documents",
        description: "Final approval for document effectiveness",
        requiresAudit: true,
      },
      {
        id: "doc_archive",
        module: "documents",
        action: "archive",
        label: "Archive Documents",
        description: "Archive obsolete documents",
        requiresAudit: true,
      },
      {
        id: "doc_delete",
        module: "documents",
        action: "delete",
        label: "Delete Documents",
        description: "Permanently delete documents (restricted)",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "training",
    name: "Training Management",
    description: "Training assignment and tracking",
    order: 2,
    permissions: [
      {
        id: "train_view",
        module: "training",
        action: "view",
        label: "View Training",
        description: "View training records and assignments",
        requiresAudit: false,
      },
      {
        id: "train_create",
        module: "training",
        action: "create",
        label: "Create Training",
        description: "Create training programs and materials",
        requiresAudit: true,
      },
      {
        id: "train_assign",
        module: "training",
        action: "assign",
        label: "Assign Training",
        description: "Assign training to users",
        requiresAudit: true,
      },
      {
        id: "train_edit",
        module: "training",
        action: "edit",
        label: "Edit Training",
        description: "Modify training content",
        requiresAudit: true,
      },
      {
        id: "train_delete",
        module: "training",
        action: "delete",
        label: "Delete Training",
        description: "Remove training records",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "capa",
    name: "CAPA Management",
    description: "Corrective and Preventive Actions",
    order: 3,
    permissions: [
      {
        id: "capa_view",
        module: "capa",
        action: "view",
        label: "View CAPA",
        description: "View CAPA records",
        requiresAudit: false,
      },
      {
        id: "capa_create",
        module: "capa",
        action: "create",
        label: "Create CAPA",
        description: "Initiate new CAPA",
        requiresAudit: true,
      },
      {
        id: "capa_edit",
        module: "capa",
        action: "edit",
        label: "Edit CAPA",
        description: "Modify CAPA details",
        requiresAudit: true,
      },
      {
        id: "capa_approve",
        module: "capa",
        action: "approve",
        label: "Approve CAPA",
        description: "Approve CAPA actions",
        requiresAudit: true,
      },
      {
        id: "capa_close",
        module: "capa",
        action: "close",
        label: "Close CAPA",
        description: "Close completed CAPA",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "change_control",
    name: "Change Control",
    description: "Change request and implementation",
    order: 4,
    permissions: [
      {
        id: "cc_view",
        module: "change_control",
        action: "view",
        label: "View Changes",
        description: "View change requests",
        requiresAudit: false,
      },
      {
        id: "cc_create",
        module: "change_control",
        action: "create",
        label: "Create Changes",
        description: "Initiate change requests",
        requiresAudit: true,
      },
      {
        id: "cc_edit",
        module: "change_control",
        action: "edit",
        label: "Edit Changes",
        description: "Modify change details",
        requiresAudit: true,
      },
      {
        id: "cc_review",
        module: "change_control",
        action: "review",
        label: "Review Changes",
        description: "Review change impact",
        requiresAudit: true,
      },
      {
        id: "cc_approve",
        module: "change_control",
        action: "approve",
        label: "Approve Changes",
        description: "Approve change implementation",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "deviations",
    name: "Deviation Management",
    description: "Deviation investigation and resolution",
    order: 5,
    permissions: [
      {
        id: "dev_view",
        module: "deviations",
        action: "view",
        label: "View Deviations",
        description: "View deviation records",
        requiresAudit: false,
      },
      {
        id: "dev_create",
        module: "deviations",
        action: "create",
        label: "Create Deviations",
        description: "Report new deviations",
        requiresAudit: true,
      },
      {
        id: "dev_edit",
        module: "deviations",
        action: "edit",
        label: "Edit Deviations",
        description: "Modify deviation details",
        requiresAudit: true,
      },
      {
        id: "dev_approve",
        module: "deviations",
        action: "approve",
        label: "Approve Deviations",
        description: "Approve deviation closure",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "audit_trail",
    name: "Audit Trail",
    description: "System audit logs and compliance",
    order: 6,
    permissions: [
      {
        id: "audit_view",
        module: "audit_trail",
        action: "view",
        label: "View Audit Trail",
        description: "Access audit logs",
        requiresAudit: false,
      },
      {
        id: "audit_export",
        module: "audit_trail",
        action: "export",
        label: "Export Audit Trail",
        description: "Export audit reports",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "user_management",
    name: "User Management",
    description: "User account and access control",
    order: 7,
    permissions: [
      {
        id: "user_view",
        module: "user_management",
        action: "view",
        label: "View Users",
        description: "View user accounts",
        requiresAudit: false,
      },
      {
        id: "user_create",
        module: "user_management",
        action: "create",
        label: "Create Users",
        description: "Create new user accounts",
        requiresAudit: true,
      },
      {
        id: "user_edit",
        module: "user_management",
        action: "edit",
        label: "Edit Users",
        description: "Modify user details",
        requiresAudit: true,
      },
      {
        id: "user_delete",
        module: "user_management",
        action: "delete",
        label: "Delete Users",
        description: "Deactivate user accounts",
        requiresAudit: true,
      },
    ],
  },
  {
    id: "settings",
    name: "System Settings",
    description: "System configuration and dictionaries",
    order: 8,
    permissions: [
      {
        id: "settings_view",
        module: "settings",
        action: "view",
        label: "View Settings",
        description: "View system settings",
        requiresAudit: false,
      },
      {
        id: "settings_edit",
        module: "settings",
        action: "edit",
        label: "Edit Settings",
        description: "Modify system configuration",
        requiresAudit: true,
      },
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
      "doc_view", "doc_review", "doc_approve", "doc_archive",
      "train_view", "train_create", "train_assign",
      "capa_view", "capa_approve", "capa_close",
      "cc_view", "cc_review", "cc_approve",
      "dev_view", "dev_approve",
      "audit_view", "audit_export",
      "user_view",
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
      "doc_view", "doc_create", "doc_edit", "doc_review",
      "train_view", "train_assign",
      "capa_view", "capa_create", "capa_edit",
      "cc_view", "cc_create", "cc_edit",
      "dev_view", "dev_create", "dev_edit",
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
