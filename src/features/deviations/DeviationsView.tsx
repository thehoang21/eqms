import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Package,
  Clock,
  Download,
} from "lucide-react";
import { IconSmartHome, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import {
  Deviation,
  DeviationFilters,
  DeviationStatus,
  DeviationCategory,
  DeviationSeverity,
} from "./types";

// Mock Data
const MOCK_DEVIATIONS: Deviation[] = [
  {
    id: "1",
    deviationId: "DEV-2026-001",
    title: "Temperature Excursion in Cold Storage",
    description:
      "Temperature exceeded 8°C for 45 minutes in cold storage area B",
    category: "Environmental",
    severity: "Major",
    status: "Under Investigation",
    reportedBy: "John Smith",
    reportedDate: "2026-01-24",
    department: "Warehouse",
    affectedProduct: "Vaccine Lot ABC-123",
    affectedBatch: "BATCH-2026-001",
    immediateAction:
      "Product moved to backup cold storage, temperature monitoring increased",
    investigationDeadline: "2026-01-31",
    assignedTo: "Dr. Sarah Johnson",
    createdAt: "2026-01-24T08:30:00",
    updatedAt: "2026-01-25T10:15:00",
  },
  {
    id: "2",
    deviationId: "DEV-2026-002",
    title: "Out of Specification Test Result",
    description: "Dissolution test failed for tablet batch",
    category: "Product Quality",
    severity: "Critical",
    status: "Pending Review",
    reportedBy: "Mike Chen",
    reportedDate: "2026-01-23",
    department: "QC Lab",
    affectedProduct: "Aspirin 500mg Tablets",
    affectedBatch: "TAB-2026-005",
    immediateAction: "Batch quarantined, retesting initiated",
    rootCause: "Granulation moisture content out of range",
    investigationDeadline: "2026-01-30",
    assignedTo: "Dr. Emma Wilson",
    reviewer: "QA Manager",
    createdAt: "2026-01-23T14:20:00",
    updatedAt: "2026-01-25T09:45:00",
  },
  {
    id: "3",
    deviationId: "DEV-2026-003",
    title: "Equipment Malfunction - Tablet Press",
    description: "Tablet press #3 stopped during production run",
    category: "Equipment",
    severity: "Major",
    status: "Closed",
    reportedBy: "David Brown",
    reportedDate: "2026-01-15",
    department: "Production",
    affectedBatch: "TAB-2026-003",
    immediateAction: "Production switched to tablet press #2",
    rootCause: "Worn compression rollers",
    correctiveAction:
      "Rollers replaced and preventive maintenance schedule updated",
    preventiveAction:
      "Implement weekly inspection checklist for all tablet presses",
    investigationDeadline: "2026-01-20",
    assignedTo: "Maintenance Team",
    reviewer: "Production Manager",
    approver: "QA Director",
    closedDate: "2026-01-22",
    createdAt: "2026-01-15T11:00:00",
    updatedAt: "2026-01-22T16:30:00",
  },
  {
    id: "4",
    deviationId: "DEV-2026-004",
    title: "Raw Material Receipt Discrepancy",
    description: "COA missing for raw material shipment",
    category: "Material",
    severity: "Minor",
    status: "Open",
    reportedBy: "Lisa Anderson",
    reportedDate: "2026-01-25",
    department: "Warehouse",
    immediateAction: "Material quarantined pending COA receipt",
    investigationDeadline: "2026-02-01",
    assignedTo: "Procurement Team",
    createdAt: "2026-01-25T13:15:00",
    updatedAt: "2026-01-25T13:15:00",
  },
  {
    id: "5",
    deviationId: "DEV-2025-098",
    title: "Incomplete Batch Record",
    description: "Missing operator signature on cleaning verification form",
    category: "Documentation",
    severity: "Minor",
    status: "Closed",
    reportedBy: "Tom Wilson",
    reportedDate: "2025-12-20",
    department: "Production",
    affectedBatch: "SYR-2025-099",
    immediateAction: "Operator located and signature obtained",
    rootCause: "Operator forgot to sign after cleaning completion",
    correctiveAction: "Training provided on GMP documentation requirements",
    preventiveAction: "Implement end-of-shift document checklist",
    investigationDeadline: "2025-12-27",
    assignedTo: "Production Supervisor",
    reviewer: "QA Manager",
    approver: "QA Director",
    closedDate: "2025-12-30",
    createdAt: "2025-12-20T15:45:00",
    updatedAt: "2025-12-30T10:00:00",
  },
];

export const DeviationsView: React.FC = () => {
  const [filters, setFilters] = useState<DeviationFilters>({
    searchQuery: "",
    categoryFilter: "All",
    severityFilter: "All",
    statusFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    { label: "Product Quality", value: "Product Quality" },
    { label: "Process", value: "Process" },
    { label: "Equipment", value: "Equipment" },
    { label: "Material", value: "Material" },
    { label: "Documentation", value: "Documentation" },
    { label: "Personnel", value: "Personnel" },
    { label: "Environmental", value: "Environmental" },
  ];

  const severityOptions = [
    { label: "All Severity", value: "All" },
    { label: "Critical", value: "Critical" },
    { label: "Major", value: "Major" },
    { label: "Minor", value: "Minor" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Open", value: "Open" },
    { label: "Under Investigation", value: "Under Investigation" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Closed", value: "Closed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_DEVIATIONS.filter((dev) => {
      const matchesSearch =
        dev.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        dev.deviationId
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        dev.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      const matchesCategory =
        filters.categoryFilter === "All" ||
        dev.category === filters.categoryFilter;
      const matchesSeverity =
        filters.severityFilter === "All" ||
        dev.severity === filters.severityFilter;
      const matchesStatus =
        filters.statusFilter === "All" || dev.status === filters.statusFilter;

      const matchesDateFrom =
        !filters.dateFrom || dev.reportedDate >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || dev.reportedDate <= filters.dateTo;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeverity &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [MOCK_DEVIATIONS, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (
    status: DeviationStatus,
  ):
    | "draft"
    | "pendingReview"
    | "pendingApproval"
    | "approved"
    | "effective"
    | "archived" => {
    switch (status) {
      case "Open":
        return "draft";
      case "Under Investigation":
        return "pendingReview";
      case "Pending Review":
        return "pendingReview";
      case "Pending Approval":
        return "pendingApproval";
      case "Closed":
        return "effective";
      default:
        return "archived";
    }
  };

  const getSeverityColor = (severity: DeviationSeverity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "Major":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Minor":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Deviations & Non-Conformances
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Deviations & NCs</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export triggered")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => console.log("New Deviation")}
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <IconPlus className="h-4 w-4" />
            New Deviation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        {/* Row 1: Search + Category + Severity */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-9 gap-4 items-end">
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="xl:col-span-3">
            <Select
              label="Category"
              value={filters.categoryFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  categoryFilter: value as DeviationCategory | "All",
                })
              }
              options={categoryOptions}
            />
          </div>

          <div className="xl:col-span-3">
            <Select
              label="Severity"
              value={filters.severityFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  severityFilter: value as DeviationSeverity | "All",
                })
              }
              options={severityOptions}
            />
          </div>
        </div>

        {/* Row 2: Status + Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end mt-4">
          <div className="xl:col-span-2">
            <Select
              label="Status"
              value={filters.statusFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  statusFilter: value as DeviationStatus | "All",
                })
              }
              options={statusOptions}
            />
          </div>

          <div className="xl:col-span-2">
            <DateTimePicker
              label="From Date"
              value={filters.dateFrom}
              onChange={(value) => setFilters({ ...filters, dateFrom: value })}
            />
          </div>

          <div className="xl:col-span-2">
            <DateTimePicker
              label="To Date"
              value={filters.dateTo}
              onChange={(value) => setFilters({ ...filters, dateTo: value })}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_DEVIATIONS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Open</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  MOCK_DEVIATIONS.filter(
                    (d) =>
                      d.status === "Open" || d.status === "Under Investigation",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Critical</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  MOCK_DEVIATIONS.filter((d) => d.severity === "Critical")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Closed</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_DEVIATIONS.filter((d) => d.status === "Closed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        {paginatedData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Severity
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Assigned To
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Deadline
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((dev, index) => (
                <tr
                  key={dev.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-mono text-slate-900">
                      {dev.deviationId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">
                    {dev.title}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {dev.category}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border",
                        getSeverityColor(dev.severity),
                      )}
                    >
                      {dev.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <StatusBadge status={getStatusColor(dev.status)} />
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {dev.assignedTo}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {new Date(dev.investigationDeadline).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-center sticky right-0 bg-white z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-50">
                    <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
          </>
        ) : (
          <TableEmptyState
            title="No Deviations Found"
            description="We couldn't find any deviation records matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
};
