import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  GraduationCap,
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Award,
  Download,
} from "lucide-react";
import { IconSmartHome, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import {
  TrainingRecord,
  TrainingFilters,
  TrainingStatus,
  TrainingType,
  TrainingMethod,
} from "../types";

// Mock Data
const MOCK_TRAININGS: TrainingRecord[] = [
  {
    id: "1",
    trainingId: "TRN-2026-001",
    title: "GMP Basic Principles",
    description: "Introduction to Good Manufacturing Practices",
    type: "GMP",
    trainingMethod: "Theory Quiz",
    status: "In-Progress",
    instructor: "John Smith",
    scheduledDate: "2026-02-15",
    duration: 4,
    location: "Training Room A",
    capacity: 30,
    enrolled: 25,
    department: "Quality Assurance",
    mandatory: true,
    passScore: 80,
    createdBy: "Admin",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-20",
  },
  {
    id: "2",
    trainingId: "TRN-2026-002",
    title: "Cleanroom Qualification",
    description: "Training on cleanroom operations and aseptic techniques",
    type: "Technical",
    trainingMethod: "Hands-on/OJT",
    status: "Scheduled",
    instructor: "Sarah Johnson",
    scheduledDate: "2026-01-26",
    duration: 3,
    location: "Cleanroom B",
    capacity: 20,
    enrolled: 20,
    department: "Quality Assurance",
    mandatory: true,
    passScore: 85,
    createdBy: "QA Manager",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-25",
  },
  {
    id: "3",
    trainingId: "TRN-2026-003",
    title: "HPLC Operation Advanced",
    description: "Advanced techniques for HPLC operation and troubleshooting",
    type: "Technical",
    trainingMethod: "Hands-on/OJT",
    status: "Completed",
    instructor: "Dr. Michael Chen",
    scheduledDate: "2026-01-20",
    duration: 6,
    location: "Laboratory 2",
    capacity: 15,
    enrolled: 14,
    department: "QC Lab",
    mandatory: false,
    passScore: 75,
    createdBy: "Lab Supervisor",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-21",
  },
  {
    id: "4",
    trainingId: "TRN-2026-004",
    title: "ISO 9001:2015 Requirements",
    description:
      "Understanding ISO 9001 quality management system requirements",
    type: "Compliance",
    trainingMethod: "Read & Understood",
    status: "Scheduled",
    instructor: "Emma Wilson",
    scheduledDate: "2026-03-01",
    duration: 8,
    location: "Conference Hall",
    capacity: 40,
    enrolled: 15,
    department: "All Departments",
    mandatory: false,
    passScore: 70,
    createdBy: "QA Director",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-23",
  },
  {
    id: "5",
    trainingId: "TRN-2026-005",
    title: "SOP Review & Update Procedures",
    description: "Training on proper SOP review and revision processes",
    type: "SOP",
    trainingMethod: "Read & Understood",
    status: "Overdue",
    instructor: "David Brown",
    scheduledDate: "2026-01-10",
    duration: 2,
    location: "Meeting Room 3",
    capacity: 25,
    enrolled: 18,
    department: "Documentation",
    mandatory: true,
    passScore: 80,
    createdBy: "Doc Control",
    createdAt: "2025-12-20",
    updatedAt: "2026-01-05",
  },
];

export const CourseListView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState<TrainingFilters>({
    searchQuery: "",
    typeFilter: "All",
    statusFilter: "All",
    dateFrom: "",
    dateTo: "",
  });
  const [methodFilter, setMethodFilter] = useState<TrainingMethod | "All">("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Options
  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "GMP", value: "GMP" },
    { label: "Technical", value: "Technical" },
    { label: "Compliance", value: "Compliance" },
    { label: "SOP", value: "SOP" },
    { label: "Safety", value: "Safety" },
  ];

  const methodOptions = [
    { label: "All Methods", value: "All" },
    { label: "Read & Understood", value: "Read & Understood" },
    { label: "Theory Quiz", value: "Theory Quiz" },
    { label: "Hands-on / OJT", value: "Hands-on/OJT" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Overdue", value: "Overdue" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_TRAININGS.filter((training) => {
      const matchesSearch =
        training.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        training.trainingId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        training.instructor.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || training.type === filters.typeFilter;
      const matchesStatus = filters.statusFilter === "All" || training.status === filters.statusFilter;
      const matchesMethod = methodFilter === "All" || training.trainingMethod === methodFilter;
      
      let matchesDateFrom = true;
      let matchesDateTo = true;
      
      if (filters.dateFrom) {
        matchesDateFrom = new Date(training.scheduledDate) >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        matchesDateTo = new Date(training.scheduledDate) <= new Date(filters.dateTo);
      }

      return matchesSearch && matchesType && matchesStatus && matchesMethod && matchesDateFrom && matchesDateTo;
    });
  }, [filters, methodFilter]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: TrainingStatus): string => {
    switch (status) {
      case "Scheduled":   return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "In-Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":   return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Overdue":     return "bg-red-50 text-red-700 border-red-200";
      case "Cancelled":   return "bg-slate-50 text-slate-700 border-slate-200";
      default:            return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getMethodConfig = (method: TrainingMethod) => {
    switch (method) {
      case "Read & Understood": return { label: "Read & Understood", className: "bg-slate-50 text-slate-700 border-slate-200", icon: "📄" };
      case "Theory Quiz":       return { label: "Theory Quiz",       className: "bg-purple-50 text-purple-700 border-purple-200", icon: "📝" };
      case "Hands-on/OJT":     return { label: "Hands-on / OJT",    className: "bg-amber-50 text-amber-700 border-amber-200",  icon: "🔧" };
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Courses List
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Courses List</span>
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
            onClick={() => navigate("/training-management/courses/create")}
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <IconPlus className="h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        {/* Row 1: Search + Type */}
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
                placeholder="Search by title, ID, or instructor..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Training Type */}
          <div className="xl:col-span-3">
            <Select
              label="Training Type"
              value={filters.typeFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, typeFilter: val as TrainingType | "All" }))
              }
              options={typeOptions}
            />
          </div>
        </div>

        {/* Row 2: Method + Status + Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end mt-4">
          {/* Training Method */}
          <div>
            <Select
              label="Training Method"
              value={methodFilter}
              onChange={(val) => setMethodFilter(val as TrainingMethod | "All")}
              options={methodOptions}
            />
          </div>

          {/* Status */}
          <div>
            <Select
              label="Status"
              value={filters.statusFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, statusFilter: val as TrainingStatus | "All" }))
              }
              options={statusOptions}
            />
          </div>

          {/* Date From */}
          <div>
            <DateTimePicker
              label="From Date"
              value={filters.dateFrom}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, dateFrom: val }))
              }
              placeholder="Select start date"
            />
          </div>

          {/* Date To */}
          <div>
            <DateTimePicker
              label="To Date"
              value={filters.dateTo}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, dateTo: val }))
              }
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Scheduled</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.filter((t) => t.status === "Scheduled").length}
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
              <p className="text-xs text-slate-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.filter((t) => t.status === "In-Progress").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.filter((t) => t.status === "Overdue").length}
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
                  Method
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Instructor
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Scheduled Date
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Enrolled
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((training, index) => (
                <tr
                  key={training.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => console.log("View training:", training.id)}
                >
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-medium text-slate-900">
                      {training.trainingId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {training.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {training.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                      {training.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    {training.trainingMethod && (() => {
                      const cfg = getMethodConfig(training.trainingMethod);
                      return (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          cfg.className
                        )}>
                          <span>{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(training.status)
                    )}>
                      {training.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {training.instructor}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {new Date(training.scheduledDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900 font-medium">
                        {training.enrolled}/{training.capacity}
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
              ))}
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
            title="No Training Records Found"
            description="We couldn't find any training records matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({
                searchQuery: "",
                typeFilter: "All",
                statusFilter: "All",
                dateFrom: "",
                dateTo: "",
              });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
