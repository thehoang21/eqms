import React from "react";
import { Calendar, AlertCircle, CheckCircle2, Clock, User } from "lucide-react";
import { cn } from '@/components/ui/utils';
import { Task } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  getPriorityColor,
} from "../utils";

interface TaskBoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({ tasks, onTaskClick }) => {
  // Group tasks by status
  const tasksByStatus = {
    Pending: tasks.filter(t => t.status === "Pending"),
    "In-Progress": tasks.filter(t => t.status === "In-Progress"),
    Reviewing: tasks.filter(t => t.status === "Reviewing"),
    Completed: tasks.filter(t => t.status === "Completed"),
  };

  const columns = [
    { status: "Pending", color: "slate", icon: Clock },
    { status: "In-Progress", color: "blue", icon: AlertCircle },
    { status: "Reviewing", color: "amber", icon: AlertCircle },
    { status: "Completed", color: "emerald", icon: CheckCircle2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-4">
      {columns.map(({ status, color, icon: Icon }) => (
        <div key={status} className="flex flex-col h-[calc(100vh-20rem)] md:h-[calc(100vh-22rem)] lg:h-[calc(100vh-24rem)]">
          {/* Column Header */}
          <div className={cn(
            "p-3 md:p-4 rounded-t-xl border-2 border-b-0",
            color === "slate" && "bg-slate-50 border-slate-200",
            color === "blue" && "bg-blue-50 border-blue-200",
            color === "amber" && "bg-amber-50 border-amber-200",
            color === "emerald" && "bg-emerald-50 border-emerald-200"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn(
                  "h-5 w-5",
                  color === "slate" && "text-slate-600",
                  color === "blue" && "text-blue-600",
                  color === "amber" && "text-amber-600",
                  color === "emerald" && "text-emerald-600"
                )} />
                <h3 className={cn(
                  "font-semibold text-xs md:text-sm",
                  color === "slate" && "text-slate-700",
                  color === "blue" && "text-blue-700",
                  color === "amber" && "text-amber-700",
                  color === "emerald" && "text-emerald-700"
                )}>
                  {status}
                </h3>
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                color === "slate" && "bg-slate-200 text-slate-700",
                color === "blue" && "bg-blue-200 text-blue-700",
                color === "amber" && "bg-amber-200 text-amber-700",
                color === "emerald" && "bg-emerald-200 text-emerald-700"
              )}>
                {tasksByStatus[status as keyof typeof tasksByStatus].length}
              </span>
            </div>
          </div>

          {/* Column Body */}
          <div className={cn(
            "flex-1 p-2 md:p-3 space-y-2 md:space-y-3 bg-white border-2 rounded-b-xl overflow-y-auto custom-scrollbar",
            color === "slate" && "border-slate-200",
            color === "blue" && "border-blue-200",
            color === "amber" && "border-amber-200",
            color === "emerald" && "border-emerald-200"
          )}>
            {tasksByStatus[status as keyof typeof tasksByStatus].map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="p-3 md:p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
              >
                {/* Priority Indicator */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
                    getPriorityColor(task.priority)
                  )}>
                    {task.priority}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {task.taskId}
                  </span>
                </div>

                {/* Task Title */}
                <h4 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {task.title}
                </h4>

                {/* Task Description */}
                {task.description && (
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Module Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
                    getModuleBadgeStyle(task.module)
                  )}>
                    {(() => {
                      const Icon = getModuleIcon(task.module);
                      return <Icon className="h-3.5 w-3.5" />;
                    })()}
                    {task.module}
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span className={cn(
                    "text-xs font-medium",
                    isOverdue(task.dueDate) && task.status !== "Completed"
                      ? "text-red-600"
                      : "text-slate-700"
                  )}>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {isOverdue(task.dueDate) && task.status !== "Completed" && (
                    <span className="text-xs font-medium text-red-600">
                      (Overdue)
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {task.progress > 0 && (
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Assignee */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs text-slate-600">{task.assignee}</span>
                </div>
              </div>
            ))}

            {tasksByStatus[status as keyof typeof tasksByStatus].length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                  color === "slate" && "bg-slate-100",
                  color === "blue" && "bg-blue-100",
                  color === "amber" && "bg-amber-100",
                  color === "emerald" && "bg-emerald-100"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    color === "slate" && "text-slate-400",
                    color === "blue" && "text-blue-400",
                    color === "amber" && "text-amber-400",
                    color === "emerald" && "text-emerald-400"
                  )} />
                </div>
                <p className="text-sm text-slate-500">No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
