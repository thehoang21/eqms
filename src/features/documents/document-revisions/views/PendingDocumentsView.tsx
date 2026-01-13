import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MoreVertical,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Home,
  FileText,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { DocumentFilters } from "../../DocumentFilters";
import { IconChecks, IconEyeCheck, IconInfoCircle } from "@tabler/icons-react";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";
type ViewType = "review" | "approval";

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
const MOCK_REVIEW_DOCUMENTS: Document[] = [
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

const MOCK_APPROVAL_DOCUMENTS: Document[] = [
  {
    id: "1",
    documentId: "SOP.0003.01",
    title: "Production Line Setup",
    type: "SOP",
    version: "3.0",
    status: "Pending Approval",
    effectiveDate: "-",
    validUntil: "-",
    author: "Robert Brown",
    department: "Production",
    created: "2023-09-15",
    openedBy: "Production Manager",
    description: "Procedure for setting up the production line",
  },
  {
    id: "2",
    documentId: "REP.0002.01",
    title: "Validation Report for Autoclave",
    type: "Report",
    version: "1.0",
    status: "Pending Approval",
    effectiveDate: "-",
    validUntil: "-",
    author: "Emily Davis",
    department: "Validation",
    created: "2023-09-20",
    openedBy: "Validation Specialist",
    description: "Validation report for the new autoclave",
  },
  {
    id: "3",
    documentId: "SPEC-RM-010",
    title: "Raw Material Specification: Sodium Chloride",
    type: "Specification",
    version: "2.1",
    status: "Pending Approval",
    effectiveDate: "-",
    validUntil: "-",
    author: "David Wilson",
    department: "Quality Control",
    created: "2023-09-25",
    openedBy: "QC Manager",
    description: "Specification for Sodium Chloride raw material",
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
  const showIcon = status !== "Pending Review" && status !== "Pending Approval";

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
};

const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onAction: (action: string) => void;
  viewType: ViewType;
}> = ({ isOpen, onClose, position, onAction, viewType }) => {
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
          {viewType === "review" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('review');
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <IconEyeCheck className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Review</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('approve');
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <IconChecks className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Approve</span>
            </button>
          )}
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

// --- Main Component ---

interface PendingDocumentsViewProps {
  viewType: ViewType;
  onViewDocument?: (documentId: string) => void;
}

export const PendingDocumentsView: React.FC<PendingDocumentsViewProps> = ({ viewType, onViewDocument }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  const itemsPerPage = 10;

  // Get config based on viewType
  const config = useMemo(() => {
    switch (viewType) {
      case "review":
        return {
          title: "Pending My Review",
          breadcrumbLast: "Pending My Review",
          statusFilter: "Pending Review" as DocumentStatus,
          documents: MOCK_REVIEW_DOCUMENTS,
        };
      case "approval":
        return {
          title: "Pending My Approval",
          breadcrumbLast: "Pending My Approval",
          statusFilter: "Pending Approval" as DocumentStatus,
          documents: MOCK_APPROVAL_DOCUMENTS,
        };
      default:
        return {
          title: "Pending Documents",
          breadcrumbLast: "Pending Documents",
          statusFilter: "Pending Review" as DocumentStatus,
          documents: [],
        };
    }
  }, [viewType]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return config.documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = doc.status === config.statusFilter;
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
  }, [searchQuery, config.statusFilter, config.documents, typeFilter, departmentFilter, authorFilter,
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

  const handleAction = (action: string) => {
    if (!openDropdownId) return;

    switch (action) {
      case 'view':
        onViewDocument?.(openDropdownId);
        break;
      case 'review':
        navigate(`/documents/revisions/review/${openDropdownId}`);
        break;
      case 'approve':
        navigate(`/documents/revisions/approval/${openDropdownId}`);
        break;
      case 'history':
        console.log(`View history for document ${openDropdownId}`);
        break;
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {config.title}
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
            <span className="text-slate-700 font-medium">{config.breadcrumbLast}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DocumentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={config.statusFilter}
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
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">No.</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Document Number</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Created</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Opened By</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Document Name</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">State</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Document Type</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Department</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Author</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Effective Date</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">Valid Until</th>
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]" style={{ width: '60px' }}>Action</th>
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
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{startIndex + index + 1}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-emerald-600">{doc.documentId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.created}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.openedBy}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">{doc.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap"><StatusBadge status={doc.status} /></td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.type}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.department}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.author}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.effectiveDate}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{doc.validUntil}</td>
                    <td
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="py-12 text-center">
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
        onAction={handleAction}
        viewType={viewType}
      />
    </div>
  );
};
