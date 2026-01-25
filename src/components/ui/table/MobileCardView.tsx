import React from "react";
import { cn } from "../utils";

/**
 * Mobile Card View for Tables
 * Responsive card layout to replace table rows on mobile devices
 * Usage: Show on mobile (<md), hide on tablet/desktop
 */

export interface MobileCardField {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  badge?: boolean;
}

export interface MobileCardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
}

export interface MobileCardProps {
  fields: MobileCardField[];
  actions?: MobileCardAction[];
  onClick?: () => void;
  className?: string;
  highlight?: boolean;
  index?: number;
}

/**
 * Single Mobile Card
 */
export const MobileCard: React.FC<MobileCardProps> = ({
  fields,
  actions,
  onClick,
  className,
  highlight = false,
  index,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200 rounded-lg p-4 space-y-3 transition-all",
        onClick && "cursor-pointer hover:border-emerald-300 hover:shadow-md active:scale-[0.98]",
        highlight && "ring-2 ring-emerald-500 border-emerald-500",
        className
      )}
    >
      {/* Index Number (Optional) */}
      {index !== undefined && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            #{index}
          </span>
        </div>
      )}

      {/* Fields */}
      <div className="space-y-2.5">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              field.fullWidth ? "flex-col gap-1" : "items-start justify-between gap-2"
            )}
          >
            <div className="flex items-center gap-1.5 shrink-0">
              {field.icon && (
                <span className="text-slate-400">{field.icon}</span>
              )}
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {field.label}
              </span>
            </div>
            <div className={cn(
              "text-sm",
              field.fullWidth ? "mt-0.5" : "text-right",
              field.badge ? "" : "text-slate-900 font-medium"
            )}>
              {field.value}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              disabled={action.disabled}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all",
                action.variant === "destructive" && "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-95",
                action.variant === "outline" && "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95",
                action.variant === "ghost" && "bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95",
                !action.variant && "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {action.icon && <span className="shrink-0">{action.icon}</span>}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile Card List Container
 */
export interface MobileCardListProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardList: React.FC<MobileCardListProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-3 md:hidden", className)}>
      {children}
    </div>
  );
};

/**
 * Empty State for Mobile Cards
 */
export interface MobileCardEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const MobileCardEmptyState: React.FC<MobileCardEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 md:hidden">
      {icon && <div className="text-slate-300 mb-3">{icon}</div>}
      <p className="text-sm font-medium text-slate-700 text-center">{title}</p>
      {description && (
        <p className="text-xs text-slate-500 text-center mt-1">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 active:scale-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
