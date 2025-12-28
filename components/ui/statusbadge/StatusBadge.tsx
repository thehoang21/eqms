import React from 'react';
import { cn } from './utils';

export type StatusType = 'draft' | 'pendingReview' | 'pendingApproval' | 'effective' | 'obsolete' | 'approved' | 'archived';

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  draft: { 
    label: 'Draft', 
    className: 'bg-slate-100 text-slate-600 border-slate-200' 
  },
  pendingReview: { 
    label: 'Pending Review', 
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200' 
  },
  pendingApproval: { 
    label: 'Pending Approval', 
    className: 'bg-amber-50 text-amber-700 border-amber-200' 
  },
  approved: { 
    label: 'Approved', 
    className: 'bg-blue-50 text-blue-700 border-blue-200' 
  },
  effective: { 
    label: 'Effective', 
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
  },
  obsolete: { 
    label: 'Obsolete', 
    className: 'bg-rose-50 text-rose-700 border-rose-200' 
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  }
};

export const StatusBadge: React.FC<{ status: StatusType; className?: string }> = ({ status, className }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border select-none", 
      config.className, 
      className
    )}>
      {config.label}
    </span>
  );
};