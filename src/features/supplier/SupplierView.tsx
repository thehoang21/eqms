import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  MoreVertical,
  Download,
  CheckCircle,
  AlertTriangle,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { IconLayoutDashboard, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import {
  Supplier,
  SupplierFilters,
  SupplierStatus,
  SupplierCategory,
  SupplierRiskRating,
} from "./types";

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    supplierId: "SUP-001",
    name: "PharmaChem AG",
    category: "API Manufacturer",
    status: "Qualified",
    riskRating: "Low",
    country: "Switzerland",
    city: "Basel",
    contactPerson: "Dr. Stefan Hoffmann",
    email: "s.hoffmann@pharmachem.ch",
    phone: "+41 61 555 0100",
    qualificationDate: "2024-03-15",
    lastAuditDate: "2025-09-20",
    nextAuditDate: "2026-09-20",
    suppliedMaterials: ["Amoxicillin Trihydrate", "Cephalexin"],
    gmpCertificate: "GMP-CH-2025-001",
    qualityAgreement: true,
    responsiblePerson: "QA Director",
    createdAt: "2024-03-15T10:00:00",
    updatedAt: "2025-12-01T09:00:00",
  },
  {
    id: "2",
    supplierId: "SUP-002",
    name: "PackSolutions GmbH",
    category: "Packaging Material",
    status: "Qualified",
    riskRating: "Low",
    country: "Germany",
    city: "Munich",
    contactPerson: "Ingrid Bauer",
    email: "i.bauer@packsolutions.de",
    phone: "+49 89 555 0200",
    qualificationDate: "2023-06-10",
    lastAuditDate: "2025-06-10",
    nextAuditDate: "2026-06-10",
    suppliedMaterials: ["PVC/Alu Blisters", "Cartons", "Labels"],
    qualityAgreement: true,
    responsiblePerson: "Procurement Manager",
    createdAt: "2023-06-10T08:00:00",
    updatedAt: "2025-11-15T14:30:00",
  },
  {
    id: "3",
    supplierId: "SUP-003",
    name: "BioTest Labs S.r.l.",
    category: "Laboratory Service",
    status: "Under Evaluation",
    riskRating: "Medium",
    country: "Italy",
    city: "Milan",
    contactPerson: "Dr. Marco Rossi",
    email: "m.rossi@biotestlabs.it",
    phone: "+39 02 555 0300",
    suppliedMaterials: ["Microbial Testing", "Endotoxin Testing"],
    qualityAgreement: false,
    responsiblePerson: "QC Director",
    createdAt: "2026-01-10T09:00:00",
    updatedAt: "2026-01-20T11:00:00",
  },
  {
    id: "4",
    supplierId: "SUP-004",
    name: "Excipi Corp",
    category: "Excipient Supplier",
    status: "Conditionally Approved",
    riskRating: "Medium",
    country: "France",
    city: "Lyon",
    contactPerson: "Pierre Dubois",
    email: "p.dubois@excipicorp.fr",
    phone: "+33 4 555 0400",
    qualificationDate: "2025-08-20",
    lastAuditDate: "2025-08-15",
    nextAuditDate: "2026-02-15",
    suppliedMaterials: ["Lactose Monohydrate", "Microcrystalline Cellulose", "Magnesium Stearate"],
    gmpCertificate: "GMP-FR-2025-042",
    qualityAgreement: true,
    responsiblePerson: "QA Manager",
    createdAt: "2025-08-20T10:00:00",
    updatedAt: "2026-01-15T09:00:00",
  },
  {
    id: "5",
    supplierId: "SUP-005",
    name: "ColdTrans Logistics B.V.",
    category: "Logistics Provider",
    status: "Suspended",
    riskRating: "High",
    country: "Netherlands",
    city: "Rotterdam",
    contactPerson: "Jan van der Berg",
    email: "j.vanderberg@coldtrans.nl",
    phone: "+31 10 555 0500",
    qualificationDate: "2023-01-20",
    lastAuditDate: "2025-07-10",
    nextAuditDate: "2026-01-10",
    suppliedMaterials: ["Cold Chain Distribution", "GDP Transport"],
    gdpCertificate: "GDP-NL-2024-078",
    qualityAgreement: true,
    responsiblePerson: "Supply Chain Director",
    createdAt: "2023-01-20T10:00:00",
    updatedAt: "2026-01-12T08:00:00",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
export const SupplierView: React.FC = () => {
  const [filters, setFilters] = useState<SupplierFilters>({
    searchQuery: "",
    categoryFilter: "All",
    statusFilter: "All",
    riskFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    { label: "API Manufacturer", value: "API Manufacturer" },
    { label: "Excipient Supplier", value: "Excipient Supplier" },
    { label: "Packaging Material", value: "Packaging Material" },
    { label: "Contract Manufacturer", value: "Contract Manufacturer" },
    { label: "Laboratory Service", value: "Laboratory Service" },
    { label: "Equipment Vendor", value: "Equipment Vendor" },
    { label: "Logistics Provider", value: "Logistics Provider" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Qualified", value: "Qualified" },
    { label: "Conditionally Approved", value: "Conditionally Approved" },
    { label: "Under Evaluation", value: "Under Evaluation" },
    { label: "Audit Scheduled", value: "Audit Scheduled" },
    { label: "Suspended", value: "Suspended" },
    { label: "Disqualified", value: "Disqualified" },
    { label: "New", value: "New" },
  ];

  const riskOptions = [
    { label: "All Risk Levels", value: "All" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Critical", value: "Critical" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_SUPPLIERS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.supplierId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCategory = filters.categoryFilter === "All" || item.category === filters.categoryFilter;
      const matchesStatus = filters.statusFilter === "All" || item.status === filters.statusFilter;
      const matchesRisk = filters.riskFilter === "All" || item.riskRating === filters.riskFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
    });
  }, [MOCK_SUPPLIERS, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: SupplierStatus) => {
    switch (status) {
      case "Qualified": return "approved" as const;
      case "Conditionally Approved": return "pendingApproval" as const;
      case "Under Evaluation": return "pendingReview" as const;
      case "Audit Scheduled": return "inProgress" as const;
      case "Suspended": return "rejected" as const;
      case "Disqualified": return "obsolete" as const;
      case "New": return "draft" as const;
      default: return "draft" as const;
    }
  };

  const getRiskColor = (risk: SupplierRiskRating) => {
    switch (risk) {
      case "Critical": return "bg-red-100 text-red-800 border-red-300";
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
            Supplier Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Supplier Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button onClick={() => {}} variant="outline" size="sm" className="whitespace-nowrap gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => {}} size="sm" className="whitespace-nowrap gap-2">
            <IconPlus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-2 xl:col-span-3">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, country..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <Select label="Category" value={filters.categoryFilter} onChange={(v) => setFilters({ ...filters, categoryFilter: v as SupplierCategory | "All" })} options={categoryOptions} />
          </div>
          <div className="xl:col-span-3">
            <Select label="Status" value={filters.statusFilter} onChange={(v) => setFilters({ ...filters, statusFilter: v as SupplierStatus | "All" })} options={statusOptions} />
          </div>
          <div className="xl:col-span-3">
            <Select label="Risk Rating" value={filters.riskFilter} onChange={(v) => setFilters({ ...filters, riskFilter: v as SupplierRiskRating | "All" })} options={riskOptions} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total Suppliers</p>
              <p className="text-2xl font-bold text-slate-900">{MOCK_SUPPLIERS.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Qualified</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_SUPPLIERS.filter((s) => s.status === "Qualified").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Under Review</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_SUPPLIERS.filter((s) => ["Under Evaluation", "Conditionally Approved"].includes(s.status)).length}
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
              <p className="text-xs text-slate-600 font-medium">Suspended</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_SUPPLIERS.filter((s) => ["Suspended", "Disqualified"].includes(s.status)).length}
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
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">No.</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Risk</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Country</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Next Audit</th>
                    <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
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
                        <span className="font-mono text-slate-900">{item.supplierId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{item.category}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getRiskColor(item.riskRating))}>
                          {item.riskRating}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <StatusBadge status={getStatusColor(item.status)} />
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700 hidden lg:table-cell">{item.country}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden md:table-cell">
                        {item.nextAuditDate ? new Date(item.nextAuditDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="py-3.5 px-4 text-sm text-center sticky right-0 bg-white z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
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
            title="No Suppliers Found"
            description="No supplier records match your current filters. Try adjusting your search criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({ searchQuery: "", categoryFilter: "All", statusFilter: "All", riskFilter: "All", dateFrom: "", dateTo: "" });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
