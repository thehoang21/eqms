import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Users,
  User,
  List,
  BarChart3,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Breadcrumb } from '@/components/ui/breadcrumb/Breadcrumb';
import { myTasks } from '@/components/ui/breadcrumb/breadcrumbs.config';
import { Select } from '@/components/ui/select/Select';
import { DateRangePicker } from '@/components/ui/datetime-picker/DateRangePicker';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { TableEmptyState } from '@/components/ui/table/TableEmptyState';
import { FilterCard } from '@/components/ui/card/FilterCard';
import { SectionLoading } from '@/components/ui/loading/Loading';
import { cn } from '@/components/ui/utils';
import type { Task, ViewMode } from "./types";
import { MOCK_TASKS } from "./mockData";
import { TaskTable, TaskCalendarView, TaskGanttView, TaskDetailDrawer } from "./components";

// --- Components ---

// 1. Task Filters using standard Select component
interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

// 2. Task Filters
const TaskFilters: React.FC<{
  search: string;
  setSearch: (val: string) => void;
  module: string;
  setModule: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  fromDate: string;
  setFromDate: (val: string) => void;
  toDate: string;
  setToDate: (val: string) => void;
  assignee: string;
  setAssignee: (val: string) => void;
  reporter: string;
  setReporter: (val: string) => void;
}> = ({
  search,
  setSearch,
  module,
  setModule,
  priority,
  setPriority,
  status,
  setStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  assignee,
  setAssignee,
  reporter,
  setReporter,
}) => {
  const moduleOptions: SelectOption[] = [
    { label: "All", value: "All Modules" },
    {
      label: "Document Control",
      value: "DMS",
    },
    {
      label: "Deviation Management",
      value: "Deviation",
    },
    {
      label: "CAPA",
      value: "CAPA",
    },
    {
      label: "Training Management",
      value: "Training",
    },
  ];
  const priorityOptions: SelectOption[] = [
    { label: "All", value: "All Priorities" },
    {
      label: "Critical",
      value: "Critical",
      icon: <div className="h-2 w-2 rounded-full bg-rose-500" />,
    },
    {
      label: "High",
      value: "High",
      icon: <div className="h-2 w-2 rounded-full bg-red-500" />,
    },
    {
      label: "Medium",
      value: "Medium",
      icon: <div className="h-2 w-2 rounded-full bg-amber-500" />,
    },
    {
      label: "Low",
      value: "Low",
      icon: <div className="h-2 w-2 rounded-full bg-blue-500" />,
    },
  ];
  const statusOptions: SelectOption[] = [
    { label: "All", value: "All Statuses" },
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In-Progress" },
    { label: "Reviewing", value: "Reviewing" },
    { label: "Completed", value: "Completed" },
  ];
  const assigneeOptions: SelectOption[] = [
    { label: "All Assignees", value: "All Assignees" },
    {
      label: "Dr. A. Smith (QA)",
      value: "Dr. A. Smith",
      icon: <User className="h-3.5 w-3.5" />,
    },
    {
      label: "J. Doe (QC)",
      value: "J. Doe",
      icon: <User className="h-3.5 w-3.5" />,
    },
    {
      label: "QC Lab Team",
      value: "QC Lab",
      icon: <Users className="h-3.5 w-3.5" />,
    },
    {
      label: "Engineering",
      value: "Engineering",
      icon: <Users className="h-3.5 w-3.5" />,
    },
    {
      label: "Warehousing",
      value: "Warehousing",
      icon: <Users className="h-3.5 w-3.5" />,
    },
    {
      label: "QA Risk",
      value: "QA Risk",
      icon: <Users className="h-3.5 w-3.5" />,
    },
  ];
  const reporterOptions: SelectOption[] = [
    { label: "All Reporters", value: "All Reporters" },
    { label: "System", value: "System", icon: <User className="h-3.5 w-3.5" /> },
    { label: "John Smith", value: "John Smith", icon: <User className="h-3.5 w-3.5" /> },
    { label: "W. House", value: "W. House", icon: <User className="h-3.5 w-3.5" /> },
    { label: "HR Training", value: "HR Training", icon: <Users className="h-3.5 w-3.5" /> },
    { label: "QA Lead", value: "QA Lead", icon: <User className="h-3.5 w-3.5" /> },
    { label: "V. Validation", value: "V. Validation", icon: <User className="h-3.5 w-3.5" /> },
    { label: "Fac. Manager", value: "Fac. Manager", icon: <User className="h-3.5 w-3.5" /> },
    { label: "QC Lead", value: "QC Lead", icon: <User className="h-3.5 w-3.5" /> },
    { label: "Auditor Ext", value: "Auditor Ext", icon: <User className="h-3.5 w-3.5" /> },
    { label: "Supply Chain", value: "Supply Chain", icon: <Users className="h-3.5 w-3.5" /> },
    { label: "Microbio QA", value: "Microbio QA", icon: <User className="h-3.5 w-3.5" /> },
    { label: "EM Lead", value: "EM Lead", icon: <User className="h-3.5 w-3.5" /> },
  ];
  return (
    <FilterCard>
      <FilterCard.Row>
        {/* Row 1: Search, Module, Priority */}
        <FilterCard.Item span={6} mdSpan={2}>
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-9 sm:pl-10 pr-3 h-9 sm:h-9 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm transition-colors placeholder:text-slate-400"
            />
          </div>
        </FilterCard.Item>
        <FilterCard.Item span={3}>
          <Select
            label="Module"
            value={module}
            onChange={setModule}
            options={moduleOptions}
            searchPlaceholder="Filter module..."
            enableSearch
          />
        </FilterCard.Item>
        <FilterCard.Item span={3}>
          <Select
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
            searchPlaceholder="Filter priority..."
            enableSearch
          />
        </FilterCard.Item>

        {/* Row 2: Status, Assignee, Date Range */}
        <FilterCard.Item span={3}>
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            searchPlaceholder="Filter status..."
            enableSearch
          />
        </FilterCard.Item>
        <FilterCard.Item span={3}>
          <Select
            label="Assignee"
            value={assignee}
            onChange={setAssignee}
            options={assigneeOptions}
            searchPlaceholder="Find user..."
            enableSearch
          />
        </FilterCard.Item>
        <FilterCard.Item span={3}>
          <Select
            label="Reporter"
            value={reporter}
            onChange={setReporter}
            options={reporterOptions}
            searchPlaceholder="Find reporter..."
            enableSearch
          />
        </FilterCard.Item>
        <FilterCard.Item span={3}>
          <DateRangePicker
            label="Due Date Range"
            startDate={fromDate}
            endDate={toDate}
            onStartDateChange={setFromDate}
            onEndDateChange={setToDate}
            placeholder="Select date range..."
          />
        </FilterCard.Item>
      </FilterCard.Row>
    </FilterCard>
  );
};

// --- Main Container ---

export const MyTasksView: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Drawer State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [reporterFilter, setReporterFilter] = useState("All Reporters");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Clear all filters handler
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setModuleFilter("All Modules");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Statuses");
    setFromDateFilter("");
    setToDateFilter("");
    setAssigneeFilter("All Assignees");
    setReporterFilter("All Reporters");
  }, []);

  // Simulate loading on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // 500ms fake load
    setCurrentPage(1); // Reset page on filter change
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    moduleFilter,
    priorityFilter,
    statusFilter,
    fromDateFilter,
    toDateFilter,
    assigneeFilter,
    reporterFilter,
  ]);

  // Derived Data Logic
  const filteredData = useMemo(() => {
    let data = MOCK_TASKS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.taskId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    if (moduleFilter !== "All Modules")
      data = data.filter((t) => t.module === moduleFilter);
    if (priorityFilter !== "All Priorities")
      data = data.filter((t) => t.priority === priorityFilter);
    if (statusFilter !== "All Statuses")
      data = data.filter((t) => t.status === statusFilter);
    if (assigneeFilter !== "All Assignees")
      data = data.filter((t) => t.assignee === assigneeFilter);
    if (reporterFilter !== "All Reporters")
      data = data.filter((t) => t.reporter === reporterFilter);

    // Date range filter logic
    if (fromDateFilter) {
      data = data.filter((t) => t.dueDate >= fromDateFilter);
    }
    if (toDateFilter) {
      data = data.filter((t) => t.dueDate <= toDateFilter);
    }

    return data;
  }, [
    searchQuery,
    moduleFilter,
    priorityFilter,
    statusFilter,
    fromDateFilter,
    toDateFilter,
    assigneeFilter,
    reporterFilter,
  ]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 w-full flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>
          <Breadcrumb items={myTasks(navigate)} />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center",
              viewMode === "list"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center",
              viewMode === "calendar"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode("gantt")}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center",
              viewMode === "gantt"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Gantt</span>
          </button>
        </div>
      </div>
      {/* 2. Filter Card */}
      <div className="shrink-0">
        <TaskFilters
          search={searchQuery}
          setSearch={setSearchQuery}
          module={moduleFilter}
          setModule={setModuleFilter}
          priority={priorityFilter}
          setPriority={setPriorityFilter}
          status={statusFilter}
          setStatus={setStatusFilter}
          fromDate={fromDateFilter}
          setFromDate={setFromDateFilter}
          toDate={toDateFilter}
          setToDate={setToDateFilter}
          assignee={assigneeFilter}
          setAssignee={setAssigneeFilter}
          reporter={reporterFilter}
          setReporter={setReporterFilter}
        />
      </div>
      {/* 3. Data Display (Loading / View-based Rendering) */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <SectionLoading text="Loading tasks..." minHeight="400px" />
        ) : (
          <>
            {/* List View (Table + Mobile Cards) */}
            {viewMode === "list" && (
              <>
                {paginatedData.length > 0 ? (
                  <>
                    {/* Table View with responsive design */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                      <TaskTable
                        tasks={paginatedData}
                        onTaskClick={setSelectedTask}
                        startIndex={(currentPage - 1) * itemsPerPage + 1}
                      />
                      <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <TableEmptyState
                      title="No Tasks Found"
                      description="We couldn't find any tasks matching your filters. Try adjusting your search criteria or clear filters."
                      actionLabel="Clear Filters"
                      onAction={handleClearFilters}
                    />
                  </div>
                )}
              </>
            )}
            {/* Calendar View */}
            {viewMode === "calendar" && (
              <>
                {filteredData.length > 0 ? (
                  <TaskCalendarView
                    tasks={filteredData}
                    onTaskClick={setSelectedTask}
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <TableEmptyState
                      title="No Tasks Found"
                      description="We couldn't find any tasks matching your filters."
                      actionLabel="Clear Filters"
                      onAction={handleClearFilters}
                    />
                  </div>
                )}
              </>
            )}

            {/* Gantt View */}
            {viewMode === "gantt" && (
              <>
                {filteredData.length > 0 ? (
                  <TaskGanttView
                    tasks={filteredData}
                    onTaskClick={setSelectedTask}
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <TableEmptyState
                      title="No Tasks Found"
                      description="We couldn't find any tasks matching your filters."
                      actionLabel="Clear Filters"
                      onAction={handleClearFilters}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {/* 4. Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
