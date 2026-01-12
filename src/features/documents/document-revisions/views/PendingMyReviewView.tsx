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
  FileText,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import { DocumentFilters } from "../../DocumentFilters";
import { IconInfoCircle } from "@tabler/icons-react";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";

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
    documentId: "SOP.0002.01",
    title: "Batch Record Review Procedure",
    type: "SOP",
    version: "1.0",
    status: "Pending Review",
    effectiveDate: "-",
    validUntil: "-",
    author: "John Doe",
    department: "Quality Assurance",
    created: "2023-10-01",
    openedBy: "QA Admin",
    description: "Procedure for reviewing batch records",
  },
  {
    id: "2",
    documentId: "POL.0001.01",
    title: "Information Security Policy",
    type: "Policy",
    version: "2.0",
    status: "Pending Review",
    effectiveDate: "-",
    validUntil: "-",
    author: "Jane Smith",
    department: "IT",
    created: "2023-10-05",
    openedBy: "IT Manager",
    description: "Policy for information security",
  },
  {
    id: "3",
    documentId: "FORM.0005.01",
    title: "Lab Equipment Calibration Log",
    type: "Form",
    version: "1.2",
    status: "Pending Review",
    effectiveDate: "-",
    validUntil: "-",
    author: "Mike Johnson",
    department: "Quality Control",
    created: "2023-10-10",
    openedBy: "QC Supervisor",
    description: "Log for equipment calibration",
  },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  const styles = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
    "Pending Approval": "bg-blue-50 text-blue-700 border-blue-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Effective: "bg-green-50 text-green-700 border-green-200",
    Archive: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons = {
    Draft: History,
    "Pending Review": AlertCircle,
    "Pending Approval": Clock,
    Approved: CheckCircle2,
    Effective: CheckCircle2,
    Archive: History,
  };

  const Icon = icons[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
};

const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onAction: (action: string) => void;
}> = ({ isOpen, onClose, position, onAction }) => {
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
        className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: position.top, left: position.left }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('view');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('review');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Review</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('history');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <History className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">History</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const ColumnCustomizer: React.FC<{
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}> = ({ columns, onColumnsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const reorderableColumns = useMemo(() => 
    [...columns].sort((a, b) => a.order - b.order)
  , [columns]);

  const toggleVisibility = (id: string) => {
    if (columns.find(c => c.id === id)?.locked) return;
    
    const newColumns = columns.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...reorderableColumns];
    const draggedItem = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedItem);

    // Update order
    const updatedColumns = newColumns.map((col, idx) => ({
      ...col,
      order: idx
    }));

    onColumnsChange(updatedColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

interface PendingMyReviewViewProps {
  onViewDocument?: (documentId: string) => void;
}

export const PendingMyReviewView: React.FC<PendingMyReviewViewProps> = ({ onViewDocument }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter] = useState<DocumentStatus | "All">("Pending Review"); // Fixed to Pending Review
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
            Pending My Review
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
            <span className="text-slate-700 font-medium">Pending My Review</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DocumentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={() => {}} // No-op since disabled
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        authorFilter={authorFilter}
        onAuthorChange={setAuthorFilter}
        createdFromDate={createdFromDate}
        onCreatedFromDateChange={setCreatedFromDate}
        createdToDate={createdToDate}
        onCreatedToDateChange={setCreatedToDate}
        effectiveFromDate={effectiveFromDate}
        onEffectiveFromDateChange={setEffectiveFromDate}
        effectiveToDate={effectiveToDate}
        onEffectiveToDateChange={setEffectiveToDate}
        validFromDate={validFromDate}
        onValidFromDateChange={setValidFromDate}
        validToDate={validToDate}
        onValidToDateChange={setValidToDate}
        disableStatusFilter={true}
      />

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.sort((a, b) => a.order - b.order).map((column) => {
                  if (!column.visible) return null;
                  
                  if (column.id === 'action') {
                    return (
                      <th 
                        key={column.id}
                        className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]"
                        style={{ width: '60px' }}
                      >
                        {column.label}
                      </th>
                    );
                  }

                  return (
                    <th
                      key={column.id}
                      className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {currentDocuments.length > 0 ? (
                currentDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    onClick={() => onViewDocument?.(doc.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {columns.sort((a, b) => a.order - b.order).map((column) => {
                      if (!column.visible) return null;

                      if (column.id === 'action') {
                        return (
                          <td
                            key={column.id}
                            onClick={(e) => e.stopPropagation()}
                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                          >
                            <button
                              ref={getButtonRef(doc.id)}
                              onClick={(e) => handleDropdownToggle(doc.id, e)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-slate-600" />
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                          {column.id === 'no' && startIndex + index + 1}
                          {column.id === 'documentId' && (
                            <span className="font-medium text-emerald-600">{doc.documentId}</span>
                          )}
                          {column.id === 'created' && doc.created}
                          {column.id === 'openedBy' && doc.openedBy}
                          {column.id === 'title' && (
                            <span className="font-medium text-slate-900">{doc.title}</span>
                          )}
                          {column.id === 'status' && <StatusBadge status={doc.status} />}
                          {column.id === 'type' && doc.type}
                          {column.id === 'department' && doc.department}
                          {column.id === 'author' && doc.author}
                          {column.id === 'effectiveDate' && doc.effectiveDate}
                          {column.id === 'validUntil' && doc.validUntil}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.filter(c => c.visible).length} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">No documents found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-slate-900">{Math.min(endIndex, filteredDocuments.length)}</span> of{" "}
            <span className="font-medium text-slate-900">{filteredDocuments.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Portal */}
      <DropdownMenu
        isOpen={!!openDropdownId}
        onClose={() => setOpenDropdownId(null)}
        position={dropdownPosition}
        onAction={(action) => {
          console.log(`Action ${action} on document ${openDropdownId}`);
          // Handle actions
        }}
      />
    </div>
  );
};
