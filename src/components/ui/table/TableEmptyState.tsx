import React from "react";
import { Search } from "lucide-react";
import { Button } from "../button/Button";

export interface TableEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Table Empty State Component
 * Hiển thị khi không có dữ liệu sau khi filter
 * 
 * @example
 * ```tsx
 * <TableEmptyState 
 *   title="No Results Found"
 *   description="Try adjusting your filters"
 *   actionLabel="Clear Filters"
 *   onAction={handleClearFilters}
 * />
 * ```
 */
export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  icon,
  title = "No Results Found",
  description = "We couldn't find any items matching your filters. Try adjusting your search criteria or clear filters.",
  actionLabel = "Clear Filters",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 bg-white text-center">
      <div className="h-14 w-14 md:h-16 md:w-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 md:mb-4">
        {icon || <Search className="h-7 w-7 md:h-8 md:w-8 text-slate-300" />}
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">
        {title}
      </h3>
      <p className="text-sm md:text-base text-slate-500 max-w-sm mx-auto mb-4 md:mb-6">
        {description}
      </p>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
