import React, { useState, useMemo } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { Task } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  daysUntil,
  getStatusBadgeStyle,
  getPriorityColor,
} from "../utils";
import { IconCircleCheckFilled } from "@tabler/icons-react";

// Helper functions
const calculateDaysLeft = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getPriorityBadgeStyle = (priority: string): string => {
  switch (priority) {
    case "High":
      return "bg-red-50 text-red-700 border-red-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

// Add diagonal stripes pattern for completed tasks
const diagonalStripesStyle = `
  .completed-row {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(148, 163, 184, 0.08) 10px,
      rgba(148, 163, 184, 0.08) 20px
    );
  }
  .completed-row:hover {
    background-image: repeating-linear-gradient(
      45deg,
      rgba(248, 250, 252, 0.9),
      rgba(248, 250, 252, 0.9) 10px,
      rgba(148, 163, 184, 0.12) 10px,
      rgba(148, 163, 184, 0.12) 20px
    );
  }
  .completed-row-cell {
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(148, 163, 184, 0.08) 10px,
      rgba(148, 163, 184, 0.08) 20px
    );
  }
  .completed-row:hover .completed-row-cell {
    background-image: repeating-linear-gradient(
      45deg,
      rgba(248, 250, 252, 0.9),
      rgba(248, 250, 252, 0.9) 10px,
      rgba(148, 163, 184, 0.12) 10px,
      rgba(148, 163, 184, 0.12) 20px
    );
  }
`;

export const TaskTable: React.FC<{
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  startIndex: number;
}> = ({ tasks, onTaskClick, startIndex }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginate Data
  const paginatedTasks = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return tasks.slice(startIdx, endIdx);
  }, [tasks, currentPage]);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: diagonalStripesStyle }} />
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[1800px] md:min-w-[2000px] xl:min-w-[2200px]">
          <thead className="bg-slate-50/80 border-b-2 border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
            <tr>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                No.
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Task ID
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Task Name
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Module
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Assignee
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Reporter
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Days Left
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Status
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Progress
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Due Date
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left">
                Priority
              </th>
              <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedTasks.map((task, idx) => {
              const remainingDays = calculateDaysLeft(task.dueDate);
              const progressPercentage = task.progress || 0;

              return (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className={cn(
                    "hover:bg-slate-50/80 transition-colors group relative cursor-pointer",
                    task.status === "Completed" && "completed-row"
                  )}
                >
                  {/* No. */}
                  <td className="py-3.5 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {startIndex + idx}
                  </td>

                  {/* Task ID */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-mono font-semibold text-emerald-600">
                      {task.taskId}
                    </span>
                  </td>

                  {/* Task Name */}
                  <td className="py-3.5 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 line-clamp-2 break-words max-w-xs">
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Module */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        getModuleBadgeStyle(task.module)
                      )}
                    >
                      {task.module}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 border border-emerald-100">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700" title={task.assignee}>
                        {task.assignee}
                      </span>
                    </div>
                  </td>

                  {/* Reporter */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-100">
                        {task.reporter.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700" title={task.reporter}>
                        {task.reporter}
                      </span>
                    </div>
                  </td>

                  {/* Days Left */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
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

                  {/* Status */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        getStatusBadgeStyle(task.status)
                      )}
                    >
                      {task.status}
                    </span>
                  </td>

                  {/* Progress */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all rounded-full",
                            task.status === "Completed"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                          )}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-8">
                        {progressPercentage}%
                      </span>
                      {task.status === "Completed" && (
                        <IconCircleCheckFilled className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                        getPriorityBadgeStyle(task.priority)
                      )}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Action (Sticky) */}
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50",
                      task.status === "Completed" && "completed-row-cell"
                    )}
                  >
                    {task.status === "Completed" ? (
                      <div className="inline-flex items-center rounded-lg border border-emerald-600 gap-1.5 px-1.5 py-1.5 text-emerald-600 text-xs font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Done</span>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      >
                        Process
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};