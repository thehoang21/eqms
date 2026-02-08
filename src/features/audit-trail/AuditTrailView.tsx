import React, { useState, useMemo, useRef, createRef } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  MoreVertical,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import type { AuditTrailRecord, AuditAction, AuditModule } from "./types";

// --- Mock Data ---
const MOCK_AUDIT_RECORDS: AuditTrailRecord[] = [
  {
    id: "1",
    timestamp: "2026-02-03T14:32:18Z",
    user: "Dr. Sarah Johnson",
    userId: "USR001",
    module: "Document",
    action: "Approve",
    entityId: "SOP.0001.03",
    entityName: "Quality Control Testing SOP",
    description: "Approved document for publication",
    ipAddress: "192.168.1.45",
    severity: "High",
    changes: [
      { field: "status", oldValue: "Pending Approval", newValue: "Approved" },
      { field: "approvedBy", oldValue: "", newValue: "Dr. Sarah Johnson" },
    ],
  },
  {
    id: "2",
    timestamp: "2026-02-03T13:15:42Z",
    user: "John Smith",
    userId: "USR005",
    module: "User",
    action: "Create",
    entityId: "USR025",
    entityName: "Jane Doe",
    description: "Created new user account with QA Manager role",
    ipAddress: "192.168.1.12",
    severity: "Medium",
    changes: [
      { field: "role", oldValue: "", newValue: "QA Manager" },
      { field: "department", oldValue: "", newValue: "Quality Assurance" },
    ],
  },
  {
    id: "3",
    timestamp: "2026-02-03T12:48:03Z",
    user: "Michael Chen",
    userId: "USR003",
    module: "CAPA",
    action: "Update",
    entityId: "CAPA-2026-001",
    entityName: "Temperature Excursion Investigation",
    description: "Updated root cause analysis findings",
    ipAddress: "192.168.1.89",
    severity: "High",
    changes: [
      { field: "rootCause", oldValue: "Unknown", newValue: "Sensor calibration drift" },
      { field: "status", oldValue: "Investigation", newValue: "Action Plan" },
    ],
  },
  {
    id: "4",
    timestamp: "2026-02-03T11:22:56Z",
    user: "Emily Rodriguez",
    userId: "USR008",
    module: "Deviation",
    action: "Create",
    entityId: "DEV-2026-012",
    entityName: "OOS Result - Batch #2024-112",
    description: "Created deviation for out-of-specification test result",
    ipAddress: "192.168.1.67",
    severity: "Critical",
  },
  {
    id: "5",
    timestamp: "2026-02-03T10:55:31Z",
    user: "Admin User",
    userId: "USR001",
    module: "System",
    action: "Login",
    entityId: "SESSION-2026-0203-001",
    entityName: "System Login",
    description: "User logged into the system",
    ipAddress: "192.168.1.45",
    severity: "Low",
  },
  {
    id: "6",
    timestamp: "2026-02-03T10:15:22Z",
    user: "Dr. Sarah Johnson",
    userId: "USR001",
    module: "Document",
    action: "Download",
    entityId: "SOP.0012.04",
    entityName: "Batch Production Record Procedure",
    description: "Downloaded document PDF",
    ipAddress: "192.168.1.45",
    severity: "Low",
  },
  {
    id: "7",
    timestamp: "2026-02-03T09:43:17Z",
    user: "Robert Lee",
    userId: "USR012",
    module: "Training",
    action: "Assign",
    entityId: "TRN-2026-055",
    entityName: "GMP Annual Refresher",
    description: "Assigned training to 15 employees",
    ipAddress: "192.168.1.23",
    severity: "Medium",
  },
  {
    id: "8",
    timestamp: "2026-02-03T09:12:48Z",
    user: "Michael Chen",
    userId: "USR003",
    module: "CAPA",
    action: "Delete",
    entityId: "CAPA-2026-999",
    entityName: "Duplicate CAPA Entry",
    description: "Deleted duplicate CAPA record",
    ipAddress: "192.168.1.89",
    severity: "Medium",
  },
  {
    id: "9",
    timestamp: "2026-02-02T18:45:33Z",
    user: "Jane Doe",
    userId: "USR025",
    module: "Document",
    action: "Review",
    entityId: "SOP.0015.02",
    entityName: "Environmental Monitoring Plan",
    description: "Completed technical review",
    ipAddress: "192.168.1.56",
    severity: "Medium",
    changes: [
      { field: "status", oldValue: "Pending Review", newValue: "Review Complete" },
    ],
  },
  {
    id: "10",
    timestamp: "2026-02-02T16:32:11Z",
    user: "Admin User",
    userId: "USR001",
    module: "Settings",
    action: "Update",
    entityId: "SYS-CONFIG-001",
    entityName: "System Configuration",
    description: "Updated password policy settings",
    ipAddress: "192.168.1.45",
    severity: "High",
    changes: [
      { field: "minPasswordLength", oldValue: "8", newValue: "12" },
      { field: "passwordExpiry", oldValue: "90", newValue: "60" },
    ],
  },
  {
    id: "11",
    timestamp: "2026-02-02T15:18:44Z",
    user: "Emily Rodriguez",
    userId: "USR008",
    module: "Controlled Copy",
    action: "Create",
    entityId: "CC-2026-045",
    entityName: "Controlled Copy Request - Manufacturing Floor",
    description: "Requested controlled copy for production area",
    ipAddress: "192.168.1.67",
    severity: "Low",
  },
  {
    id: "12",
    timestamp: "2026-02-02T14:05:29Z",
    user: "David Park",
    userId: "USR015",
    module: "Deviation",
    action: "Approve",
    entityId: "DEV-2026-008",
    entityName: "Equipment Malfunction - Line 3",
    description: "Approved deviation closure",
    ipAddress: "192.168.1.78",
    severity: "High",
  },
  {
    id: "13",
    timestamp: "2026-02-02T13:42:55Z",
    user: "John Smith",
    userId: "USR005",
    module: "User",
    action: "Disable",
    entityId: "USR099",
    entityName: "Former Employee",
    description: "Disabled user account",
    ipAddress: "192.168.1.12",
    severity: "Medium",
  },
  {
    id: "14",
    timestamp: "2026-02-02T12:28:37Z",
    user: "Dr. Sarah Johnson",
    userId: "USR001",
    module: "Report",
    action: "Export",
    entityId: "RPT-2026-Q1-001",
    entityName: "Quarterly Quality Metrics Report",
    description: "Exported report to Excel",
    ipAddress: "192.168.1.45",
    severity: "Low",
  },
  {
    id: "15",
    timestamp: "2026-02-02T11:15:22Z",
    user: "Michael Chen",
    userId: "USR003",
    module: "Document",
    action: "Archive",
    entityId: "SOP.0008.01",
    entityName: "Obsolete Cleaning Procedure",
    description: "Archived obsolete document",
    ipAddress: "192.168.1.89",
    severity: "Medium",
  },
  {
    id: "16",
    timestamp: "2026-02-02T10:47:13Z",
    user: "Robert Lee",
    userId: "USR012",
    module: "Task",
    action: "Assign",
    entityId: "TSK-2026-089",
    entityName: "Annual Equipment Calibration",
    description: "Assigned task to maintenance team",
    ipAddress: "192.168.1.23",
    severity: "Low",
  },
  {
    id: "17",
    timestamp: "2026-02-01T17:33:48Z",
    user: "Jane Doe",
    userId: "USR025",
    module: "CAPA",
    action: "Approve",
    entityId: "CAPA-2025-098",
    entityName: "Packaging Material Specification Update",
    description: "Approved CAPA effectiveness verification",
    ipAddress: "192.168.1.56",
    severity: "High",
  },
  {
    id: "18",
    timestamp: "2026-02-01T16:12:35Z",
    user: "Emily Rodriguez",
    userId: "USR008",
    module: "Notification",
    action: "Create",
    entityId: "NOT-2026-234",
    entityName: "System Maintenance Notification",
    description: "Created notification for scheduled maintenance",
    ipAddress: "192.168.1.67",
    severity: "Low",
  },
  {
    id: "19",
    timestamp: "2026-02-01T14:55:29Z",
    user: "David Park",
    userId: "USR015",
    module: "Document",
    action: "Publish",
    entityId: "POL.0012.01",
    entityName: "Data Integrity Policy",
    description: "Published policy to all users",
    ipAddress: "192.168.1.78",
    severity: "Critical",
  },
  {
    id: "20",
    timestamp: "2026-02-01T13:28:17Z",
    user: "Admin User",
    userId: "USR001",
    module: "System",
    action: "Logout",
    entityId: "SESSION-2026-0201-001",
    entityName: "System Logout",
    description: "User logged out of the system",
    ipAddress: "192.168.1.45",
    severity: "Low",
  },
];

// --- Helper Functions ---
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

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
            <Eye className="h-4 w-4 flex-shrink-0" />
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
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <IconSmartHome className="h-4 w-4" />
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="md:col-span-2 xl:col-span-6">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by entity, user, or description..."
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Module Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Module"
              value={moduleFilter}
              onChange={(value) => setModuleFilter(value as AuditModule | "All")}
              options={moduleOptions}
              placeholder="All Modules"
            />
          </div>

          {/* Action Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Action"
              value={actionFilter}
              onChange={(value) => setActionFilter(value as AuditAction | "All")}
              options={actionOptions}
              placeholder="All Actions"
            />
          </div>

          {/* Date From */}
          <div className="xl:col-span-3">
            <DateTimePicker
              label="From Date"
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Start date"
            />
          </div>

          {/* Date To */}
          <div className="xl:col-span-3">
            <DateTimePicker
              label="To Date"
              value={dateTo}
              onChange={setDateTo}
              placeholder="End date"
            />
          </div>
        </div>
      </div>

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
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
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
