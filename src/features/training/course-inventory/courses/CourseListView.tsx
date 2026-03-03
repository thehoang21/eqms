import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.constants";
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
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { IconLayoutDashboard, IconPlus, IconInfoCircle, IconEyeCheck, IconChecks } from "@tabler/icons-react";
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
} from "../../types";
import { MOCK_TRAININGS } from "./mockData";

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
    { label: "Quiz (Paper-based/Manual)", value: "Quiz (Paper-based/Manual)" },
    { label: "Hands-on / OJT", value: "Hands-on/OJT" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Draft", value: "Draft" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Approved", value: "Approved" },
    { label: "Obsoleted", value: "Obsoleted" },
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
      case "Draft":            return "bg-slate-100 text-slate-700 border-slate-200";
      case "Pending Review":   return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending Approval": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Approved":         return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Obsoleted":        return "bg-rose-50 text-rose-700 border-rose-200";
      default:                 return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getMethodConfig = (method: TrainingMethod) => {
    switch (method) {
      case "Read & Understood": return { label: "Read & Understood", className: "bg-slate-50 text-slate-700 border-slate-200" };
      case "Quiz (Paper-based/Manual)": return { label: "Quiz (Manual)", className: "bg-purple-50 text-purple-700 border-purple-200" };
      case "Hands-on/OJT":     return { label: "Hands-on / OJT",    className: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  // Action Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Menu dimensions (varies by content, estimate max)
      const menuHeight = 220;
      const menuWidth = 200;
      const safeMargin = 8;
      
      // Check available space
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Show above if not enough space below AND there's more space above
      const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
      
      // Calculate vertical position
      let top: number;
      if (shouldShowAbove) {
        top = rect.top + window.scrollY - 4;
      } else {
        top = rect.bottom + window.scrollY + 4;
      }
      
      // Calculate horizontal position with safe margins
      const viewportWidth = window.innerWidth;
      let left = rect.right + window.scrollX - menuWidth;
      
      // Ensure menu doesn't overflow right edge
      if (left + menuWidth > viewportWidth - safeMargin) {
        left = viewportWidth - menuWidth - safeMargin + window.scrollX;
      }
      
      // Ensure menu doesn't overflow left edge
      if (left < safeMargin + window.scrollX) {
        left = safeMargin + window.scrollX;
      }
      
      setDropdownPosition({ top, left, showAbove: shouldShowAbove });
      setOpenDropdownId(id);
    }
  };

  const handleViewCourse = (id: string) => {
    navigate(ROUTES.TRAINING.COURSE_DETAIL(id));
    setOpenDropdownId(null);
  };

  const handleEditCourse = (id: string) => {
    navigate(ROUTES.TRAINING.COURSE_EDIT(id));
    setOpenDropdownId(null);
  };

  const handleResultEntry = (id: string) => {
    navigate(ROUTES.TRAINING.COURSE_RESULT_ENTRY(id));
    setOpenDropdownId(null);
  };

  const handleViewProgress = (id: string) => {
    navigate(ROUTES.TRAINING.COURSE_PROGRESS(id));
    setOpenDropdownId(null);
  };

  const handleReviewCourse = (id: string) => {
    navigate(ROUTES.TRAINING.APPROVAL_DETAIL(id));
    setOpenDropdownId(null);
  };

  const handleApproveCourse = (id: string) => {
    navigate(ROUTES.TRAINING.APPROVE_DETAIL(id));
    setOpenDropdownId(null);
  };

  const handleExportPDF = (id: string) => {
    console.log("Export PDF:", id);
    setOpenDropdownId(null);
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
            <IconLayoutDashboard className="h-4 w-4" />
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
            onClick={() => navigate(ROUTES.TRAINING.COURSES_CREATE)}
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
        {/* Row 1: Search + Type + Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
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
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Training Type */}
          <div>
            <Select
              label="Training Type"
              value={filters.typeFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, typeFilter: val as TrainingType | "All" }))
              }
              options={typeOptions}
            />
          </div>

          {/* Training Method */}
          <div>
            <Select
              label="Training Method"
              value={methodFilter}
              onChange={(val) => setMethodFilter(val as TrainingMethod | "All")}
              options={methodOptions}
            />
          </div>
        </div>

        {/* Row 2: Status + Date From + Date To */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">
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
                  Course ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course Name
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
                  onClick={() => navigate(ROUTES.TRAINING.COURSE_DETAIL(training.id))}
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
                      onClick={(e) => handleDropdownToggle(training.id, e)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Actions"
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
              setMethodFilter("All");
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Action Dropdown Portal */}
      {openDropdownId && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
            }}
            aria-hidden="true"
          />
          {/* Menu */}
          <div
            className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none'
            }}
          >
            {(() => {
              const currentTraining = MOCK_TRAININGS.find(t => t.id === openDropdownId);
              const isPendingReview = currentTraining?.status === "Pending Review";
              const isPendingApproval = currentTraining?.status === "Pending Approval";

              return (
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourse(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                  >
                    <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">View Detail Course</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                  >
                    <Edit className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Edit Course</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResultEntry(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                  >
                    <ClipboardList className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Result Entry</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProgress(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                  >
                    <BarChart3 className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">View Progress</span>
                  </button>
                  {isPendingReview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewCourse(openDropdownId);
                        setOpenDropdownId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                    >
                      <IconEyeCheck className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Review Course</span>
                    </button>
                  )}
                  {isPendingApproval && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveCourse(openDropdownId);
                        setOpenDropdownId(null);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                    >
                      <IconChecks className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Approve Course</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportPDF(openDropdownId);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                  >
                    <Download className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Export PDF</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
