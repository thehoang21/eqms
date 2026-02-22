import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  Grid3x3,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { cn } from "@/components/ui/utils";

interface MatrixEntry {
  id: string;
  jobPosition: string;
  department: string;
  requiredCourses: string[];
  employees: number;
  completedEmployees: number;
  inProgressEmployees: number;
  overdueEmployees: number;
}

interface MatrixFilters {
  searchQuery: string;
  departmentFilter: string;
}

// Mock Data
const MOCK_MATRIX: MatrixEntry[] = [
  {
    id: "1",
    jobPosition: "QA Manager",
    department: "Quality Assurance",
    requiredCourses: ["GMP Basic", "ISO 9001", "Audit Training"],
    employees: 5,
    completedEmployees: 4,
    inProgressEmployees: 1,
    overdueEmployees: 0,
  },
  {
    id: "2",
    jobPosition: "QC Analyst",
    department: "Quality Control",
    requiredCourses: ["GMP Basic", "HPLC Operation", "Lab Safety"],
    employees: 12,
    completedEmployees: 9,
    inProgressEmployees: 2,
    overdueEmployees: 1,
  },
  {
    id: "3",
    jobPosition: "Production Operator",
    department: "Production",
    requiredCourses: ["GMP Basic", "Cleanroom Operations", "Safety Training"],
    employees: 25,
    completedEmployees: 20,
    inProgressEmployees: 3,
    overdueEmployees: 2,
  },
  {
    id: "4",
    jobPosition: "Document Controller",
    department: "Documentation",
    requiredCourses: ["GMP Basic", "SOP Management", "Document Control"],
    employees: 3,
    completedEmployees: 3,
    inProgressEmployees: 0,
    overdueEmployees: 0,
  },
  {
    id: "5",
    jobPosition: "Validation Engineer",
    department: "Engineering",
    requiredCourses: ["GMP Basic", "Validation Principles", "Risk Assessment"],
    employees: 8,
    completedEmployees: 6,
    inProgressEmployees: 1,
    overdueEmployees: 1,
  },
];

export const TrainingMatrixView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState<MatrixFilters>({
    searchQuery: "",
    departmentFilter: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Options
  const departmentOptions = [
    { label: "All Departments", value: "All" },
    { label: "Quality Assurance", value: "Quality Assurance" },
    { label: "Quality Control", value: "Quality Control" },
    { label: "Production", value: "Production" },
    { label: "Documentation", value: "Documentation" },
    { label: "Engineering", value: "Engineering" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_MATRIX.filter((entry) => {
      const matchesSearch =
        entry.jobPosition.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        entry.department.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesDepartment = filters.departmentFilter === "All" || entry.department === filters.departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const getCompletionRate = (entry: MatrixEntry) => {
    return Math.round((entry.completedEmployees / entry.employees) * 100);
  };

  const getCompletionColor = (rate: number): string => {
    if (rate >= 90) return "text-emerald-600";
    if (rate >= 70) return "text-blue-600";
    if (rate >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Matrix
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
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
          <Button
            onClick={() => console.log("Export matrix")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by job position or department..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Department */}
          <div className="xl:col-span-2">
            <Select
              label="Department"
              value={filters.departmentFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, departmentFilter: val }))
              }
              options={departmentOptions}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Grid3x3 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Job Positions
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATRIX.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATRIX.reduce((sum, entry) => sum + entry.employees, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATRIX.reduce((sum, entry) => sum + entry.completedEmployees, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATRIX.reduce((sum, entry) => sum + entry.overdueEmployees, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[60px]">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Job Position
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Required Courses
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Employees
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Completed
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  In Progress
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Overdue
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((entry, index) => {
                const completionRate = getCompletionRate(entry);
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => console.log("View details:", entry.id)}
                  >
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                      {rowNumber}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">
                        {entry.jobPosition}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {entry.department}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {entry.requiredCourses.map((course, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900 font-medium">
                          {entry.employees}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-900 font-medium">
                          {entry.completedEmployees}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-900 font-medium">
                          {entry.inProgressEmployees}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-900 font-medium">
                          {entry.overdueEmployees}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                completionRate >= 90 && "bg-emerald-600",
                                completionRate >= 70 && completionRate < 90 && "bg-blue-600",
                                completionRate >= 50 && completionRate < 70 && "bg-amber-600",
                                completionRate < 50 && "bg-red-600"
                              )}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                        <span className={cn(
                          "font-semibold text-sm",
                          getCompletionColor(completionRate)
                        )}>
                          {completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
          showItemCount={true}
        />
      </div>
    </div>
  );
};
