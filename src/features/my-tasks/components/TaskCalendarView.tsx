import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';
import { cn } from '@/components/ui/utils';
import { Task } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  getPriorityColor,
} from "../utils";

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get calendar data
  const { year, month, firstDay, daysInMonth, daysInPrevMonth } = useMemo(() => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    return { year, month, firstDay, daysInMonth, daysInPrevMonth };
  }, [selectedMonth, selectedYear]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.forEach(task => {
      const date = task.dueDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    return grouped;
  }, [tasks]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Array<{
      date: number;
      month: 'prev' | 'current' | 'next';
      fullDate: string;
      isToday: boolean;
    }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = daysInPrevMonth - i;
      const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      days.push({ date, month: 'prev', fullDate, isToday: false });
    }

    // Current month days
    const today = new Date();
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && 
                      today.getMonth() === month && 
                      today.getDate() === date;
      days.push({ date, month: 'current', fullDate, isToday });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      const fullDate = `${year}-${String(month + 2).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      days.push({ date, month: 'next', fullDate, isToday: false });
    }

    return days;
  }, [year, month, firstDay, daysInMonth, daysInPrevMonth]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Task Calendar
          </h3>
        </div>

        {/* Month and Year Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
          <div className="w-36 shrink-0">
            <Select
              value={selectedMonth.toString()}
              onChange={(value) => setSelectedMonth(Number(value))}
              options={monthNames.map((name, index) => ({
                label: name,
                value: index.toString()
              }))}
              placeholder="Select month"
            />
          </div>
          
          <div className="w-20 shrink-0">
            <Select
              value={selectedYear.toString()}
              onChange={(value) => setSelectedYear(Number(value))}
              options={yearOptions.map((year) => ({
                label: year.toString(),
                value: year.toString()
              }))}
              placeholder="Select year"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const dayTasks = tasksByDate[day.fullDate] || [];
          const isCurrentMonth = day.month === 'current';

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] md:min-h-[140px] lg:min-h-[160px] border rounded-lg p-1.5 md:p-2 transition-all",
                isCurrentMonth
                  ? "bg-white border-slate-200 hover:border-emerald-300"
                  : "bg-slate-50 border-slate-100",
                day.isToday && "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50"
              )}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-sm font-semibold",
                  isCurrentMonth ? "text-slate-900" : "text-slate-400",
                  day.isToday && "text-emerald-700"
                )}>
                  {day.date}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                {dayTasks.slice(0, 2).map(task => {
                  const ModuleIcon = getModuleIcon(task.module as any);
                  const overdueStatus = isOverdue(task.dueDate) && task.status !== "Completed";
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className={cn(
                        "p-1.5 md:p-2 rounded-md cursor-pointer hover:shadow-md transition-all border",
                        overdueStatus
                          ? "bg-red-50 border-red-200 hover:bg-red-100"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {/* Header: Module + Priority */}
                      <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border truncate max-w-[calc(100%-12px)]",
                          getModuleBadgeStyle(task.module as any)
                        )}>
                          <ModuleIcon className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{task.module}</span>
                        </div>
                        <span className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          task.priority === "Critical" && "bg-red-600",
                          task.priority === "High" && "bg-orange-600",
                          task.priority === "Medium" && "bg-amber-600",
                          task.priority === "Low" && "bg-blue-600"
                        )} />
                      </div>

                      {/* Task Info */}
                      <div className="space-y-0.5">
                        <p className="text-[11px] md:text-xs font-semibold text-slate-900 truncate" title={task.title}>
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between gap-1 min-w-0">
                          <span className="text-[9px] md:text-[10px] font-mono text-slate-500 truncate">{task.taskId}</span>
                          <span className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0",
                            task.status === "Completed" && "bg-emerald-100 text-emerald-700",
                            task.status === "In-Progress" && "bg-blue-100 text-blue-700",
                            task.status === "Pending" && "bg-amber-100 text-amber-700"
                          )}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-slate-500 text-center py-1 font-medium">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span className="text-xs text-slate-600">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-600"></span>
          <span className="text-xs text-slate-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-600"></span>
          <span className="text-xs text-slate-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="text-xs text-slate-600">Low</span>
        </div>
      </div>
    </div>
  );
};
