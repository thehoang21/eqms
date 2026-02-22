import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { cn } from "@/components/ui/utils";

interface CourseStatus {
  id: string;
  courseId: string;
  courseTitle: string;
  courseType: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  averageScore: number;
  department: string;
}

interface StatusFilters {
  searchQuery: string;
  departmentFilter: string;
  typeFilter: string;
}

// Mock Data
const MOCK_COURSE_STATUS: CourseStatus[] = [
  {
    id: "1",
    courseId: "TRN-2026-001",
    courseTitle: "GMP Basic Principles",
    courseType: "GMP",
    totalAssigned: 50,
    completed: 45,
    inProgress: 3,
    notStarted: 2,
    overdue: 0,
    averageScore: 88,
    department: "All Departments",
  },
  {
    id: "2",
    courseId: "TRN-2026-002",
    courseTitle: "Cleanroom Qualification",
    courseType: "Technical",
    totalAssigned: 25,
    completed: 20,
    inProgress: 4,
    notStarted: 1,
    overdue: 0,
    averageScore: 92,
    department: "Quality Assurance",
  },
  {
    id: "3",
    courseId: "TRN-2026-003",
    courseTitle: "HPLC Operation Advanced",
    courseType: "Technical",
    totalAssigned: 15,
    completed: 12,
    inProgress: 2,
    notStarted: 0,
    overdue: 1,
    averageScore: 85,
    department: "QC Lab",
  },
  {
    id: "4",
    courseId: "TRN-2026-004",
    courseTitle: "ISO 9001:2015 Requirements",
    courseType: "Compliance",
    totalAssigned: 40,
    completed: 30,
    inProgress: 8,
    notStarted: 2,
    overdue: 0,
    averageScore: 79,
    department: "All Departments",
  },
  {
    id: "5",
    courseId: "TRN-2026-005",
    courseTitle: "SOP Review & Update Procedures",
    courseType: "SOP",
    totalAssigned: 30,
    completed: 18,
    inProgress: 5,
    notStarted: 2,
    overdue: 5,
    averageScore: 81,
    department: "Documentation",
  },
];

export const CourseStatusView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState<StatusFilters>({
    searchQuery: "",
    departmentFilter: "All",
    typeFilter: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Options
  const departmentOptions = [
    { label: "All Departments", value: "All" },
    { label: "Quality Assurance", value: "Quality Assurance" },
    { label: "QC Lab", value: "QC Lab" },
    { label: "Documentation", value: "Documentation" },
  ];

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "GMP", value: "GMP" },
    { label: "Technical", value: "Technical" },
    { label: "Compliance", value: "Compliance" },
    { label: "SOP", value: "SOP" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_COURSE_STATUS.filter((course) => {
      const matchesSearch =
        course.courseTitle.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        course.courseId.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesDepartment = filters.departmentFilter === "All" || course.department === filters.departmentFilter;
      const matchesType = filters.typeFilter === "All" || course.courseType === filters.typeFilter;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const getCompletionRate = (course: CourseStatus) => {
    return Math.round((course.completed / course.totalAssigned) * 100);
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
            Course Status
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
            <span className="text-slate-700 font-medium">Course Status</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export status")}
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
                placeholder="Search by course title or ID..."
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

          {/* Type */}
          <div className="xl:col-span-1">
            <Select
              label="Type"
              value={filters.typeFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, typeFilter: val }))
              }
              options={typeOptions}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_COURSE_STATUS.length}
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
              <p className="text-xs text-slate-600 font-medium">Total Assigned</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_COURSE_STATUS.reduce((sum, course) => sum + course.totalAssigned, 0)}
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
                {MOCK_COURSE_STATUS.reduce((sum, course) => sum + course.completed, 0)}
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
              <p className="text-xs text-slate-600 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(
                  MOCK_COURSE_STATUS.reduce((sum, course) => sum + course.averageScore, 0) /
                    MOCK_COURSE_STATUS.length
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
                  Course ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course Title
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Total Assigned
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
                  Avg. Score
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Completion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((course, index) => {
                const completionRate = getCompletionRate(course);
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => console.log("View details:", course.id)}
                  >
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                      {rowNumber}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">
                        {course.courseId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-slate-900">
                          {course.courseTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                        {course.courseType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900 font-medium">
                          {course.totalAssigned}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-900 font-medium">
                          {course.completed}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-900 font-medium">
                          {course.inProgress}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        <span className="text-red-900 font-medium">
                          {course.overdue}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="text-slate-900 font-medium">
                        {course.averageScore}%
                      </span>
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
