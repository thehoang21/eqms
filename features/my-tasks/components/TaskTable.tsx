import React from "react";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import { cn } from "../../../components/ui/utils";
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
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  const renderHeader = (column: TableColumn) => {
    const baseClass = "px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap";
    
    switch (column.id) {
      case 'no':
        return (
          <th key={column.id} className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[60px] text-center whitespace-nowrap">
            {column.label}
          </th>
        );
      case 'taskId':
        return <th key={column.id} className={cn(baseClass, "w-[120px]")}>{column.label}</th>;
      case 'taskName':
        return <th key={column.id} className={cn(baseClass, "min-w-[200px]")}>{column.label}</th>;
      case 'module':
        return <th key={column.id} className={cn(baseClass, "hidden md:table-cell")}>{column.label}</th>;
      case 'assignee':
      case 'reporter':
        return <th key={column.id} className={cn(baseClass, "hidden lg:table-cell")}>{column.label}</th>;
      case 'daysLeft':
        return <th key={column.id} className={cn(baseClass, "hidden md:table-cell")}>{column.label}</th>;
      case 'status':
        return <th key={column.id} className={cn(baseClass, "hidden xl:table-cell")}>{column.label}</th>;
      case 'progress':
        return <th key={column.id} className={cn(baseClass, "hidden 2xl:table-cell")}>{column.label}</th>;
      case 'action':
        return (
          <th
            key={column.id}
            className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center 
             sticky right-0 bg-slate-50 z-40 
             before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200
             shadow-[-1px_0_0_0_rgba(226,232,240,1)] 
             w-[120px] whitespace-nowrap"
          >
            {column.label}
          </th>
        );
      default:
        return <th key={column.id} className={baseClass}>{column.label}</th>;
    }
  };

  const renderCell = (column: TableColumn, task: Task, idx: number) => {
    const overdue = isOverdue(task.dueDate) && task.status !== "Completed";
    const remainingDays = daysUntil(task.dueDate);

    switch (column.id) {
      case 'no':
        return (
          <td key={column.id} className="px-4 py-4 whitespace-nowrap align-top text-center text-sm text-slate-600">
            {startIndex + idx}
          </td>
        );
      
      case 'taskId':
        return (
          <td key={column.id} className="px-6 py-4 whitespace-nowrap align-top">
            <button className="text-primary font-bold hover:underline text-sm">
              {task.taskId}
            </button>
          </td>
        );
      
      case 'taskName':
        return (
          <td key={column.id} className="px-6 py-4 align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 hidden md:table-cell align-top">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                getModuleBadgeStyle(task.module)
              )}
            >
              {getModuleIcon(task.module)}
              {task.module}
            </span>
          </td>
        );
      
      case 'assignee':
        return (
          <td key={column.id} className="px-6 py-4 hidden lg:table-cell align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 hidden lg:table-cell align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 hidden md:table-cell align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 hidden xl:table-cell align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 hidden 2xl:table-cell align-top whitespace-nowrap">
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
          <td key={column.id} className="px-6 py-4 whitespace-nowrap align-top">
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                overdue ? "text-red-600 font-bold" : "text-slate-600"
              )}
            >
              <Calendar className="h-4 w-4" />
              {task.dueDate}
              {overdue && <AlertCircle className="h-4 w-4" />}
            </div>
          </td>
        );
      
      case 'priority':
        return (
          <td key={column.id} className="px-6 py-4 whitespace-nowrap align-top">
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
          <td
            key={column.id}
            className="px-6 py-4 text-right align-top sticky right-0 z-20 
             bg-white group-hover:bg-slate-50 transition-colors 
             before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200
             shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] 
             w-[120px] whitespace-nowrap"
          >
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
        return <td key={column.id} className="px-6 py-4 whitespace-nowrap align-top">-</td>;
    }
  };

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[1100px] md:min-w-[1250px] xl:min-w-[1400px]">
        <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
          <tr>
            {visibleColumns.map(column => renderHeader(column))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.map((task, idx) => (
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
  );
};
