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
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { DocumentFilters } from "@/features/documents/shared/components";
import {
  IconChecks,
  IconEyeCheck,
  IconInfoCircle,
  IconFileExport,
  IconSmartHome,
} from "@tabler/icons-react";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";
import { MOCK_DOCUMENTS as ALL_DOCUMENTS } from "@/features/documents/views/DocumentsView";
import { MOCK_REVISIONS as ALL_REVISIONS } from "@/features/documents/document-revisions/views/RevisionListView";

// --- Types ---
type ViewType = "review" | "approval";

interface ReviewerApprover {
  userId: string;
  userName: string;
  status: "Pending" | "Approved" | "Rejected";
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
  reviewers?: ReviewerApprover[];
  approvers?: ReviewerApprover[];
}

// --- Mock Data ---
// Current logged-in user (simulated)
const CURRENT_USER = {
  id: "user-001",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@company.com",
  department: "Quality Assurance",
};

// Helper to convert Document to Revision format
const convertDocumentToRevision = (doc: any, isReview: boolean): Revision => {
  return {
    id: doc.id,
    documentNumber: doc.documentId,
    revisionNumber: doc.version,
    created: doc.created,
    openedBy: doc.openedBy,
    revisionName: doc.title,
    state: doc.status,
    author: doc.author,
    effectiveDate: doc.effectiveDate,
    validUntil: doc.validUntil,
    documentName: doc.title,
    type: doc.type,
    department: doc.department,
    // Assign current user as reviewer/approver for documents with matching status
    ...(isReview
      ? {
          reviewers: [
            {
              userId: CURRENT_USER.id,
              userName: CURRENT_USER.name,
              status: "Pending",
            },
          ],
        }
      : {
          approvers: [
            {
              userId: CURRENT_USER.id,
              userName: CURRENT_USER.name,
              status: "Pending",
            },
          ],
        }),
  };
};

// Helper to ensure Revision has reviewer/approver info
const ensureReviewerApproverInfo = (rev: any, isReview: boolean): Revision => {
  return {
    ...rev,
    ...(isReview
      ? {
          reviewers: rev.reviewers || [
            {
              userId: CURRENT_USER.id,
              userName: CURRENT_USER.name,
              status: "Pending",
            },
          ],
        }
      : {
          approvers: rev.approvers || [
            {
              userId: CURRENT_USER.id,
              userName: CURRENT_USER.name,
              status: "Pending",
            },
          ],
        }),
  };
};

const MOCK_REVIEW_REVISIONS: Revision[] = [
  {
    id: "rev-001",
    documentNumber: "SOP.0002.01",
    revisionNumber: "2.0",
    created: "2026-01-10",
    openedBy: "QA Admin",
    revisionName: "Batch Record Review Procedure Update",
    state: "Pending Review",
    author: "John Doe",
    effectiveDate: "2026-01-20",
    validUntil: "2027-01-20",
    documentName: "Batch Record Review Procedure",
    type: "SOP",
    department: "Quality Assurance",
    reviewers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
      { userId: "user-002", userName: "Michael Chen", status: "Pending" },
    ],
  },
  {
    id: "rev-002",
    documentNumber: "POL.0001.01",
    revisionNumber: "3.0",
    created: "2026-01-12",
    openedBy: "IT Manager",
    revisionName: "Information Security Policy Revision",
    state: "Pending Review",
    author: "Jane Smith",
    effectiveDate: "2026-02-01",
    validUntil: "2027-02-01",
    documentName: "Information Security Policy",
    type: "Policy",
    department: "IT",
    reviewers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
    ],
  },
  {
    id: "rev-003",
    documentNumber: "FORM.0005.01",
    revisionNumber: "1.5",
    created: "2026-01-14",
    openedBy: "QC Supervisor",
    revisionName: "Lab Equipment Calibration Log Update",
    state: "Pending Review",
    author: "Mike Johnson",
    effectiveDate: "2026-01-25",
    validUntil: "2027-01-25",
    documentName: "Lab Equipment Calibration Log",
    type: "Form",
    department: "Quality Control",
    reviewers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
      { userId: "user-003", userName: "Emma Williams", status: "Pending" },
    ],
  },
  // Revision not assigned to current user (should be filtered out)
  {
    id: "rev-007",
    documentNumber: "SOP.0010.01",
    revisionNumber: "1.0",
    created: "2026-01-13",
    openedBy: "Admin",
    revisionName: "Other Department Procedure",
    state: "Pending Review",
    author: "Other Author",
    effectiveDate: "2026-02-15",
    validUntil: "2027-02-15",
    documentName: "Other Department Document",
    type: "SOP",
    department: "Production",
    reviewers: [
      { userId: "user-999", userName: "Other Reviewer", status: "Pending" },
    ],
  },
];

const MOCK_APPROVAL_REVISIONS: Revision[] = [
  {
    id: "rev-004",
    documentNumber: "SOP.0003.01",
    revisionNumber: "4.0",
    created: "2026-01-08",
    openedBy: "Production Manager",
    revisionName: "Production Line Setup Revision",
    state: "Pending Approval",
    author: "Robert Brown",
    effectiveDate: "2026-02-01",
    validUntil: "2027-02-01",
    documentName: "Production Line Setup",
    type: "SOP",
    department: "Production",
    approvers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
      { userId: "user-004", userName: "John Davis", status: "Pending" },
    ],
  },
  {
    id: "rev-005",
    documentNumber: "REP.0002.01",
    revisionNumber: "1.0",
    created: "2026-01-09",
    openedBy: "Validation Specialist",
    revisionName: "Autoclave Validation Report",
    state: "Pending Approval",
    author: "Emily Davis",
    effectiveDate: "2026-02-05",
    validUntil: "2027-02-05",
    documentName: "Validation Report for Autoclave",
    type: "Report",
    department: "Validation",
    approvers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
    ],
  },
  {
    id: "rev-006",
    documentNumber: "SPEC.0001.01",
    revisionNumber: "2.5",
    created: "2026-01-11",
    openedBy: "QC Manager",
    revisionName: "Sodium Chloride Specification Update",
    state: "Pending Approval",
    author: "David Wilson",
    effectiveDate: "2026-02-10",
    validUntil: "2027-02-10",
    documentName: "Raw Material Specification: Sodium Chloride",
    type: "Specification",
    department: "Quality Control",
    approvers: [
      { userId: "user-001", userName: "Dr. Sarah Johnson", status: "Pending" },
      { userId: "user-005", userName: "Dr. Lisa Park", status: "Pending" },
    ],
  },
  // Revision not assigned to current user (should be filtered out)
  {
    id: "rev-008",
    documentNumber: "POL.0020.01",
    revisionNumber: "2.0",
    created: "2026-01-12",
    openedBy: "Admin",
    revisionName: "Other Policy Revision",
    state: "Pending Approval",
    author: "Other Author",
    effectiveDate: "2026-03-01",
    validUntil: "2027-03-01",
    documentName: "Other Policy Document",
    type: "Policy",
    department: "HR",
    approvers: [
      { userId: "user-888", userName: "Other Approver", status: "Pending" },
    ],
  },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  const styles: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
    "Pending Approval": "bg-blue-50 text-blue-700 border-blue-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Effective: "bg-green-50 text-green-700 border-green-200",
    Archive: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Draft: History,
    "Pending Review": AlertCircle,
    "Pending Approval": Clock,
    Approved: CheckCircle2,
    Effective: CheckCircle2,
    Archive: History,
  };

  const Icon = icons[status] || History;
  const showIcon = status !== "Pending Review" && status !== "Pending Approval";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        styles[status] || "bg-slate-100 text-slate-700 border-slate-200",
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
};

const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
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
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: position.showAbove ? "translateY(-100%)" : "none",
        }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("view");
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
                onAction("review");
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
                onAction("approve");
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
              onAction("history");
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
    document.body,
  );
};

// --- Main Component ---

interface PendingDocumentsViewProps {
  viewType: ViewType;
  onViewDocument?: (documentId: string) => void;
}

export const PendingDocumentsView: React.FC<PendingDocumentsViewProps> = ({
  viewType,
  onViewDocument,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  // Author filter is always set to current user for pending views
  const [authorFilter, setAuthorFilter] = useState<string>(CURRENT_USER.name);
  const [createdFromDate, setCreatedFromDate] = useState<string>("");
  const [createdToDate, setCreatedToDate] = useState<string>("");
  const [effectiveFromDate, setEffectiveFromDate] = useState<string>("");
  const [effectiveToDate, setEffectiveToDate] = useState<string>("");
  const [validFromDate, setValidFromDate] = useState<string>("");
  const [validToDate, setValidToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    showAbove: false,
  });
  const buttonRefs = React.useRef<{
    [key: string]: React.RefObject<HTMLButtonElement | null>;
  }>({});
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get config based on viewType
  const config = useMemo(() => {
    const isReview = viewType === "review";
    const targetStatus = isReview ? "Pending Review" : "Pending Approval";

    // Get all revisions from All Revisions view with target status
    const revisionsFromAllRevisions = ALL_REVISIONS.filter(
      (rev) => rev.state === targetStatus,
    ).map((rev) => ensureReviewerApproverInfo(rev, isReview));

    // Get all documents from All Documents view with target status and convert to Revision format
    const documentsAsRevisions = ALL_DOCUMENTS.filter(
      (doc) => doc.status === targetStatus,
    ).map((doc) => convertDocumentToRevision(doc, isReview));

    // Combine with existing mock data
    const existingMockData = isReview
      ? MOCK_REVIEW_REVISIONS
      : MOCK_APPROVAL_REVISIONS;

    // Merge all sources (deduplicate by id)
    const allRevisions = [
      ...existingMockData,
      ...revisionsFromAllRevisions,
      ...documentsAsRevisions,
    ];
    const uniqueRevisions = Array.from(
      new Map(allRevisions.map((item) => [item.id, item])).values(),
    );

    switch (viewType) {
      case "review":
        return {
          title: "Pending My Review",
          breadcrumbLast: "Pending My Review",
          statusFilter: "Pending Review" as DocumentStatus,
          revisions: uniqueRevisions,
        };
      case "approval":
        return {
          title: "Pending My Approval",
          breadcrumbLast: "Pending My Approval",
          statusFilter: "Pending Approval" as DocumentStatus,
          revisions: uniqueRevisions,
        };
      default:
        return {
          title: "Pending Documents",
          breadcrumbLast: "Pending Documents",
          statusFilter: "Pending Review" as DocumentStatus,
          revisions: [],
        };
    }
  }, [viewType]);

  // Filter revisions - only show revisions assigned to current user
  const filteredRevisions = useMemo(() => {
    return config.revisions.filter((rev) => {
      // First check if current user is assigned as reviewer/approver
      const isAssignedToCurrentUser =
        viewType === "review"
          ? rev.reviewers?.some(
              (r) => r.userId === CURRENT_USER.id && r.status === "Pending",
            )
          : rev.approvers?.some(
              (a) => a.userId === CURRENT_USER.id && a.status === "Pending",
            );

      if (!isAssignedToCurrentUser) return false;

      const matchesSearch =
        rev.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.revisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = rev.state === config.statusFilter;
      const matchesType = typeFilter === "All" || rev.type === typeFilter;
      const matchesDepartment =
        departmentFilter === "All" || rev.department === departmentFilter;

      // Date filtering
      const matchesCreatedFrom =
        !createdFromDate || new Date(rev.created) >= new Date(createdFromDate);
      const matchesCreatedTo =
        !createdToDate || new Date(rev.created) <= new Date(createdToDate);
      const matchesEffectiveFrom =
        !effectiveFromDate ||
        new Date(rev.effectiveDate) >= new Date(effectiveFromDate);
      const matchesEffectiveTo =
        !effectiveToDate ||
        new Date(rev.effectiveDate) <= new Date(effectiveToDate);
      const matchesValidFrom =
        !validFromDate || new Date(rev.validUntil) >= new Date(validFromDate);
      const matchesValidTo =
        !validToDate || new Date(rev.validUntil) <= new Date(validToDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDepartment &&
        matchesCreatedFrom &&
        matchesCreatedTo &&
        matchesEffectiveFrom &&
        matchesEffectiveTo &&
        matchesValidFrom &&
        matchesValidTo
      );
    });
  }, [
    searchQuery,
    config.statusFilter,
    config.revisions,
    typeFilter,
    departmentFilter,
    viewType,
    createdFromDate,
    createdToDate,
    effectiveFromDate,
    effectiveToDate,
    validFromDate,
    validToDate,
  ]);

  const totalPages = Math.ceil(filteredRevisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRevisions = filteredRevisions.slice(startIndex, endIndex);

  const handleDropdownToggle = (
    docId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openDropdownId === docId) {
      setOpenDropdownId(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    // Menu dimensions (2 items * ~40px per item + padding)
    const menuHeight = 90;
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
      case "view":
        onViewDocument?.(openDropdownId);
        break;
      case "review":
        navigate(`/documents/revisions/review/${openDropdownId}`);
        break;
      case "approve":
        navigate(`/documents/revisions/approval/${openDropdownId}`);
        break;
      case "history":
        console.log(`View history for document ${openDropdownId}`);
        break;
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            {config.title}
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
              {config.breadcrumbLast}
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
        authorFilterDisabled={true}
      />

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        {currentRevisions.length > 0 ? (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      No.
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Document Number
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Revision Number
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Created
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Opened By
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Revision Name
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      State
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Document Name
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Document Type
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Department
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Author
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Effective Date
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Valid Until
                    </th>
                    <th
                      className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]"
                      style={{ width: "60px" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentRevisions.length > 0
                    ? currentRevisions.map((rev, index) => (
                        <tr
                          key={rev.id}
                          onClick={() => onViewDocument?.(rev.id)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className="font-medium text-emerald-600">
                              {rev.documentNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.revisionNumber}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.created}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.openedBy}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <span className="font-medium text-slate-900">
                              {rev.revisionName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            <StatusBadge status={rev.state} />
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                            {rev.documentName}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.type}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.department}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.author}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.effectiveDate}
                          </td>
                          <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                            {rev.validUntil}
                          </td>
                          <td
                            onClick={(e) => e.stopPropagation()}
                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                          >
                            <button
                              ref={getButtonRef(rev.id)}
                              onClick={(e) => handleDropdownToggle(rev.id, e)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-slate-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
            title="No Pending Documents Found"
            description="We couldn't find any pending documents for review or approval matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setTypeFilter("All");
              setDepartmentFilter("All");
              setAuthorFilter(CURRENT_USER.name);
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
