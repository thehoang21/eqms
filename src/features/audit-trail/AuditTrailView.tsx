import React, { useState, useMemo, useRef, createRef } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  MoreVertical,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { IconInfoCircle, IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { formatDateTime } from "@/utils/format";
import { FilterCard } from "@/components/ui/card/FilterCard";
import type { AuditTrailRecord, AuditAction, AuditModule } from "./types";
import { MOCK_AUDIT_RECORDS } from "./mockData";

// --- Helper Functions ---

// --- Dropdown Component ---
interface DropdownMenuProps {
  record: AuditTrailRecord;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  record,
  isOpen,
  onClose,
  position,
}) => {
  if (!isOpen) return null;

  const handleViewDetails = () => {
    console.log("View details:", record.id);
    onClose();
  };

  const handleExport = () => {
    console.log("Export entry:", record.id);
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: position.showAbove ? 'translateY(-100%)' : 'none'
        }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExport();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Export Entry</span>
          </button>
        </div>
      </div>
    </>,
    window.document.body
  );
};

// --- Main Component ---
export const AuditTrailView: React.FC = () => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<AuditModule | "All">("All");
  const [actionFilter, setActionFilter] = useState<AuditAction | "All">("All");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const buttonRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement | null> }>({});

  // Get button ref helper
  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Filter data
  const filteredData = useMemo(() => {
    return MOCK_AUDIT_RECORDS.filter((record) => {
      const matchesSearch =
        searchQuery === "" ||
        record.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModule = moduleFilter === "All" || record.module === moduleFilter;
      const matchesAction = actionFilter === "All" || record.action === actionFilter;
      const matchesUser =
        userFilter === "" ||
        record.user.toLowerCase().includes(userFilter.toLowerCase());

      // Date filtering
      let matchesDateFrom = true;
      let matchesDateTo = true;
      if (dateFrom) {
        matchesDateFrom = new Date(record.timestamp) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDateTo = new Date(record.timestamp) <= new Date(dateTo);
      }

      return (
        matchesSearch &&
        matchesModule &&
        matchesAction &&
        matchesUser &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    searchQuery,
    moduleFilter,
    actionFilter,
    userFilter,
    dateFrom,
    dateTo,
  ]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    moduleFilter,
    actionFilter,
    userFilter,
    dateFrom,
    dateTo,
  ]);

  // Handle dropdown toggle
  const handleDropdownToggle = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Menu dimensions
      const menuHeight = 200;
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

  // Module options
  const moduleOptions = [
    { label: "All Modules", value: "All" },
    { label: "Document", value: "Document" },
    { label: "Revision", value: "Revision" },
    { label: "User", value: "User" },
    { label: "Role", value: "Role" },
    { label: "CAPA", value: "CAPA" },
    { label: "Deviation", value: "Deviation" },
    { label: "Training", value: "Training" },
    { label: "Controlled Copy", value: "Controlled Copy" },
    { label: "System", value: "System" },
    { label: "Settings", value: "Settings" },
    { label: "Report", value: "Report" },
    { label: "Task", value: "Task" },
    { label: "Notification", value: "Notification" },
  ];

  // Action options
  const actionOptions = [
    { label: "All Actions", value: "All" },
    { label: "Create", value: "Create" },
    { label: "Update", value: "Update" },
    { label: "Delete", value: "Delete" },
    { label: "Approve", value: "Approve" },
    { label: "Reject", value: "Reject" },
    { label: "Review", value: "Review" },
    { label: "Publish", value: "Publish" },
    { label: "Archive", value: "Archive" },
    { label: "Restore", value: "Restore" },
    { label: "Login", value: "Login" },
    { label: "Logout", value: "Logout" },
    { label: "Export", value: "Export" },
    { label: "Download", value: "Download" },
    { label: "Upload", value: "Upload" },
    { label: "Assign", value: "Assign" },
    { label: "Unassign", value: "Unassign" },
    { label: "Enable", value: "Enable" },
    { label: "Disable", value: "Disable" },
  ];

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Audit Trail
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Audit Trail</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Export all")}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterCard>
        <FilterCard.Row>
          {/* Search */}
          <FilterCard.Item span={6} mdSpan={2}>
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by entity, user, or description..."
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </FilterCard.Item>

          {/* Module Filter */}
          <FilterCard.Item span={3}>
            <Select
              label="Module"
              value={moduleFilter}
              onChange={(value) => setModuleFilter(value as AuditModule | "All")}
              options={moduleOptions}
              placeholder="All Modules"
            />
          </FilterCard.Item>

          {/* Action Filter */}
          <FilterCard.Item span={3}>
            <Select
              label="Action"
              value={actionFilter}
              onChange={(value) => setActionFilter(value as AuditAction | "All")}
              options={actionOptions}
              placeholder="All Actions"
            />
          </FilterCard.Item>

          {/* Date From */}
          <FilterCard.Item span={3}>
            <DateTimePicker
              label="From Date"
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Start date"
            />
          </FilterCard.Item>

          {/* Date To */}
          <FilterCard.Item span={3}>
            <DateTimePicker
              label="To Date"
              value={dateTo}
              onChange={setDateTo}
              placeholder="End date"
            />
          </FilterCard.Item>
        </FilterCard.Row>
      </FilterCard>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        {paginatedData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      No.
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      User
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Module
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Action
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Entity
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Description
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      IP Address
                    </th>

                    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedData.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* No. */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                        {startItem + index}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                        {formatDateTime(record.timestamp)}
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {record.user}
                          </span>
                          <span className="text-xs text-slate-500">
                            {record.userId}
                          </span>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                          {record.module}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                          {record.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {record.entityId}
                          </span>
                          <span className="text-xs text-slate-500 max-w-[200px] truncate">
                            {record.entityName}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-sm text-slate-700 whitespace-nowrap">
                        {record.description}
                      </td>

                      {/* IP Address */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-mono">
                        {record.ipAddress}
                      </td>

                      {/* Action Column */}
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          ref={getButtonRef(record.id)}
                          onClick={(e) => handleDropdownToggle(record.id, e)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="More options"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        ) : (
          <TableEmptyState
            title="No Audit Records Found"
            description="We couldn't find any audit records matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setModuleFilter("All");
              setActionFilter("All");
              setUserFilter("");
              setDateFrom("");
              setDateTo("");
            }}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {openDropdownId &&
        paginatedData.find((r) => r.id === openDropdownId) && (
          <DropdownMenu
            record={paginatedData.find((r) => r.id === openDropdownId)!}
            isOpen={true}
            onClose={() => setOpenDropdownId(null)}
            position={dropdownPosition}
          />
        )}
    </div>
  );
};
