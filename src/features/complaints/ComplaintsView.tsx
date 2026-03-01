import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  MoreVertical,
  Clock,
  Download,
  CheckCircle,
  AlertTriangle,
  MessageSquareWarning,
} from "lucide-react";
import { IconLayoutDashboard, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import {
  Complaint,
  ComplaintFilters,
  ComplaintStatus,
  ComplaintType,
  ComplaintPriority,
  ComplaintSource,
} from "./types";

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    complaintId: "CMP-2026-001",
    title: "Tablet Discoloration Reported by Distributor",
    description: "Distributor reported yellow discoloration on white-coated tablets in batch TAB-2026-008",
    type: "Product Quality",
    priority: "High",
    status: "Under Investigation",
    source: "Distributor",
    reportedBy: "MedDistrib EU GmbH",
    reportedDate: "2026-01-22",
    affectedProduct: "Amoxicillin 500mg Tablets",
    affectedBatch: "TAB-2026-008",
    country: "Germany",
    responseDeadline: "2026-01-29",
    assignedTo: "Dr. Anna Schmidt",
    createdAt: "2026-01-22T09:30:00",
    updatedAt: "2026-01-25T14:00:00",
  },
  {
    id: "2",
    complaintId: "CMP-2026-002",
    title: "Adverse Event - Injection Site Reaction",
    description: "Patient reported severe swelling at injection site after administration",
    type: "Adverse Event",
    priority: "Critical",
    status: "Under Investigation",
    source: "Healthcare Professional",
    reportedBy: "Dr. Jean-Pierre Moreau",
    reportedDate: "2026-01-24",
    affectedProduct: "Ceftriaxone 1g IV Solution",
    affectedBatch: "INJ-2026-003",
    country: "France",
    responseDeadline: "2026-01-25",
    assignedTo: "Pharmacovigilance Team",
    reviewer: "PV Manager",
    createdAt: "2026-01-24T11:00:00",
    updatedAt: "2026-01-25T08:30:00",
  },
  {
    id: "3",
    complaintId: "CMP-2026-003",
    title: "Packaging Defect - Missing Patient Leaflet",
    description: "5 units received without patient information leaflet in secondary packaging",
    type: "Packaging",
    priority: "Medium",
    status: "Root Cause Identified",
    source: "Customer",
    reportedBy: "PharmaCare Pharmacy",
    reportedDate: "2026-01-18",
    affectedProduct: "Metformin 850mg Tablets",
    affectedBatch: "TAB-2025-145",
    country: "Spain",
    rootCause: "Leaflet insertion sensor malfunction during packaging run",
    responseDeadline: "2026-01-25",
    assignedTo: "Packaging Engineering",
    createdAt: "2026-01-18T15:20:00",
    updatedAt: "2026-01-23T10:45:00",
  },
  {
    id: "4",
    complaintId: "CMP-2025-089",
    title: "Labeling Error - Wrong Strength on Carton",
    description: "Carton label shows 250mg instead of 500mg for correct blister strips",
    type: "Labeling",
    priority: "Critical",
    status: "CAPA Initiated",
    source: "Internal",
    reportedBy: "QA Inspector",
    reportedDate: "2025-12-15",
    affectedProduct: "Ibuprofen Tablets",
    affectedBatch: "TAB-2025-130",
    country: "Italy",
    rootCause: "Artwork version control failure in printing process",
    relatedCapaId: "CAPA-2025-042",
    responseDeadline: "2025-12-22",
    assignedTo: "Artwork Management Team",
    reviewer: "QA Director",
    createdAt: "2025-12-15T08:00:00",
    updatedAt: "2026-01-10T09:30:00",
  },
  {
    id: "5",
    complaintId: "CMP-2025-075",
    title: "Temperature Excursion During Delivery",
    description: "Temperature logger showed excursion above 25°C for 6 hours during transit",
    type: "Delivery",
    priority: "Medium",
    status: "Closed",
    source: "Distributor",
    reportedBy: "ColdChain Logistics",
    reportedDate: "2025-11-28",
    affectedProduct: "Insulin Glargine Pens",
    affectedBatch: "BIO-2025-067",
    country: "Netherlands",
    rootCause: "Refrigerated truck breakdown during transit",
    investigationFindings: "Stability data confirms product integrity within excursion range",
    responseDeadline: "2025-12-05",
    assignedTo: "QA Team",
    reviewer: "QA Manager",
    closedDate: "2025-12-10",
    createdAt: "2025-11-28T14:15:00",
    updatedAt: "2025-12-10T16:00:00",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
export const ComplaintsView: React.FC = () => {
  const [filters, setFilters] = useState<ComplaintFilters>({
    searchQuery: "",
    typeFilter: "All",
    priorityFilter: "All",
    statusFilter: "All",
    sourceFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Product Quality", value: "Product Quality" },
    { label: "Adverse Event", value: "Adverse Event" },
    { label: "Packaging", value: "Packaging" },
    { label: "Labeling", value: "Labeling" },
    { label: "Delivery", value: "Delivery" },
    { label: "Counterfeit Suspicion", value: "Counterfeit Suspicion" },
    { label: "Stability", value: "Stability" },
  ];

  const priorityOptions = [
    { label: "All Priority", value: "All" },
    { label: "Critical", value: "Critical" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Received", value: "Received" },
    { label: "Under Investigation", value: "Under Investigation" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Root Cause Identified", value: "Root Cause Identified" },
    { label: "CAPA Initiated", value: "CAPA Initiated" },
    { label: "Closed", value: "Closed" },
    { label: "Rejected", value: "Rejected" },
  ];

  const sourceOptions = [
    { label: "All Sources", value: "All" },
    { label: "Customer", value: "Customer" },
    { label: "Healthcare Professional", value: "Healthcare Professional" },
    { label: "Patient", value: "Patient" },
    { label: "Regulatory Authority", value: "Regulatory Authority" },
    { label: "Distributor", value: "Distributor" },
    { label: "Internal", value: "Internal" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_COMPLAINTS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.complaintId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || item.type === filters.typeFilter;
      const matchesPriority = filters.priorityFilter === "All" || item.priority === filters.priorityFilter;
      const matchesStatus = filters.statusFilter === "All" || item.status === filters.statusFilter;
      const matchesSource = filters.sourceFilter === "All" || item.source === filters.sourceFilter;
      const matchesDateFrom = !filters.dateFrom || item.reportedDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || item.reportedDate <= filters.dateTo;
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesSource && matchesDateFrom && matchesDateTo;
    });
  }, [MOCK_COMPLAINTS, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "Received": return "draft" as const;
      case "Under Investigation": return "pendingReview" as const;
      case "Pending Review": return "pendingReview" as const;
      case "Root Cause Identified": return "pendingApproval" as const;
      case "CAPA Initiated": return "inProgress" as const;
      case "Closed": return "effective" as const;
      case "Rejected": return "rejected" as const;
      default: return "draft" as const;
    }
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case "Critical": return "bg-red-50 text-red-700 border-red-200";
      case "High": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Complaints Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Complaints Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button onClick={() => {}} variant="outline" size="sm" className="whitespace-nowrap gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => {}} size="sm" className="whitespace-nowrap gap-2">
            <IconPlus className="h-4 w-4" />
            Log Complaint
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-2 xl:col-span-4">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <Select label="Type" value={filters.typeFilter} onChange={(v) => setFilters({ ...filters, typeFilter: v as ComplaintType | "All" })} options={typeOptions} />
          </div>
          <div className="xl:col-span-2">
            <Select label="Priority" value={filters.priorityFilter} onChange={(v) => setFilters({ ...filters, priorityFilter: v as ComplaintPriority | "All" })} options={priorityOptions} />
          </div>
          <div className="xl:col-span-3">
            <Select label="Source" value={filters.sourceFilter} onChange={(v) => setFilters({ ...filters, sourceFilter: v as ComplaintSource | "All" })} options={sourceOptions} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end mt-4">
          <div className="xl:col-span-2">
            <Select label="Status" value={filters.statusFilter} onChange={(v) => setFilters({ ...filters, statusFilter: v as ComplaintStatus | "All" })} options={statusOptions} />
          </div>
          <div className="xl:col-span-2">
            <DateTimePicker label="From Date" value={filters.dateFrom} onChange={(v) => setFilters({ ...filters, dateFrom: v })} />
          </div>
          <div className="xl:col-span-2">
            <DateTimePicker label="To Date" value={filters.dateTo} onChange={(v) => setFilters({ ...filters, dateTo: v })} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MessageSquareWarning className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-slate-900">{MOCK_COMPLAINTS.length}</p>
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
                {MOCK_COMPLAINTS.filter((c) => !["Closed", "Rejected"].includes(c.status)).length}
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
                {MOCK_COMPLAINTS.filter((c) => c.priority === "Critical").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_COMPLAINTS.filter((c) => c.status === "Closed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        {paginatedData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">No.</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Source</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Deadline</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-mono text-slate-900">{item.complaintId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{item.type}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getPriorityColor(item.priority))}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <StatusBadge status={getStatusColor(item.status)} />
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden lg:table-cell">{item.source}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden md:table-cell">
                        {new Date(item.responseDeadline).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="py-3.5 px-4 text-sm text-center sticky right-0 bg-white z-30 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            title="No Complaints Found"
            description="No complaint records match your current filters. Try adjusting your search criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({ searchQuery: "", typeFilter: "All", priorityFilter: "All", statusFilter: "All", sourceFilter: "All", dateFrom: "", dateTo: "" });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
