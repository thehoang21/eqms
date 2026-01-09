import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Users,
  CalendarDays,
  ChevronDown,
  User,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Paperclip,
  History,
  MoreVertical,
  LayoutGrid,
  List,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { Task, ModuleType, ViewMode } from "./types";
import { TaskTable } from "./components/TaskTable";
import { TaskBoardView } from "./components/TaskBoardView";
import { TaskCalendarView } from "./components/TaskCalendarView";
import { TaskGanttView } from "./components/TaskGanttView";
import { TaskDetailDrawer } from "./components/TaskDetailDrawer";
import { ColumnCustomizer } from "./components/ColumnCustomizer";
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';
import { TableColumn } from "./types";

// --- Mock Data ---
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    taskId: "SOP-REV-001",
    title: "Review SOP: Batch Release Proc 2.0",
    description:
      "Review the updated sampling plan appendices. Ensure alignment with Annex 16.",
    module: "Document",
    priority: "High",
    dueDate: "2026-01-25",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "System",
    progress: 0,
    timeline: [{ date: "2026-01-01", action: "Task Created", user: "System" }],
  },
  {
    id: "2",
    taskId: "SOP-APR-002",
    title: "Approve Revision: Quality Control Testing SOP v3.0",
    description:
      "Please review and approve the updated quality control testing procedures to comply with new regulatory requirements.",
    module: "Document",
    priority: "Critical",
    dueDate: "2026-01-15",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "John Smith",
    progress: 0,
    timeline: [
      { date: "2026-01-05", action: "Revision Submitted", user: "John Smith" },
      { date: "2026-01-06", action: "Review Completed", user: "QA Team" },
    ],
  },
  {
    id: "3",
    taskId: "DEV-2025-001",
    title: "Investigate Temp Excursion: Warehouse",
    description:
      "Root cause analysis for Zone B sensor failure. Interview logistics staff.",
    module: "Deviation",
    priority: "Critical",
    dueDate: "2026-01-08",
    status: "In-Progress",
    assignee: "Dr. A. Smith",
    reporter: "W. House",
    progress: 45,
    timeline: [
      { date: "2025-12-20", action: "Deviation Logged", user: "W. House" },
      {
        date: "2025-12-21",
        action: "Investigation Started",
        user: "Dr. A. Smith",
      },
    ],
  },
  {
    id: "4",
    taskId: "TRN-2025-055",
    title: "Complete: GMP Annual Refresher Quiz",
    description: "Annual mandatory training requirement.",
    module: "Training",
    priority: "Medium",
    dueDate: "2026-01-15",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "HR Training",
    progress: 0,
    timeline: [{ date: "2025-12-01", action: "Assigned", user: "HR Training" }],
  },
  {
    id: "5",
    taskId: "CAPA-2025-012",
    title: "Verify Effectiveness: Labeling Fix",
    description:
      "Check new label stock for adhesion properties after fix implementation.",
    module: "CAPA",
    priority: "Medium",
    dueDate: "2026-01-20",
    status: "Reviewing",
    assignee: "J. Doe",
    reporter: "QA Lead",
    progress: 90,
    timeline: [
      { date: "2025-12-01", action: "CAPA Opened", user: "QA Lead" },
      { date: "2025-12-15", action: "Actions Implemented", user: "Ops Team" },
      { date: "2026-01-02", action: "Verification Started", user: "J. Doe" },
    ],
  },
  {
    id: "5",
    taskId: "DOC-APR-102",
    title: "Approve: Cleaning Validation Report",
    description: "Final approval required for Line 4.",
    module: "Document",
    priority: "High",
    dueDate: "2026-01-10",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "V. Validation",
    progress: 10,
    timeline: [],
  },
  {
    id: "6",
    taskId: "CC-2025-004",
    title: "Impact Assessment: New HVAC Filter",
    description: "Assess impact on air change rates.",
    module: "Document",
    priority: "Low",
    dueDate: "2026-02-15",
    status: "In-Progress",
    assignee: "Engineering",
    reporter: "Fac. Manager",
    progress: 30,
    timeline: [],
  },
  {
    id: "7",
    taskId: "DEV-2025-003",
    title: "Root Cause Analysis: pH Meter Drift",
    description: "Investigate potential electrode aging.",
    module: "Deviation",
    priority: "Medium",
    dueDate: "2026-01-30",
    status: "Pending",
    assignee: "QC Lab",
    reporter: "QC Lead",
    progress: 0,
    timeline: [],
  },
  {
    id: "8",
    taskId: "TRN-2025-060",
    title: "Read & Understand: Data Integrity Policy",
    description: "New global policy rollout.",
    module: "Training",
    priority: "Low",
    dueDate: "2026-02-05",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "HR Training",
    progress: 0,
    timeline: [],
  },
  {
    id: "9",
    taskId: "CAPA-2025-009",
    title: "Update Risk Assessment for Line 3",
    description: "Post-audit requirement.",
    module: "CAPA",
    priority: "Critical",
    dueDate: "2025-12-28",
    status: "Completed",
    assignee: "QA Risk",
    reporter: "Auditor Ext",
    progress: 100,
    timeline: [],
  },
  {
    id: "10",
    taskId: "SOP-REV-015",
    title: "Review SOP: Pest Control Program",
    description: "Regular biennial review.",
    module: "Document",
    priority: "Low",
    dueDate: "2026-03-01",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "System",
    progress: 0,
    timeline: [],
  },
  {
    id: "11",
    taskId: "DEV-2025-005",
    title: "Material Discrepancy Lot #992",
    description: "Quantity mismatch in raw material receipt.",
    module: "Deviation",
    priority: "High",
    dueDate: "2026-01-22",
    status: "Pending",
    assignee: "Warehousing",
    reporter: "Supply Chain",
    progress: 5,
    timeline: [],
  },
  {
    id: "12",
    taskId: "TRN-2025-061",
    title: "Sterile Gowning Qualification",
    description: "Physical demonstration required.",
    module: "Training",
    priority: "High",
    dueDate: "2026-02-10",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "Microbio QA",
    progress: 0,
    timeline: [],
  },
  {
    id: "13",
    taskId: "DOC-REV-103",
    title: "Review: Environmental Monitoring Plan",
    description: "Update sampling points map.",
    module: "Document",
    priority: "High",
    dueDate: "2026-01-12",
    status: "Pending",
    assignee: "Dr. A. Smith",
    reporter: "EM Lead",
    progress: 0,
    timeline: [],
  },
];

// --- Components ---

// 1. Searchable Combobox (High Fidelity)
interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}
interface SearchableComboboxProps {
  label?: string;
  value: string | number;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
}
const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedOption = options.find((opt) => opt.value === value);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (isOpen && searchInputRef.current)
      setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [isOpen]);
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200",
          "placeholder:text-slate-400 focus:outline-none",
          "h-11",
          isOpen
            ? "ring-2 ring-emerald-500 border-emerald-500"
            : "hover:border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate text-slate-900">
          {selectedOption?.icon}
          <span className={cn("truncate", !selectedOption && "text-slate-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden min-w-[200px] right-0 md:left-0">
          <div className="flex items-center border-b border-slate-100 px-3 pb-2 pt-3 bg-white">
            <Search className="mr-2 h-4 w-4 text-slate-400 shrink-0 opacity-50" />
            <input
              ref={searchInputRef}
              className="flex h-6 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-3 px-4 text-sm outline-none transition-colors",
                    value === option.value
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 truncate">
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-emerald-600 ml-2 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>
          Showing <span className="font-medium text-slate-900">{startItem}</span> to{" "}
          <span className="font-medium text-slate-900">{endItem}</span> of{" "}
          <span className="font-medium text-slate-900">{totalItems}</span> results
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// 3. Task Filters
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
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
        {/* Row 1: Search, Module, Priority */}
        <div className="xl:col-span-6 w-full">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 h-11 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="xl:col-span-3 w-full">
          <SearchableCombobox
            label="Module"
            value={module}
            onChange={setModule}
            options={moduleOptions}
            searchPlaceholder="Filter module..."
          />
        </div>
        <div className="xl:col-span-3 w-full">
          <SearchableCombobox
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
            searchPlaceholder="Filter priority..."
          />
        </div>

        {/* Row 2: Status, Assignee, Date Range */}
        <div className="xl:col-span-3 w-full">
          <SearchableCombobox
            label="Status"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            searchPlaceholder="Filter status..."
          />
        </div>
        <div className="xl:col-span-3 w-full">
          <SearchableCombobox
            label="Assignee"
            value={assignee}
            onChange={setAssignee}
            options={assigneeOptions}
            searchPlaceholder="Find user..."
          />
        </div>
        <div className="xl:col-span-3 w-full">
          <DateTimePicker
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
            placeholder="Select start date..."
          />
        </div>
        <div className="xl:col-span-3 w-full">
          <DateTimePicker
            label="To Date"
            value={toDate}
            onChange={setToDate}
            placeholder="Select end date..."
          />
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 bg-white text-center">
    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <Search className="h-8 w-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-1">No Tasks Found</h3>
    <p className="text-slate-500 max-w-sm mx-auto mb-6">
      We couldn't find any tasks matching your filters. Try adjusting your
      search criteria or clear filters.
    </p>
    <Button variant="outline" onClick={() => window.location.reload()}>
      Clear Filters
    </Button>
  </div>
);

const SkeletonLoader = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="h-12 bg-slate-100 border-b border-slate-200" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 border-b border-slate-100 px-6 py-4 flex items-center gap-4"
          >
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-48 bg-slate-200 rounded flex-1" />
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Container ---

export const MyTasksView: React.FC = () => {
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Column Customization State
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([
    { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
    { id: 'taskId', label: 'Task ID', visible: true, order: 1 },
    { id: 'taskName', label: 'Task Name', visible: true, order: 2 },
    { id: 'module', label: 'Module', visible: true, order: 3 },
    { id: 'assignee', label: 'Assignee', visible: true, order: 4 },
    { id: 'reporter', label: 'Reporter', visible: true, order: 5 },
    { id: 'daysLeft', label: 'Days Left', visible: true, order: 6 },
    { id: 'status', label: 'Status', visible: true, order: 7 },
    { id: 'progress', label: 'Progress', visible: true, order: 8 },
    { id: 'dueDate', label: 'Due Date', visible: true, order: 9 },
    { id: 'priority', label: 'Priority', visible: true, order: 10 },
    { id: 'action', label: 'Action', visible: true, order: 11, locked: true },
  ]);

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
  ]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "board"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "calendar"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            onClick={() => setViewMode("gantt")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "gantt"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Gantt</span>
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
        />
      </div>
      {/* 3. Data Display (Loading / View-based Rendering) */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* List View (Table) */}
            {viewMode === "list" && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                {paginatedData.length > 0 ? (
                  <>
                    <TaskTable
                      tasks={paginatedData}
                      onTaskClick={setSelectedTask}
                      startIndex={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      columns={tableColumns}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}

            {/* Board View */}
            {viewMode === "board" && (
              <>
                {filteredData.length > 0 ? (
                  <TaskBoardView
                    tasks={filteredData}
                    onTaskClick={setSelectedTask}
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <EmptyState />
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
                    <EmptyState />
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
                    <EmptyState />
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
