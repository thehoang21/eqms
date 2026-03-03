import React, { useState, useMemo, useRef, createRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import {
  Search,
  MoreVertical,
  FileText,
  Download,
  Eye,
  X,
} from "lucide-react";
import { IconInfoCircle, IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateRangePicker } from "@/components/ui/datetime-picker/DateRangePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { formatDateTime } from "@/utils/format";
import { FilterCard } from "@/components/ui/card/FilterCard";
import type { AuditTrailRecord, AuditAction, AuditModule } from "./types";
import { MOCK_AUDIT_RECORDS } from "./mockData";
import { AuditTrailDetailView } from "./AuditTrailDetailView";

// --- Helper Functions ---

// --- Export Modal Component ---
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AuditTrailRecord;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(record, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-trail-${record.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("PDF export not implemented yet");
    onClose();
  };

  const handleExportText = () => {
    const text = `
Audit Trail Record
==================
ID: ${record.id}
Timestamp: ${formatDateTime(record.timestamp)}
User: ${record.user} (${record.userId})
IP Address: ${record.ipAddress}
Device: ${record.device || "Not recorded"}
Module: ${record.module}
Action: ${record.action}
Entity: ${record.entityName} (${record.entityId})
Description: ${record.description}

${
      record.changes && record.changes.length > 0
        ? `Changes:\n${record.changes.map((c) => `- ${c.field}: "${c.oldValue}" → "${c.newValue}"`).join("\n")}`
        : ""
    }

${
      record.metadata && Object.keys(record.metadata).length > 0
        ? `Metadata:\n${Object.entries(record.metadata)
            .map(([k, v]) => `- ${k}: ${v}`)
            .join("\n")}`
        : ""
    }
    `.trim();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-trail-${record.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Export Audit Record</h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-slate-600 mb-4">
              Select export format for audit record <span className="font-mono font-medium text-slate-900">{record.id}</span>
            </p>
            <div className="space-y-2">
              <button
                onClick={handleExportJSON}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-xs text-slate-500">Structured data format</div>
                </div>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Export as PDF</div>
                  <div className="text-xs text-slate-500">Printable document format</div>
                </div>
              </button>
              <button
                onClick={handleExportText}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Export as TXT</div>
                  <div className="text-xs text-slate-500">Plain text format</div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// --- Dropdown Component ---
interface DropdownMenuProps {
  record: AuditTrailRecord;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onExport: () => void;
  position: { top: number; left: number; showAbove?: boolean };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  record,
  isOpen,
  onClose,
  onViewDetails,
  onExport,
  position,
}) => {
  if (!isOpen) return null;

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
              onViewDetails();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Export</span>
          </button>
        </div>
      </div>
    </>,
    window.document.body
  );
};

// --- Main Component ---
export const AuditTrailView: React.FC = () => {
  const location = useLocation();

  // View state
  const [selectedRecord, setSelectedRecord] = useState<AuditTrailRecord | null>(null);

  // Reset to list view when user navigates to this page from sidebar
  useEffect(() => {
    setSelectedRecord(null);
  }, [location.key]);
  
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

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportingRecord, setExportingRecord] = useState<AuditTrailRecord | null>(null);

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

      // Date filtering (DateRangePicker outputs dd/MM/yyyy format)
      let matchesDateFrom = true;
      let matchesDateTo = true;
      if (dateFrom) {
        const parts = dateFrom.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (parts) {
          const from = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
          matchesDateFrom = new Date(record.timestamp) >= from;
        }
      }
      if (dateTo) {
        const parts = dateTo.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (parts) {
          const to = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 23, 59, 59);
          matchesDateTo = new Date(record.timestamp) <= to;
        }
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

  // Show detail view if a record is selected
  if (selectedRecord) {
    return (
      <AuditTrailDetailView
        record={selectedRecord}
        onBack={() => {
          document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'instant' });
          setSelectedRecord(null);
        }}
      />
    );
  }

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
          <FilterCard.Item span={3}>
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

          {/* Timestamp Date Range */}
          <FilterCard.Item span={3}>
            <DateRangePicker
              label="Timestamp Date Range"
              startDate={dateFrom}
              endDate={dateTo}
              onStartDateChange={setDateFrom}
              onEndDateChange={setDateTo}
              placeholder="Select date range"
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
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Device
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
                          <span className="text-xs text-slate-500">
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

                      {/* Device */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-mono">
                        {record.device || "-"}
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
            onViewDetails={() => {
              const record = paginatedData.find((r) => r.id === openDropdownId);
              if (record) {
                document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'instant' });
                setSelectedRecord(record);
                setOpenDropdownId(null);
              }
            }}
            onExport={() => {
              const record = paginatedData.find((r) => r.id === openDropdownId);
              if (record) {
                setExportingRecord(record);
                setIsExportModalOpen(true);
                setOpenDropdownId(null);
              }
            }}
            position={dropdownPosition}
          />
        )}

      {/* Export Modal */}
      {exportingRecord && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => {
            setIsExportModalOpen(false);
            setExportingRecord(null);
          }}
          record={exportingRecord}
        />
      )}
    </div>
  );
};
