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
        id: "knowledge-base",
        label: "Knowledge",
        path: "/documents/knowledge",
      },
      {
        id: "doc-owned-me",
        label: "Documents Owned By Me",
        path: "/documents/owned",
      },
      { id: "doc-all", label: "All Documents", path: "/documents/all" },
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
        children: [
          {
            id: "cc-all",
            label: "All Controlled Copies",
            path: "/documents/controlled-copies/all",
          },
          {
            id: "cc-ready",
            label: "Ready for Distribution",
            path: "/documents/controlled-copies/ready",
          },
          {
            id: "cc-distributed",
            label: "Distributed Copies",
            path: "/documents/controlled-copies/distributed",
          },
        ],
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
        id: "courses-list",
        label: "Courses List",
        path: "/training-management/courses",
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
    path: "/deviations",
  },
  {
    id: "capa-management",
    label: "CAPA Management",
    icon: IconClipboardCheck,
    path: "/capa-management",
  },
  {
    id: "change-control",
    label: "Change Controls",
    icon: IconReplace,
    path: "/change-control",
  },
  {
    id: "complaints-management",
    label: "Complaints Management",
    icon: IconMessageReport,
    path: "/complaints",
  },
  {
    id: "risk-management",
    label: "Risk Management",
    icon: IconAlertSquareRounded,
    path: "/risk-management",
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
    path: "/equipment",
  },
  {
    id: "supplier-management",
    label: "Supplier Management",
    icon: IconBuildingStore,
    path: "/suppliers",
  },
  {
    id: "product-management",
    label: "Product Management",
    icon: Package,
    path: "/product",
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
    path: "/regulatory",
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
    path: "/reports",
  },
  {
    id: "audit-trail",
    label: "Audit Trail System",
    icon: IconFilter2Search,
    showDividerAfter: true,
    path: "/audit-trail",
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
        path: "/settings/role-permission",
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
  currentPath: { label: string; id: string }[] = [],
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
  targetPath: string,
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
