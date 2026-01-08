import React, { useState, useMemo, useRef, createRef, RefObject, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MoreVertical,
  Eye,
  History,
  GripVertical,
  ChevronDown,
  Plus,
  Home,
  ThumbsUp,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { StatusBadge, StatusType } from '@/components/ui/statusbadge/StatusBadge';
import { DocumentFilters } from "../../DocumentFilters";
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import { IconFileCheck, IconFileTime, IconInfoCircle } from "@tabler/icons-react";

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
  openedBy: string;
  revisionName: string;
  state: DocumentStatus;
  author: string;
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
    // "Pending Review": "pending",
    // "Pending Approval": "pending",
    Approved: "approved",
    // Effective: "active",
    Archive: "archived",
  };
  return mapping[status] || "draft";
};

// --- Mock Data ---
const MOCK_REVISIONS: Revision[] = Array.from({ length: 45 }, (_, i) => ({
  id: `${i + 1}`,
  documentNumber: `SOP.${String(i + 1).padStart(4, "0")}.0${(i % 3) + 1}`,
  revisionNumber: `Rev ${Math.floor(i / 3) + 1}.${i % 3}`,
  created: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
  openedBy: ["John Smith", "Jane Doe", "Alice Johnson", "Bob Williams"][i % 4],
  revisionName: `Revision ${i + 1}`,
  state: ["Draft", "Pending Review", "Approved", "Effective", "Archive"][i % 5] as DocumentStatus,
  author: ["Dr. Sarah Johnson", "Michael Chen", "Emily Brown", "David Lee"][i % 4],
  effectiveDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split("T")[0],
  validUntil: new Date(Date.now() + Math.random() * 20000000000).toISOString().split("T")[0],
  documentName: `Standard Operating Procedure ${i + 1}`,
  type: ["SOP", "Policy", "Form", "Report"][i % 4] as DocumentType,
  department: ["Quality Assurance", "Production", "R&D", "Regulatory Affairs"][i % 4],
}));

// Default columns configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "no", label: "No.", visible: true, order: 0, locked: true },
  { id: "documentNumber", label: "Document Number", visible: true, order: 1 },
  { id: "revisionNumber", label: "Revision Number", visible: true, order: 2 },
  { id: "created", label: "Created", visible: true, order: 3 },
  { id: "openedBy", label: "Opened by", visible: true, order: 4 },
  { id: "revisionName", label: "Revision Name", visible: true, order: 5 },
  { id: "state", label: "State", visible: true, order: 6 },
  { id: "author", label: "Author", visible: true, order: 7 },
  { id: "effectiveDate", label: "Effective Date", visible: true, order: 8 },
  { id: "validUntil", label: "Valid Until", visible: true, order: 9 },
  { id: "documentName", label: "Document Name", visible: true, order: 10 },
  { id: "action", label: "Action", visible: true, order: 11, locked: true },
];

// --- Column Customizer Component ---
interface RevisionColumnCustomizerProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

const RevisionColumnCustomizer: React.FC<RevisionColumnCustomizerProps> = ({
  columns,
  onColumnsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out locked columns for reordering
  const reorderableColumns = columns.filter(col => !col.locked);
  const lockedColumns = columns.filter(col => col.locked);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...reorderableColumns];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedColumn);

    // Update order property
    const updatedReorderable = newColumns.map((col, idx) => ({
      ...col,
      order: idx + 1, // Start from 1 (0 is reserved for "No.")
    }));

    // Merge with locked columns
    const finalColumns = [
      ...lockedColumns,
      ...updatedReorderable,
    ].sort((a, b) => a.order - b.order);

    onColumnsChange(finalColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleVisibility = (columnId: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const resetToDefault = () => {
    onColumnsChange([...DEFAULT_COLUMNS]);
  };

  const handleDone = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 h-11 border rounded-md bg-white text-sm transition-all",
          isOpen 
            ? "border-emerald-500 ring-2 ring-emerald-500" 
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <span className="text-slate-700 font-medium">Customize Columns</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 top-full mt-2 z-50 w-full bg-white rounded-lg border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Customize Columns</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scroll to View, Drag to reorder</p>
          </div>

          {/* Column List */}
          <div className="p-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {reorderableColumns.map((column, index) => (
              <div
                key={column.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md border border-transparent transition-all cursor-move group',
                  draggedIndex === index
                    ? 'bg-blue-50 border-blue-200 opacity-50'
                    : 'hover:bg-slate-50'
                )}
              >
                <Checkbox
                  id={`column-${column.id}`}
                  checked={column.visible}
                  onChange={() => toggleVisibility(column.id)}
                  className="flex-shrink-0"
                />
                
                <span className={cn(
                  "text-sm font-medium flex-1",
                  column.visible ? "text-slate-700" : "text-slate-400"
                )}>
                  {column.label}
                </span>

                <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 rounded-b-lg border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleDone}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const RevisionListView: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
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
    return MOCK_REVISIONS.filter((revision) => {
      const matchesSearch =
        searchQuery === "" ||
        revision.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.revisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        revision.documentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || revision.state === statusFilter;
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
      left: rect.right + window.scrollX - 180,
    });
    setOpenDropdownId(id);
  };

  const handleMenuAction = (action: string, id: string) => {
    setOpenDropdownId(null);
    
    switch (action) {
      case "view":
        navigate(`/documents/${id}`);
        break;
      case "review":
        navigate(`/documents/revisions/review/${id}`);
        break;
      case "audit":
        // TODO: Navigate to audit trail view
        console.log(`View audit trail for revision: ${id}`);
        navigate(`/documents/${id}?tab=audit`);
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
        return <span className="font-medium text-emerald-600">{revision.documentNumber}</span>;
      case "revisionNumber":
        return revision.revisionNumber;
      case "created":
        return revision.created;
      case "openedBy":
        return revision.openedBy;
      case "revisionName":
        return revision.revisionName;
      case "state":
        return (
          <span className="inline-flex items-center gap-1.5">
            <StatusBadge status={mapStatusToType(revision.state)} />
          </span>
        );
      case "author":
        return revision.author;
      case "effectiveDate":
        return revision.effectiveDate;
      case "validUntil":
        return revision.validUntil;
      case "documentName":
        return revision.documentName;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            All Revisions
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">Dashboard</button>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4" />
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">
              Document Control
            </button>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4" />
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">
              Document Revisions
            </button>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700 font-medium">All Revisions</span>
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
        showTypeFilter={false}
        showDepartmentFilter={false}
      />

      {/* Table Container - Match DocumentListView wrapper */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Table with Horizontal Scroll */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className={cn(
                        "py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                        column.id === 'action' 
                          ? "sticky right-0 bg-slate-50/80 text-center z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm"
                          : "text-left"
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
                </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRevisions.map((revision, index) => (
                  <tr
                    key={revision.id}
                    onClick={() => handleViewRevision(revision.id)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
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
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>
                Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to{" "}
                <span className="font-medium text-slate-900">{Math.min(endIndex, filteredRevisions.length)}</span> of{" "}
                <span className="font-medium text-slate-900">{filteredRevisions.length}</span> results
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu (Portal) */}
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
                transformOrigin: "top right",
              }}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("view", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <IconInfoCircle className="h-4 w-4 text-slate-500" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("review", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <IconFileCheck className="h-4 w-4 text-slate-500" />
                  <span>Review Revision</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction("audit", openDropdownId);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <History className="h-4 w-4 text-slate-500" />
                  <span>View Audit Trail</span>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};
