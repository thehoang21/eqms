import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  GripVertical,
  Home,
} from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import { Checkbox } from "../../components/ui/checkbox/Checkbox";
import { cn } from "../../components/ui/utils";
import { DocumentFilters } from "./components/DocumentFilters";

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

interface Document {
  id: string;
  documentId: string;
  title: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
  effectiveDate: string;
  validUntil: string;
  author: string;
  department: string;
  created: string;
  openedBy: string;
  description?: string;
}

// --- Mock Data ---
const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    documentId: "SOP-QA-001",
    title: "Standard Operating Procedure for Quality Control Testing",
    type: "SOP",
    version: "3.0",
    status: "Effective",
    effectiveDate: "2023-06-15",
    validUntil: "2024-06-15",
    author: "Dr. Sarah Johnson",
    department: "Quality Assurance",
    created: "2023-05-01",
    openedBy: "QA Admin",
    description: "Comprehensive procedure for conducting quality control tests on pharmaceutical products",
  },
  {
    id: "2",
    documentId: "POL-HR-005",
    title: "Employee Training and Development Policy",
    type: "Policy",
    version: "2.1",
    status: "Effective",
    effectiveDate: "2023-03-20",
    validUntil: "2024-03-20",
    author: "Dr. Sarah Johnson",
    department: "Human Resources",
    created: "2023-02-10",
    openedBy: "HR Manager",
    description: "Policy outlining training requirements and professional development opportunities",
  },
  {
    id: "3",
    documentId: "FORM-QC-012",
    title: "Raw Material Inspection Checklist",
    type: "Form",
    version: "1.5",
    status: "Effective",
    effectiveDate: "2023-08-01",
    validUntil: "2024-08-01",
    author: "Dr. Sarah Johnson",
    department: "Quality Control",
    created: "2023-07-15",
    openedBy: "QC Inspector",
    description: "Standardized form for documenting raw material inspection results",
  },
  {
    id: "4",
    documentId: "RPT-VAL-203",
    title: "Annual Validation Summary Report 2023",
    type: "Report",
    version: "1.0",
    status: "Pending Review",
    effectiveDate: "2024-01-15",
    validUntil: "2025-01-15",
    author: "Dr. Sarah Johnson",
    department: "Validation",
    created: "2023-12-01",
    openedBy: "Validation Lead",
    description: "Comprehensive summary of all validation activities completed in 2023",
  },
  {
    id: "5",
    documentId: "SOP-MFG-045",
    title: "Batch Manufacturing Record Procedure",
    type: "SOP",
    version: "4.2",
    status: "Draft",
    effectiveDate: "2024-02-01",
    validUntil: "2025-02-01",
    author: "Dr. Sarah Johnson",
    department: "Manufacturing",
    created: "2024-01-05",
    openedBy: "Manufacturing Manager",
    description: "Detailed procedure for creating and maintaining batch manufacturing records",
  },
];

// --- Helper Functions ---

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Approved":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Archive":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case "Draft":
      return <Clock className="h-3.5 w-3.5" />;
    case "Pending Review":
      return <AlertCircle className="h-3.5 w-3.5" />;
    case "Pending Approval":
      return <AlertTriangle className="h-3.5 w-3.5" />;
    case "Approved":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "Effective":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "Archive":
      return <AlertTriangle className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
};

const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case "SOP":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Policy":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Form":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Report":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Specification":
      return "bg-pink-50 text-pink-700 border-pink-200";
    case "Protocol":
      return "bg-teal-50 text-teal-700 border-teal-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- Pagination Component ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startItem: number;
  endItem: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startItem,
  endItem,
  totalItems,
}) => {
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
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// --- Dropdown Menu Component ---
interface DropdownMenuProps {
  document: Document;
  triggerRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDocument?: (documentId: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  document,
  triggerRef,
  isOpen,
  onClose,
  position,
  onViewDocument,
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
        className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("View document:", document.id);
              onViewDocument?.(document.id);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            <span>View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Download document:", document.id);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("View history:", document.id);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span>Version History</span>
          </button>
        </div>
      </div>
    </>,
    window.document.body
  );
};

// --- Document Column Customizer Component ---

interface DocumentColumnCustomizerProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

const DocumentColumnCustomizer: React.FC<DocumentColumnCustomizerProps> = ({
  columns,
  onColumnsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reorderableColumns = columns.filter(col => !col.locked);
  const lockedColumns = columns.filter(col => col.locked);

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

    const updatedReorderable = newColumns.map((col, idx) => ({
      ...col,
      order: idx + 1,
    }));

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
    const defaultColumns: TableColumn[] = [
      { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
      { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
      { id: 'created', label: 'Created', visible: true, order: 2 },
      { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
      { id: 'title', label: 'Document Name', visible: true, order: 4 },
      { id: 'status', label: 'State', visible: true, order: 5 },
      { id: 'type', label: 'Document Type', visible: true, order: 6 },
      { id: 'department', label: 'Department', visible: true, order: 7 },
      { id: 'author', label: 'Author', visible: true, order: 8 },
      { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 9 },
      { id: 'validUntil', label: 'Valid Until', visible: true, order: 10 },
      { id: 'action', label: 'Action', visible: true, order: 11, locked: true },
    ];
    onColumnsChange(defaultColumns);
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
          <div className="px-4 py-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Customize Columns</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scroll to View, Drag to reorder</p>
          </div>

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
              onClick={() => setIsOpen(false)}
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

interface DocumentsOwnedByMeViewProps {
  onViewDocument?: (documentId: string) => void;
}

export const DocumentsOwnedByMeView: React.FC<DocumentsOwnedByMeViewProps> = ({ onViewDocument }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [authorFilter, setAuthorFilter] = useState<string>("All");
  const [createdFromDate, setCreatedFromDate] = useState<string>("");
  const [createdToDate, setCreatedToDate] = useState<string>("");
  const [effectiveFromDate, setEffectiveFromDate] = useState<string>("");
  const [effectiveToDate, setEffectiveToDate] = useState<string>("");
  const [validFromDate, setValidFromDate] = useState<string>("");
  const [validToDate, setValidToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
    { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
    { id: 'created', label: 'Created', visible: true, order: 2 },
    { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
    { id: 'title', label: 'Document Name', visible: true, order: 4 },
    { id: 'status', label: 'State', visible: true, order: 5 },
    { id: 'type', label: 'Document Type', visible: true, order: 6 },
    { id: 'department', label: 'Department', visible: true, order: 7 },
    { id: 'author', label: 'Author', visible: true, order: 8 },
    { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 9 },
    { id: 'validUntil', label: 'Valid Until', visible: true, order: 10 },
    { id: 'action', label: 'Action', visible: true, order: 11, locked: true },
  ]);
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  const itemsPerPage = 10;

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
      const matchesType = typeFilter === "All" || doc.type === typeFilter;
      const matchesDepartment = departmentFilter === "All" || doc.department === departmentFilter;
      const matchesAuthor = authorFilter === "All" || doc.author === authorFilter;

      // Date filtering
      const matchesCreatedFrom = !createdFromDate || new Date(doc.created) >= new Date(createdFromDate);
      const matchesCreatedTo = !createdToDate || new Date(doc.created) <= new Date(createdToDate);
      const matchesEffectiveFrom = !effectiveFromDate || new Date(doc.effectiveDate) >= new Date(effectiveFromDate);
      const matchesEffectiveTo = !effectiveToDate || new Date(doc.effectiveDate) <= new Date(effectiveToDate);
      const matchesValidFrom = !validFromDate || new Date(doc.validUntil) >= new Date(validFromDate);
      const matchesValidTo = !validToDate || new Date(doc.validUntil) <= new Date(validToDate);

      return matchesSearch && matchesStatus && matchesType && matchesDepartment && 
             matchesAuthor && matchesCreatedFrom && matchesCreatedTo && 
             matchesEffectiveFrom && matchesEffectiveTo && matchesValidFrom && matchesValidTo;
    });
  }, [searchQuery, statusFilter, typeFilter, departmentFilter, authorFilter,
      createdFromDate, createdToDate, effectiveFromDate, effectiveToDate, 
      validFromDate, validToDate]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handleDropdownToggle = (
    docId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openDropdownId === docId) {
      setOpenDropdownId(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 200,
    });
    setOpenDropdownId(docId);
  };

  const getButtonRef = (docId: string) => {
    if (!buttonRefs.current[docId]) {
      buttonRefs.current[docId] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[docId];
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb (No Action Button) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Documents Owned By Me
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Document Management</span>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-medium">Documents Owned By Me</span>
          </div>
        </div>
      </div>

      {/* Filters Card */}
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
        columns={columns}
        onColumnsChange={setColumns}
        ColumnCustomizerComponent={DocumentColumnCustomizer}
      />

      {/* Table Container with Pagination */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Document Number
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Created
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Opened by
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Document Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  State
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Document Type
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Author
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Effective Date
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                  Valid Until
                </th>
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {currentDocuments.map((doc) => {
                return (
                  <tr
                    key={doc.id}
                    onClick={() => onViewDocument?.(doc.id)}
                    className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* No. */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center text-slate-700">
                      {(currentPage - 1) * itemsPerPage + currentDocuments.indexOf(doc) + 1}
                    </td>
                    {/* Document Number */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-emerald-600">{doc.documentId}</span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {formatDate(doc.created)}
                    </td>

                    {/* Opened by */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                      {doc.openedBy}
                    </td>

                    {/* Document Name */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <div className="max-w-md">
                        <div className="font-medium text-slate-900 truncate">{doc.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Version {doc.version}</div>
                      </div>
                    </td>

                    {/* State */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(doc.status)
                        )}
                      >
                        {doc.status}
                      </span>
                    </td>

                    {/* Document Type */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
                          getTypeColor(doc.type)
                        )}
                      >
                        {doc.type}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                      {doc.department}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {doc.author}
                    </td>

                    {/* Effective Date */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {formatDate(doc.effectiveDate)}
                    </td>

                    {/* Valid Until */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {formatDate(doc.validUntil)}
                    </td>

                    {/* Action - Sticky Column */}
                    <td 
                      onClick={(e) => e.stopPropagation()}
                      className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                    >
                      <button
                        ref={getButtonRef(doc.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownToggle(doc.id, e);
                        }}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                        aria-label="More actions"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </button>
                      <DropdownMenu
                        document={doc}
                        triggerRef={getButtonRef(doc.id)}
                        isOpen={openDropdownId === doc.id}
                        onClose={() => setOpenDropdownId(null)}
                        position={dropdownPosition}
                        onViewDocument={onViewDocument}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startItem={startIndex + 1}
          endItem={Math.min(endIndex, filteredDocuments.length)}
          totalItems={filteredDocuments.length}
        />
      </div>
    </div>
  );
};
