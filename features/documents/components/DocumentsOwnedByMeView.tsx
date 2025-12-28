import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Filter,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import { Select, SelectOption } from "../../../components/ui/select/Select";
import { cn } from "../../../components/ui/utils";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Under Review" | "Approved" | "Obsolete" | "Effective";

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
    status: "Under Review",
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
    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Approved":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Obsolete":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case "Draft":
      return <Clock className="h-3.5 w-3.5" />;
    case "Under Review":
      return <AlertCircle className="h-3.5 w-3.5" />;
    case "Approved":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "Effective":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "Obsolete":
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
    document.body
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
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Documents Owned By Me
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span>Document Management</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-medium">Documents Owned By Me</span>
          </div>
        </div>
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
                { value: "All", label: "All" },
                { value: "Draft", label: "Draft" },
                { value: "Under Review", label: "Under Review" },
                { value: "Approved", label: "Approved" },
                { value: "Effective", label: "Effective" },
                { value: "Obsolete", label: "Obsolete" },
              ]}
              placeholder="Select Status"
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
                { value: "All", label: "All" },
                { value: "SOP", label: "SOP" },
                { value: "Policy", label: "Policy" },
                { value: "Form", label: "Form" },
                { value: "Report", label: "Report" },
                { value: "Specification", label: "Specification" },
                { value: "Protocol", label: "Protocol" },
              ]}
              placeholder="Select Type"
            />
          </div>
        </div>
      </div>

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
          onPageChange={setCurrentPage}
          startItem={startIndex + 1}
          endItem={Math.min(endIndex, filteredDocuments.length)}
          totalItems={filteredDocuments.length}
        />
      </div>
    </div>
  );
};
