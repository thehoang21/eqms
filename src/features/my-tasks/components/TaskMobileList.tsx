import React from "react";
import { Calendar, User } from "lucide-react";
import { MobileCard, MobileCardList } from "@/components/ui/table/MobileCardView";
import { TaskStatusBadge, PriorityBadge, ModuleBadge } from "@/components/ui/badge";
import type { Task } from "../types";
import { calculateDaysLeft, formatDate } from "../utils";
import { cn } from "@/components/ui/utils";

interface TaskMobileListProps {
  tasks: Task[];
  startIndex: number;
  onTaskClick: (task: Task) => void;
}

export const TaskMobileList: React.FC<TaskMobileListProps> = ({
  tasks,
  startIndex,
  onTaskClick,
}) => {
  return (
    <MobileCardList>
      {tasks.map((task, index) => {
        const remainingDays = calculateDaysLeft(task.dueDate);
        const isCompleted = task.status === "Completed";
        
        return (
          <MobileCard
            key={task.id}
            index={startIndex + index}
            onClick={() => onTaskClick(task)}
            highlight={isCompleted}
            fields={[
              {
                label: "Task ID",
                value: (
                  <span className="font-mono font-semibold text-emerald-600">
                    {task.taskId}
                  </span>
                ),
              },
              {
                label: "Title",
                value: (
                  <span className="font-medium text-slate-900 line-clamp-2">
                    {task.title}
                  </span>
                ),
                fullWidth: true,
              },
              {
                label: "Module",
                value: <ModuleBadge module={task.module as any} />,
                badge: true,
              },
              {
                label: "Status",
                value: <TaskStatusBadge status={task.status as any} />,
                badge: true,
              },
              {
                label: "Priority",
                value: <PriorityBadge priority={task.priority as any} />,
                badge: true,
              },
              {
                label: "Assignee",
                value: (
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-700">{task.assignee}</span>
                  </div>
                ),
              },
              {
                label: "Days Left",
                value: (
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
                ),
              },
              {
                label: "Due Date",
                value: (
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm">{formatDate(task.dueDate)}</span>
                  </div>
                ),
              },
              {
                label: "Progress",
                value: (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all rounded-full",
                          isCompleted ? "bg-emerald-500" : "bg-blue-500"
                        )}
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {task.progress || 0}%
                    </span>
                  </div>
                ),
              },
            ]}
            actions={
              isCompleted
                ? [
                    {
                      label: "Done",
                      onClick: () => {},
                      variant: "outline" as const,
                      disabled: true,
                    },
                  ]
                : [
                    {
                      label: "View Details",
                      onClick: () => onTaskClick(task),
                      variant: "outline" as const,
                    },
                    {
                      label: "Process",
                      onClick: () => onTaskClick(task),
                    },
                  ]
            }
          />
        );
      })}
    </MobileCardList>
  );
};
