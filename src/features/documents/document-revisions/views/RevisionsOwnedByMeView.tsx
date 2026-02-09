import React, {
  useState,
  useMemo,
  useRef,
  createRef,
  RefObject,
  useEffect,
} from "react";
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
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import {
  StatusBadge,
  StatusType,
} from "@/components/ui/statusbadge/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { DocumentFilters } from "@/features/documents/shared/components";
import { cn } from "@/components/ui/utils";
import {
  IconInfoCircle,
  IconFileExport,
  IconSmartHome,
} from "@tabler/icons-react";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";

// --- Types ---

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
  openedBy: string;
  revisionName: string;
  state: DocumentStatus;
  effectiveDate: string;
  validUntil: string;
  documentName: string;
  type: DocumentType;
  department: string;
  author: string;
}

// Helper to map status string to StatusType
const mapStatusToType = (status: string): StatusType => {
  const mapping: { [key: string]: StatusType } = {
    Draft: "draft",
    Approved: "approved",
    Archive: "archived",
    Effective: "effective",
  };
  return mapping[status] || "draft";
};

// --- Mock Data (Owned by current user) ---
const MOCK_MY_REVISIONS: Revision[] = Array.from({ length: 18 }, (_, i) => ({
  id: `my-${i + 1}`,
  documentNumber: `SOP.${String(i + 1).padStart(4, "0")}.0${(i % 2) + 1}`,
  revisionNumber: `${Math.floor(i / 2) + 1}.${i % 2}`,
  created: new Date(Date.now() - Math.random() * 10000000000)
    .toISOString()
    .split("T")[0],
  openedBy: ["John Smith", "Jane Doe", "Dr. Sarah Johnson", "Michael Chen"][i % 4],
  revisionName: `My Revision ${i + 1}`,
  state: ["Draft", "Pending Review", "Approved"][i % 3] as DocumentStatus,
  effectiveDate: new Date(Date.now() + Math.random() * 10000000000)
    .toISOString()
    .split("T")[0],
  validUntil: new Date(Date.now() + Math.random() * 20000000000)
    .toISOString()
    .split("T")[0],
  documentName: `My Document ${i + 1}`,
  type: ["SOP", "Policy", "Form", "Report"][i % 4] as DocumentType,
  department: ["Quality Assurance", "Production", "R&D"][i % 3],
  author: ["Dr. Sarah Johnson", "Michael Chen", "Emily Davis", "Robert Brown"][i % 4],
}));

// --- Filters Component (removed - using shared DocumentFilters instead) ---

// Default columns configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "no", label: "No.", visible: true, order: 0, locked: true },
  { id: "documentNumber", label: "Document Number", visible: true, order: 1 },
  { id: "revisionNumber", label: "Revision Number", visible: true, order: 2 },
  { id: "created", label: "Created", visible: true, order: 3 },
  { id: "openedBy", label: "Opened By", visible: true, order: 4 },
  { id: "revisionName", label: "Revision Name", visible: true, order: 5 },
  { id: "state", label: "State", visible: true, order: 6 },
  { id: "documentName", label: "Document Name", visible: true, order: 7 },
  { id: "type", label: "Document Type", visible: true, order: 8 },
  { id: "department", label: "Department", visible: true, order: 9 },
  { id: "author", label: "Author", visible: true, order: 10 },
  { id: "effectiveDate", label: "Effective Date", visible: true, order: 11 },
  { id: "validUntil", label: "Valid Until", visible: true, order: 12 },
  { id: "action", label: "Action", visible: true, order: 13, locked: true },
];

// --- Main Component ---
export const RevisionsOwnedByMeView: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">(
    "All",
  );
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [createdFromDate, setCreatedFromDate] = useState("");
  const [createdToDate, setCreatedToDate] = useState("");
  const [effectiveFromDate, setEffectiveFromDate] = useState("");
  const [effectiveToDate, setEffectiveToDate] = useState("");
  const [validFromDate, setValidFromDate] = useState("");
  const [validToDate, setValidToDate] = useState("");
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    showAbove: false,
  });

  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement | null> }>(
    {},
  );

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered data
  const filteredRevisions = useMemo(() => {
    return MOCK_MY_REVISIONS.filter((revision) => {
      const matchesSearch =
        searchQuery === "" ||
        revision.documentNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        revision.revisionName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        revision.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.documentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || revision.state === statusFilter;
      const matchesType = typeFilter === "All" || revision.type === typeFilter;
      const matchesDepartment = departmentFilter === "All" || revision.department === departmentFilter;
      const matchesAuthor = authorFilter === "All" || revision.author === authorFilter;

      const matchesCreatedDate =
        (!createdFromDate || revision.created >= createdFromDate) &&
        (!createdToDate || revision.created <= createdToDate);

      const matchesEffectiveDate =
        (!effectiveFromDate || revision.effectiveDate >= effectiveFromDate) &&
        (!effectiveToDate || revision.effectiveDate <= effectiveToDate);

      const matchesValidDate =
        (!validFromDate || revision.validUntil >= validFromDate) &&
        (!validToDate || revision.validUntil <= validToDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDepartment &&
        matchesAuthor &&
        matchesCreatedDate &&
        matchesEffectiveDate &&
        matchesValidDate
      );
    });
  }, [
    searchQuery,
    statusFilter,
    typeFilter,
    departmentFilter,
    authorFilter,
    createdFromDate,
    createdToDate,
    effectiveFromDate,
    effectiveToDate,
    validFromDate,
    validToDate,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredRevisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRevisions = filteredRevisions.slice(startIndex, endIndex);

  // Visible columns
  const visibleColumns = columns
    .filter((col) => col.visible)
    .sort((a, b) => a.order - b.order);

  // Handlers
  const handleViewRevision = (id: string) => {
    // Navigate to document detail view - revisions use the same detail view as documents
    navigate(`/documents/${id}`);
  };

  const handleDropdownToggle = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // Menu dimensions (estimate max)
    const menuHeight = 150;
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
  const renderCell = (
    column: TableColumn,
    revision: Revision,
    index: number,
  ) => {
    switch (column.id) {
      case "no":
        return startIndex + index + 1;
      case "documentNumber":
        return (
          <span className="font-medium text-emerald-600">
            {revision.documentNumber}
          </span>
        );
      case "revisionNumber":
        return revision.revisionNumber;
      case "created":
        return revision.created;
      case "openedBy":
        return revision.openedBy;
      case "revisionName":
        return <span className="font-medium text-slate-900">{revision.revisionName}</span>;
      case "state":
        return (
          <span className="inline-flex items-center gap-1.5">
            <StatusBadge status={mapStatusToType(revision.state)} />
          </span>
        );
      case "documentName":
        return <span className="text-slate-600">{revision.documentName}</span>;
      case "type":
        return revision.type;
      case "department":
        return revision.department;
      case "author":
        return revision.author;
      case "effectiveDate":
        return revision.effectiveDate;
      case "validUntil":
        return revision.validUntil;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Revisions Owned By Me
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 whitespace-nowrap overflow-x-auto">
              <IconSmartHome className="h-4 w-4" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Document Revisions</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">
                Revisions Owned By Me
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Button
              onClick={() => {
                console.log("Export triggered");
                // TODO: Implement export functionality
              }}
              variant="outline"
              size="sm"
              className="whitespace-nowrap gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DocumentFilters
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
        departmentFilter={departmentFilter}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
          setCurrentPage(1);
        }}
        authorFilter={authorFilter}
        onAuthorChange={(value) => {
          setAuthorFilter(value);
          setCurrentPage(1);
        }}
        createdFromDate={createdFromDate}
        onCreatedFromDateChange={(dateStr) => {
          setCreatedFromDate(dateStr);
          setCurrentPage(1);
        }}
        createdToDate={createdToDate}
        onCreatedToDateChange={(dateStr) => {
          setCreatedToDate(dateStr);
          setCurrentPage(1);
        }}
        effectiveFromDate={effectiveFromDate}
        onEffectiveFromDateChange={(dateStr) => {
          setEffectiveFromDate(dateStr);
          setCurrentPage(1);
        }}
        effectiveToDate={effectiveToDate}
        onEffectiveToDateChange={(dateStr) => {
          setEffectiveToDate(dateStr);
          setCurrentPage(1);
        }}
        validFromDate={validFromDate}
        onValidFromDateChange={(dateStr) => {
          setValidFromDate(dateStr);
          setCurrentPage(1);
        }}
        validToDate={validToDate}
        onValidToDateChange={(dateStr) => {
          setValidToDate(dateStr);
          setCurrentPage(1);
        }}
        showTypeFilter={true}
        showDepartmentFilter={true}
      />

      {/* Table Container */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col flex-1">
          {paginatedRevisions.length > 0 ? (
            <>
              <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className={cn(
                        "py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                        column.id === "action"
                          ? "sticky right-0 bg-slate-50 text-center z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm"
                          : "text-left",
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
                          className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                        >
                          <button
                            ref={getButtonRef(revision.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropdownToggle(revision.id, e);
                            }}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="More actions"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                          </button>
                        </td>
                      ) : (
                        <td
                          key={column.id}
                          className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700"
                        >
                          {renderCell(column, revision, index)}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRevisions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
            </>
          ) : (
            <TableEmptyState
              title="No Revisions Found"
              description="We couldn't find any revision records matching your filters. Try adjusting your search criteria or clear filters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setTypeFilter("All");
                setDepartmentFilter("All");
                setAuthorFilter("All");
                setCreatedFromDate("");
                setCreatedToDate("");
                setEffectiveFromDate("");
                setEffectiveToDate("");
                setValidFromDate("");
                setValidToDate("");
                setCurrentPage(1);
              }}
            />
          )}
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
              className="fixed z-50 min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                transform: dropdownPosition.showAbove
                  ? "translateY(-100%)"
                  : "none",
              }}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("view", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("download", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Download className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Download</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("history", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <History className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Version History</span>
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
