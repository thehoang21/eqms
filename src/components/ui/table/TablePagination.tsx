import React from 'react';
import { Button } from '../button/Button';
import { cn } from '../utils';

/**
 * TablePagination Component
 * Reusable pagination component for data tables
 * 
 * @example
 * ```tsx
 * <TablePagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   itemsPerPage={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export interface TablePaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Show "Showing X-Y of Z results" text */
  showItemCount?: boolean;
  /** Show page numbers between prev/next buttons */
  showPageNumbers?: boolean;
  /** Maximum page number buttons to display */
  maxPageButtons?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showItemCount = true,
  showPageNumbers = false,
  maxPageButtons = 5,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-slate-200 bg-white',
        className
      )}
    >
      {/* Item count */}
      {showItemCount && (
        <div className="text-xs md:text-sm text-slate-600">
          Showing{' '}
          <span className="font-medium text-slate-900">{startItem}</span> to{' '}
          <span className="font-medium text-slate-900">{endItem}</span> of{' '}
          <span className="font-medium text-slate-900">{totalItems}</span>
          <span className="hidden sm:inline"> results</span>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          className="text-xs md:text-sm px-2.5 md:px-4"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <span className="hidden xs:inline">Previous</span>
          <span className="xs:hidden">Prev</span>
        </Button>

        {/* Page numbers (optional) */}
        {showPageNumbers && (
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="h-8 w-8 text-sm font-medium rounded-md transition-all text-slate-700 hover:bg-slate-100"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="px-1 text-slate-400">...</span>
                )}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'h-8 w-8 text-sm font-medium rounded-md transition-all',
                  page === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {page}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-slate-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="h-8 w-8 text-sm font-medium rounded-md transition-all text-slate-700 hover:bg-slate-100"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          className="text-xs md:text-sm px-2.5 md:px-4"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
