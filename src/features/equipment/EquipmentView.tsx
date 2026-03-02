import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  MoreVertical,
  Download,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Monitor,
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
  Equipment,
  EquipmentFilters,
  EquipmentStatus,
  EquipmentType,
} from "./types";

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: "1",
    equipmentId: "EQP-001",
    name: "High-Shear Granulator HSG-500",
    description: "Diosna P500 high-shear granulator for wet granulation",
    type: "Manufacturing",
    status: "Active",
    qualificationStatus: "Fully Qualified",
    manufacturer: "Diosna GmbH",
    model: "P500",
    serialNumber: "DSN-2020-4521",
    location: "Building A, Room 201",
    department: "Production",
    installationDate: "2020-06-15",
    lastCalibrationDate: "2026-01-10",
    nextCalibrationDate: "2026-07-10",
    lastMaintenanceDate: "2026-01-05",
    nextMaintenanceDate: "2026-04-05",
    responsiblePerson: "Thomas Weber",
    sopReference: "SOP-EQP-045",
    createdAt: "2020-06-15T10:00:00",
    updatedAt: "2026-01-25T09:00:00",
  },
  {
    id: "2",
    equipmentId: "EQP-002",
    name: "HPLC System - Agilent 1260",
    description: "Agilent 1260 Infinity II HPLC for quality control testing",
    type: "Laboratory",
    status: "Active",
    qualificationStatus: "Fully Qualified",
    manufacturer: "Agilent Technologies",
    model: "1260 Infinity II",
    serialNumber: "AGI-2022-8834",
    location: "QC Lab, Room 105",
    department: "Quality Control",
    installationDate: "2022-03-20",
    lastCalibrationDate: "2025-12-15",
    nextCalibrationDate: "2026-06-15",
    lastMaintenanceDate: "2025-11-20",
    nextMaintenanceDate: "2026-05-20",
    responsiblePerson: "Dr. Maria Fernandez",
    sopReference: "SOP-LAB-012",
    createdAt: "2022-03-20T08:00:00",
    updatedAt: "2026-01-20T14:30:00",
  },
  {
    id: "3",
    equipmentId: "EQP-003",
    name: "Tablet Press - Fette 2200i",
    description: "Rotary tablet press for production of oral solid dosage forms",
    type: "Manufacturing",
    status: "Under Maintenance",
    qualificationStatus: "Re-qualification Required",
    manufacturer: "Fette Compacting",
    model: "2200i",
    serialNumber: "FET-2019-3312",
    location: "Building A, Room 203",
    department: "Production",
    installationDate: "2019-09-10",
    lastCalibrationDate: "2025-09-10",
    nextCalibrationDate: "2026-03-10",
    lastMaintenanceDate: "2026-01-20",
    nextMaintenanceDate: "2026-02-20",
    responsiblePerson: "Klaus Richter",
    sopReference: "SOP-EQP-023",
    createdAt: "2019-09-10T10:00:00",
    updatedAt: "2026-01-25T11:00:00",
  },
  {
    id: "4",
    equipmentId: "EQP-004",
    name: "Cold Storage Chamber - Binder KBF720",
    description: "Stability chamber for ICH condition storage (25°C/60% RH)",
    type: "Storage",
    status: "Active",
    qualificationStatus: "Fully Qualified",
    manufacturer: "Binder GmbH",
    model: "KBF 720",
    serialNumber: "BND-2021-5567",
    location: "Building B, Room 301",
    department: "Quality Control",
    installationDate: "2021-01-15",
    lastCalibrationDate: "2025-07-15",
    nextCalibrationDate: "2026-01-15",
    lastMaintenanceDate: "2025-10-15",
    nextMaintenanceDate: "2026-04-15",
    responsiblePerson: "Dr. Andrea Bauer",
    sopReference: "SOP-STB-008",
    createdAt: "2021-01-15T09:00:00",
    updatedAt: "2026-01-15T08:00:00",
  },
  {
    id: "5",
    equipmentId: "EQP-005",
    name: "Purified Water System - MECO PW-2000",
    description: "Multi-effect distillation unit for purified water generation",
    type: "Water System",
    status: "Calibration Due",
    qualificationStatus: "PQ Completed",
    manufacturer: "MECO",
    model: "PW-2000",
    serialNumber: "MEC-2018-1123",
    location: "Utility Building, Room U01",
    department: "Engineering",
    installationDate: "2018-05-20",
    lastCalibrationDate: "2025-05-20",
    nextCalibrationDate: "2025-11-20",
    lastMaintenanceDate: "2025-12-01",
    nextMaintenanceDate: "2026-06-01",
    responsiblePerson: "Engineering Manager",
    sopReference: "SOP-UTL-003",
    createdAt: "2018-05-20T10:00:00",
    updatedAt: "2026-01-10T09:00:00",
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
export const EquipmentView: React.FC = () => {
  const [filters, setFilters] = useState<EquipmentFilters>({
    searchQuery: "",
    typeFilter: "All",
    statusFilter: "All",
    locationFilter: "",
    dateFrom: "",
    dateTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Laboratory", value: "Laboratory" },
    { label: "Packaging", value: "Packaging" },
    { label: "Storage", value: "Storage" },
    { label: "Utility", value: "Utility" },
    { label: "HVAC", value: "HVAC" },
    { label: "Water System", value: "Water System" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Under Maintenance", value: "Under Maintenance" },
    { label: "Calibration Due", value: "Calibration Due" },
    { label: "Qualification Due", value: "Qualification Due" },
    { label: "Out of Service", value: "Out of Service" },
    { label: "Retired", value: "Retired" },
    { label: "Pending Installation", value: "Pending Installation" },
  ];

  const filteredData = useMemo(() => {
    return MOCK_EQUIPMENT.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.equipmentId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || item.type === filters.typeFilter;
      const matchesStatus = filters.statusFilter === "All" || item.status === filters.statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [MOCK_EQUIPMENT, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case "Active": return "active" as const;
      case "Under Maintenance": return "inProgress" as const;
      case "Calibration Due": return "pendingReview" as const;
      case "Qualification Due": return "pendingApproval" as const;
      case "Out of Service": return "rejected" as const;
      case "Retired": return "archived" as const;
      case "Pending Installation": return "draft" as const;
      default: return "draft" as const;
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Equipment Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Equipment Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button onClick={() => {}} variant="outline" size="sm" className="whitespace-nowrap gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => {}} size="sm" className="whitespace-nowrap gap-2">
            <IconPlus className="h-4 w-4" />
            Add Equipment
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
                placeholder="Search by name, ID, or location..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <Select label="Equipment Type" value={filters.typeFilter} onChange={(v) => setFilters({ ...filters, typeFilter: v as EquipmentType | "All" })} options={typeOptions} />
          </div>
          <div className="xl:col-span-3">
            <Select label="Status" value={filters.statusFilter} onChange={(v) => setFilters({ ...filters, statusFilter: v as EquipmentStatus | "All" })} options={statusOptions} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total Equipment</p>
              <p className="text-2xl font-bold text-slate-900">{MOCK_EQUIPMENT.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EQUIPMENT.filter((e) => e.status === "Active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Maintenance Due</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EQUIPMENT.filter((e) => ["Under Maintenance", "Calibration Due"].includes(e.status)).length}
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
              <p className="text-xs text-slate-600 font-medium">Out of Service</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EQUIPMENT.filter((e) => e.status === "Out of Service").length}
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
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Location</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Next Calibration</th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Responsible</th>
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
                        <span className="font-mono text-slate-900">{item.equipmentId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium max-w-xs truncate">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{item.type}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <StatusBadge status={getStatusColor(item.status)} />
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700 hidden lg:table-cell">{item.location}</td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden md:table-cell">
                        {item.nextCalibrationDate ? new Date(item.nextCalibrationDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 hidden xl:table-cell">{item.responsiblePerson}</td>
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
            title="No Equipment Found"
            description="No equipment records match your current filters. Try adjusting your search criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({ searchQuery: "", typeFilter: "All", statusFilter: "All", locationFilter: "", dateFrom: "", dateTo: "" });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
