import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, ChevronDown } from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import { Checkbox } from '../../../components/ui/checkbox/Checkbox';
import { Button } from '../../../components/ui/button/Button';
import { TableColumn } from '../types';

interface ColumnCustomizerProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

export const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  columns,
  onColumnsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out locked columns for reordering
  const reorderableColumns = columns.filter(col => !col.locked);
  const lockedColumns = columns.filter(col => col.locked);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...reorderableColumns];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedColumn);

    // Update order property
    const updatedReorderable = newColumns.map((col, idx) => ({
      ...col,
      order: idx + 1, // Start from 1 (0 is reserved for "No.")
    }));

    // Merge with locked columns
    const finalColumns = [
      ...lockedColumns,
      ...updatedReorderable,
    ].sort((a, b) => a.order - b.order);

    onColumnsChange(finalColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleVisibility = (columnId: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const resetToDefault = () => {
    const defaultColumns: TableColumn[] = [
      { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
      { id: 'taskId', label: 'Task ID', visible: true, order: 1 },
      { id: 'taskName', label: 'Task Name', visible: true, order: 2 },
      { id: 'module', label: 'Module', visible: true, order: 3 },
      { id: 'assignee', label: 'Assignee', visible: true, order: 4 },
      { id: 'reporter', label: 'Reporter', visible: true, order: 5 },
      { id: 'daysLeft', label: 'Days Left', visible: true, order: 6 },
      { id: 'status', label: 'Status', visible: true, order: 7 },
    //   { id: 'progress', label: 'Progress', visible: true, order: 8 },
      { id: 'dueDate', label: 'Due Date', visible: true, order: 9 },
      { id: 'priority', label: 'Priority', visible: true, order: 10 },
      { id: 'action', label: 'Action', visible: true, order: 11, locked: true },
    ];
    onColumnsChange(defaultColumns);
  };

  const handleDone = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 h-11 border rounded-md bg-white text-sm transition-all",
          isOpen 
            ? "border-emerald-500 ring-2 ring-emerald-500" 
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <span className="text-slate-700 font-medium">Customize Columns</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 top-full mt-2 z-50 w-full bg-white rounded-lg border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Customize Columns</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scroll to View, Drag to reorder</p>
          </div>

          {/* Column List */}
          <div className="p-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {reorderableColumns.map((column, index) => (
              <div
                key={column.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md border border-transparent transition-all cursor-move group',
                  draggedIndex === index
                    ? 'bg-blue-50 border-blue-200 opacity-50'
                    : 'hover:bg-slate-50'
                )}
              >
                <Checkbox
                  id={`column-${column.id}`}
                  checked={column.visible}
                  onChange={() => toggleVisibility(column.id)}
                  className="flex-shrink-0"
                />
                
                <span className={cn(
                  "text-sm font-medium flex-1",
                  column.visible ? "text-slate-700" : "text-slate-400"
                )}>
                  {column.label}
                </span>

                <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 rounded-b-lg border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleDone}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
