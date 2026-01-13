import React, { useState, useMemo, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Info,
  Edit,
  FileX,
  Home,
  Clock,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { cn } from "@/components/ui/utils";
import { ControlledCopy, TableColumn } from "./types";
import { CreateLinkModal } from "../CreateLinkModal";

// Mock Data - Only Ready for Distribution
const MOCK_READY_COPIES: ControlledCopy[] = [
  {
    id: "cc-001",
    documentNumber: "CC-2024-001",
    createdDate: "2024-01-10",
    createdTime: "09:30:45",
    openedBy: "John Smith",
    name: "Standard Operating Procedure for Material Receipt",
    status: "Ready for Distribution",
    validUntil: "2025-01-10",
    document: "SOP.0015.02",
    distributionList: "Warehouse Team, QC Team",
    version: "2.0",
    location: "Warehouse - Receiving",
    department: "Operations",
    reason: "Annual review and update",
  },
  {
    id: "cc-005",
    documentNumber: "CC-2024-005",
    createdDate: "2024-01-12",
    createdTime: "16:50:12",
    openedBy: "Robert Lee",
    name: "Validation Protocol for Sterilization Process",
    status: "Ready for Distribution",
    validUntil: "2025-06-30",
    document: "VP.0087.02",
    distributionList: "Validation Team, Production",
    version: "2.0",
    location: "Sterilization Area",
    department: "Validation",
  },
  {
    id: "cc-008",
    documentNumber: "CC-2024-008",
    createdDate: "2024-01-09",
    createdTime: "15:30:42",
    openedBy: "Anna Martinez",
    name: "Equipment Calibration Schedule",
    status: "Ready for Distribution",
    validUntil: "2025-01-09",
    document: "CS.0067.01",
    distributionList: "Calibration Lab, Maintenance",
    version: "1.0",
    location: "Calibration Lab",
    department: "Metrology",
  },
];

// Default Columns Configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "documentNumber", label: "Document Number", visible: true, order: 1, locked: true },
  { id: "created", label: "Created", visible: true, order: 2 },
  { id: "openedBy", label: "Opened by", visible: true, order: 3 },
  { id: "name", label: "Name", visible: true, order: 4 },
  { id: "status", label: "State", visible: true, order: 5 },
  { id: "validUntil", label: "Valid Until", visible: true, order: 6 },
  { id: "document", label: "Document", visible: true, order: 7 },
  { id: "distributionList", label: "Distribution List", visible: true, order: 8 },
];

// Helper Functions
const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(`${date}T${time}`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>
          Showing <span className="font-medium text-slate-900">{startItem}</span> to{" "}
          <span className="font-medium text-slate-900">{endItem}</span> of{" "}
          <span className="font-medium text-slate-900">{totalItems}</span> results
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Dropdown Menu Component
const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDetails: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onCreateLink?: () => void;
}> = ({ isOpen, onClose, position, onViewDetails, onEdit, onCancel, onCreateLink }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      <div
        className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Edit className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Edit</span>
          </button>
          {onCreateLink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateLink();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Link2 className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Create Shareable Link</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <FileX className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Cancel Distribution</span>
          </button>
        </div>
      </div>
    </>,
    window.document.body
  );
};

// Main Component
export const ReadyForDistributionView: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  // Create Shareable Link Modal state
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedCopyForLink, setSelectedCopyForLink] = useState<ControlledCopy | null>(null);

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return MOCK_READY_COPIES.filter((copy) => {
      const matchesSearch =
        searchQuery === "" ||
        copy.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateFrom =
        dateFromFilter === "" || new Date(copy.createdDate) >= new Date(dateFromFilter);

      const matchesDateTo =
        dateToFilter === "" || new Date(copy.createdDate) <= new Date(dateToFilter);

      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, dateFromFilter, dateToFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 200,
    });
    setOpenDropdownId(id);
  };

  const handleViewDetails = (copy: ControlledCopy) => {
    navigate(`/documents/controlled-copies/${copy.id}`);
  };

  const handleEdit = (copy: ControlledCopy) => {
    console.log("Edit copy:", copy);
    // TODO: Navigate to edit page
  };

  const handleCreateLink = (copy: ControlledCopy) => {
    setSelectedCopyForLink(copy);
    setIsCreateLinkModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCancel = (copy: ControlledCopy) => {
    console.log("Cancel Distribution:", copy);
    // TODO: Show confirmation modal
    alert(`Cancel controlled copy ${copy.documentNumber}?`);
  };

  const handleViewRow = (copy: ControlledCopy) => {
    handleViewDetails(copy);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Ready for Distribution
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Controlled Copies</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-700 font-medium">Ready for Distribution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          <div className="xl:col-span-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Document #, Name, Document ID..."
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">State</label>
            <Select
              value="Ready for Distribution"
              onChange={() => {}}
              options={[{ label: "Ready for Distribution", value: "Ready for Distribution" }]}
              placeholder="Ready for Distribution"
              disabled
            />
          </div>
          <div className="xl:col-span-2">
            <DateTimePicker
              label="From Date"
              value={dateFromFilter}
              onChange={setDateFromFilter}
              placeholder="Select date"
            />
          </div>
          <div className="xl:col-span-3">
            <DateTimePicker
              label="To Date"
              value={dateToFilter}
              onChange={setDateToFilter}
              placeholder="Select date"
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
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-16">
                  No.
                </th>
                {DEFAULT_COLUMNS.filter((c) => c.visible).map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={DEFAULT_COLUMNS.filter((c) => c.visible).length + 2}
                    className="py-12 text-center text-slate-500"
                  >
                    No controlled copies ready for distribution
                  </td>
                </tr>
              ) : (
                paginatedData.map((copy, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr
                      key={copy.id}
                      onClick={() => handleViewRow(copy)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 font-medium">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-emerald-700">{copy.documentNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="text-slate-700">
                          {formatDateTime(copy.createdDate, copy.createdTime)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="text-slate-700">{copy.openedBy}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm">
                        <div className="max-w-md">
                          <span className="text-slate-900">{copy.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            "bg-blue-50 text-blue-700 border-blue-200"
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {copy.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="text-slate-700">{formatDate(copy.validUntil)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-slate-900">{copy.document}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm">
                        <div className="max-w-xs">
                          <span className="text-slate-700">{copy.distributionList || "—"}</span>
                        </div>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          ref={getButtonRef(copy.id)}
                          onClick={(e) => handleDropdownToggle(copy.id, e)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {openDropdownId && (
        <DropdownMenu
          isOpen={openDropdownId !== null}
          onClose={() => setOpenDropdownId(null)}
          position={dropdownPosition}
          onViewDetails={() => {
            const copy = paginatedData.find((c) => c.id === openDropdownId);
            if (copy) handleViewDetails(copy);
          }}
          onEdit={() => {
            const copy = paginatedData.find((c) => c.id === openDropdownId);
            if (copy) handleEdit(copy);
          }}
          onCreateLink={() => {
            const copy = paginatedData.find((c) => c.id === openDropdownId);
            if (copy) handleCreateLink(copy);
          }}
          onCancel={() => {
            const copy = paginatedData.find((c) => c.id === openDropdownId);
            if (copy) handleCancel(copy);
          }}
        />
      )}

      {/* Create Shareable Link Modal */}
      {selectedCopyForLink && (
        <CreateLinkModal
          isOpen={isCreateLinkModalOpen}
          onClose={() => {
            setIsCreateLinkModalOpen(false);
            setSelectedCopyForLink(null);
          }}
          documentId={selectedCopyForLink.documentNumber}
          documentTitle={selectedCopyForLink.name}
        />
      )}
    </div>
  );
};
