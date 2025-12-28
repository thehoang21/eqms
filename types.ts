import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  children?: NavItem[];
  path?: string; // Route path for navigation
}

export interface BreadcrumbItem {
  label: string;
  id: string;
}

export interface AppState {
  currentViewId: string;
  breadcrumbs: BreadcrumbItem[];
}
