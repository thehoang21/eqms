import React, { useState, useMemo, useRef, createRef, RefObject, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  History,
  GripVertical,
  ChevronDown,
  FileText,
  User,
  Home,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { StatusBadge, StatusType } from '@/components/ui/statusbadge/StatusBadge';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';  
import { cn } from '@/components/ui/utils';

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";

interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

interface Revision {
  id: string;
  documentNumber: string;
  revisionNumber: string;
  created: string;
  revisionName: string;
  state: DocumentStatus;
  effectiveDate: string;
  validUntil: string;
  documentName: string;
  type: DocumentType;
  department: string;
}

// Helper to map status string to StatusType
const mapStatusToType = (status: string): StatusType => {
  const mapping: { [key: string]: StatusType } = {
    Draft: "draft",
    Approved: "approved",
    Archive: "archived",
  };
  return mapping[status] || "draft";
};

// --- Mock Data (Owned by current user) ---
const MOCK_MY_REVISIONS: Revision[] = Array.from({ length: 18 }, (_, i) => ({
  id: `my-${i + 1}`,
  documentNumber: `MY-DOC-${String(i + 1).padStart(4, "0")}`,
  revisionNumber: `Rev ${Math.floor(i / 2) + 1}.${i % 2}`,
  created: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
  revisionName: `My Revision ${i + 1}`,
  state: ["Draft", "Pending Review", "Approved"][i % 3] as DocumentStatus,
  effectiveDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split("T")[0],
  validUntil: new Date(Date.now() + Math.random() * 20000000000).toISOString().split("T")[0],
  documentName: `My Document ${i + 1}`,
  type: ["SOP", "Policy", "Form", "Report"][i % 4] as DocumentType,
  department: ["Quality Assurance", "Production", "R&D"][i % 3],
}));

// Default columns configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "no", label: "No.", visible: true, order: 0, locked: true },
  { id: "documentNumber", label: "Document Number", visible: true, order: 1 },
  { id: "revisionNumber", label: "Revision Number", visible: true, order: 2 },
  { id: "created", label: "Created", visible: true, order: 3 },
  { id: "revisionName", label: "Revision Name", visible: true, order: 4 },
  { id: "state", label: "State", visible: true, order: 5 },
  { id: "effectiveDate", label: "Effective Date", visible: true, order: 6 },
  { id: "validUntil", label: "Valid Until", visible: true, order: 7 },
  { id: "documentName", label: "Document Name", visible: true, order: 8 },
  { id: "type", label: "Type", visible: true, order: 9 },
  { id: "action", label: "Action", visible: true, order: 10, locked: true },
];

// --- Filters Component ---
interface MyRevisionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: DocumentStatus | "All";
  onStatusChange: (value: DocumentStatus | "All") => void;
  typeFilter: DocumentType | "All";
  onTypeChange: (value: DocumentType | "All") => void;
  createdFromDate: string;
  onCreatedFromDateChange: (value: string) => void;
  createdToDate: string;
  onCreatedToDateChange: (value: string) => void;
  effectiveFromDate: string;
  onEffectiveFromDateChange: (value: string) => void;
  effectiveToDate: string;
  onEffectiveToDateChange: (value: string) => void;
  validFromDate: string;
  onValidFromDateChange: (value: string) => void;
  validToDate: string;
  onValidToDateChange: (value: string) => void;
}

const MyRevisionFilters: React.FC<MyRevisionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  createdFromDate,
  onCreatedFromDateChange,
  createdToDate,
  onCreatedToDateChange,
  effectiveFromDate,
  onEffectiveFromDateChange,
  effectiveToDate,
  onEffectiveToDateChange,
  validFromDate,
  onValidFromDateChange,
  validToDate,
  onValidToDateChange,
}) => {
  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Draft", value: "Draft" },
    { label: "Pending Review", value: "Pending Review" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Approved", value: "Approved" },
  ];

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "SOP", value: "SOP" },
    { label: "Policy", value: "Policy" },
    { label: "Form", value: "Form" },
    { label: "Report", value: "Report" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="xl:col-span-6">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Search
          </label>
          <input
            type="text"
            placeholder="Search revisions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 h-11 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <div className="xl:col-span-3">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(value) => onStatusChange(value as DocumentStatus | "All")}
            options={statusOptions}
          />
        </div>

        {/* Type Filter */}
        <div className="xl:col-span-3">
          <Select
            label="Type"
            value={typeFilter}
            onChange={(value) => onTypeChange(value as DocumentType | "All")}
            options={typeOptions}
          />
        </div>

        {/* Created From Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Created From"
            value={createdFromDate}
            onChange={onCreatedFromDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* Created To Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Created To"
            value={createdToDate}
            onChange={onCreatedToDateChange}
            placeholder="Select end date"
          />
        </div>

        {/* Effective From Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Effective From"
            value={effectiveFromDate}
            onChange={onEffectiveFromDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* Effective To Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Effective To"
            value={effectiveToDate}
            onChange={onEffectiveToDateChange}
            placeholder="Select end date"
          />
        </div>

        {/* Valid From Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Valid From"
            value={validFromDate}
            onChange={onValidFromDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* Valid To Date */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="Valid To"
            value={validToDate}
            onChange={onValidToDateChange}
            placeholder="Select end date"
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const RevisionsOwnedByMeView: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [createdFromDate, setCreatedFromDate] = useState("");
  const [createdToDate, setCreatedToDate] = useState("");
  const [effectiveFromDate, setEffectiveFromDate] = useState("");
  const [effectiveToDate, setEffectiveToDate] = useState("");
  const [validFromDate, setValidFromDate] = useState("");
  const [validToDate, setValidToDate] = useState("");
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  const itemsPerPage = 10;

  // Filtered data
  const filteredRevisions = useMemo(() => {
    return MOCK_MY_REVISIONS.filter((revision) => {
      const matchesSearch =
        searchQuery === "" ||
        revision.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.revisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.documentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || revision.state === statusFilter;
      const matchesType = typeFilter === "All" || revision.type === typeFilter;

      const matchesCreatedDate =
        (!createdFromDate || revision.created >= createdFromDate) &&
        (!createdToDate || revision.created <= createdToDate);

      const matchesEffectiveDate =
        (!effectiveFromDate || revision.effectiveDate >= effectiveFromDate) &&
        (!effectiveToDate || revision.effectiveDate <= effectiveToDate);

      const matchesValidDate =
        (!validFromDate || revision.validUntil >= validFromDate) &&
        (!validToDate || revision.validUntil <= validToDate);

      return matchesSearch && matchesStatus && matchesType && matchesCreatedDate && matchesEffectiveDate && matchesValidDate;
    });
  }, [searchQuery, statusFilter, typeFilter, createdFromDate, createdToDate, effectiveFromDate, effectiveToDate, validFromDate, validToDate]);

  // Pagination
  const totalPages = Math.ceil(filteredRevisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRevisions = filteredRevisions.slice(startIndex, endIndex);

  // Visible columns
  const visibleColumns = columns.filter((col) => col.visible).sort((a, b) => a.order - b.order);

  // Handlers
  const handleViewRevision = (id: string) => {
    // Navigate to document detail view - revisions use the same detail view as documents
    navigate(`/documents/${id}`);
  };

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
      left: rect.left + window.scrollX - 180 + rect.width,
    });
    setOpenDropdownId(id);
  };

  const handleMenuAction = (action: string, id: string) => {
    setOpenDropdownId(null);
    
    switch (action) {
      case "view":
        navigate(`/documents/${id}`);
        break;
      case "download":
        // TODO: Implement download functionality
        console.log(`Download revision: ${id}`);
        break;
      case "history":
        // TODO: Implement version history functionality
        console.log(`View history for revision: ${id}`);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  // Render column cell
  const renderCell = (column: TableColumn, revision: Revision, index: number) => {
    switch (column.id) {
      case "no":
        return startIndex + index + 1;
      case "documentNumber":
        return revision.documentNumber;
      case "revisionNumber":
        return revision.revisionNumber;
      case "created":
        return revision.created;
      case "revisionName":
        return revision.revisionName;
      case "state":
        return (
          <span className="inline-flex items-center gap-1.5">
            <StatusBadge status={mapStatusToType(revision.state)} />
          </span>
        );
      case "effectiveDate":
        return revision.effectiveDate;
      case "validUntil":
        return revision.validUntil;
      case "documentName":
        return revision.documentName;
      case "type":
        return revision.type;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Revisions Owned By Me
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Document Revisions</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-700 font-medium">Revisions Owned By Me</span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/documents/revisions/new")}
            size="sm"
            className="flex items-center gap-2 shadow-sm"
          >
            <FileText className="h-4 w-4" />
            New Revision
          </Button>
        </div>
      </div>

      {/* Filters */}
      <MyRevisionFilters
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setCurrentPage(1);
        }}
        createdFromDate={createdFromDate}
        onCreatedFromDateChange={(value) => {
          setCreatedFromDate(value);
          setCurrentPage(1);
        }}
        createdToDate={createdToDate}
        onCreatedToDateChange={(value) => {
          setCreatedToDate(value);
          setCurrentPage(1);
        }}
        effectiveFromDate={effectiveFromDate}
        onEffectiveFromDateChange={(value) => {
          setEffectiveFromDate(value);
          setCurrentPage(1);
        }}
        effectiveToDate={effectiveToDate}
        onEffectiveToDateChange={(value) => {
          setEffectiveToDate(value);
          setCurrentPage(1);
        }}
        validFromDate={validFromDate}
        onValidFromDateChange={(value) => {
          setValidFromDate(value);
          setCurrentPage(1);
        }}
        validToDate={validToDate}
        onValidToDateChange={(value) => {
          setValidToDate(value);
          setCurrentPage(1);
        }}
      />

      {/* Table Container */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className={cn(
                        "py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap",
                        column.id === 'action' 
                          ? "sticky right-0 bg-slate-50 text-center z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm"
                          : "text-left"
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedRevisions.map((revision, index) => (
                  <tr
                    key={revision.id}
                    onClick={() => handleViewRevision(revision.id)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {visibleColumns.map((column) =>
                      column.id === "action" ? (
                        <td
                          key={column.id}
                          onClick={(e) => e.stopPropagation()}
                          className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                        >
                          <button
                            ref={getButtonRef(revision.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(revision.id, e);
                            }}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                            aria-label="More actions"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                          </button>
                        </td>
                      ) : (
                        <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                          {renderCell(column, revision, index)}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-900">{startIndex + 1}-{Math.min(endIndex, filteredRevisions.length)}</span> of <span className="font-medium text-slate-900">{filteredRevisions.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'h-9 px-4 text-sm font-medium rounded-md transition-all border border-slate-200',
                  currentPage === 1 ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
                )}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'h-9 px-4 text-sm font-medium rounded-md transition-all border border-slate-200',
                  currentPage === totalPages ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {openDropdownId &&
        createPortal(
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
              className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("view", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Eye className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("download", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Download className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Download</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("history", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <History className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Version History</span>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};
