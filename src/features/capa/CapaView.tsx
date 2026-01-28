import React, { useState, useMemo } from "react";
import {
  Search,
  Shield,
  Calendar,
  TrendingUp,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  AlertTriangle,
  FileText,
  Download,
} from "lucide-react";
import { IconSmartHome, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { cn } from "@/components/ui/utils";
import { CAPA, CAPAFilters, CAPAType, CAPASource, CAPAStatus } from "./types";
import { MobileCard, MobileCardList } from "@/components/ui/table/MobileCardView";

// Mock Data
const MOCK_CAPAS: CAPA[] = [
  {
    id: "1",
    capaId: "CAPA-2026-001",
    title: "Improve Temperature Monitoring System",
    description: "Implement automated temperature monitoring for all cold storage areas",
    type: "Preventive",
    source: "Deviation",
    status: "Implementation",
    initiatedBy: "Dr. Sarah Johnson",
    initiatedDate: "2026-01-25",
    department: "Quality Assurance",
    relatedDeviationId: "DEV-2026-001",
    problemStatement: "Temperature excursions due to manual monitoring delays",
    rootCause: "Lack of real-time temperature monitoring and alerts",
    correctiveAction: "Install automated temperature monitoring devices in all cold storage areas",
    preventiveAction: "Implement 24/7 monitoring dashboard with SMS/email alerts for temperature deviations",
    targetCompletionDate: "2026-03-15",
    assignedTo: "Facilities Team",
    reviewer: "QA Manager",
    createdAt: "2026-01-25T10:00:00",
    updatedAt: "2026-01-25T14:30:00",
  },
  {
    id: "2",
    capaId: "CAPA-2026-002",
    title: "Granulation Process Optimization",
    description: "Revise granulation process to prevent moisture content issues",
    type: "Corrective",
    source: "Deviation",
    status: "Verification",
    initiatedBy: "Dr. Emma Wilson",
    initiatedDate: "2026-01-24",
    department: "Production",
    relatedDeviationId: "DEV-2026-002",
    problemStatement: "Out of specification dissolution test due to granulation moisture",
    rootCause: "Inadequate drying time and temperature control during granulation",
    correctiveAction: "Update granulation SOP with specific moisture testing requirements and drying parameters",
    preventiveAction: "Install inline moisture analyzer for real-time monitoring",
    targetCompletionDate: "2026-02-28",
    actualCompletionDate: "2026-01-22",
    assignedTo: "Production Manager",
    reviewer: "QA Director",
    approver: "Technical Director",
    effectivenessCheckDate: "2026-03-15",
    createdAt: "2026-01-24T09:15:00",
    updatedAt: "2026-01-25T11:20:00",
  },
  {
    id: "3",
    capaId: "CAPA-2026-003",
    title: "Tablet Press Preventive Maintenance Enhancement",
    description: "Enhance preventive maintenance program for tablet presses",
    type: "Both",
    source: "Deviation",
    status: "Closed",
    initiatedBy: "Maintenance Supervisor",
    initiatedDate: "2026-01-16",
    department: "Maintenance",
    relatedDeviationId: "DEV-2026-003",
    problemStatement: "Tablet press failure due to worn compression rollers",
    rootCause: "Insufficient preventive maintenance frequency and wear monitoring",
    correctiveAction: "Replaced worn compression rollers on all tablet presses",
    preventiveAction: "Implemented weekly visual inspection checklist and monthly compression force verification",
    targetCompletionDate: "2026-01-30",
    actualCompletionDate: "2026-01-23",
    assignedTo: "Maintenance Team",
    reviewer: "Production Manager",
    approver: "QA Director",
    effectivenessCheckDate: "2026-02-23",
    effectivenessResult: "Effective",
    createdAt: "2026-01-16T13:00:00",
    updatedAt: "2026-01-24T16:45:00",
  },
  {
    id: "4",
    capaId: "CAPA-2026-004",
    title: "Supplier COA Verification Process",
    description: "Implement automated COA tracking and verification system",
    type: "Preventive",
    source: "Internal Review",
    status: "Action Plan Pending",
    initiatedBy: "Procurement Manager",
    initiatedDate: "2026-01-25",
    department: "Supply Chain",
    problemStatement: "Delayed COA receipt causing material quarantine and production delays",
    rootCause: "Manual COA tracking without automated reminders",
    targetCompletionDate: "2026-03-01",
    assignedTo: "IT & Procurement Teams",
    createdAt: "2026-01-25T15:30:00",
    updatedAt: "2026-01-25T15:30:00",
  },
  {
    id: "5",
    capaId: "CAPA-2025-089",
    title: "GMP Documentation Training Program",
    description: "Develop comprehensive GMP documentation training module",
    type: "Preventive",
    source: "Self-Identified",
    status: "Closed",
    initiatedBy: "Training Manager",
    initiatedDate: "2025-12-01",
    department: "Quality Assurance",
    problemStatement: "Recurring documentation errors and incomplete batch records",
    rootCause: "Insufficient training on GMP documentation requirements",
    correctiveAction: "Provided immediate training to all production operators",
    preventiveAction: "Developed comprehensive GMP documentation training module with quarterly refreshers and competency assessments",
    targetCompletionDate: "2026-01-15",
    actualCompletionDate: "2026-01-10",
    assignedTo: "Training Department",
    reviewer: "QA Manager",
    approver: "QA Director",
    effectivenessCheckDate: "2026-02-10",
    effectivenessResult: "Effective",
    createdAt: "2025-12-01T10:00:00",
    updatedAt: "2026-01-10T14:00:00",
  },
];

export const CAPAView: React.FC = () => {
  const [filters, setFilters] = useState<CAPAFilters>({
    searchQuery: "",
    typeFilter: "All",
    sourceFilter: "All",
    statusFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Corrective", value: "Corrective" },
    { label: "Preventive", value: "Preventive" },
    { label: "Both", value: "Both" },
  ];

  const sourceOptions = [
    { label: "All Sources", value: "All" },
    { label: "Deviation", value: "Deviation" },
    { label: "Audit Finding", value: "Audit Finding" },
    { label: "Customer Complaint", value: "Customer Complaint" },
    { label: "Internal Review", value: "Internal Review" },
    { label: "Risk Assessment", value: "Risk Assessment" },
    { label: "Regulatory Inspection", value: "Regulatory Inspection" },
    { label: "Self-Identified", value: "Self-Identified" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Open", value: "Open" },
    { label: "Under Investigation", value: "Under Investigation" },
    { label: "Action Plan Pending", value: "Action Plan Pending" },
    { label: "Implementation", value: "Implementation" },
    { label: "Verification", value: "Verification" },
    { label: "Effectiveness Check", value: "Effectiveness Check" },
    { label: "Closed", value: "Closed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_CAPAS.filter((capa) => {
      const matchesSearch =
        capa.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        capa.capaId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        capa.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesType = filters.typeFilter === "All" || capa.type === filters.typeFilter;
      const matchesSource = filters.sourceFilter === "All" || capa.source === filters.sourceFilter;
      const matchesStatus = filters.statusFilter === "All" || capa.status === filters.statusFilter;

      const matchesDateFrom = !filters.dateFrom || capa.initiatedDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || capa.initiatedDate <= filters.dateTo;

      return matchesSearch && matchesType && matchesSource && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [MOCK_CAPAS, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: CAPAStatus): "draft" | "pendingReview" | "pendingApproval" | "approved" | "effective" | "archived" => {
    switch (status) {
      case "Open":
      case "Under Investigation":
        return "draft";
      case "Action Plan Pending":
        return "pendingReview";
      case "Implementation":
      case "Verification":
        return "approved";
      case "Effectiveness Check":
        return "pendingApproval";
      case "Closed":
        return "effective";
      default:
        return "archived";
    }
  };

  const getTypeIcon = (type: CAPAType) => {
    switch (type) {
      case "Corrective":
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case "Preventive":
        return <Shield className="h-3.5 w-3.5" />;
      default:
        return <CheckCircle className="h-3.5 w-3.5" />;
    }
  };

  const getTypeColor = (type: CAPAType) => {
    switch (type) {
      case "Corrective":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Preventive":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Both":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            CAPA Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">CAPA Management</span>
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
            onClick={() => console.log("New CAPA")}
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <IconPlus className="h-4 w-4" />
            New CAPA
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        {/* Row 1: Search + Type + Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-9 gap-4 items-end">
          <div className="xl:col-span-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="xl:col-span-2">
            <Select
              label="Type"
              value={filters.typeFilter}
              onChange={(value) => setFilters({ ...filters, typeFilter: value as CAPAType | "All" })}
              options={typeOptions}
            />
          </div>

          <div className="xl:col-span-3">
            <Select
              label="Source"
              value={filters.sourceFilter}
              onChange={(value) => setFilters({ ...filters, sourceFilter: value as CAPASource | "All" })}
              options={sourceOptions}
            />
          </div>
        </div>

        {/* Row 2: Status + Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end mt-4">
          <div className="xl:col-span-2">
            <Select
              label="Status"
              value={filters.statusFilter}
              onChange={(value) => setFilters({ ...filters, statusFilter: value as CAPAStatus | "All" })}
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
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total CAPAs</p>
              <p className="text-2xl font-bold text-slate-900">{MOCK_CAPAS.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_CAPAS.filter((c) => !["Closed", "Cancelled"].includes(c.status)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Due This Month</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_CAPAS.filter((c) => {
                  const targetDate = new Date(c.targetCompletionDate);
                  const now = new Date();
                  return (
                    targetDate.getMonth() === now.getMonth() &&
                    targetDate.getFullYear() === now.getFullYear()
                  );
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Closed</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_CAPAS.filter((c) => c.status === "Closed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <MobileCardList>
        {paginatedData.map((capa, index) => (
          <MobileCard
            key={capa.id}
            index={(currentPage - 1) * itemsPerPage + index + 1}
            fields={[
              {
                label: "CAPA ID",
                value: <span className="font-mono">{capa.capaId}</span>,
              },
              {
                label: "Title",
                value: capa.title,
                fullWidth: true,
              },
              {
                label: "Type",
                value: (
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border", getTypeColor(capa.type))}>
                    {getTypeIcon(capa.type)}
                    {capa.type}
                  </span>
                ),
                badge: true,
              },
              {
                label: "Source",
                value: <span className="text-xs">{capa.source}</span>,
              },
              {
                label: "Status",
                value: <StatusBadge status={getStatusColor(capa.status)} />,
                badge: true,
              },
              {
                label: "Assigned",
                value: capa.assignedTo,
              },
              {
                label: "Target Date",
                value: new Date(capa.targetCompletionDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              },
            ]}
            actions={[
              {
                label: "View",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => console.log("View", capa.id),
                variant: "outline",
              },
              {
                label: "Manage",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => console.log("Manage", capa.id),
              },
            ]}
          />
        ))}
      </MobileCardList>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">No.</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">CAPA ID</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Title</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Type</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Source</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Status</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Assigned To</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Target Date</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((capa, index) => (
                <tr key={capa.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap"><span className="font-mono text-slate-900">{capa.capaId}</span></td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">{capa.title}</td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border", getTypeColor(capa.type))}>
                      {getTypeIcon(capa.type)}
                      {capa.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{capa.source}</td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <StatusBadge status={getStatusColor(capa.status)} />
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">{capa.assignedTo}</td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {new Date(capa.targetCompletionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-center sticky right-0 bg-white z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-50">
                    <button className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors">
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
        />
      </div>
    </div>
  );
};
