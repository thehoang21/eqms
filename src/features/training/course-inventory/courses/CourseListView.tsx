import React, { useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.constants";
import {
  Search,
  GraduationCap,
  Users,
  Edit,
  Download,
  ClipboardList,
  BarChart3,
  MoreVertical,
} from "lucide-react";
import { IconInfoCircle, IconEyeCheck, IconChecks, IconPlus } from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page/PageHeader";
import { coursesList } from "@/components/ui/breadcrumb/breadcrumbs.config";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { formatDate } from "@/utils/format";
import { getStatusColorClass } from "@/utils/status";
import {
  TrainingRecord,
  TrainingFilters,
  TrainingStatus,
  TrainingType,
  TrainingMethod,
} from "../../types";
import { MOCK_TRAININGS } from "./mockData";

// ── Local Dropdown ────────────────────────────────────────────────
interface CourseDropdownMenuProps {
  training: TrainingRecord;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
  navigate: ReturnType<typeof useNavigate>;
}

const CourseDropdownMenu: React.FC<CourseDropdownMenuProps> = ({
  training,
  isOpen,
  onClose,
  position,
  navigate,
}) => {
  if (!isOpen) return null;

  type MenuItem =
    | { isDivider: true }
    | { isDivider?: false; icon: React.ElementType; label: string; onClick: () => void; color?: string };

  const menuItems: MenuItem[] = [
    { icon: IconInfoCircle, label: "View Detail",   onClick: () => { navigate(ROUTES.TRAINING.COURSE_DETAIL(training.id)); onClose(); }, color: "text-slate-500" },
    { icon: Edit,           label: "Edit Course",   onClick: () => { navigate(ROUTES.TRAINING.COURSE_EDIT(training.id)); onClose(); },   color: "text-slate-500" },
    { icon: ClipboardList,  label: "Result Entry",  onClick: () => { navigate(ROUTES.TRAINING.COURSE_RESULT_ENTRY(training.id)); onClose(); }, color: "text-slate-500" },
    { icon: BarChart3,      label: "View Progress", onClick: () => { navigate(ROUTES.TRAINING.COURSE_PROGRESS(training.id)); onClose(); },           color: "text-slate-500" },
    ...(training.status === "Pending Review"  ? [{ icon: IconEyeCheck, label: "Review Course",  onClick: () => { navigate(ROUTES.TRAINING.APPROVAL_DETAIL(training.id)); onClose(); }, color: "text-slate-500" } as MenuItem] : []),
    ...(training.status === "Pending Approval" ? [{ icon: IconChecks,   label: "Approve Course", onClick: () => { navigate(ROUTES.TRAINING.APPROVE_DETAIL(training.id)); onClose(); },  color: "text-slate-500" } as MenuItem] : []),
    { isDivider: true },
    { icon: Download, label: "Export PDF", onClick: () => { console.log("Export PDF:", training.id); onClose(); }, color: "text-slate-500" },
  ];

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-hidden="true"
      />
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: `${position.top}px`, left: `${position.left}px`, transform: position.showAbove ? "translateY(-100%)" : "none" }}
      >
        <div className="py-1">
          {menuItems.map((item, i) => {
            if ("isDivider" in item && item.isDivider) {
              return <div key={i} className="my-1 border-t border-slate-100" />;
            }
            const mi = item as Exclude<MenuItem, { isDivider: true }>;
            const Icon = mi.icon;
            return (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); mi.onClick(); }}
                className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors", mi.color)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{mi.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>,
    window.document.body
  );
};

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

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement | null>>>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) { setOpenDropdownId(null); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 200; const menuWidth = 200; const safeMargin = 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldShowAbove = spaceBelow < menuHeight && rect.top > menuHeight;
    const top = shouldShowAbove ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - menuWidth;
    left = Math.max(safeMargin, Math.min(left, window.innerWidth - menuWidth - safeMargin));
    setDropdownPosition({ top, left, showAbove: shouldShowAbove });
    setOpenDropdownId(id);
  };

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

  const getMethodConfig = (method: TrainingMethod) => {
    switch (method) {
      case "Read & Understood": return { label: "Read & Understood", className: "bg-slate-50 text-slate-700 border-slate-200" };
      case "Quiz (Paper-based/Manual)": return { label: "Quiz (Manual)", className: "bg-purple-50 text-purple-700 border-purple-200" };
      case "Hands-on/OJT":     return { label: "Hands-on / OJT",    className: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <PageHeader
        title="Courses List"
        breadcrumbItems={coursesList(navigate)}
        actions={
          <>
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
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 transition-colors"
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
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-[1] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="font-medium text-slate-900">
                      {training.trainingId}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {training.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                          {training.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                      {training.type}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    {training.trainingMethod && (() => {
                      const cfg = getMethodConfig(training.trainingMethod);
                      return (
                        <span className={cn(
                          "inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border",
                          cfg.className
                        )}>
                          {cfg.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border",
                      getStatusColorClass(training.status)
                    )}>
                      {training.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                    {training.instructor}
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                    {formatDate(training.scheduledDate)}
                  </td>
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                      <span className="text-slate-900 font-medium">
                        {training.enrolled}/{training.capacity}
                      </span>
                    </div>
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      ref={getButtonRef(training.id)}
                      onClick={(e) => handleDropdownToggle(training.id, e)}
                      className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                    </button>
                    <CourseDropdownMenu
                      training={training}
                      isOpen={openDropdownId === training.id}
                      onClose={() => setOpenDropdownId(null)}
                      position={dropdownPosition}
                      navigate={navigate}
                    />
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

    </div>
  );
};
