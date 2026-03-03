import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.constants";
import {
  Search,
  GraduationCap,
  Download,
  MoreVertical,
} from "lucide-react";
import { IconLayoutDashboard, IconInfoCircle, IconChecks } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { CourseApproval, CourseWorkflowStatus, TrainingMethod } from "../../../types";
import { MOCK_PENDING_APPROVAL } from "../mockData";

const getMethodConfig = (method: TrainingMethod) => {
  switch (method) {
    case "Read & Understood": return { label: "Read & Understood", className: "bg-slate-50 text-slate-700 border-slate-200" };
    case "Quiz (Paper-based/Manual)": return { label: "Quiz (Manual)", className: "bg-purple-50 text-purple-700 border-purple-200" };
    case "Hands-on/OJT":     return { label: "Hands-on / OJT",    className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
};

const getStatusColor = (status: CourseWorkflowStatus): string => {
  switch (status) {
    case "Draft":            return "bg-slate-100 text-slate-700 border-slate-200";
    case "Pending Review":   return "bg-amber-50 text-amber-700 border-amber-200";
    case "Pending Approval": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Approved":         return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Obsoleted":        return "bg-rose-50 text-rose-700 border-rose-200";
    case "Rejected":         return "bg-red-50 text-red-700 border-red-200";
    default:                 return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const METHOD_OPTIONS = [
  { label: "All Methods", value: "All" },
  { label: "Quiz (Paper-based/Manual)", value: "Quiz (Paper-based/Manual)" },
  { label: "Hands-on / OJT", value: "Hands-on/OJT" },
  { label: "Read & Understood", value: "Read & Understood" },
];

const INSTRUCTOR_OPTIONS = [
  { label: "All Instructors", value: "All" },
  { label: "Dr. Michael Chen", value: "Dr. Michael Chen" },
  { label: "Kevin Tran", value: "Kevin Tran" },
  { label: "Alice Pham", value: "Alice Pham" },
];

const DEPARTMENT_OPTIONS = [
  { label: "All Departments", value: "All" },
  { label: "Quality Assurance", value: "Quality Assurance" },
  { label: "QC Lab", value: "QC Lab" },
  { label: "HSE", value: "HSE" },
];

export const PendingApprovalView: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [instructorFilter, setInstructorFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return MOCK_PENDING_APPROVAL.filter((item) => {
      const matchesSearch =
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trainingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedDocument.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = methodFilter === "All" || item.trainingMethod === methodFilter;
      const matchesInstructor = instructorFilter === "All" || item.submittedBy === instructorFilter;
      const matchesDepartment = departmentFilter === "All" || item.department === departmentFilter;
      
      let matchesDateFrom = true;
      let matchesDateTo = true;
      if (dateFrom) {
        matchesDateFrom = new Date(item.submittedAt) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDateTo = new Date(item.submittedAt) <= new Date(dateTo);
      }
      
      return matchesSearch && matchesMethod && matchesInstructor && matchesDepartment && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, methodFilter, instructorFilter, departmentFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Action Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const menuHeight = 100;
      const menuWidth = 200;
      const safeMargin = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
      let top = shouldShowAbove ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4;
      const viewportWidth = window.innerWidth;
      let left = rect.right + window.scrollX - menuWidth;
      if (left + menuWidth > viewportWidth - safeMargin) {
        left = viewportWidth - menuWidth - safeMargin + window.scrollX;
      }
      if (left < safeMargin + window.scrollX) {
        left = safeMargin + window.scrollX;
      }
      setDropdownPosition({ top, left, showAbove: shouldShowAbove });
      setOpenDropdownId(id);
    }
  };

  const handleViewDetail = (id: string) => {
    navigate(`${ROUTES.TRAINING.PENDING_APPROVAL}/${id}`);
    setOpenDropdownId(null);
  };

  const handleApproveCourse = (id: string) => {
    navigate(`${ROUTES.TRAINING.PENDING_APPROVAL}/${id}`);
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Pending Approval
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Pending Approval</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            Cancel
          </Button>
          <Button
            onClick={() => console.log("Export pending approval")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 lg:gap-4 items-end">
          <div className="xl:col-span-4">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title, ID..."
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="xl:col-span-4">
            <Select
              label="Training Method"
              value={methodFilter}
              onChange={(val) => {
                setMethodFilter(val);
                setCurrentPage(1);
              }}
              options={METHOD_OPTIONS}
            />
          </div>
          <div className="xl:col-span-4">
            <Select
              label="Instructor"
              value={instructorFilter}
              onChange={(val) => {
                setInstructorFilter(val);
                setCurrentPage(1);
              }}
              options={INSTRUCTOR_OPTIONS}
            />
          </div>
          <div className="xl:col-span-4">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={(val) => {
                setDepartmentFilter(val);
                setCurrentPage(1);
              }}
              options={DEPARTMENT_OPTIONS}
            />
          </div>
          <div className="xl:col-span-4">
            <DateTimePicker
              label="From Date"
              value={dateFrom}
              onChange={(val) => {
                setDateFrom(val);
                setCurrentPage(1);
              }}
              placeholder="Select start date"
            />
          </div>
          <div className="xl:col-span-4">
            <DateTimePicker
              label="To Date"
              value={dateTo}
              onChange={(val) => {
                setDateTo(val);
                setCurrentPage(1);
              }}
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
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
                  Method
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Submitted By
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Submitted Date
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <TableEmptyState
                      title="No courses pending approval"
                      description="All courses have been approved or no courses match your filters."
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const methodCfg = getMethodConfig(item.trainingMethod);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleViewDetail(item.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-slate-900">{item.trainingId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-900">{item.courseTitle}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.relatedDocument}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          methodCfg.className
                        )}>
                          {methodCfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(item.approvalStatus)
                        )}>
                          {item.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        {item.submittedBy}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        {item.department}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        {new Date(item.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          onClick={(e) => handleDropdownToggle(item.id, e)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}
      </div>

      {/* Action Dropdown Portal */}
      {openDropdownId && createPortal(
        <>
          <div
            className="fixed inset-0 z-40 animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
            }}
            aria-hidden="true"
          />
          <div
            className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none'
            }}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetail(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">View Details</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveCourse(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <IconChecks className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Approve Course</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
