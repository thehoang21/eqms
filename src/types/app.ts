import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon | any;
  /** Custom icon color class (e.g., 'text-blue-500') */
  iconColor?: string;
  children?: NavItem[];
  path?: string; // Route path for navigation
  /** Show horizontal divider after this item */
  showDividerAfter?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  id: string;
}

export interface AppState {
  currentViewId: string;
  breadcrumbs: BreadcrumbItem[];
}
