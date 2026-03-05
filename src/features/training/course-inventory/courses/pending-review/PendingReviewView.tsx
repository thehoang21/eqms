import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.constants";
import {
  Search,
  GraduationCap,
  Users,
  Download,
  MoreVertical,
} from "lucide-react";
import { IconInfoCircle, IconEyeCheck } from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page/PageHeader";
import { coursePendingReview } from "@/components/ui/breadcrumb/breadcrumbs.config";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { CourseApproval, CourseWorkflowStatus, TrainingMethod, TrainingType } from "../../../types";
import { MOCK_PENDING_REVIEWS as MOCK_APPROVALS } from "../mockData";

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

// --- Constants ---
const TYPE_OPTIONS = [
  { label: "All Types", value: "All" },
  { label: "GMP", value: "GMP" },
  { label: "Technical", value: "Technical" },
  { label: "Compliance", value: "Compliance" },
  { label: "SOP", value: "SOP" },
  { label: "Safety", value: "Safety" },
];

const METHOD_OPTIONS = [
  { label: "All Methods", value: "All" },
  { label: "Quiz (Paper-based/Manual)", value: "Quiz (Paper-based/Manual)" },
  { label: "Hands-on / OJT", value: "Hands-on/OJT" },
  { label: "Read & Understood", value: "Read & Understood" },
];

// --- Component ---
export const PendingReviewView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered data
  const filteredData = useMemo(() => {
    return MOCK_APPROVALS.filter((item) => {
      const matchesSearch =
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trainingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.instructor || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All" || item.trainingType === typeFilter;
      const matchesMethod = methodFilter === "All" || item.trainingMethod === methodFilter;
      
      let matchesDateFrom = true;
      let matchesDateTo = true;
      if (dateFrom) {
        matchesDateFrom = new Date(item.scheduledDate || item.submittedAt) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDateTo = new Date(item.scheduledDate || item.submittedAt) <= new Date(dateTo);
      }
      
      return matchesSearch && matchesType && matchesMethod && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, typeFilter, methodFilter, dateFrom, dateTo]);

  // Pagination
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
    navigate(ROUTES.TRAINING.APPROVAL_DETAIL(id));
    setOpenDropdownId(null);
  };

  const handleReviewCourse = (id: string) => {
    navigate(ROUTES.TRAINING.APPROVAL_DETAIL(id));
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <PageHeader
        title="Pending Review"
        breadcrumbItems={coursePendingReview(navigate)}
        actions={
          <>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              Cancel
            </Button>
            <Button
              onClick={() => console.log("Export pending review")}
              variant="outline"
              size="sm"
              className="whitespace-nowrap gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        }
      />

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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 transition-colors"
              />
            </div>
          </div>

          {/* Training Type */}
          <div>
            <Select
              label="Training Type"
              value={typeFilter}
              onChange={(val) => {
                setTypeFilter(val);
                setCurrentPage(1);
              }}
              options={TYPE_OPTIONS}
            />
          </div>

          {/* Training Method */}
          <div>
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
        </div>

        {/* Row 2: Status + Date From + Date To */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">
          {/* Status (readonly) */}
          <div>
            <Select
              label="Status"
              value="Pending Review"
              onChange={() => {}}
              options={[{ label: "Pending Review", value: "Pending Review" }]}
              disabled
            />
          </div>

          {/* Date From */}
          <div>
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

          {/* Date To */}
          <div>
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
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-10 sm:w-[60px]">
                  No.
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course ID
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course Name
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Method
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Instructor
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Scheduled Date
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Enrolled
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <TableEmptyState
                      title="No approvals found"
                      description="No course approvals match your current filters."
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
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                        {rowNumber}
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        <span className="font-medium text-slate-900">{item.trainingId}</span>
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-start gap-1.5 sm:gap-2">
                          <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-900">{item.courseTitle}</p>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{item.relatedDocument}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        {item.trainingType && (
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                            {item.trainingType}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border",
                          methodCfg.className
                        )}>
                          {methodCfg.label}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border",
                          getStatusColor(item.approvalStatus)
                        )}>
                          {item.approvalStatus}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                        {item.instructor || "—"}
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                        {new Date(item.scheduledDate || item.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                          <span className="text-slate-900 font-medium">
                            {item.enrolled ?? 0}/{item.capacity ?? 0}
                          </span>
                        </div>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          onClick={(e) => handleDropdownToggle(item.id, e)}
                          className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                  handleReviewCourse(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <IconEyeCheck className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Review Course</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
