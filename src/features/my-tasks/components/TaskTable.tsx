import React, { useState, useMemo } from "react";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { Task, TableColumn } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  daysUntil,
  getStatusBadgeStyle,
  getPriorityColor,
} from "../utils";

export const TaskTable: React.FC<{
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  startIndex: number;
  columns: TableColumn[];
}> = ({ tasks, onTaskClick, startIndex, columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  // Paginate Data
  const paginatedTasks = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return tasks.slice(startIdx, endIdx);
  }, [tasks, currentPage]);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const renderHeader = (column: TableColumn) => {
    switch (column.id) {
      case 'no':
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
            {column.label}
          </th>
        );
      case 'taskId':
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
            {column.label}
          </th>
        );
      case 'taskName':
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left min-w-[500px]">
            {column.label}
          </th>
        );
      case 'module':
        return (
          <th key={column.id} className="hidden md:table-cell py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[220px]">
            {column.label}
          </th>
        );
      case 'assignee':
      case 'reporter':
        return (
          <th key={column.id} className="hidden lg:table-cell py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[250px]">
            {column.label}
          </th>
        );
      case 'daysLeft':
        return (
          <th key={column.id} className="hidden md:table-cell py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[180px]">
            {column.label}
          </th>
        );
      case 'status':
        return (
          <th key={column.id} className="hidden xl:table-cell py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[180px]">
            {column.label}
          </th>
        );
      case 'progress':
        return (
          <th key={column.id} className="hidden 2xl:table-cell py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[160px]">
            {column.label}
          </th>
        );
      case 'dueDate':
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[200px]">
            {column.label}
          </th>
        );
      case 'priority':
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-[160px]">
            {column.label}
          </th>
        );
      case 'action':
        return (
          <th 
            key={column.id} 
            className="sticky right-0 bg-slate-50/80 text-center z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[140px]"
          >
            {column.label}
          </th>
        );
      default:
        return (
          <th key={column.id} className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
            {column.label}
          </th>
        );
    }
  };

  const renderCell = (column: TableColumn, task: Task, idx: number) => {
    const overdue = isOverdue(task.dueDate) && task.status !== "Completed";
    const remainingDays = daysUntil(task.dueDate);

    switch (column.id) {
      case 'no':
        return (
          <td key={column.id} className="py-3.5 px-4 text-sm text-slate-600 text-left whitespace-nowrap">
            {(currentPage - 1) * itemsPerPage + idx + 1}
          </td>
        );
      
      case 'taskId':
        return (
          <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
            <button className="text-primary font-bold hover:underline text-sm">
              {task.taskId}
            </button>
          </td>
        );
      
      case 'taskName':
        return (
          <td key={column.id} className="py-3.5 px-4 text-sm">
            <span
              title={task.description || task.title}
              className={cn(
                "font-normal text-sm md:text-base text-slate-900",
                task.status === "Completed" && "line-through text-slate-500"
              )}
            >
              {task.title}
            </span>
          </td>
        );
      
      case 'module':
        return (
          <td key={column.id} className="hidden md:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                getModuleBadgeStyle(task.module)
              )}
            >
              {(() => {
                const ModuleIcon = getModuleIcon(task.module);
                return <ModuleIcon className="h-3.5 w-3.5" />;
              })()}
              {task.module}
            </span>
          </td>
        );
      
      case 'assignee':
        return (
          <td key={column.id} className="hidden lg:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 border border-emerald-100">
                {task.assignee.charAt(0)}
              </div>
              <span className="text-sm text-slate-700" title={task.assignee}>
                {task.assignee}
              </span>
            </div>
          </td>
        );
      
      case 'reporter':
        return (
          <td key={column.id} className="hidden lg:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-100">
                {task.reporter.charAt(0)}
              </div>
              <span className="text-sm text-slate-700" title={task.reporter}>
                {task.reporter}
              </span>
            </div>
          </td>
        );
      
      case 'daysLeft':
        return (
          <td key={column.id} className="hidden md:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <span
              className={cn(
                "text-sm font-medium",
                remainingDays < 0 ? "text-rose-600" : "text-slate-700"
              )}
            >
              {remainingDays < 0
                ? `${Math.abs(remainingDays)} overdue`
                : `${remainingDays} days`}
            </span>
          </td>
        );
      
      case 'status':
        return (
          <td key={column.id} className="hidden xl:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                getStatusBadgeStyle(task.status)
              )}
            >
              {task.status}
            </span>
          </td>
        );
      
      case 'progress':
        return (
          <td key={column.id} className="hidden 2xl:table-cell py-3.5 px-4 text-sm whitespace-nowrap">
            <div className="flex items-center gap-2 w-24">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full", overdue ? "bg-red-500" : "bg-primary")}
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {task.progress}%
              </span>
            </div>
          </td>
        );
      
      case 'dueDate':
        return (
          <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                overdue ? "text-red-600 font-bold" : "text-slate-600"
              )}
            >
              <Calendar className="h-4 w-4" />
              {task.dueDate}
              {/* {overdue && <AlertCircle className="h-4 w-4" />} */}
            </div>
          </td>
        );
      
      case 'priority':
        return (
          <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border",
                getPriorityColor(task.priority)
              )}
            >
              {task.priority}
            </span>
          </td>
        );
      
      case 'action':
        return (
          <td key={column.id} className="sticky right-0 bg-white z-20 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] py-3.5 px-4 text-sm whitespace-nowrap text-center w-[140px]">
            {task.status !== "Completed" ? (
              <Button
                size="xs"
                className="text-white bg-brand hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none transition-all"
              >
                Process
              </Button>
            ) : (
              <span className="inline-flex items-center justify-center w-full text-emerald-600 text-sm font-medium py-1">
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Done
              </span>
            )}
          </td>
        );
      
      default:
        return <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">-</td>;
    }
  };

  return (
    <>
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[1800px] md:min-w-[2000px] xl:min-w-[2200px]">
          <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
            <tr>
              {visibleColumns.map(column => renderHeader(column))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedTasks.map((task, idx) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-slate-50/80 transition-colors group relative cursor-pointer"
              >
                {visibleColumns.map(column => renderCell(column, task, idx))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};