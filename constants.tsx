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
  ShieldUser
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_CONFIG: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'my-tasks',
    label: 'My Tasks',
    icon: CheckSquare,
    path: '/my-tasks',
  },
  {
    id: 'doc-management',
    label: 'Document Management',
    icon: FileText,
    children: [
      { id: 'doc-owned-me', label: 'Documents Owned By Me', path: '/documents/owned' },
      { id: 'doc-all', label: 'All Documents', path: '/documents/all' },
      {
        id: 'doc-revisions',
        label: 'Document Revisions',
        children: [
          { id: 'rev-owned-me', label: 'Revisions Owned By Me', path: '/documents/revisions/owned' },
          { id: 'rev-all', label: 'All Revisions', path: '/documents/revisions/all' },
          { id: 'pending-review', label: 'Pending My Review', path: '/documents/revisions/pending-review' },
          { id: 'pending-approval', label: 'Pending My Approval', path: '/documents/revisions/pending-approval' },
        ],
      },
      {
        id: 'controlled-copies',
        label: 'Controlled Copies',
        children: [
          { id: 'cc-all', label: 'All Controlled Copies', path: '/documents/controlled-copies/all' },
          { id: 'cc-ready', label: 'Ready for Distribution', path: '/documents/controlled-copies/ready' },
          { id: 'cc-distributed', label: 'Distributed Copies', path: '/documents/controlled-copies/distributed' },
        ],
      },
      { id: 'archive-documents', label: 'Archived Documents', path: '/documents/archived' },
      { id: 'external-documents', label: 'External Documents', path: '/documents/external' },
    ],
  },
  {
    id: 'training',
    label: 'Training Management',
    icon: GraduationCap,
    path: '/training',
  },
  {
    id: 'deviation',
    label: 'Deviation Management',
    icon: AlertTriangle,
    path: '/deviations',
  },
  {
    id: 'capa',
    label: 'CAPA',
    icon: Shield,
    path: '/capa',
  },
  {
    id: 'change-control',
    label: 'Change Control',
    icon: GitPullRequest,
    path: '/change-control',
  },
  {
    id: 'complaints',
    label: 'Complaints & Recalls',
    icon: Undo2,
    path: '/complaints',
  },
  {
    id: 'audit-trail',
    label: 'Audit Trail System',
    icon: History,
    path: '/audit-trail',
  },
  {
    id: 'settings',
    label: 'Setting',
    icon: Settings,
    children: [
      { id: 'user-management', label: 'User Management', icon: Users, path: '/settings/users' },
      { id: 'roles', label: 'Roles & Permissions', icon: ShieldUser, path: '/settings/roles' },
      { id: 'dictionaries', label: 'Dictionaries', icon: Book, path: '/settings/dictionaries' },
      { id: 'config', label: 'Configuration', icon: MonitorCog, path: '/settings/config' },
      { id: 'info-sys', label: 'Information System', icon: Database, path: '/settings/info-system' },
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
    nodes.forEach(node => {
      if (node.path) paths.push(node.path);
      if (node.children) traverse(node.children);
    });
  };
  traverse(items);
  return paths;
};
