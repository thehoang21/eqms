import React from 'react';
import { cn } from '../utils';

/**
 * Badge Component - Flexible badge for any status/label display
 * 
 * @example
 * ```tsx
 * // Using preset variants
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="warning">In Progress</Badge>
 * 
 * // Using custom className
 * <Badge className="bg-rose-50 text-rose-700 border-rose-200">Critical</Badge>
 * 
 * // With icon
 * <Badge variant="info" icon={<InfoIcon />}>Note</Badge>
 * ```
 */

export type BadgeVariant = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'secondary'
  | 'outline';

export type BadgeSize = 'sm' | 'default' | 'lg';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  secondary: 'bg-slate-50 text-slate-600 border-slate-200',
  outline: 'bg-transparent text-slate-700 border-slate-300',
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  default: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Preset color variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether to use rounded-full (pill) style */
  pill?: boolean;
  /** Additional CSS classes (can override variant) */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'default',
  icon,
  pill = false,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium border select-none whitespace-nowrap',
        pill ? 'rounded-full' : 'rounded',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
};

// --- Pre-configured badge factories for common use cases ---

export interface TaskStatusBadgeProps {
  status: 'Pending' | 'In-Progress' | 'Reviewing' | 'Completed' | 'Overdue';
  size?: BadgeSize;
  className?: string;
}

const TASK_STATUS_STYLES: Record<string, string> = {
  'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
  'In-Progress': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Reviewing': 'bg-amber-50 text-amber-700 border-amber-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Overdue': 'bg-red-50 text-red-700 border-red-200',
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = 'default',
  className,
}) => {
  return (
    <Badge
      size={size}
      className={cn(TASK_STATUS_STYLES[status] || TASK_STATUS_STYLES['Pending'], className)}
    >
      {status}
    </Badge>
  );
};

export interface PriorityBadgeProps {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  size?: BadgeSize;
  className?: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  'Critical': 'bg-rose-100 text-rose-800 border-rose-200',
  'High': 'bg-red-50 text-red-700 border-red-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low': 'bg-slate-50 text-slate-700 border-slate-200',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'default',
  className,
}) => {
  return (
    <Badge
      size={size}
      className={cn(PRIORITY_STYLES[priority] || PRIORITY_STYLES['Medium'], className)}
    >
      {priority}
    </Badge>
  );
};

export interface ModuleBadgeProps {
  module: 'Document' | 'Deviation' | 'CAPA' | 'Training';
  size?: BadgeSize;
  className?: string;
}

const MODULE_STYLES: Record<string, string> = {
  'Document': 'bg-sky-50 text-sky-700 border-sky-200',
  'Deviation': 'bg-rose-50 text-rose-700 border-rose-200',
  'CAPA': 'bg-orange-50 text-orange-700 border-orange-200',
  'Training': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const ModuleBadge: React.FC<ModuleBadgeProps> = ({
  module,
  size = 'default',
  className,
}) => {
  return (
    <Badge
      size={size}
      className={cn(MODULE_STYLES[module] || MODULE_STYLES['Document'], className)}
    >
      {module}
    </Badge>
  );
};
