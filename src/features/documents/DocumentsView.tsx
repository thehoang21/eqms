import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Home,
  ChevronRight,
  MoreVertical,
  Download,
  History,
  Link2,
  FilePlusCorner,
  FileStack,
  SquarePen,
} from "lucide-react";
import {
  IconInfoCircle,
  IconEyeCheck,
  IconChecks,
  IconFileDownload,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { DocumentFilters } from "./DocumentFilters";
import { DetailDocumentView } from "./detail-document/DetailDocumentView";
import { NewDocumentModal } from "./all-document/new-document/NewDocumentModal";
import { CreateLinkModal } from "./CreateLinkModal";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";
type ViewType = "all" | "owned-by-me";

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
  hasRelatedDocuments?: boolean;
}

// --- Mock Data ---
const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    documentId: "SOP.0001.03",
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
    hasRelatedDocuments: true,
  },
  {
    id: "2",
    documentId: "POL.0005.02",
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
    hasRelatedDocuments: false,
  },
  {
    id: "3",
    documentId: "SOP.0012.04",
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
    hasRelatedDocuments: true,
  },
  {
    id: "4",
    documentId: "FORM.0001.01",
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
    hasRelatedDocuments: false,
  },
  {
    id: "5",
    documentId: "SPEC.0045.02",
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
    hasRelatedDocuments: true,
  },
  {
    id: "6",
    documentId: "PROT.0008.03",
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
    hasRelatedDocuments: false,
  },
  {
    id: "7",
    documentId: "REP.0001.01",
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
    hasRelatedDocuments: true,
  },
  {
    id: "8",
    documentId: "SOP.0023.05",
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
    hasRelatedDocuments: false,
  },
  {
    id: "9",
    documentId: "SOP.0007.02",
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
    documentId: "POL.0002.01",
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
  {
    id: "11",
    documentId: "SOP.0015.04",
    title: "Good Manufacturing Practice Guidelines",
    type: "SOP",
    version: "4.2",
    status: "Pending Approval",
    effectiveDate: "2023-10-15",
    validUntil: "2024-10-15",
    author: "Michael Chen",
    department: "Manufacturing",
    created: "2023-09-01",
    openedBy: "Manufacturing Manager",
    description: "Comprehensive GMP guidelines for pharmaceutical manufacturing",
  },
];

// Mock current user
const CURRENT_USER = {
  id: "1",
  name: "Dr. Sarah Johnson",
  role: "Quality Manager",
};

// --- Helper Functions ---

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Approved":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Approval":
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
  navigate: ReturnType<typeof useNavigate>;
  onPrintControlledCopy?: (document: Document) => void;
  onCreateLink?: (document: Document) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  document,
  isOpen,
  onClose,
  position,
  onViewDocument,
  navigate,
  onPrintControlledCopy,
  onCreateLink,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  if (!isOpen) return null;

  // Check if document has parent-child relationships
  const hasRelationships = (doc: Document): boolean => {
    return doc.hasRelatedDocuments === true;
  };

  // Handle New Revision with relationship check
  const handleNewRevision = async (doc: Document) => {
    setIsNavigating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      if (doc.status === "Effective" && doc.hasRelatedDocuments) {
        // Navigate to NewRevisionView (multi-document with related documents)
        navigate(`/documents/revisions/new-multi?sourceDocId=${doc.id}`);
      } else if (doc.status === "Effective") {
        // Navigate to StandaloneRevisionView (single document)
        navigate(`/documents/revisions/new-standalone?sourceDocId=${doc.id}`);
      } else {
        // Fallback for non-Effective documents
        navigate(`/documents/revisions/new?sourceDocId=${doc.id}`);
      }
      onClose();
    } catch (error) {
      console.error("Error checking relationships:", error);
      navigate(`/documents/revisions/new?sourceDocId=${doc.id}`);
      onClose();
    } finally {
      setIsNavigating(false);
    }
  };

  // Dynamic menu items based on document status
  const getMenuItems = () => {
    const items = [];

    // Always available: View Details
    items.push({
      icon: IconInfoCircle,
      label: "View Details",
      onClick: () => {
        onViewDocument?.(document.id);
        onClose();
      },
      color: "text-slate-500"
    });

    // Status-specific actions
    switch (document.status) {
      case "Draft":
        items.push(
          {
            icon: SquarePen,
            label: "Edit Document",
            onClick: () => {
              console.log("Edit document:", document.id);
              onClose();
            },
            color: "text-slate-500"
          }
        );
        break;

      case "Pending Review":
        items.push({
          icon: IconEyeCheck,
          label: "Review Document",
          onClick: () => {
            navigate(`/documents/${document.id}/review`);
            onClose();
          },
          color: "text-slate-500"
        });
        break;

      case "Pending Approval":
        items.push({
          icon: IconChecks,
          label: "Approve Document",
          onClick: () => {
            navigate(`/documents/${document.id}/approval`);
            onClose();
          },
          color: "text-slate-500"
        });
        break;

      case "Approved":
        items.push({
          icon: IconFileDownload,
          label: "Download PDF",
          onClick: () => {
            console.log("Download PDF:", document.id);
            onClose();
          },
          color: "text-slate-500"
        });
        break;

      case "Effective":
        items.push(
          {
            icon: FilePlusCorner,
            label: "New Revision",
            onClick: () => handleNewRevision(document),
            color: "text-slate-500",
            disabled: isNavigating
          },
          {
            icon: FileStack,
            label: "Request Controlled Copy",
            onClick: () => {
              onPrintControlledCopy?.(document);
              onClose();
            },
            color: "text-slate-500"
          },
          {
            icon: Download,
            label: "Download PDF",
            onClick: () => {
              console.log("Download PDF:", document.id);
              onClose();
            },
            color: "text-slate-500"
          }
        );
        break;

      case "Archive":
        break;
    }

    // Always available: Create Shareable Link
    items.push({
      icon: Link2,
      label: "Create Shareable Link",
      onClick: () => {
        onCreateLink?.(document);
        onClose();
      },
      color: "text-slate-500"
    });

    // Always available: Version History & Audit Trail
    items.push({
      icon: History,
      label: "View Audit Trail",
      onClick: () => {
        onViewDocument?.(document.id, "audit");
        onClose();
      },
      color: "text-slate-500"
    });

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
                  if (!item.disabled) {
                    item.onClick();
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  item.color
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

// --- Main Component ---

interface DocumentsViewProps {
  viewType: ViewType;
  onViewDocument?: (documentId: string, tab?: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ viewType, onViewDocument }) => {
  const navigate = useNavigate();

  // Configuration based on viewType
  const config = useMemo(() => {
    switch (viewType) {
      case "all":
        return {
          title: "All Documents",
          breadcrumbLast: "All Documents",
          showNewDocButton: true,
          showRelatedDocumentsColumn: true,
          filterDocuments: (docs: Document[]) => docs,
          authorFilterDisabled: false,
          defaultAuthorFilter: "All" as string,
          defaultColumns: [
            { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
            { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
            { id: 'created', label: 'Created', visible: true, order: 2 },
            { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
            { id: 'title', label: 'Document Name', visible: true, order: 4 },
            { id: 'status', label: 'State', visible: true, order: 5 },
            { id: 'type', label: 'Document Type', visible: true, order: 6 },
            { id: 'relatedDocuments', label: 'Related Document', visible: true, order: 7 },
            { id: 'department', label: 'Department', visible: true, order: 8 },
            { id: 'author', label: 'Author', visible: true, order: 9 },
            { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 10 },
            { id: 'validUntil', label: 'Valid Until', visible: true, order: 11 },
            { id: 'action', label: 'Action', visible: true, order: 12, locked: true },
          ] as TableColumn[],
        };
      case "owned-by-me":
        return {
          title: "Documents Owned By Me",
          breadcrumbLast: "Documents Owned By Me",
          showNewDocButton: false,
          showRelatedDocumentsColumn: true, // Match "all" configuration
          filterDocuments: (docs: Document[]) => docs.filter(doc => doc.author === CURRENT_USER.name),
          authorFilterDisabled: true,
          defaultAuthorFilter: CURRENT_USER.name,
          defaultColumns: [
            { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
            { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
            { id: 'created', label: 'Created', visible: true, order: 2 },
            { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
            { id: 'title', label: 'Document Name', visible: true, order: 4 },
            { id: 'status', label: 'State', visible: true, order: 5 },
            { id: 'type', label: 'Document Type', visible: true, order: 6 },
            { id: 'relatedDocuments', label: 'Related Document', visible: true, order: 7 },
            { id: 'department', label: 'Department', visible: true, order: 8 },
            { id: 'author', label: 'Author', visible: true, order: 9 },
            { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 10 },
            { id: 'validUntil', label: 'Valid Until', visible: true, order: 11 },
            { id: 'action', label: 'Action', visible: true, order: 12, locked: true },
          ] as TableColumn[],
        };
    }
  }, [viewType]);

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
  const [authorFilter, setAuthorFilter] = useState<string>(config.defaultAuthorFilter);
  const [versionFilter, setVersionFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [columns, setColumns] = useState<TableColumn[]>(config.defaultColumns);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedDocumentForLink, setSelectedDocumentForLink] = useState<Document | null>(null);

  const itemsPerPage = 10;

  // Update authorFilter when viewType changes
  useEffect(() => {
    setAuthorFilter(config.defaultAuthorFilter);
  }, [viewType, config.defaultAuthorFilter]);

  // Update columns when viewType changes
  useEffect(() => {
    setColumns(config.defaultColumns);
  }, [viewType, config.defaultColumns]);

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
    const document = MOCK_DOCUMENTS.find(doc => doc.id === documentId);
    
    if (document?.status === "Pending Review") {
      navigate(`/documents/${documentId}/review`);
    } else if (document?.status === "Pending Approval") {
      navigate(`/documents/${documentId}/approval`);
    } else {
      setSelectedDocumentId(documentId);
      setSelectedDocumentTab(tab);
    }
  };

  const handleCreateLink = (document: Document) => {
    setSelectedDocumentForLink(document);
    setIsCreateLinkModalOpen(true);
  };

  const handlePrintControlledCopy = (document: Document) => {
    const relatedDocuments = document.hasRelatedDocuments
      ? (() => {
          const relatedDocs = [
            {
              id: document.id,
              documentId: document.documentId,
              title: document.title,
              version: document.version,
              status: document.status as any,
              isParent: true,
            },
          ];

          if (document.documentId.startsWith('SOP.0001')) {
            relatedDocs.push(
              {
                id: "child-1",
                documentId: "FORM-QC-001",
                title: "Quality Control Test Form",
                version: "2.0",
                status: "Effective" as any,
                isParent: false,
              },
              {
                id: "child-2",
                documentId: "SPEC-QC-002",
                title: "Test Specification Document",
                version: "1.5",
                status: "Effective" as any,
                isParent: false,
              }
            );
          } else if (document.documentId.startsWith('SOP.0012')) {
            relatedDocs.push(
              {
                id: "child-3",
                documentId: "FORM-PROD-001",
                title: "Batch Record Template",
                version: "3.0",
                status: "Effective" as any,
                isParent: false,
              }
            );
          } else if (document.documentId.startsWith('SPEC.0045')) {
            relatedDocs.push(
              {
                id: "child-4",
                documentId: "SOP-QC-015",
                title: "Raw Material Testing SOP",
                version: "2.1",
                status: "Effective" as any,
                isParent: false,
              }
            );
          }

          return relatedDocs;
        })()
      : [];

    navigate('/documents/controlled-copy/request', {
      state: {
        documentId: document.documentId,
        documentTitle: document.title,
        documentVersion: document.version,
        relatedDocuments,
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter documents based on viewType and filters
  const filteredDocuments = useMemo(() => {
    // First apply viewType-specific filtering
    let docs = config.filterDocuments(MOCK_DOCUMENTS);

    // Then apply user filters
    return docs.filter((doc) => {
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
      createdFromDate, createdToDate, effectiveFromDate, effectiveToDate, validFromDate, validToDate, config]);

  const visibleColumns = useMemo(() => {
    return columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
  }, [columns]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage]);

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

  const getButtonRef = (docId: string) => {
    if (!buttonRefs.current[docId]) {
      buttonRefs.current[docId] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[docId];
  };

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
            {config.title}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Document Control</span>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700 font-medium">{config.breadcrumbLast}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
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
          {config.showNewDocButton && (
            <Button
              onClick={handleNewDocument}
              size="sm"
              className="whitespace-nowrap gap-2"
            >
              <IconPlus className="h-4 w-4" />
              New Document
            </Button>
          )}
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
        authorFilterDisabled={config.authorFilterDisabled}
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
      />

      {/* Table Container with Pagination */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {visibleColumns.map(col => (
                  <th
                    key={col.id}
                    className={cn(
                      "py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                      col.id === 'action' && "sticky right-0 bg-slate-50 text-center z-40 backdrop-blur-sm shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedDocuments.map((doc, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr
                    key={doc.id}
                    onClick={() => handleViewDocument(doc.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {visibleColumns.map(col => {
                      if (col.id === 'no') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                            {globalIndex}
                          </td>
                        );
                      }
                      if (col.id === 'documentId') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className="font-medium text-emerald-600">{doc.documentId}</span>
                          </td>
                        );
                      }
                      if (col.id === 'created') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {formatDate(doc.created)}
                          </td>
                        );
                      }
                      if (col.id === 'openedBy') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {doc.openedBy}
                          </td>
                        );
                      }
                      if (col.id === 'title') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <div className="font-medium text-slate-900">
                              {doc.title}
                            </div>
                          </td>
                        );
                      }
                      if (col.id === 'status') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                              getStatusColor(doc.status)
                            )}>
                              {doc.status}
                            </span>
                          </td>
                        );
                      }
                      if (col.id === 'type') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                              getTypeColor(doc.type)
                            )}>
                              {doc.type}
                            </span>
                          </td>
                        );
                      }
                      if (col.id === 'relatedDocuments' && config.showRelatedDocumentsColumn) {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                            {doc.hasRelatedDocuments ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                Yes
                              </span>
                            ) : (
                              <span className="text-slate-600 font-medium">No</span>
                            )}
                          </td>
                        );
                      }
                      if (col.id === 'department') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {doc.department}
                          </td>
                        );
                      }
                      if (col.id === 'author') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {doc.author}
                          </td>
                        );
                      }
                      if (col.id === 'effectiveDate') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {formatDate(doc.effectiveDate)}
                          </td>
                        );
                      }
                      if (col.id === 'validUntil') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {formatDate(doc.validUntil)}
                          </td>
                        );
                      }
                      if (col.id === 'action') {
                        return (
                          <td
                            key={col.id}
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
                              navigate={navigate}
                              onPrintControlledCopy={handlePrintControlledCopy}
                              onCreateLink={handleCreateLink}
                            />
                          </td>
                        );
                      }
                      return null;
                    })}
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
          totalItems={filteredDocuments.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* New Document Modal */}
      <NewDocumentModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        onSelectSingle={handleSelectSingleDocument}
        onSelectBatch={handleSelectBatchDocument}
      />

      {/* Create Shareable Link Modal */}
      {selectedDocumentForLink && (
        <CreateLinkModal
          isOpen={isCreateLinkModalOpen}
          onClose={() => {
            setIsCreateLinkModalOpen(false);
            setSelectedDocumentForLink(null);
          }}
          documentId={selectedDocumentForLink.documentId}
          documentTitle={selectedDocumentForLink.title}
        />
      )}
    </div>
  );
};
