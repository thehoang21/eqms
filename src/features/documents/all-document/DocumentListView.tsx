import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  History,
  Plus,
  GripVertical,
  ChevronDown,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Archive,
  FileCheck,
  ClipboardList,
  Info,
  Home,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';
import { DocumentFilters } from "../DocumentFilters";
import { DetailDocumentView } from "../detail-document/DetailDocumentView";
import { NewDocumentModal } from "./new-document/NewDocumentModal";

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
    documentId: "POL-QMS-005",
    title: "Quality Management System Policy",
    type: "Policy",
    version: "2.1",
    status: "Approved",
    effectiveDate: "2023-08-01",
    validUntil: "2024-08-01",
    author: "Michael Chen",
    department: "Quality Management",
    created: "2023-07-10",
    openedBy: "System Admin",
    description: "Organization-wide quality management policy framework",
  },
  {
    id: "3",
    documentId: "SOP-PR-012",
    title: "Batch Production Record Procedure",
    type: "SOP",
    version: "4.2",
    status: "Pending Review",
    effectiveDate: "2023-09-10",
    validUntil: "2024-09-10",
    author: "Emma Williams",
    department: "Production",
    created: "2023-08-20",
    openedBy: "Production Lead",
    description: "Guidelines for maintaining and reviewing batch production records",
  },
  {
    id: "4",
    documentId: "FORM-DEV-001",
    title: "Deviation Report Form",
    type: "Form",
    version: "1.5",
    status: "Effective",
    effectiveDate: "2023-05-20",
    validUntil: "2024-05-20",
    author: "John Davis",
    department: "Quality Assurance",
    created: "2023-04-15",
    openedBy: "QA Manager",
  },
  {
    id: "5",
    documentId: "SPEC-RAW-045",
    title: "Raw Material Specification - API Grade A",
    type: "Specification",
    version: "2.0",
    status: "Effective",
    effectiveDate: "2023-07-01",
    validUntil: "2024-07-01",
    author: "Dr. Lisa Park",
    department: "Quality Control",
    created: "2023-06-01",
    openedBy: "QC Supervisor",
  },
  {
    id: "6",
    documentId: "PROT-VAL-008",
    title: "Cleaning Validation Protocol",
    type: "Protocol",
    version: "3.1",
    status: "Approved",
    effectiveDate: "2023-04-15",
    validUntil: "2024-04-15",
    author: "Robert Taylor",
    department: "Validation",
    created: "2023-03-10",
    openedBy: "Validation Team",
  },
  {
    id: "7",
    documentId: "REP-AUD-2023-Q2",
    title: "Internal Audit Report Q2 2023",
    type: "Report",
    version: "1.0",
    status: "Effective",
    effectiveDate: "2023-06-30",
      validUntil: "2024-06-30",
      author: "Amanda Martinez",
    department: "Quality Assurance",
      created: "2023-06-20",
      openedBy: "Audit Team",
  },
  {
    id: "8",
    documentId: "SOP-EQ-023",
    title: "Equipment Calibration Procedure",
    type: "SOP",
    version: "5.0",
    status: "Effective",
    effectiveDate: "2023-08-15",
      validUntil: "2024-08-15",
      author: "David Brown",
    department: "Engineering",
      created: "2023-07-25",
      openedBy: "Engineering Lead",
  },
  {
    id: "9",
    documentId: "SOP-TR-007",
    title: "Training Management Standard Operating Procedure",
    type: "SOP",
    version: "2.3",
    status: "Draft",
    effectiveDate: "2023-10-01",
      validUntil: "2024-10-01",
      author: "Jessica Lee",
    department: "Human Resources",
      created: "2023-09-15",
      openedBy: "HR Manager",
  },
  {
    id: "10",
    documentId: "POL-DI-002",
    title: "Data Integrity Policy",
    type: "Policy",
    version: "1.0",
    status: "Pending Review",
    effectiveDate: "2023-09-01",
      validUntil: "2024-09-01",
      author: "Dr. Sarah Johnson",
    department: "Quality Management",
      created: "2023-08-10",
      openedBy: "QM Director",
  },
];

// --- Helper Functions ---

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Approved":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Archive":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// --- Pagination Component ---
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

// --- Dropdown Component ---

interface DropdownMenuProps {
  document: Document;
  triggerRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDocument?: (documentId: string, tab?: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  document,
  isOpen,
  onClose,
  position,
  onViewDocument,
}) => {
  if (!isOpen) return null;

  // Dynamic menu items based on document status
  const getMenuItems = () => {
    const items = [];

    // Always available: View Details
    items.push({
      icon: Info,
      label: "View Details",
      onClick: () => {
        onViewDocument?.(document.id);
        onClose();
      },
      color: "text-slate-700"
    });

    // Status-specific actions
    switch (document.status) {
      case "Draft":
        items.push(
          {
            icon: Edit,
            label: "Edit Document",
            onClick: () => {
              console.log("Edit document:", document.id);
              onClose();
            },
            color: "text-slate-700"
          },
          {
            icon: Send,
            label: "Submit for Review",
            onClick: () => {
              console.log("Submit for review:", document.id);
              onClose();
            },
            color: "text-blue-700"
          }
        );
        break;

      case "Pending Review":
        items.push(
          {
            icon: FileCheck,
            label: "Review Document",
            onClick: () => {
              console.log("Review document:", document.id);
              onClose();
            },
            color: "text-purple-700"
          },
          {
            icon: XCircle,
            label: "Reject",
            onClick: () => {
              console.log("Reject document:", document.id);
              onClose();
            },
            color: "text-red-700"
          }
        );
        break;

      case "Pending Approval":
        items.push(
          {
            icon: CheckCircle,
            label: "Approve Document",
            onClick: () => {
              console.log("Approve document:", document.id);
              onClose();
            },
            color: "text-emerald-700"
          },
          {
            icon: XCircle,
            label: "Reject",
            onClick: () => {
              console.log("Reject document:", document.id);
              onClose();
            },
            color: "text-red-700"
          }
        );
        break;

      case "Approved":
      case "Effective":
        items.push(
          {
            icon: Download,
            label: "Download PDF",
            onClick: () => {
              console.log("Download document:", document.id);
              onClose();
            },
            color: "text-slate-700"
          },
          {
            icon: Edit,
            label: "Request Change",
            onClick: () => {
              console.log("Request change:", document.id);
              onClose();
            },
            color: "text-amber-700"
          }
        );
        break;

      case "Archive":
        items.push(
          {
            icon: Download,
            label: "Download PDF",
            onClick: () => {
              console.log("Download document:", document.id);
              onClose();
            },
            color: "text-slate-700"
          }
        );
        break;
    }

    // Always available: Version History & Audit Trail
    items.push(
      {
        icon: History,
        label: "View Audit Trail",
        onClick: () => {
          onViewDocument?.(document.id, "audit");
          onClose();
        },
        color: "text-slate-700"
      }
    );

    return items;
  };

  const menuItems = getMenuItems();

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
        className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors",
                  item.color,
                  "hover:bg-slate-50 active:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>,
    window.document.body
  );
};

// --- Column Customizer Component ---

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

interface DocumentListViewProps {
  onViewDocument?: (documentId: string, tab?: string) => void;
}

export const DocumentListView: React.FC<DocumentListViewProps> = ({ onViewDocument }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [createdFromDate, setCreatedFromDate] = useState<string>("");
  const [createdToDate, setCreatedToDate] = useState<string>("");
  const [effectiveFromDate, setEffectiveFromDate] = useState<string>("");
  const [effectiveToDate, setEffectiveToDate] = useState<string>("");
  const [validFromDate, setValidFromDate] = useState<string>("");
  const [validToDate, setValidToDate] = useState<string>("");
  const [authorFilter, setAuthorFilter] = useState<string>("All");
  const [versionFilter, setVersionFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  const itemsPerPage = 10;

  const handleNewDocument = () => {
    setIsNewDocModalOpen(true);
  };

  const handleSelectSingleDocument = () => {
    navigate("/documents/all/new");
  };

  const handleSelectBatchDocument = () => {
    navigate("/documents/batch/new");
  };

  const handleViewDocument = (documentId: string, tab: string = "general") => {
    setSelectedDocumentId(documentId);
    setSelectedDocumentTab(tab);
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      const matchesVersion = !versionFilter || doc.version.toLowerCase().includes(versionFilter.toLowerCase());

      // Date filtering
      const docCreatedDate = new Date(doc.created);
      const matchesCreatedFrom = !createdFromDate || docCreatedDate >= new Date(createdFromDate);
      const matchesCreatedTo = !createdToDate || docCreatedDate <= new Date(createdToDate);

      const docEffectiveDate = new Date(doc.effectiveDate);
      const matchesEffectiveFrom = !effectiveFromDate || docEffectiveDate >= new Date(effectiveFromDate);
      const matchesEffectiveTo = !effectiveToDate || docEffectiveDate <= new Date(effectiveToDate);

      const docValidUntilDate = new Date(doc.validUntil);
      const matchesValidFrom = !validFromDate || docValidUntilDate >= new Date(validFromDate);
      const matchesValidTo = !validToDate || docValidUntilDate <= new Date(validToDate);

      return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesAuthor && matchesVersion &&
             matchesCreatedFrom && matchesCreatedTo && matchesEffectiveFrom && matchesEffectiveTo &&
             matchesValidFrom && matchesValidTo;
    });
  }, [searchQuery, statusFilter, typeFilter, departmentFilter, authorFilter, versionFilter,
      createdFromDate, createdToDate, effectiveFromDate, effectiveToDate, validFromDate, validToDate]);

  // Visible columns sorted by order
  const visibleColumns = useMemo(() => {
    return columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
  }, [columns]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage]);

  // Handle dropdown toggle
  const handleDropdownToggle = (docId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (openDropdownId === docId) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 200 + rect.width,
      });
      setOpenDropdownId(docId);
    }
  };

  // Get or create ref for button
  const getButtonRef = (docId: string) => {
    if (!buttonRefs.current[docId]) {
      buttonRefs.current[docId] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[docId];
  };

  // Show DetailDocumentView if document is selected
  if (selectedDocumentId) {
    return (
      <DetailDocumentView
        documentId={selectedDocumentId}
        onBack={() => {
          setSelectedDocumentId(null);
          setSelectedDocumentTab("general");
        }}
        initialTab={selectedDocumentTab as any}
      />
    );
  }

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
           All Documents
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4" />
            <span className="hidden sm:inline">Document Control</span>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700 font-medium">All Documents</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleNewDocument}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <FileText className="mr-2 h-4 w-4" />
          New Document
        </Button>
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
      />

      {/* Table Container - Match MyTasksView wrapper */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {isLoading ? (
            // Loading Skeleton
            <div className="flex-1">
              {/* Header Skeleton */}
              <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-3.5">
                <div className="flex gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${80 + Math.random() * 40}px` }} />
                  ))}
                </div>
              </div>
              {/* Rows Skeleton */}
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <div key={rowIndex} className="border-b border-slate-100 px-4 py-3.5">
                  <div className="flex gap-4 items-center">
                    <div className="h-4 w-8 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse" style={{ maxWidth: '150px' }} />
                    <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse" style={{ maxWidth: '200px' }} />
                    <div className="h-4 flex-1 bg-slate-200 rounded animate-pulse" style={{ maxWidth: '120px' }} />
                    <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
              {/* Pagination Skeleton */}
              <div className="border-t border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : paginatedDocuments.length > 0 ? (
            <>
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
                        : column.id === 'no'
                        ? "text-left"
                        : column.id === 'title'
                        ? "text-left min-w-[250px]"
                        : "text-left"
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDocuments.map((doc, docIndex) => {
                const renderCell = (columnId: string) => {
                  const cellContent = (() => {
                    switch (columnId) {
                      case 'no':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-left text-slate-700">
                            {(currentPage - 1) * itemsPerPage + docIndex + 1}
                          </td>
                        );
                      case 'documentId':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className="font-medium text-emerald-600">{doc.documentId}</span>
                          </td>
                        );
                      case 'created':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {formatDate(doc.created)}
                          </td>
                        );
                      case 'openedBy':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {doc.openedBy}
                          </td>
                        );
                      case 'title':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className="font-medium text-slate-900">{doc.title}</span>
                          </td>
                        );
                      case 'status':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                              getStatusColor(doc.status)
                            )}>
                              {doc.status}
                            </span>
                          </td>
                        );
                      case 'type':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                              getTypeColor(doc.type)
                            )}>
                              {doc.type}
                            </span>
                          </td>
                        );
                      case 'department':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {doc.department}
                          </td>
                        );
                      case 'author':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {doc.author}
                          </td>
                        );
                      case 'effectiveDate':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {formatDate(doc.effectiveDate)}
                          </td>
                        );
                      case 'validUntil':
                        return (
                          <td key={columnId} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {formatDate(doc.validUntil)}
                          </td>
                        );
                      case 'action':
                        return (
                          <td 
                            key={columnId} 
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
                              onViewDocument={handleViewDocument}
                            />
                          </td>
                        );
                      default:
                        return null;
                    }
                  })();
                  return cellContent;
                };

                return (
                  <tr
                    key={doc.id}
                    onClick={() => handleViewDocument(doc.id)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    {visibleColumns.map((column) => renderCell(column.id))}
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
                totalItems={filteredDocuments.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            // Empty State
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                No documents found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Document Modal */}
      <NewDocumentModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        onSelectSingle={handleSelectSingleDocument}
        onSelectBatch={handleSelectBatchDocument}
      />
    </div>
  );
};
