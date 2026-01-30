import React, { useMemo, useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, AlertCircle, ZoomIn, ZoomOut, BarChart3 } from "lucide-react";
import { cn } from '@/components/ui/utils';
import type { Task } from "../types";
import {
  getModuleBadgeStyle,
  getModuleIcon,
  isOverdue,
  getStatusBadgeStyle,
} from "../utils";

interface TaskGanttViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskGanttView: React.FC<TaskGanttViewProps> = ({ tasks, onTaskClick }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["Document", "Deviation", "CAPA", "Training"]));
  const [timelineView, setTimelineView] = useState<"month" | "day">("day");
  const [dayWidth, setDayWidth] = useState(50); // px per day for Day view
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate date range for timeline
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 60);
      return {
        startDate: today,
        endDate: futureDate,
        totalDays: 60
      };
    }

    const dates = tasks.map(t => new Date(t.dueDate));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Add padding (7 days before and after)
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);
    
    const diffTime = Math.abs(maxDate.getTime() - minDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      startDate: minDate,
      endDate: maxDate,
      totalDays: diffDays
    };
  }, [tasks]);

  // Group tasks by module
  const tasksByModule = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      Document: [],
      Deviation: [],
      CAPA: [],
      Training: [],
    };
    
    tasks.forEach(task => {
      if (grouped[task.module]) {
        grouped[task.module].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  // Generate timeline headers
  const { monthHeaders, dayHeaders, totalWidth } = useMemo(() => {
    if (timelineView === "month") {
      // Month View Logic (Percentage based)
      const headers: Array<{ label: string; width: number }> = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        const monthStart = new Date(current);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        const effectiveEnd = monthEnd > endDate ? endDate : monthEnd;
        
        const daysInRange = Math.ceil((effectiveEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const widthPercent = (daysInRange / totalDays) * 100;
        
        headers.push({
          label: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          width: widthPercent
        });
        
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
      }
      return { monthHeaders: headers, dayHeaders: [], totalWidth: "100%" };
    } else {
      // Day View Logic (Pixel based)
      const mHeaders: Array<{ label: string; width: number }> = [];
      const dHeaders: Array<{ labelDay: string; labelDate: string; date: Date }> = [];
      
      let current = new Date(startDate);
      let currentMonthLabel = "";
      let currentMonthDays = 0;

      // Iterate day by day
      for (let i = 0; i < totalDays; i++) {
        // Day Header
        dHeaders.push({
          labelDay: current.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
          labelDate: current.getDate().toString().padStart(2, "0"),
          date: new Date(current)
        });

        // Month Header Accumulation
        const monthLabel = current.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
        if (monthLabel !== currentMonthLabel) {
          if (currentMonthLabel) {
            mHeaders.push({ label: currentMonthLabel, width: currentMonthDays * dayWidth });
          }
          currentMonthLabel = monthLabel;
          currentMonthDays = 0;
        }
        currentMonthDays++;
        
        current.setDate(current.getDate() + 1);
      }
      // Push last month
      if (currentMonthLabel) {
        mHeaders.push({ label: currentMonthLabel, width: currentMonthDays * dayWidth });
      }

      return { 
        monthHeaders: mHeaders, 
        dayHeaders: dHeaders, 
        totalWidth: totalDays * dayWidth 
      };
    }
  }, [startDate, endDate, totalDays, timelineView, dayWidth]);

  // Calculate task bar position and width
  const getTaskBarStyle = (task: Task) => {
    const dueDate = new Date(task.dueDate);
    const taskStart = new Date(dueDate);
    taskStart.setDate(taskStart.getDate() - 7); // Assume 7 days duration
    
    const daysSinceStart = Math.max(0, Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const taskDuration = 7;
    
    if (timelineView === "month") {
      const leftPercent = (daysSinceStart / totalDays) * 100;
      const widthPercent = (taskDuration / totalDays) * 100;
      return { left: `${leftPercent}%`, width: `${widthPercent}%` };
    } else {
      const leftPx = daysSinceStart * dayWidth;
      const widthPx = taskDuration * dayWidth;
      return { left: `${leftPx}px`, width: `${widthPx}px` };
    }
  };

  const toggleModule = (module: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(module)) {
        newSet.delete(module);
      } else {
        newSet.add(module);
      }
      return newSet;
    });
  };

  // Calculate today's position with time
  const getTodayPosition = () => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    // Calculate days since start (to the start of today)
    const daysSinceStart = Math.max(0, Math.ceil((todayStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate the fraction of the current day that has passed
    const hoursPassedToday = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const dayFraction = hoursPassedToday / 24; // 0 to 1
    
    if (timelineView === "month") {
      const position = ((daysSinceStart + dayFraction) / totalDays) * 100;
      return position >= 0 && position <= 100 ? `${position}%` : null;
    } else {
      const position = (daysSinceStart + dayFraction) * dayWidth;
      return position >= 0 && position <= (totalDays * dayWidth) ? `${position}px` : null;
    }
  };

  const todayPosition = getTodayPosition();

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (timelineView === "day" && e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setDayWidth(prev => Math.max(30, Math.min(150, prev + delta)));
    }
  };

  // Prevent default browser zoom when ctrl+wheel inside component
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const preventDefaultZoom = (e: WheelEvent) => {
      if (e.ctrlKey && timelineView === "day") {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', preventDefaultZoom, { passive: false });
    return () => {
      container.removeEventListener('wheel', preventDefaultZoom);
    };
  }, [timelineView]);

  // Auto-scroll to TODAY position on mount and view change
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || todayPosition === null) return;

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (timelineView === "month") {
        // For month view (percentage based), calculate pixel position
        const containerWidth = container.scrollWidth;
        const todayPercent = parseFloat(todayPosition);
        const scrollPosition = (todayPercent / 100) * containerWidth - container.clientWidth / 2;
        container.scrollLeft = Math.max(0, scrollPosition);
      } else {
        // For day view (pixel based)
        const todayPx = parseFloat(todayPosition);
        const scrollPosition = todayPx - container.clientWidth / 2;
        container.scrollLeft = Math.max(0, scrollPosition);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [todayPosition, timelineView]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">Gantt Chart</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {timelineView === "day" && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                <ZoomOut className="h-4 w-4" />
                <span>Ctrl + Scroll to Zoom</span>
                <ZoomIn className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-lg">
              <button
                onClick={() => setTimelineView("month")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timelineView === "month"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setTimelineView("day")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  timelineView === "day"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Task List Column (Fixed) */}
        <div className="w-64 md:w-72 lg:w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col">
          {/* Timeline Header Spacer */}
          <div className={cn(
            "border-b border-slate-200 bg-white p-3 flex items-center justify-center",
            timelineView === "day" ? "h-[88px]" : "h-12"
          )}>
            <p className="text-base font-bold text-slate-700 uppercase tracking-wider">Tasks</p>
          </div>

          {/* Task Names */}
          <div className="divide-y divide-slate-200 overflow-y-auto custom-scrollbar flex-1">
            {Object.entries(tasksByModule).map(([module, moduleTasks]) => (
              <div key={module}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors sticky top-0 bg-white z-10 border-b border-slate-100"
                >
                  {expandedModules.has(module) ? (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  )}
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border",
                    getModuleBadgeStyle(module as any)
                  )}>
                    {(() => {
                      const Icon = getModuleIcon(module as any);
                      return <Icon className="h-3.5 w-3.5" />;
                    })()}
                    {module}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">
                    {moduleTasks.length}
                  </span>
                </button>

                {/* Module Tasks */}
                {expandedModules.has(module) && moduleTasks.map((task) => {
                  const overdueStatus = isOverdue(task.dueDate) && task.status !== "Completed";
                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="pl-8 md:pl-10 pr-2 md:pr-3 py-3 md:py-3.5 hover:bg-slate-50 cursor-pointer transition-colors border-t border-slate-100 h-[56px] md:h-[60px] flex items-center"
                    >
                      <div className="flex items-start gap-2.5 w-full">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
                          task.priority === "Critical" && "bg-red-600",
                          task.priority === "High" && "bg-orange-500",
                          task.priority === "Medium" && "bg-amber-500",
                          task.priority === "Low" && "bg-emerald-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-slate-900 truncate flex-1">
                              {task.title}
                            </p>
                            {overdueStatus && (
                              <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-mono">{task.taskId}</span>
                            <span>•</span>
                            <span className={cn(
                              "font-medium",
                              getStatusBadgeStyle(task.status).split(" ")[1] // Get text color class
                            )}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Column (Scrollable) */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex flex-col"
          onWheel={handleWheel}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}
        >
          <div style={{ width: typeof totalWidth === 'number' ? `${totalWidth}px` : totalWidth, minWidth: '100%' }}>
            {/* Timeline Header */}
            <div className="border-b border-slate-200 bg-slate-100 sticky top-0 z-20">
              {timelineView === "month" ? (
                // Month View Header
                <div className="h-12 flex">
                  {monthHeaders.map((header, index) => (
                    <div
                      key={index}
                      style={{ width: `${header.width}%` }}
                      className="border-r border-slate-200 p-3 shrink-0 flex items-center justify-center"
                    >
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {header.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Day View Header (2 Rows)
                <div className="h-[88px] flex flex-col">
                  {/* Top Row: Months */}
                  <div className="h-8 flex border-b border-slate-200 bg-slate-200/50">
                    {monthHeaders.map((header, index) => (
                      <div
                        key={index}
                        style={{ width: `${header.width}px` }}
                        className="border-r border-slate-400 shrink-0 flex items-center justify-center"
                      >
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {header.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Bottom Row: Days */}
                  <div className="h-[56px] flex">
                    {dayHeaders.map((header, index) => {
                      const isWeekend = header.date.getDay() === 0 || header.date.getDay() === 6;
                      return (
                        <div
                          key={index}
                          style={{ width: `${dayWidth}px` }}
                          className={cn(
                            "border-r border-slate-200 shrink-0 flex flex-col items-center justify-center gap-0.5",
                            isWeekend ? "bg-slate-50/80" : "bg-white"
                          )}
                        >
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">
                            {header.labelDay}
                          </span>
                          <span className={cn(
                            "text-sm font-bold",
                            isWeekend ? "text-slate-600" : "text-slate-800"
                          )}>
                            {header.labelDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Task Bars Container */}
            <div className="divide-y divide-slate-200 relative">
              {/* Today Marker Line */}
              {todayPosition !== null && (
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none"
                  style={{ left: todayPosition }}
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0 w-0.5 bg-emerald-500 shadow-sm" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-30">
                      TODAY
                    </div>
                  </div>
                </div>
              )}

              {Object.entries(tasksByModule).map(([module, moduleTasks]) => (
                <div key={module}>
                  {/* Module Header Row (Empty spacer matching left column) */}
                  <div className="h-[45px] bg-slate-50/50 relative border-b border-slate-100">
                    <div className="absolute inset-0 flex">
                      {timelineView === "month" ? (
                        monthHeaders.map((header, index) => (
                          <div
                            key={index}
                            style={{ width: `${header.width}%` }}
                            className="border-r border-slate-200 shrink-0"
                          />
                        ))
                      ) : (
                        dayHeaders.map((header, index) => (
                          <div
                            key={index}
                            style={{ width: `${dayWidth}px` }}
                            className={cn(
                              "border-r border-slate-200 shrink-0",
                              (header.date.getDay() === 0 || header.date.getDay() === 6) && "bg-slate-50/50"
                            )}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Module Task Bars */}
                  {expandedModules.has(module) && moduleTasks.map((task) => {
                    const barStyle = getTaskBarStyle(task);
                    const overdueStatus = isOverdue(task.dueDate) && task.status !== "Completed";

                    return (
                      <div
                        key={task.id}
                        className="h-[60px] relative hover:bg-slate-50 transition-colors border-t border-slate-100"
                        onClick={() => onTaskClick(task)}
                      >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                          {timelineView === "month" ? (
                            monthHeaders.map((header, index) => (
                              <div
                                key={index}
                                style={{ width: `${header.width}%` }}
                                className="border-r border-slate-200 shrink-0"
                              />
                            ))
                          ) : (
                            dayHeaders.map((header, index) => (
                              <div
                                key={index}
                                style={{ width: `${dayWidth}px` }}
                                className={cn(
                                  "border-r border-slate-200 shrink-0",
                                  (header.date.getDay() === 0 || header.date.getDay() === 6) && "bg-slate-50/50"
                                )}
                              />
                            ))
                          )}
                        </div>

                        {/* Task Bar */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-2 cursor-pointer group z-10"
                          style={barStyle}
                        >
                          <div className={cn(
                            "h-full rounded-full shadow-md transition-all group-hover:shadow-lg group-hover:scale-y-150 relative overflow-hidden",
                            overdueStatus
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : task.status === "Completed"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                              : task.status === "In-Progress"
                              ? "bg-gradient-to-r from-cyan-500 to-cyan-600"
                              : "bg-gradient-to-r from-slate-400 to-slate-500"
                          )}>
                            {/* Progress Bar Overlay */}
                            <div
                              className="absolute inset-0 bg-white/20 transition-all"
                              style={{ width: `${100 - task.progress}%`, right: 0, left: 'auto' }}
                            />

                            {/* Priority Indicator */}
                            {task.priority === "Critical" && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-900" />
                            )}
                          </div>

                          {/* Enhanced Tooltip */}
                          <div className="absolute left-0 top-8 z-30 hidden group-hover:block bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl whitespace-nowrap min-w-[240px]">
                            <div className="space-y-2">
                              <p className="font-semibold text-sm border-b border-slate-700 pb-2">
                                {task.title}
                              </p>
                              <div className="space-y-1.5 text-slate-300">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">ID:</span>
                                  <span className="font-mono text-white">{task.taskId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">Assignee:</span>
                                  <span className="text-white">{task.assignee}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">Due Date:</span>
                                  <span className="text-white">
                                    {new Date(task.dueDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric"
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">Priority:</span>
                                  <span className={cn(
                                    "font-medium",
                                    task.priority === "Critical" && "text-red-400",
                                    task.priority === "High" && "text-orange-400",
                                    task.priority === "Medium" && "text-amber-400",
                                    task.priority === "Low" && "text-blue-400"
                                  )}>
                                    {task.priority}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">Status:</span>
                                  <span className="text-white">{task.status}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 w-16">Progress:</span>
                                  <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-white font-medium">{task.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
