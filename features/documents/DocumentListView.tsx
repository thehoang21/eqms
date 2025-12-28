import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
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
} from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import { Select } from "../../components/ui/select/Select";
import { cn } from "../../components/ui/utils";
import { NewDocumentView } from "./new-document";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";

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
  onViewDocument?: (documentId: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  document,
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
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="py-1">
          <button
            onClick={() => {
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
            onClick={() => {
              console.log("Download document:", document.id);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => {
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
    // document.body
  );
};

// --- Main Component ---

interface DocumentListViewProps {
  onViewDocument?: (documentId: string) => void;
}

export const DocumentListView: React.FC<DocumentListViewProps> = ({ onViewDocument }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});
  const [showNewDocument, setShowNewDocument] = useState(false);

  const itemsPerPage = 10;

  const handleNewDocument = () => {
    setShowNewDocument(true);
  };

  const handleSaveDocument = async (data: any) => {
    console.log("Saving new document:", data);
    // TODO: Implement API call to save document
    // After successful save, go back to list
    setShowNewDocument(false);
  };

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

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

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

  // Show NewDocumentView if needed
  if (showNewDocument) {
    return (
      <NewDocumentView
        onBack={() => setShowNewDocument(false)}
        onSave={handleSaveDocument}
      />
    );
  }

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
           All Documents
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-medium">Document Management</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-medium">All Documents</span>
          </div>
        </div>
        <Button 
          onClick={handleNewDocument}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {/* Filters Card - Match MyTasksView style */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search - Takes more space */}
          <div className="xl:col-span-6 w-full">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <input
                type="text"
                 placeholder="Search by document name, ID, author, department, opened by..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 h-11 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="xl:col-span-3 w-full">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value as DocumentStatus | "All");
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Draft", value: "Draft"},
                { label: "Pending Review", value: "Pending Review"},
                { label: "Pending Approval", value: "Pending Approval"},
                { label: "Approved", value: "Approved"},
                { label: "Effective", value: "Effective"},
                { label: "Archive", value: "Archive"},
              ]}
              placeholder="Select status"
              searchPlaceholder="Search status..."
            />
          </div>

          {/* Type Filter */}
          <div className="xl:col-span-3 w-full">
            <Select
              label="Document Type"
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value as DocumentType | "All");
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "SOP", value: "SOP" },
                { label: "Policy", value: "Policy" },
                { label: "Form", value: "Form" },
                { label: "Report", value: "Report" },
                { label: "Specification", value: "Specification" },
                { label: "Protocol", value: "Protocol" },
              ]}
              placeholder="Select type"
              searchPlaceholder="Search type..."
            />
          </div>
        </div>
      </div>

      {/* Table Container - Match MyTasksView wrapper */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {paginatedDocuments.length > 0 ? (
            <>
              {/* Table with Horizontal Scroll */}
              <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
              <tr>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  No.
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Document Number
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Created
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Opened By
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[250px]">
                  Document Name
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  State
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Document Type
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Author
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Effective Date
                </th>
                <th className="text-left py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Valid Until
                </th>
                <th className="sticky right-0 bg-slate-50/80 text-center py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDocuments.map((doc) => {
                return (
                  <tr
                    key={doc.id}
                    onClick={() => onViewDocument?.(doc.id)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    {/* No. */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center text-slate-700">
                      {(currentPage - 1) * itemsPerPage + paginatedDocuments.indexOf(doc) + 1}
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
                    
                      {/* Opened By */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        {doc.openedBy}
                    </td>
                    
                      {/* Document Name */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{doc.title}</span>
                        </div>
                    </td>
                    
                      {/* State */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span
                        className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
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
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
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
                      <td className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50">
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
    </div>
  );
};
