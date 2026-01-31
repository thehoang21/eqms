/**
 * Navigation Configuration
 * Defines the application navigation structure
 * 
 * @module navigation
 * @description Modular navigation config organized by functional domains
 */

import {
  Bell,
  FileBarChart,
  Package,
  Scale,
  Users,
  ShieldCheck,
  BookText,
  Palette,
} from "lucide-react";

import {
  IconAlertSquareRounded,
  IconAlertTriangle,
  IconBrandAsana,
  IconBuildingStore,
  IconClipboardCheck,
  IconDeviceDesktopCog,
  IconDeviceLaptop,
  IconFileDescription,
  IconFilter2Search,
  IconInfoCircle,
  IconMessageReport,
  IconPresentationAnalytics,
  IconReplace,
  IconSettings2,
  IconSmartHome,
} from "@tabler/icons-react";
import { NavItem } from "@/types";

// ============================================================================
// CORE NAVIGATION (Dashboard, Tasks, Notifications)
// ============================================================================
const CORE_NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconSmartHome,
    path: "/dashboard",
  },
  {
    id: "my-tasks",
    label: "My Tasks",
    icon: IconBrandAsana,
    path: "/my-tasks",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    showDividerAfter: true, // Divider Separator
  },
];

// ============================================================================
// DOCUMENT & TRAINING (Foundation)
// ============================================================================
const FOUNDATION_MODULES: NavItem[] = [
  {
    id: "doc-control",
    label: "Document Control",
    icon: IconFileDescription,
    children: [
      {
        id: "doc-owned-me",
        label: "Documents Owned By Me",
        path: "/documents/owned",
      },
      { id: "doc-all", label: "All Documents", path: "/documents/all" },
      {
        id: "template-library",
        label: "Template Library",
        path: "/documents/templates",
      },
      {
        id: "doc-revisions",
        label: "Document Revisions",
        children: [
          {
            id: "rev-owned-me",
            label: "Revisions Owned By Me",
            path: "/documents/revisions/owned",
          },
          {
            id: "rev-all",
            label: "All Revisions",
            path: "/documents/revisions/all",
          },
          {
            id: "pending-review",
            label: "Pending My Review",
            path: "/documents/revisions/pending-review",
          },
          {
            id: "pending-approval",
            label: "Pending My Approval",
            path: "/documents/revisions/pending-approval",
          },
        ],
      },
      {
        id: "controlled-copies",
        label: "Controlled Copies",
        path: "/documents/controlled-copies",
      },
      {
        id: "archive-documents",
        label: "Archived Documents",
        path: "/documents/archived",
      },
    ],
  },
  {
    id: "training-management",
    label: "Training Management",
    icon: IconPresentationAnalytics,
    children: [
      {
        id: "tm-records",
        label: "Training Records",
        path: "/training/records",
      },
      {
        id: "tm-my-open",
        label: "My Open Trainings",
        path: "/training/my-open",
      },
      {
        id: "tm-pending-review",
        label: "Pending My Review",
        path: "/training/pending-review",
      },
      {
        id: "tm-pending-approval",
        label: "Pending My Approval",
        path: "/training/pending-approval",
      },
      {
        id: "tm-ojt",
        label: "OJT & Practical Assessment",
        path: "/training/ojt",
      },
      {
        id: "tm-administration",
        label: "Training Administration",
        children: [
          {
            id: "tm-admin-matrix",
            label: "Qualification Matrix",
            path: "/training/admin/matrix",
          },
          {
            id: "tm-admin-properties",
            label: "Training Properties",
            path: "/training/admin/properties",
          },
          {
            id: "tm-admin-templates",
            label: "Requirement Templates",
            path: "/training/admin/templates",
          },
          {
            id: "tm-admin-quiz",
            label: "Create a Quiz",
            path: "/training/admin/quiz",
          },
          {
            id: "tm-admin-curriculums",
            label: "Curriculums",
            path: "/training/admin/curriculums",
          },
          {
            id: "tm-admin-job-titles",
            label: "Job Titles",
            path: "/training/admin/job-titles",
          },
          {
            id: "tm-admin-employees",
            label: "Employees",
            path: "/training/admin/employees",
          },
        ],
      },
    ],
  },
];

// ============================================================================
// QUALITY PROCESSES (Deviation, CAPA, Change, Complaint, Risk)
// ============================================================================
const QUALITY_MODULES: NavItem[] = [
  {
    id: "deviation-ncs",
    label: "Deviation & NCs",
    icon: IconAlertTriangle,
    children: [
      {
        id: "dev-all",
        label: "All Deviations",
        path: "/deviations/all",
      },
      {
        id: "dev-my-tasks",
        label: "My Deviation Tasks",
        path: "/deviations/my-tasks",
      },
      {
        id: "dev-oos-oot",
        label: "OOS/OOT Investigations",
        path: "/deviations/oos",
      },
      {
        id: "dev-ncr",
        label: "Non-Conformances (NCR)",
        path: "/deviations/ncr",
      },
      {
        id: "dev-investigation",
        label: "Investigation & RCA",
        path: "/deviations/investigation",
      },
      {
        id: "dev-disposition",
        label: "Batch Disposition",
        path: "/deviations/disposition",
      },
      {
        id: "dev-mrb",
        label: "Review Board (MRB)",
        path: "/deviations/mrb",
      },
      {
        id: "dev-trending",
        label: "Trending & Reports",
        path: "/deviations/trending",
      },
    ],
  },
  {
    id: "capa-management",
    label: "CAPA Management",
    icon: IconClipboardCheck,
    children: [
      {
        id: "capa-all",
        label: "All CAPAs",
        path: "/capa-management/all",
      },
      {
        id: "capa-my-tasks",
        label: "My CAPA Tasks",
        path: "/capa-management/my-tasks",
      },
      {
        id: "capa-effectiveness",
        label: "Effectiveness Checks",
        path: "/capa-management/effectiveness",
      },
      {
        id: "capa-trending",
        label: "Trending & Reports",
        path: "/capa-management/trending",
      },
    ],
  },
  {
    id: "change-control",
    label: "Change Controls",
    icon: IconReplace,
    children: [
      {
        id: "cc-all",
        label: "All Change Controls",
        path: "/change-control/all",
      },
      {
        id: "cc-my-tasks",
        label: "My Change Tasks",
        path: "/change-control/my-tasks",
      },
      {
        id: "cc-impact",
        label: "Impact Assessments",
        path: "/change-control/impact",
      },
      {
        id: "cc-effectiveness",
        label: "Effectiveness Checks",
        path: "/change-control/effectiveness",
      },
    ],
  },
  {
    id: "complaints-management",
    label: "Complaints Management",
    icon: IconMessageReport,
    children: [
      {
        id: "complaint-all",
        label: "All Complaints",
        path: "/complaints/all",
      },
      {
        id: "complaint-my-tasks",
        label: "My Complaint Tasks",
        path: "/complaints/my-tasks",
      },
      {
        id: "complaint-recall",
        label: "Recall Management",
        path: "/complaints/recall",
      },
    ],
  },
  {
    id: "risk-management",
    label: "Risk Management",
    icon: IconAlertSquareRounded,
    children: [
      {
        id: "rm-register",
        label: "Risk Registry",
        path: "/risk-management/register",
      },
      {
        id: "rm-assessments",
        label: "Risk Assessments (FMEA)",
        path: "/risk-management/assessments",
      },
      {
        id: "rm-action-items",
        label: "Risk Action Items",
        path: "/risk-management/action-items",
      },
      {
        id: "rm-review",
        label: "Risk Review & Reporting",
        path: "/risk-management/review",
      },
    ],
  },
];

// ============================================================================
// OPERATIONS MODULES (Equipment, Supplier, Product)
// ============================================================================
const OPERATIONS_MODULES: NavItem[] = [
  {
    id: "equipment-management",
    label: "Equipment Management",
    icon: IconDeviceLaptop,
    children: [
      {
        id: "eq-inventory",
        label: "Inventory & Assets",
        path: "/equipment/inventory",
      },
      {
        id: "eq-calibration",
        label: "Calibration Mgmt",
        path: "/equipment/calibration",
      },
      {
        id: "eq-maintenance",
        label: "Maintenance Schedules",
        path: "/equipment/maintenance",
      },
      {
        id: "eq-qualification",
        label: "Qualification (IQ/OQ/PQ)",
        path: "/equipment/qualification",
      },
      {
        id: "eq-logbooks",
        label: "Electronic Logbooks",
        path: "/equipment/logbooks",
      },
    ],
  },
  {
    id: "supplier-management",
    label: "Supplier Management",
    icon: IconBuildingStore,
    children: [
      {
        id: "sup-directory",
        label: "Supplier Directory",
        path: "/suppliers/directory",
      },
      {
        id: "sup-qualification",
        label: "Qualification & Audits",
        path: "/suppliers/qualification",
      },
      {
        id: "sup-materials",
        label: "Material Quality",
        path: "/suppliers/materials",
      },
      {
        id: "sup-performance",
        label: "Performance Rating",
        path: "/suppliers/performance",
      },
      {
        id: "sup-scar",
        label: "SCAR Management",
        path: "/suppliers/scar",
      },
    ],
  },
  {
    id: "risk-management",
    label: "Risk Management",
    icon: IconAlertSquareRounded,
    children: [
      {
        id: "rm-register",
        label: "Risk Registry",
        path: "/risk-management/register",
      },
      {
        id: "rm-assessments",
        label: "Risk Assessments (FMEA)",
        path: "/risk-management/assessments",
      },
      {
        id: "rm-action-items",
        label: "Risk Action Items",
        path: "/risk-management/action-items",
      },
      {
        id: "rm-review",
        label: "Risk Review & Reporting",
        path: "/risk-management/review",
      },
    ],
  },
  {
    id: "product-management",
    label: "Product Management",
    icon: Package,
    children: [
      {
        id: "prod-registry",
        label: "Product Registry",
        path: "/product/registry",
      },
      {
        id: "prod-specs",
        label: "Specifications",
        path: "/product/specs",
      },
      {
        id: "prod-master-formula",
        label: "Master Formula (BMR)",
        path: "/product/master-formula",
      },
      {
        id: "prod-bom",
        label: "Bill of Materials",
        path: "/product/bom",
      },
      {
        id: "prod-apqr",
        label: "PQR / APQR",
        path: "/product/apqr",
      },
    ],
  },
];

// ============================================================================
// REGULATORY TRACK
// ============================================================================
const REGULATORY_MODULE: NavItem[] = [
  {
    id: "regulatory-management",
    label: "Regulatory Management",
    icon: Scale,
    children: [
      {
        id: "reg-registration",
        label: "Product Registration",
        path: "/regulatory/registration",
      },
      {
        id: "reg-submissions",
        label: "Submissions & Dossiers",
        path: "/regulatory/submissions",
      },
      {
        id: "reg-intelligence",
        label: "Regulatory Intelligence",
        path: "/regulatory/intelligence",
      },
      {
        id: "reg-inspections",
        label: "Health Authority Inspections",
        path: "/regulatory/inspections",
      },
    ],
  },
];

// ============================================================================
// SYSTEM (Reports, Audit, Settings)
// ============================================================================
const SYSTEM_MODULES: NavItem[] = [
  {
    id: "report",
    label: "Reports & Analytics",
    icon: FileBarChart,
    children: [
      {
        id: "rep-dashboards",
        label: "Executive Dashboards",
        path: "/reports/dashboards",
      },
      {
        id: "rep-standard",
        label: "Standard Reports",
        path: "/reports/standard",
      },
      {
        id: "rep-compliance",
        label: "Compliance Reports",
        path: "/reports/compliance",
      },
      {
        id: "rep-custom",
        label: "Custom Report Builder",
        path: "/reports/custom",
      },
    ],
  },
  {
    id: "audit-trail",
    label: "Audit Trail System",
    icon: IconFilter2Search,
    showDividerAfter: true,
    children: [
      {
        id: "audit-system",
        label: "System Logs",
        path: "/audit-trail/system",
      },
      {
        id: "audit-data",
        label: "Data Change Logs",
        path: "/audit-trail/data",
      },
      {
        id: "audit-access",
        label: "Access & Security Logs",
        path: "/audit-trail/access",
      },
      {
        id: "audit-settings",
        label: "Audit Settings",
        path: "/audit-trail/settings",
      },
    ],
  },
  {
    id: "settings",
    label: "Setting",
    icon: IconSettings2,
    children: [
      {
        id: "user-management",
        label: "User Management",
        icon: Users,
        path: "/settings/user-management",
      },
      {
        id: "roles",
        label: "Roles & Permissions",
        icon: ShieldCheck,
        path: "/settings/roles",
      },
      {
        id: "dictionaries",
        label: "Dictionaries",
        icon: BookText,
        path: "/settings/dictionaries",
      },
      {
        id: "config",
        label: "Configuration",
        icon: IconDeviceDesktopCog,
        path: "/settings/config",
      },
      {
        id: "info-sys",
        label: "System Information",
        icon: IconInfoCircle,
        path: "/settings/info-system",
      },
      { id: "ui-demo", label: "UI Showcase", icon: Palette, path: "/ui-demo" },
    ],
  },
];

// ============================================================================
// MAIN CONFIGURATION
// ============================================================================
export const NAV_CONFIG: NavItem[] = [
  ...CORE_NAV,
  ...FOUNDATION_MODULES,
  ...QUALITY_MODULES,
  ...OPERATIONS_MODULES,
  ...REGULATORY_MODULE,
  ...SYSTEM_MODULES,
];

// Helper to find a node and build breadcrumbs
export const findNodeAndBreadcrumbs = (
  items: NavItem[],
  targetId: string,
  currentPath: { label: string; id: string }[] = []
): { label: string; id: string }[] | null => {
  for (const item of items) {
    const newPath = [...currentPath, { label: item.label, id: item.id }];
    if (item.id === targetId) {
      return newPath;
    }
    if (item.children) {
      const result = findNodeAndBreadcrumbs(item.children, targetId, newPath);
      if (result) return result;
    }
  }
  return null;
};

// Helper to find nav item by path
export const findNodeByPath = (
  items: NavItem[],
  targetPath: string
): NavItem | null => {
  for (const item of items) {
    if (item.path === targetPath) {
      return item;
    }
    if (item.children) {
      const result = findNodeByPath(item.children, targetPath);
      if (result) return result;
    }
  }
  return null;
};

// Helper to get all paths (useful for route generation)
export const getAllPaths = (items: NavItem[]): string[] => {
  const paths: string[] = [];
  const traverse = (nodes: NavItem[]) => {
    nodes.forEach((node) => {
      if (node.path) paths.push(node.path);
      if (node.children) traverse(node.children);
    });
  };
  traverse(items);
  return paths;
};
