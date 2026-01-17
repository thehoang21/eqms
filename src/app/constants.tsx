import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  GraduationCap,
  AlertTriangle,
  GitPullRequest,
  Undo2,
  History,
  Settings,
  Users,
  Shield,
  Book,
  Database,
  MonitorCog,
  ShieldCheck,
  MonitorSpeaker,
  Boxes,
  TextSearch,
  Palette,
  BookText,
  ListTodo,
} from "lucide-react";
import { NavItem } from "@/types";
import {
  IconAlertTriangle,
  IconChecklist,
  IconDeviceDesktopCog,
  IconFileDescription,
  IconHistory,
  IconInfoCircle,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconReplace,
  IconSchool,
  IconSettings2,
  IconShieldCheck,
  IconUsersGroup,
  IconDatabase,
} from "@tabler/icons-react";

export const NAV_CONFIG: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "my-tasks",
    label: "My Tasks",
    icon: ListTodo,
    path: "/my-tasks",
  },
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
    icon: IconSchool,
    path: "/training-management",
  },
  {
    id: "deviation-ncs",
    label: "Deviation & NCs",
    icon: IconAlertTriangle,
    path: "/deviations-ncs",
  },
  {
    id: "capa-management",
    label: "CAPA Management",
    icon: IconShieldCheck,
    path: "/capa-management",
  },
  {
    id: "change-management",
    label: "Change Management",
    icon: IconReplace,
    path: "/change-management",
  },
  {
    id: "complaints-management",
    label: "Complaints Management",
    icon: Undo2,
    path: "/complaints-management",
  },
  {
    id: "equipment-management",
    label: "Equipment Management",
    icon: MonitorSpeaker,
    path: "/equipment-management",
  },
  {
    id: "supplier-management",
    label: "Supplier Management",
    icon: Boxes,
    path: "/supplier-management",
  },
  {
    id: "risk-management",
    label: "Risk Management",
    icon: TextSearch,
    path: "/risk-management",
  },
  {
    id: "audit-trail",
    label: "Audit Trail System",
    icon: IconHistory,
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
        path: "/settings/users",
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
