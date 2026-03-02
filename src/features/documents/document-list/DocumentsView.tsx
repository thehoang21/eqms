import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '@/app/routes.constants';
import { createPortal } from "react-dom";
import {
  Home,
  ChevronRight,
  MoreVertical,
  Download,
  History,
  Link2,
  SquarePen,
} from "lucide-react";
import {
  IconInfoCircle,
  IconEyeCheck,
  IconChecks,
  IconFileDownload,
  IconPlus,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { StatusBadge, StatusType } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { formatDateUS } from "@/utils/format";
import { DocumentFilters } from "./../shared/components/DocumentFilters";
import { DetailDocumentView } from "../document-detail/DetailDocumentView";
import { CreateLinkModal } from "./../shared/components/CreateLinkModal";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";

import { MOCK_DOCUMENTS } from './mockData';
import type { Document } from './mockData';

// --- Types ---
type ViewType = "all" | "owned-by-me";

interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

// Mock current user
const CURRENT_USER = {
  id: "1",
  name: "Dr. Sarah Johnson",
  role: "Quality Manager",
};

// --- Helper Functions ---

// Map DocumentStatus to StatusType for StatusBadge component
const mapDocumentStatusToStatusType = (status: DocumentStatus): StatusType => {
  switch (status) {
    case "Active":
      return "active";
    case "Effective":
      return "effective";
    case "Approved":
      return "approved";
    case "Pending Approval":
      return "pendingApproval";
    case "Pending Review":
      return "pendingReview";
    case "Draft":
      return "draft";
    case "Obsoleted":
      return "obsolete";
    case "Closed - Cancelled":
      return "archived";
    default:
      return "draft";
  }
};

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Active":
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Obsoleted":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Closed - Cancelled":
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

// --- Dropdown Component ---

interface DropdownMenuProps {
  document: Document;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
  onViewDocument?: (documentId: string, tab?: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  onCreateLink?: (document: Document) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  document,
  isOpen,
  onClose,
  position,
  onViewDocument,
  navigate,
  onCreateLink,
}) => {
  if (!isOpen) return null;

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
            navigate(ROUTES.DOCUMENTS.REVISIONS.REVIEW(document.id));
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
            navigate(ROUTES.DOCUMENTS.REVISIONS.APPROVAL(document.id));
            onClose();
          },
          color: "text-slate-500"
        });
        break;

      case "Active":
      case "Effective":
      case "Obsoleted":
      case "Closed - Cancelled":
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
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: position.showAbove ? 'translateY(-100%)' : 'none'
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
                  "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors",
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
          allowedStatuses: ["Draft", "Active", "Obsoleted", "Closed - Cancelled"] as DocumentStatus[],
          defaultColumns: [
            { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
            { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
            { id: 'created', label: 'Created', visible: true, order: 2 },
            { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
            { id: 'title', label: 'Document Name', visible: true, order: 4 },
            { id: 'status', label: 'State', visible: true, order: 5 },
            { id: 'type', label: 'Document Type', visible: true, order: 6 },
            { id: 'relatedDocuments', label: 'Related Document', visible: true, order: 7 },
            { id: 'correlatedDocuments', label: 'Correlated Document', visible: true, order: 8 },
            { id: 'department', label: 'Department', visible: true, order: 9 },
            { id: 'author', label: 'Author', visible: true, order: 10 },
            { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 11 },
            { id: 'validUntil', label: 'Valid Until', visible: true, order: 12 },
            { id: 'action', label: 'Action', visible: true, order: 13, locked: true },
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
          allowedStatuses: ["Draft", "Active", "Obsoleted", "Closed - Cancelled"] as DocumentStatus[],
          defaultColumns: [
            { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
            { id: 'documentId', label: 'Document Number', visible: true, order: 1 },
            { id: 'created', label: 'Created', visible: true, order: 2 },
            { id: 'openedBy', label: 'Opened By', visible: true, order: 3 },
            { id: 'title', label: 'Document Name', visible: true, order: 4 },
            { id: 'status', label: 'State', visible: true, order: 5 },
            { id: 'type', label: 'Document Type', visible: true, order: 6 },
            { id: 'relatedDocuments', label: 'Related Document', visible: true, order: 7 },
            { id: 'correlatedDocuments', label: 'Correlated Document', visible: true, order: 8 },
            { id: 'department', label: 'Department', visible: true, order: 9 },
            { id: 'author', label: 'Author', visible: true, order: 10 },
            { id: 'effectiveDate', label: 'Effective Date', visible: true, order: 11 },
            { id: 'validUntil', label: 'Valid Until', visible: true, order: 12 },
            { id: 'action', label: 'Action', visible: true, order: 13, locked: true },
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const buttonRefs = React.useRef<{ [key: string]: React.RefObject<HTMLButtonElement | null> }>({});
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocumentTab, setSelectedDocumentTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedDocumentForLink, setSelectedDocumentForLink] = useState<Document | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Update authorFilter when viewType changes
  useEffect(() => {
    setAuthorFilter(config.defaultAuthorFilter);
  }, [viewType, config.defaultAuthorFilter]);

  // Update columns when viewType changes
  useEffect(() => {
    setColumns(config.defaultColumns);
  }, [viewType, config.defaultColumns]);

  const handleNewDocument = () => {
    navigate(ROUTES.DOCUMENTS.NEW);
  };

  const handleViewDocument = (documentId: string, tab: string = "general") => {
    const document = MOCK_DOCUMENTS.find(doc => doc.id === documentId);
    
    if (document?.status === "Pending Review") {
      navigate(ROUTES.DOCUMENTS.REVISIONS.REVIEW(documentId));
    } else if (document?.status === "Pending Approval") {
      navigate(ROUTES.DOCUMENTS.REVISIONS.APPROVAL(documentId));
    } else {
      setSelectedDocumentId(documentId);
      setSelectedDocumentTab(tab);
    }
  };

  const handleCreateLink = (document: Document) => {
    setSelectedDocumentForLink(document);
    setIsCreateLinkModalOpen(true);
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

    // Filter by allowed statuses for the current view
    if (config.allowedStatuses) {
      docs = docs.filter(doc => config.allowedStatuses!.includes(doc.status));
    }

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
      
      // Menu dimensions (varies by status, estimate max)
      const menuHeight = 200;
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
      setOpenDropdownId(docId);
    }
  };

  const getButtonRef = (docId: string) => {
    if (!buttonRefs.current[docId]) {
      buttonRefs.current[docId] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[docId];
  };

  const selectedDocument = useMemo(() => 
    MOCK_DOCUMENTS.find(doc => doc.id === selectedDocumentId),
    [selectedDocumentId]
  );

  if (selectedDocumentId && selectedDocument) {
    return (
      <DetailDocumentView
        documentId={selectedDocumentId}
        initialStatus={selectedDocument.status}
        customStatusSteps={["Draft", "Active", "Obsoleted", "Closed - Cancelled"]}
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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            {config.title}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Document Control</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">{config.breadcrumbLast}</span>
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
        allowedStatuses={config.allowedStatuses}
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

      {/* Table Container with Pagination */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        {paginatedDocuments.length > 0 ? (
          <>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
              <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {visibleColumns.map(col => (
                  <th
                    key={col.id}
                    className={cn(
                      "py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                      col.id === 'action' && "sticky right-0 bg-slate-50 text-center z-10 backdrop-blur-sm shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200"
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
                            {formatDateUS(doc.created)}
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
                            <StatusBadge status={mapDocumentStatusToStatusType(doc.status)} />
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
                      if (col.id === 'correlatedDocuments') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                            {doc.hasCorrelatedDocuments ? (
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
                            {formatDateUS(doc.effectiveDate)}
                          </td>
                        );
                      }
                      if (col.id === 'validUntil') {
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {formatDateUS(doc.validUntil)}
                          </td>
                        );
                      }
                      if (col.id === 'action') {
                        return (
                          <td
                            key={col.id}
                            onClick={(e) => e.stopPropagation()}
                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                          >
                            <button
                              ref={getButtonRef(doc.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDropdownToggle(doc.id, e);
                              }}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
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
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredDocuments.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
          </>
        ) : (
          <TableEmptyState
            title="No Documents Found"
            description="We couldn't find any documents matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("All");
              setTypeFilter("All");
              setDepartmentFilter("All");
              setCreatedFromDate("");
              setCreatedToDate("");
              setEffectiveFromDate("");
              setEffectiveToDate("");
              setValidFromDate("");
              setValidToDate("");
              setAuthorFilter(config.defaultAuthorFilter);
              setVersionFilter("");
              setCurrentPage(1);
            }}
          />
        )}
      </div>

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