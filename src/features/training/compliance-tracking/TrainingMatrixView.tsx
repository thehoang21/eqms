import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  XCircle,
  Download,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  Clock,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Circle,
  X,
  User,
  FileText,
  BookOpen,
  Send,
  type LucideIcon,
  MinusCircle,
} from "lucide-react";
import { IconAlertTriangle, IconCheck, IconHourglassEmpty, IconLayoutDashboard, IconMinus, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";

import type { MatrixFilters, CellStatus, TrainingCell, SOPColumn, EmployeeRow } from "./types";
import {
  MOCK_EMPLOYEES,
  MOCK_SOPS,
  MOCK_CELLS,
  getCell,
  computeKPIs,
  DEPARTMENT_OPTIONS,
  JOB_TITLE_OPTIONS,
  STATUS_OPTIONS,
} from "./mockData";

// ─── Cell styling ────────────────────────────────────────────────────
const CELL_CONFIG: Record<CellStatus, { bg: string; hoverBg: string; Icon: LucideIcon; iconColor: string; label: string; border: string }> = {
  Qualified:    { bg: "bg-emerald-100", hoverBg: "hover:bg-emerald-200", Icon: IconCheck,  iconColor: "text-emerald-600", label: "Qualified",      border: "border-emerald-300" },
  Pending:      { bg: "bg-amber-100",   hoverBg: "hover:bg-amber-200",   Icon: IconHourglassEmpty,         iconColor: "text-amber-600",   label: "Pending",        border: "border-amber-300" },
  Overdue:      { bg: "bg-red-100",     hoverBg: "hover:bg-red-200",     Icon: IconX,       iconColor: "text-red-600",     label: "Overdue",        border: "border-red-300" },
  ExpiringSoon: { bg: "bg-orange-100",  hoverBg: "hover:bg-orange-200",  Icon: IconAlertTriangle, iconColor: "text-orange-600",  label: "Expiring Soon",  border: "border-orange-300" },
  NotRequired:  { bg: "bg-slate-50",    hoverBg: "hover:bg-slate-100",   Icon: IconMinus,   iconColor: "text-slate-400",   label: "Not Required",   border: "border-slate-200" },
};

const formatDate = (d: string | null): string => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ─── Cell Popover ────────────────────────────────────────────────────
interface CellPopoverProps {
  cell: TrainingCell;
  employee: EmployeeRow;
  sop: SOPColumn;
  anchorRect: DOMRect;
  onClose: () => void;
}

const CellPopover: React.FC<CellPopoverProps> = ({ cell, employee, sop, anchorRect, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const cfg = CELL_CONFIG[cell.status];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Position: try below, fallback above
  const isMobile = window.innerWidth < 640;
  const popoverWidth = isMobile ? 280 : 340;
  const top = anchorRect.bottom + 8;
  const left = Math.max(8, Math.min(anchorRect.left + anchorRect.width / 2 - popoverWidth / 2, window.innerWidth - popoverWidth - 16));
  const showAbove = top + 340 > window.innerHeight;
  const finalTop = showAbove ? anchorRect.top - 8 : top;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60]" aria-hidden="true" />
      <div
        ref={popoverRef}
        className={cn(
          "fixed z-[70] w-[280px] sm:w-[340px] bg-white border border-slate-200 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-150",
          showAbove && "origin-bottom"
        )}
        style={{
          top: showAbove ? undefined : finalTop,
          bottom: showAbove ? window.innerHeight - finalTop : undefined,
          left,
        }}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between px-4 py-3 rounded-t-xl border-b", cfg.bg)}>
          <div className="flex items-center gap-2.5">
            <cfg.Icon className={cn("h-5 w-5", cfg.iconColor)} />
            <span className="text-sm font-bold text-slate-800">{cfg.label}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors" aria-label="Close">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Employee info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium leading-none mb-1">Employee</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{employee.name}</p>
            </div>
          </div>

          {/* SOP info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium leading-none mb-1">SOP / Document</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{sop.code} — {sop.title}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Training details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Last Trained</p>
              <p className="text-sm font-semibold text-slate-700">{formatDate(cell.lastTrainedDate)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Expiry Date</p>
              <p className={cn(
                "text-sm font-semibold",
                cell.status === "Overdue" ? "text-red-600" : cell.status === "ExpiringSoon" ? "text-orange-600" : "text-slate-700"
              )}>{formatDate(cell.expiryDate)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Score</p>
              <p className="text-sm font-semibold text-slate-700">{cell.score != null ? `${cell.score}%` : "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">Attempts</p>
              <p className="text-sm font-semibold text-slate-700">{cell.attempts || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// ─── Column Header Context Menu ──────────────────────────────────────
interface HeaderMenuProps {
  anchorRect: DOMRect;
  onClose: () => void;
  type: "employee" | "sop";
  label: string;
}

const HeaderContextMenu: React.FC<HeaderMenuProps> = ({ anchorRect, onClose, type, label }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const top = anchorRect.bottom + 4;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 220));

  const actions =
    type === "employee"
      ? [
          { icon: <User className="h-4 w-4" />, label: "View Profile" },
          { icon: <Send className="h-4 w-4" />, label: "Assign Training" },
          { icon: <Download className="h-4 w-4" />, label: "Export Report" },
        ]
      : [
          { icon: <FileText className="h-4 w-4" />, label: "View Document" },
          { icon: <BookOpen className="h-4 w-4" />, label: "Assign Training" },
          { icon: <Download className="h-4 w-4" />, label: "Export Report" },
        ];

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60]" aria-hidden="true" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed z-[70] min-w-[200px] bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
        style={{ top, left }}
      >
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-900 truncate">{label}</p>
          <p className="text-[10px] text-slate-400 capitalize">{type}</p>
        </div>
        <div className="py-1">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => { console.log(action.label, label); onClose(); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {React.cloneElement(action.icon, { className: "h-4 w-4 text-slate-400" })}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
};

// ─── Main Component ──────────────────────────────────────────────────
export const TrainingMatrixView: React.FC = () => {
  // ── State ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<MatrixFilters>({
    searchQuery: "",
    department: "All",
    jobTitle: "All",
    status: "All",
    gapAnalysis: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Popover state
  const [activePopover, setActivePopover] = useState<{
    cell: TrainingCell;
    employee: EmployeeRow;
    sop: SOPColumn;
    rect: DOMRect;
  } | null>(null);

  // Header context menu
  const [headerMenu, setHeaderMenu] = useState<{
    type: "employee" | "sop";
    label: string;
    rect: DOMRect;
  } | null>(null);

  // ── Filtered employees ─────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q);
      const matchesDept = filters.department === "All" || emp.department === filters.department;
      const matchesJob = filters.jobTitle === "All" || emp.jobTitle === filters.jobTitle;

      // Status filter: only show employees who have at least one cell matching
      if (filters.status !== "All") {
        const hasMatchingCell = MOCK_SOPS.some((sop) => {
          const cell = getCell(emp.id, sop.id);
          return cell && cell.status === filters.status;
        });
        if (!hasMatchingCell) return false;
      }

      return matchesSearch && matchesDept && matchesJob;
    });
  }, [filters]);

  // ── KPIs ───────────────────────────────────────────────────────────
  const kpis = useMemo(
    () => computeKPIs(MOCK_EMPLOYEES, MOCK_SOPS, MOCK_CELLS),
    []
  );

  // ── Cell click handler ─────────────────────────────────────────────
  const handleCellClick = useCallback(
    (e: React.MouseEvent, employee: EmployeeRow, sop: SOPColumn) => {
      e.stopPropagation();
      const cell = getCell(employee.id, sop.id);
      if (!cell || cell.status === "NotRequired") return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setActivePopover({ cell, employee, sop, rect });
      setHeaderMenu(null);
    },
    []
  );

  // ── Header click handler ───────────────────────────────────────────
  const handleHeaderClick = useCallback(
    (e: React.MouseEvent, type: "employee" | "sop", label: string) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setHeaderMenu({ type, label, rect });
      setActivePopover(null);
    },
    []
  );

  // ── Clear filters ──────────────────────────────────────────────────
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.department !== "All" ||
    filters.jobTitle !== "All" ||
    filters.status !== "All";

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
      department: "All",
      jobTitle: "All",
      status: "All",
    }));
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 w-full flex-1 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Matrix
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Compliance Tracking</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Training Matrix</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button onClick={() => console.log("Export")} variant="outline" size="sm" className="whitespace-nowrap gap-2">
            <Download className="h-4 w-4" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        {/* Compliance Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              kpis.complianceRate >= 80 ? "bg-emerald-100" : kpis.complianceRate >= 60 ? "bg-amber-100" : "bg-red-100"
            )}>
              <ShieldCheck className={cn("h-5 w-5", kpis.complianceRate >= 80 ? "text-emerald-600" : kpis.complianceRate >= 60 ? "text-amber-600" : "text-red-600")} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Compliance Rate</p>
              <p className={cn("text-2xl font-bold", kpis.complianceRate >= 80 ? "text-emerald-600" : kpis.complianceRate >= 60 ? "text-amber-600" : "text-red-600")}>
                {kpis.complianceRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Total Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Total Overdue</p>
              <p className="text-2xl font-bold text-red-600">{kpis.totalOverdue}</p>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{kpis.expiringSoon}</p>
            </div>
          </div>
        </div>

        {/* Next Audit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CalendarClock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Next Audit</p>
              <p className="text-2xl font-bold text-blue-600">{kpis.daysUntilNextAudit} <span className="text-sm font-medium text-slate-400">days</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Filter Bar ────────────────────────────────────── */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {/* Row 1: Search + Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          {/* Search */}
          <div className="flex-1 w-full sm:max-w-md">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee, department, job title..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Filter + Gap toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/20 text-[10px] font-bold">
                  {[filters.department !== "All", filters.jobTitle !== "All", filters.status !== "All"].filter(Boolean).length}
                </span>
              )}
            </Button>

            {/* Gap Analysis toggle */}
            <button
              onClick={() => setFilters((prev) => ({ ...prev, gapAnalysis: !prev.gapAnalysis }))}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-3 rounded-lg border text-sm font-medium transition-all",
                filters.gapAnalysis
                  ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {filters.gapAnalysis ? (
                <ToggleRight className="h-4 w-4 text-red-500" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-slate-400" />
              )}
              Gap Analysis
            </button>
          </div>
        </div>

        {/* Row 2: Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <Select
              label="Department"
              value={filters.department}
              onChange={(val) => setFilters((prev) => ({ ...prev, department: val }))}
              options={DEPARTMENT_OPTIONS}
            />
            <Select
              label="Job Title"
              value={filters.jobTitle}
              onChange={(val) => setFilters((prev) => ({ ...prev, jobTitle: val }))}
              options={JOB_TITLE_OPTIONS}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(val) => setFilters((prev) => ({ ...prev, status: val as CellStatus | "All" }))}
              options={STATUS_OPTIONS}
            />
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.department !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                Dept: {filters.department}
                <button onClick={() => setFilters((prev) => ({ ...prev, department: "All" }))} className="hover:text-red-500 transition-colors" aria-label="Remove filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.jobTitle !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                Job: {filters.jobTitle}
                <button onClick={() => setFilters((prev) => ({ ...prev, jobTitle: "All" }))} className="hover:text-red-500 transition-colors" aria-label="Remove filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                Status: {filters.status}
                <button onClick={() => setFilters((prev) => ({ ...prev, status: "All" }))} className="hover:text-red-500 transition-colors" aria-label="Remove filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Matrix Grid ────────────────────────────────────────────── */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-auto max-h-[calc(100vh-420px)] sm:max-h-[calc(100vh-400px)] md:max-h-[calc(100vh-380px)] relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-slate-400 [&::-webkit-scrollbar-corner]:bg-slate-100">
          <table className="border-separate border-spacing-0">
            {/* ── Column Headers (SOPs) ── */}
            <thead>
              <tr>
                {/* No. column header – sticky both axes */}
                <th
                  className="sticky top-0 left-0 z-30 bg-white border-b-2 border-r border-slate-200 px-1.5 sm:px-2 py-2.5 sm:py-4 min-w-[36px] sm:min-w-[52px] max-w-[36px] sm:max-w-[52px] text-center shadow-[0_2px_6px_-2px_rgba(0,0,0,0.1)]"
                >
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    No.
                  </span>
                </th>

                {/* Employee column header – sticky */}
                <th
                  className="sticky top-0 left-[36px] sm:left-[52px] z-30 bg-white border-b-2 border-r border-slate-200 px-2 sm:px-4 py-2.5 sm:py-4 min-w-[140px] sm:min-w-[180px] md:min-w-[240px] max-w-[140px] sm:max-w-[180px] md:max-w-[240px] shadow-[0_2px_6px_-2px_rgba(0,0,0,0.1)]"
                >
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Employee
                  </span>
                </th>

                {/* SOP column headers */}
                {MOCK_SOPS.map((sop) => (
                  <th
                    key={sop.id}
                    className="sticky top-0 z-20 bg-slate-50 border-b-2 border-r border-slate-200 px-1.5 sm:px-2 md:px-3 py-2 sm:py-3 min-w-[64px] sm:min-w-[90px] md:min-w-[130px] max-w-[64px] sm:max-w-[90px] md:max-w-[130px] cursor-pointer hover:bg-slate-100 transition-colors group/sop text-left shadow-[0_2px_6px_-2px_rgba(0,0,0,0.1)]"
                    onClick={(e) => handleHeaderClick(e, "sop", sop.title)}
                    title={`${sop.code}: ${sop.title}`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight whitespace-nowrap">
                          {sop.code}
                        </span>
                        <span className={cn(
                          "hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase leading-none flex-shrink-0",
                          sop.category === "GMP" && "bg-emerald-100 text-emerald-700",
                          sop.category === "Safety" && "bg-amber-100 text-amber-700",
                          sop.category === "Technical" && "bg-blue-100 text-blue-700",
                          sop.category === "Compliance" && "bg-purple-100 text-purple-700",
                        )}>
                          {sop.category.slice(0, 4)}
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-snug line-clamp-1 sm:line-clamp-2 group-hover/sop:text-slate-500 transition-colors">
                        {sop.title}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={MOCK_SOPS.length + 2} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-900">No employees found</p>
                      <p className="text-xs text-slate-500">Try adjusting your filters</p>
                      {hasActiveFilters && (
                        <Button variant="outline" size="xs" onClick={clearFilters}>Clear filters</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id} className="group/row">
                    {/* No. column */}
                    <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-200 px-1.5 sm:px-2 py-1 sm:py-1.5 min-w-[36px] sm:min-w-[52px] max-w-[36px] sm:max-w-[52px] text-center group-hover/row:bg-white">
                      <span className="text-xs font-medium text-slate-400">{index + 1}</span>
                    </td>

                    {/* Employee name – sticky second column */}
                    <td
                      className="sticky left-[36px] sm:left-[52px] z-10 bg-white border-b border-r border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 min-w-[140px] sm:min-w-[180px] md:min-w-[240px] max-w-[140px] sm:max-w-[180px] md:max-w-[240px] cursor-pointer hover:bg-slate-50 transition-colors group-hover/row:bg-white"
                      onClick={(e) => handleHeaderClick(e, "employee", emp.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-700">{emp.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] sm:text-[13px] font-semibold text-slate-900 truncate leading-tight">{emp.name}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden sm:block">{emp.jobTitle}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status cells */}
                    {MOCK_SOPS.map((sop) => {
                      const cell = getCell(emp.id, sop.id);
                      if (!cell) return <td key={sop.id} className="border-b border-r border-slate-200 min-w-[64px] sm:min-w-[90px] md:min-w-[130px]" />;

                      const cfg = CELL_CONFIG[cell.status];
                      const isGapHidden = filters.gapAnalysis && cell.status === "Qualified";

                      return (
                        <td key={sop.id} className="border-b border-r border-slate-200 p-0 min-w-[64px] sm:min-w-[90px] md:min-w-[130px] max-w-[64px] sm:max-w-[90px] md:max-w-[130px] h-px">
                          <button
                            className={cn(
                              "w-full h-full flex items-center justify-center gap-2 text-base transition-all duration-100 touch-manipulation",
                              isGapHidden
                                ? "bg-white text-slate-200 cursor-default"
                                : cn(cfg.bg, cfg.hoverBg, "cursor-pointer active:scale-95"),
                              cell.status !== "NotRequired" && !isGapHidden && "hover:shadow-inner"
                            )}
                            onClick={(e) => !isGapHidden && handleCellClick(e, emp, sop)}
                            title={isGapHidden ? "Qualified (hidden)" : `${cfg.label} – ${sop.title}`}
                            aria-label={`${emp.name} - ${sop.code}: ${cfg.label}`}
                            disabled={cell.status === "NotRequired"}
                          >
                            {isGapHidden ? (
                              <span className="text-slate-200 text-sm">—</span>
                            ) : (
                              <>
                                <cfg.Icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0", cfg.iconColor)} />
                                <span className="hidden md:inline text-[11px] font-semibold text-slate-600 select-none">{cfg.label}</span>
                              </>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Summary bar ── */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-t border-slate-200 bg-slate-50/50">
          <span className="text-[10px] sm:text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredEmployees.length}</span> employees × <span className="font-semibold text-slate-700">{MOCK_SOPS.length}</span> SOPs
          </span>
          {filters.gapAnalysis && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3" />
              Gap Analysis Active
            </span>
          )}
        </div>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────── */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-1 h-4 rounded-full bg-emerald-500" />
          <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Color Legend</span>
        </div>
        <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
          {(Object.entries(CELL_CONFIG) as [CellStatus, typeof CELL_CONFIG[CellStatus]][]).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5 sm:gap-2.5">
              <div className={cn("w-6 h-5 sm:w-8 sm:h-7 rounded sm:rounded-lg flex items-center justify-center border", cfg.bg, cfg.border)}>
                <cfg.Icon className={cn("h-3 w-3 sm:h-4 sm:w-4", cfg.iconColor)} />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 font-medium">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popovers / Context Menus ─────────────────────────────── */}
      {activePopover && (
        <CellPopover
          cell={activePopover.cell}
          employee={activePopover.employee}
          sop={activePopover.sop}
          anchorRect={activePopover.rect}
          onClose={() => setActivePopover(null)}
        />
      )}

      {headerMenu && (
        <HeaderContextMenu
          type={headerMenu.type}
          label={headerMenu.label}
          anchorRect={headerMenu.rect}
          onClose={() => setHeaderMenu(null)}
        />
      )}
    </div>
  );
};
