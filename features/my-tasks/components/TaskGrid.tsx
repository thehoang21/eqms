import React from "react";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import { cn } from "../../../components/ui/utils";
import { Task } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  daysUntil,
  getStatusBadgeStyle,
  getPriorityColor,
} from "../utils";

export const TaskGrid: React.FC<{
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}> = ({ tasks, onTaskClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate) && task.status !== "Completed";
        const remainingDays = daysUntil(task.dueDate);
        return (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
                    getModuleBadgeStyle(task.module)
                  )}
                >
                  {getModuleIcon(task.module)}
                  {task.module}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium border",
                    getPriorityColor(task.priority)
                  )}
                >
                  {task.priority}
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                  getStatusBadgeStyle(task.status)
                )}
              >
                {task.status}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-primary">
                  {task.taskId}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    remainingDays < 0 ? "text-rose-600" : "text-slate-500"
                  )}
                >
                  {remainingDays < 0
                    ? `${Math.abs(remainingDays)} days overdue`
                    : `${remainingDays} days left`}
                </span>
              </div>
              <h3
                className={cn(
                  "font-semibold text-slate-900 line-clamp-2",
                  task.status === "Completed" && "line-through text-slate-500"
                )}
              >
                {task.title}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  {task.assignee.charAt(0)}
                </div>
                <span className="truncate max-w-[80px]">{task.assignee}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 ml-auto",
                  overdue ? "text-red-600 font-bold" : ""
                )}
              >
                <Calendar className="h-3.5 w-3.5" />
                {task.dueDate}
                {overdue && <AlertCircle className="h-3.5 w-3.5" />}
              </div>
            </div>

            <div className="mt-2">
              {task.status !== "Completed" ? (
                <Button
                  size="sm"
                  className="w-full text-white bg-brand hover:bg-brand-strong shadow-sm"
                >
                  Process Task
                </Button>
              ) : (
                <div className="w-full py-2 flex items-center justify-center text-emerald-600 text-sm font-medium bg-emerald-50 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Completed
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
