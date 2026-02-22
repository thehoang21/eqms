import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Award,
  Download,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { MoreVertical } from "lucide-react";

interface EmployeeTrainingFile {
  id: string;
  employeeId: string;
  employeeName: string;
  jobPosition: string;
  department: string;
  totalCoursesRequired: number;
  coursesCompleted: number;
  coursesInProgress: number;
  coursesOverdue: number;
  lastTrainingDate: string;
  averageScore: number;
}

interface EmployeeFilters {
  searchQuery: string;
  departmentFilter: string;
  positionFilter: string;
}

// Mock Data
const MOCK_EMPLOYEES: EmployeeTrainingFile[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    employeeName: "John Smith",
    jobPosition: "QA Manager",
    department: "Quality Assurance",
    totalCoursesRequired: 5,
    coursesCompleted: 5,
    coursesInProgress: 0,
    coursesOverdue: 0,
    lastTrainingDate: "2026-01-15",
    averageScore: 92,
  },
  {
    id: "2",
    employeeId: "EMP-002",
    employeeName: "Sarah Johnson",
    jobPosition: "QC Analyst",
    department: "Quality Control",
    totalCoursesRequired: 6,
    coursesCompleted: 5,
    coursesInProgress: 1,
    coursesOverdue: 0,
    lastTrainingDate: "2026-01-20",
    averageScore: 88,
  },
  {
    id: "3",
    employeeId: "EMP-003",
    employeeName: "Michael Chen",
    jobPosition: "Production Operator",
    department: "Production",
    totalCoursesRequired: 4,
    coursesCompleted: 3,
    coursesInProgress: 0,
    coursesOverdue: 1,
    lastTrainingDate: "2026-01-10",
    averageScore: 78,
  },
  {
    id: "4",
    employeeId: "EMP-004",
    employeeName: "Emma Wilson",
    jobPosition: "Document Controller",
    department: "Documentation",
    totalCoursesRequired: 4,
    coursesCompleted: 4,
    coursesInProgress: 0,
    coursesOverdue: 0,
    lastTrainingDate: "2026-01-25",
    averageScore: 95,
  },
  {
    id: "5",
    employeeId: "EMP-005",
    employeeName: "David Brown",
    jobPosition: "Validation Engineer",
    department: "Engineering",
    totalCoursesRequired: 7,
    coursesCompleted: 5,
    coursesInProgress: 1,
    coursesOverdue: 1,
    lastTrainingDate: "2026-01-18",
    averageScore: 85,
  },
];

export const EmployeeTrainingFilesView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState<EmployeeFilters>({
    searchQuery: "",
    departmentFilter: "All",
    positionFilter: "All",
  });

  // Pagination
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

  const positionOptions = [
    { label: "All Positions", value: "All" },
    { label: "QA Manager", value: "QA Manager" },
    { label: "QC Analyst", value: "QC Analyst" },
    { label: "Production Operator", value: "Production Operator" },
    { label: "Document Controller", value: "Document Controller" },
    { label: "Validation Engineer", value: "Validation Engineer" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_EMPLOYEES.filter((employee) => {
      const matchesSearch =
        employee.employeeName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesDepartment = filters.departmentFilter === "All" || employee.department === filters.departmentFilter;
      const matchesPosition = filters.positionFilter === "All" || employee.jobPosition === filters.positionFilter;

      return matchesSearch && matchesDepartment && matchesPosition;
    });
  }, [filters]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getCompletionRate = (employee: EmployeeTrainingFile) => {
    return Math.round((employee.coursesCompleted / employee.totalCoursesRequired) * 100);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Employee Training Files
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Records & Archive</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Employee Training Files</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export files")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee name or ID..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
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

          {/* Position */}
          <div className="xl:col-span-1">
            <Select
              label="Position"
              value={filters.positionFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, positionFilter: val }))
              }
              options={positionOptions}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EMPLOYEES.length}
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
              <p className="text-xs text-slate-600 font-medium">Fully Compliant</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EMPLOYEES.filter((e) => e.coursesCompleted === e.totalCoursesRequired).length}
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
              <p className="text-xs text-slate-600 font-medium">With Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_EMPLOYEES.filter((e) => e.coursesOverdue > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(
                  MOCK_EMPLOYEES.reduce((sum, e) => sum + e.averageScore, 0) /
                    MOCK_EMPLOYEES.length
                )}%
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
                  Employee ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Employee Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Position
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Required
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Completed
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Overdue
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Avg. Score
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((employee, index) => {
                const completionRate = getCompletionRate(employee);
                return (
                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => console.log("View employee:", employee.id)}
                  >
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">
                        {employee.employeeId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-slate-900">
                          {employee.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {employee.jobPosition}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {employee.department}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="text-slate-900 font-medium">
                        {employee.totalCoursesRequired}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-900 font-medium">
                          {employee.coursesCompleted}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <XCircle className={`h-4 w-4 ${employee.coursesOverdue > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                        <span className={`font-medium ${employee.coursesOverdue > 0 ? 'text-red-900' : 'text-slate-500'}`}>
                          {employee.coursesOverdue}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="text-slate-900 font-medium">
                          {employee.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Action clicked");
                        }}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <TableEmptyState
            title="No Employee Records Found"
            description="We couldn't find any employee training records matching your filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({
                searchQuery: "",
                departmentFilter: "All",
                positionFilter: "All",
              });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
