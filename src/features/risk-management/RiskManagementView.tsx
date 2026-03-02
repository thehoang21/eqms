import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  MoreVertical,
  Clock,
  Download,
  CheckCircle,
  ShieldAlert,
  Shield,
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
  Risk,
  RiskFilters,
  RiskStatus,
  RiskCategory,
  RiskLevel,
} from "./types";

// ============================================================================
// MOCK DATA (ICH Q9 compliant)
// ============================================================================
const MOCK_RISKS: Risk[] = [
  {
    id: "1",
    riskId: "RSK-2026-001",
    title: "Cross-Contamination Risk - Multi-Product Facility",
    description: "Risk of cross-contamination between beta-lactam and non-beta-lactam products in shared facility",
    category: "Quality",
    level: "High",
    status: "Mitigation In Progress",
    assessmentMethod: "FMEA",
    probability: 3,
    severity: 5,
    detectability: 3,
    rpn: 45,
    identifiedBy: "QA Risk Team",
    identifiedDate: "2026-01-10",
    department: "Production",
    mitigationPlan: "Implement dedicated air handling, cleaning validation, and campaign manufacturing",
    reviewDate: "2026-04-10",
    assignedTo: "Production Director",
    reviewer: "QA Director",
    createdAt: "2026-01-10T09:00:00",
    updatedAt: "2026-01-25T15:00:00",
  },
  {
    id: "2",
    riskId: "RSK-2026-002",
    title: "Data Integrity Risk - Legacy LIMS System",
    description: "Audit trail gaps in laboratory data management system version 4.2",
    category: "Data Integrity",
    level: "Very High",
    status: "Escalated",
    assessmentMethod: "Risk Matrix",
    probability: 4,
    severity: 5,
    detectability: 4,
    rpn: 80,
    identifiedBy: "IT Compliance Team",
    identifiedDate: "2026-01-05",
    department: "IT / QC Lab",
    mitigationPlan: "Upgrade LIMS to version 6.0 with full 21 CFR Part 11 compliance",
    reviewDate: "2026-03-05",
    assignedTo: "IT Director",
    reviewer: "QA Director",
    approver: "Site Director",
    createdAt: "2026-01-05T10:30:00",
    updatedAt: "2026-01-24T11:00:00",
  },
  {
    id: "3",
    riskId: "RSK-2026-003",
    title: "Supply Chain Disruption - Single Source API",
    description: "Active pharmaceutical ingredient sourced from single supplier with no qualified alternative",
    category: "Supply Chain",
    level: "High",
    status: "Mitigation Planned",
    assessmentMethod: "PHA",
    probability: 3,
    severity: 4,
    detectability: 2,
    rpn: 24,
    identifiedBy: "Supply Chain Manager",
    identifiedDate: "2026-01-15",
    department: "Procurement",
    mitigationPlan: "Qualify second API supplier within 6 months",
    reviewDate: "2026-07-15",
    assignedTo: "Procurement Team",
    createdAt: "2026-01-15T08:00:00",
    updatedAt: "2026-01-20T14:30:00",
  },
  {
    id: "4",
    riskId: "RSK-2025-045",
    title: "Environmental Monitoring Gaps in Isolator",
    description: "Particle count sampling frequency insufficient per EU-GMP Annex 1",
    category: "Environmental",
    level: "Medium",
    status: "Mitigated",
    assessmentMethod: "HACCP",
    probability: 2,
    severity: 4,
    detectability: 2,
    rpn: 16,
    identifiedBy: "Validation Team",
    identifiedDate: "2025-11-20",
    department: "Sterile Manufacturing",
    mitigationPlan: "Increased sampling to continuous monitoring during Grade A operations",
    residualRisk: "Low",
    reviewDate: "2026-05-20",
    assignedTo: "EM Coordinator",
    reviewer: "QA Manager",
    approver: "QA Director",
    createdAt: "2025-11-20T09:00:00",
    updatedAt: "2026-01-15T10:00:00",
  },
  {
    id: "5",
    riskId: "RSK-2026-004",
    title: "Regulatory Non-Compliance Risk - GMP Certificate Expiry",
    description: "EU-GMP certificate for Site B expiring in 90 days without renewal application",
    category: "Regulatory",
    level: "Very High",
    status: "Under Assessment",
    assessmentMethod: "Risk Matrix",
    probability: 4,
    severity: 5,
    detectability: 1,
    rpn: 20,
    identifiedBy: "Regulatory Affairs",
    identifiedDate: "2026-01-25",
    department: "Regulatory Affairs",
    reviewDate: "2026-02-25",
    assignedTo: "RA Director",
    createdAt: "2026-01-25T11:00:00",
    updatedAt: "2026-01-25T11:00:00",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
export const RiskManagementView: React.FC = () => {
  const [filters, setFilters] = useState<RiskFilters>({
    searchQuery: "",
    categoryFilter: "All",
    levelFilter: "All",
    statusFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    { label: "Quality", value: "Quality" },
    { label: "Safety", value: "Safety" },
    { label: "Regulatory", value: "Regulatory" },
    { label: "Environmental", value: "Environmental" },
    { label: "Operational", value: "Operational" },
    { label: "Supply Chain", value: "Supply Chain" },
    { label: "Data Integrity", value: "Data Integrity" },
  ];

  const levelOptions = [
    { label: "All Levels", value: "All" },
    { label: "Very High", value: "Very High" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
    { label: "Very Low", value: "Very Low" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Identified", value: "Identified" },
    { label: "Under Assessment", value: "Under Assessment" },
    { label: "Mitigation Planned", value: "Mitigation Planned" },
    { label: "Mitigation In Progress", value: "Mitigation In Progress" },
    { label: "Mitigated", value: "Mitigated" },
    { label: "Accepted", value: "Accepted" },
    { label: "Closed", value: "Closed" },
    { label: "Escalated", value: "Escalated" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_RISKS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.riskId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCategory = filters.categoryFilter === "All" || item.category === filters.categoryFilter;
      const matchesLevel = filters.levelFilter === "All" || item.level === filters.levelFilter;
      const matchesStatus = filters.statusFilter === "All" || item.status === filters.statusFilter;
      const matchesDateFrom = !filters.dateFrom || item.identifiedDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || item.identifiedDate <= filters.dateTo;
      return matchesSearch && matchesCategory && matchesLevel && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [MOCK_RISKS, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: RiskStatus) => {
    switch (status) {
      case "Identified": return "draft" as const;
      case "Under Assessment": return "pendingReview" as const;
      case "Mitigation Planned": return "pendingApproval" as const;
      case "Mitigation In Progress": return "inProgress" as const;
      case "Mitigated": return "approved" as const;
      case "Accepted": return "effective" as const;
      case "Closed": return "effective" as const;
      case "Escalated": return "rejected" as const;
      default: return "draft" as const;
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case "Very High": return "bg-red-100 text-red-800 border-red-300";
      case "High": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Very Low": return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Risk Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Risk Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button onClick={() => {}} variant="outline" size="sm" className="whitespace-nowrap gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => {}} size="sm" className="whitespace-nowrap gap-2">
            <IconPlus className="h-4 w-4" />
            New Risk Assessment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-9 gap-4 items-end">
          <div className="md:col-span-2 xl:col-span-3">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <Select label="Category" value={filters.categoryFilter} onChange={(v) => setFilters({ ...filters, categoryFilter: v as RiskCategory | "All" })} options={categoryOptions} />
          </div>
          <div className="xl:col-span-3">
            <Select label="Risk Level" value={filters.levelFilter} onChange={(v) => setFilters({ ...filters, levelFilter: v as RiskLevel | "All" })} options={levelOptions} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end mt-4">
          <div className="xl:col-span-2">
            <Select label="Status" value={filters.statusFilter} onChange={(v) => setFilters({ ...filters, statusFilter: v as RiskStatus | "All" })} options={statusOptions} />
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
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total Risks</p>
              <p className="text-2xl font-bold text-slate-900">{MOCK_RISKS.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">High / Very High</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_RISKS.filter((r) => r.level === "High" || r.level === "Very High").length}
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
              <p className="text-xs text-slate-600 font-medium">Under Review</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_RISKS.filter((r) => ["Under Assessment", "Mitigation Planned", "Mitigation In Progress"].includes(r.status)).length}
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
              <p className="text-xs text-slate-600 font-medium">Mitigated</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_RISKS.filter((r) => ["Mitigated", "Accepted", "Closed"].includes(r.status)).length}
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
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Level</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">RPN</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Review Date</th>
                    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                        <span className="font-mono text-slate-900">{item.riskId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{item.category}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getRiskLevelColor(item.level))}>
                          {item.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center justify-center w-10 h-6 rounded-full text-xs font-bold",
                          item.rpn >= 60 ? "bg-red-100 text-red-700" : item.rpn >= 30 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {item.rpn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <StatusBadge status={getStatusColor(item.status)} />
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden md:table-cell">
                        {new Date(item.reviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
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
            title="No Risks Found"
            description="No risk records match your current filters. Try adjusting your search criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({ searchQuery: "", categoryFilter: "All", levelFilter: "All", statusFilter: "All", dateFrom: "", dateTo: "" });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
