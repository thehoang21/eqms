import React, { useState, useMemo, useCallback } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/page/PageHeader";
import { trainingMatrix } from "@/components/ui/breadcrumb/breadcrumbs.config";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";

import type { MatrixFilters, CellStatus, TrainingCell, SOPColumn, EmployeeRow } from "./types";
import { MOCK_EMPLOYEES, MOCK_SOPS, MOCK_CELLS, getCell } from "./mockData";
import {
  FilterBar,
  MatrixTable,
  CellDetailDrawer,
  HeaderActionDrawer,
  CELL_CONFIG,
} from "./matrix";

// ─── Main Component ──────────────────────────────────────────────────
export const TrainingMatrixView: React.FC = () => {
  // ── State ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<MatrixFilters>({
    searchQuery: "",
    department: "All",
    jobTitle: "All",
    status: "All",
    gapAnalysis: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  const [activeCellDrawer, setActiveCellDrawer] = useState<{
    cell: TrainingCell;
    employee: EmployeeRow;
    sop: SOPColumn;
  } | null>(null);

  const [headerDrawer, setHeaderDrawer] = useState<{
    type: "employee" | "sop";
    data: EmployeeRow | SOPColumn;
  } | null>(null);

  // ── Derived data ───────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q);
      const matchesDept =
        filters.department === "All" || emp.department === filters.department;
      const matchesJob =
        filters.jobTitle === "All" || emp.jobTitle === filters.jobTitle;

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

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.department !== "All" ||
    filters.jobTitle !== "All" ||
    filters.status !== "All";

  // ── Handlers ───────────────────────────────────────────────────────
  const handleCellClick = useCallback(
    (e: React.MouseEvent, employee: EmployeeRow, sop: SOPColumn) => {
      e.stopPropagation();
      const cell = getCell(employee.id, sop.id);
      if (!cell || cell.status === "NotRequired") return;
      setActiveCellDrawer({ cell, employee, sop });
      setHeaderDrawer(null);
    },
    []
  );

  const handleEmployeeClick = useCallback(
    (e: React.MouseEvent, employee: EmployeeRow) => {
      e.stopPropagation();
      setHeaderDrawer({ type: "employee", data: employee });
      setActiveCellDrawer(null);
    },
    []
  );

  const handleSOPHeaderClick = useCallback(
    (e: React.MouseEvent, sop: SOPColumn) => {
      e.stopPropagation();
      setHeaderDrawer({ type: "sop", data: sop });
      setActiveCellDrawer(null);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
      department: "All",
      jobTitle: "All",
      status: "All",
    }));
  }, []);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 w-full flex-1 flex flex-col">
      {/* Page header */}
      <PageHeader
        title="Training Matrix"
        breadcrumbItems={trainingMatrix()}
        actions={
          <Button
            onClick={() => console.log("Export")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export Matrix
          </Button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v) => !v)}
      />

      {/* Color Legend */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
          Legend
        </span>
        <div className="w-px h-3.5 bg-slate-200 shrink-0" />
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.entries(CELL_CONFIG) as [CellStatus, (typeof CELL_CONFIG)[CellStatus]][]).map(
            ([status, cfg]) => (
              <span
                key={status}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
                  cfg.bg,
                  cfg.border
                )}
              >
                <cfg.Icon className={cn("h-3 w-3 shrink-0", cfg.iconColor)} />
                <span className={cn(cfg.iconColor)}>{cfg.label}</span>
              </span>
            )
          )}
        </div>
      </div>

      {/* Matrix Table */}
      <MatrixTable
        employees={filteredEmployees}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onCellClick={handleCellClick}
        onEmployeeClick={handleEmployeeClick}
        onSOPHeaderClick={handleSOPHeaderClick}
      />

      {/* Cell detail drawer */}
      {activeCellDrawer && (
        <CellDetailDrawer
          cell={activeCellDrawer.cell}
          employee={activeCellDrawer.employee}
          sop={activeCellDrawer.sop}
          onClose={() => setActiveCellDrawer(null)}
        />
      )}

      {/* Header action drawer */}
      {headerDrawer && (
        <HeaderActionDrawer
          type={headerDrawer.type}
          data={headerDrawer.data}
          onClose={() => setHeaderDrawer(null)}
        />
      )}
    </div>
  );
};

