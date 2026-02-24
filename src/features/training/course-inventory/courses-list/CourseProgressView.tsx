import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  ArrowLeft,
  Download,
  TrendingUp,
  Target,
  UserCheck,
  UserX,
} from "lucide-react";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EnrollmentStatus = "Completed" | "In-Progress" | "Not Started" | "Overdue" | "Exempt";
type ResultStatus = "Pass" | "Fail" | "Pending" | "N/A";

interface EmployeeProgress {
  userId: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  enrollmentStatus: EnrollmentStatus;
  resultStatus: ResultStatus;
  score: number | null;
  completedAt: string | null;
  examDate: string | null;
  attempts: number;
}

interface CourseProgressInfo {
  id: string;
  trainingId: string;
  title: string;
  totalEnrolled: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  passRate: number;
  averageScore: number | null;
  passingScore: number;
  passingGradeType: "pass_fail" | "score_10" | "percentage";
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_PROGRESS_INFO: CourseProgressInfo = {
  id: "1",
  trainingId: "TRN-2026-001",
  title: "GMP Basic Principles",
  totalEnrolled: 25,
  completed: 15,
  inProgress: 5,
  notStarted: 3,
  overdue: 2,
  passRate: 87,
  averageScore: 8.2,
  passingScore: 7,
  passingGradeType: "score_10",
};

const MOCK_EMPLOYEES: EmployeeProgress[] = [
  { userId: "EMP-1001", name: "Nguyen Van An", email: "an.nguyen@company.com", department: "QA", jobTitle: "QA Specialist", enrollmentStatus: "Completed", resultStatus: "Pass", score: 9, completedAt: "2026-02-10", examDate: "2026-02-10", attempts: 1 },
  { userId: "EMP-1002", name: "Tran Thi Binh", email: "binh.tran@company.com", department: "QC Lab", jobTitle: "Lab Technician", enrollmentStatus: "Completed", resultStatus: "Pass", score: 8, completedAt: "2026-02-11", examDate: "2026-02-11", attempts: 1 },
  { userId: "EMP-1003", name: "Le Van Cuong", email: "cuong.le@company.com", department: "Production", jobTitle: "Production Manager", enrollmentStatus: "Completed", resultStatus: "Fail", score: 5, completedAt: "2026-02-12", examDate: "2026-02-12", attempts: 2 },
  { userId: "EMP-1004", name: "Pham Thi Dung", email: "dung.pham@company.com", department: "QA", jobTitle: "QA Specialist", enrollmentStatus: "Completed", resultStatus: "Pass", score: 10, completedAt: "2026-02-09", examDate: "2026-02-09", attempts: 1 },
  { userId: "EMP-1005", name: "Hoang Van Em", email: "em.hoang@company.com", department: "R&D", jobTitle: "R&D Scientist", enrollmentStatus: "In-Progress", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1006", name: "Vo Thi Phuong", email: "phuong.vo@company.com", department: "Production", jobTitle: "Production Supervisor", enrollmentStatus: "Completed", resultStatus: "Pass", score: 7, completedAt: "2026-02-13", examDate: "2026-02-13", attempts: 2 },
  { userId: "EMP-1007", name: "Dang Van Gia", email: "gia.dang@company.com", department: "QC Lab", jobTitle: "Senior Analyst", enrollmentStatus: "Overdue", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1008", name: "Bui Thi Hanh", email: "hanh.bui@company.com", department: "Engineering", jobTitle: "Senior Engineer", enrollmentStatus: "Not Started", resultStatus: "N/A", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1009", name: "Ngo Van Ich", email: "ich.ngo@company.com", department: "Warehouse", jobTitle: "Warehouse Supervisor", enrollmentStatus: "Completed", resultStatus: "Pass", score: 8, completedAt: "2026-02-14", examDate: "2026-02-14", attempts: 1 },
  { userId: "EMP-1010", name: "Trinh Thi Kim", email: "kim.trinh@company.com", department: "QA", jobTitle: "QA Manager", enrollmentStatus: "Completed", resultStatus: "Pass", score: 9, completedAt: "2026-02-08", examDate: "2026-02-08", attempts: 1 },
  { userId: "EMP-1011", name: "Do Van Lam", email: "lam.do@company.com", department: "Production", jobTitle: "Operator", enrollmentStatus: "In-Progress", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1012", name: "Ly Thi Mai", email: "mai.ly@company.com", department: "R&D", jobTitle: "Research Associate", enrollmentStatus: "Completed", resultStatus: "Pass", score: 8, completedAt: "2026-02-15", examDate: "2026-02-15", attempts: 1 },
  { userId: "EMP-1013", name: "Truong Van Nam", email: "nam.truong@company.com", department: "Engineering", jobTitle: "Maintenance Technician", enrollmentStatus: "Not Started", resultStatus: "N/A", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1014", name: "Huynh Thi Oanh", email: "oanh.huynh@company.com", department: "QC Lab", jobTitle: "Lab Supervisor", enrollmentStatus: "Completed", resultStatus: "Pass", score: 9, completedAt: "2026-02-10", examDate: "2026-02-10", attempts: 1 },
  { userId: "EMP-1015", name: "Phan Van Phuc", email: "phuc.phan@company.com", department: "Warehouse", jobTitle: "Logistics Coordinator", enrollmentStatus: "In-Progress", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1016", name: "Duong Thi Quynh", email: "quynh.duong@company.com", department: "QA", jobTitle: "Document Controller", enrollmentStatus: "Completed", resultStatus: "Pass", score: 8, completedAt: "2026-02-12", examDate: "2026-02-12", attempts: 1 },
  { userId: "EMP-1017", name: "Cao Van Rang", email: "rang.cao@company.com", department: "Production", jobTitle: "Operator", enrollmentStatus: "Overdue", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1018", name: "Ta Thi Son", email: "son.ta@company.com", department: "Engineering", jobTitle: "Calibration Technician", enrollmentStatus: "Completed", resultStatus: "Pass", score: 7, completedAt: "2026-02-16", examDate: "2026-02-16", attempts: 3 },
  { userId: "EMP-1019", name: "Mai Van Tuan", email: "tuan.mai@company.com", department: "QC Lab", jobTitle: "Microbiologist", enrollmentStatus: "In-Progress", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1020", name: "Luu Thi Uyen", email: "uyen.luu@company.com", department: "QA", jobTitle: "QA Specialist", enrollmentStatus: "Completed", resultStatus: "Pass", score: 10, completedAt: "2026-02-09", examDate: "2026-02-09", attempts: 1 },
  { userId: "EMP-1021", name: "Dinh Van Vinh", email: "vinh.dinh@company.com", department: "Production", jobTitle: "Shift Leader", enrollmentStatus: "Completed", resultStatus: "Pass", score: 8, completedAt: "2026-02-17", examDate: "2026-02-17", attempts: 1 },
  { userId: "EMP-1022", name: "Ha Thi Xuan", email: "xuan.ha@company.com", department: "R&D", jobTitle: "Formulation Scientist", enrollmentStatus: "Not Started", resultStatus: "N/A", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1023", name: "Tong Van Yen", email: "yen.tong@company.com", department: "Warehouse", jobTitle: "Receiving Inspector", enrollmentStatus: "In-Progress", resultStatus: "Pending", score: null, completedAt: null, examDate: null, attempts: 0 },
  { userId: "EMP-1024", name: "Chu Thi Zen", email: "zen.chu@company.com", department: "Engineering", jobTitle: "Process Engineer", enrollmentStatus: "Completed", resultStatus: "Pass", score: 9, completedAt: "2026-02-18", examDate: "2026-02-18", attempts: 1 },
  { userId: "EMP-1025", name: "Lam Van Anh", email: "anh.lam@company.com", department: "QA", jobTitle: "Validation Specialist", enrollmentStatus: "Exempt", resultStatus: "N/A", score: null, completedAt: null, examDate: null, attempts: 0 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const getEnrollmentColor = (status: EnrollmentStatus) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In-Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Not Started":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Overdue":
      return "bg-red-50 text-red-700 border-red-200";
    case "Exempt":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getResultColor = (status: ResultStatus) => {
  switch (status) {
    case "Pass":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Fail":
      return "bg-red-50 text-red-700 border-red-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "N/A":
      return "bg-slate-50 text-slate-400 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export const CourseProgressView: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const info = MOCK_PROGRESS_INFO; // In real app, fetch by courseId

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "All">("All");
  const [resultFilter, setResultFilter] = useState<ResultStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Derived data
  const uniqueDepartments = useMemo(
    () => Array.from(new Set(MOCK_EMPLOYEES.map((e) => e.department))).sort(),
    []
  );

  const filteredEmployees = useMemo(() => {
    let filtered = MOCK_EMPLOYEES;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.userId.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((e) => e.enrollmentStatus === statusFilter);
    }

    if (resultFilter !== "All") {
      filtered = filtered.filter((e) => e.resultStatus === resultFilter);
    }

    if (departmentFilter !== "All") {
      filtered = filtered.filter((e) => e.department === departmentFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter, resultFilter, departmentFilter]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const completionPercent = Math.round((info.completed / info.totalEnrolled) * 100);

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Progress
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Courses List</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Training Progress</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/training-management/courses/${courseId}`)}
          >
            Back to Course
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-500 font-mono">{info.trainingId}</p>
            <h2 className="text-base lg:text-lg font-semibold text-slate-900 mt-0.5">
              {info.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Passing: ≥ {info.passingScore}/{info.passingGradeType === "percentage" ? "100" : "10"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Completion: <span className="font-semibold">{info.completed}</span> / {info.totalEnrolled}
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-700">
              {completionPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{info.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{info.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">{info.overdue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Pass Rate</p>
              <p className="text-2xl font-bold text-slate-900">{info.passRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Avg. Score</p>
              <p className="text-2xl font-bold text-slate-900">
                {info.averageScore !== null ? info.averageScore.toFixed(1) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 lg:gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-4">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, Name, Email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="xl:col-span-2">
            <Select
              label="Enrollment"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val as typeof statusFilter);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Status", value: "All" },
                { label: "Completed", value: "Completed" },
                { label: "In-Progress", value: "In-Progress" },
                { label: "Not Started", value: "Not Started" },
                { label: "Overdue", value: "Overdue" },
                { label: "Exempt", value: "Exempt" },
              ]}
            />
          </div>

          {/* Result Status */}
          <div className="xl:col-span-2">
            <Select
              label="Result"
              value={resultFilter}
              onChange={(val) => {
                setResultFilter(val as typeof resultFilter);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Results", value: "All" },
                { label: "Pass", value: "Pass" },
                { label: "Fail", value: "Fail" },
                { label: "Pending", value: "Pending" },
                { label: "N/A", value: "N/A" },
              ]}
            />
          </div>

          {/* Department */}
          <div className="xl:col-span-4">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={(val) => {
                setDepartmentFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Departments", value: "All" },
                ...uniqueDepartments.map((d) => ({ label: d, value: d })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[60px]">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Employee ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Email
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Department
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Enrollment
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Score
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Result
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Attempts
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedEmployees.map((emp, index) => {
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={emp.userId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                      {rowNumber}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-mono text-slate-700">{emp.userId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.jobTitle}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 hidden lg:table-cell">
                      {emp.email}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700 hidden md:table-cell">
                      {emp.department}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          getEnrollmentColor(emp.enrollmentStatus)
                        )}
                      >
                        {emp.enrollmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap">
                      {emp.score !== null ? (
                        <span
                          className={cn(
                            "font-semibold",
                            emp.score >= info.passingScore
                              ? "text-emerald-700"
                              : "text-red-600"
                          )}
                        >
                          {emp.score}/{info.passingGradeType === "percentage" ? 100 : 10}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          getResultColor(emp.resultStatus)
                        )}
                      >
                        {emp.resultStatus === "Pass" && (
                          <UserCheck className="h-3 w-3" />
                        )}
                        {emp.resultStatus === "Fail" && (
                          <UserX className="h-3 w-3" />
                        )}
                        {emp.resultStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-700 hidden lg:table-cell">
                      {emp.attempts > 0 ? emp.attempts : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700 hidden xl:table-cell">
                      {formatDate(emp.completedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEmployees.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <TableEmptyState
            title="No Results Found"
            description="No employees match your current filters. Try adjusting your search or filter criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("All");
              setResultFilter("All");
              setDepartmentFilter("All");
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
