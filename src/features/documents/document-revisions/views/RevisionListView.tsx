import React, { useState, useMemo, useRef, createRef, RefObject, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MoreVertical,
  Eye,
  History,
  ChevronDown,
  Plus,
  Home,
  ThumbsUp,
  Download,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { StatusBadge, StatusType } from '@/components/ui/statusbadge/StatusBadge';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { TableEmptyState } from '@/components/ui/table/TableEmptyState';
import { DocumentFilters } from "@/features/documents/shared/components";
import { cn } from '@/components/ui/utils';
import { IconFileCheck, IconFileTime, IconInfoCircle, IconFileExport, IconSmartHome, IconEyeCheck, IconChecks } from "@tabler/icons-react";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";

// --- Types ---

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
    "Pending Review": "pendingReview",
    "Pending Approval": "pendingApproval",
    Approved: "approved",
    "Pending Training": "pendingTraining",
    "Ready for Publishing": "readyForPublishing",
    Published: "published",
    Effective: "effective",
    Archive: "archived",
  };
  return mapping[status] || "draft";
};

// --- Mock Data ---
const MOCK_REVISIONS: Revision[] = [
  // Pending Review items (for testing Review workflow)
  {
    id: "rev-001",
    documentNumber: "SOP.0001.01",
    revisionNumber: "2.0",
    created: "2026-01-08",
    openedBy: "John Smith",
    revisionName: "Quality Control Testing Revision",
    state: "Pending Review",
    author: "Dr. Sarah Johnson",
    effectiveDate: "2026-01-20",
    validUntil: "2027-01-20",
    documentName: "Quality Control Testing SOP",
    type: "SOP",
    department: "Quality Assurance",
  },
  {
    id: "rev-002",
    documentNumber: "SOP.0002.01",
    revisionNumber: "3.1",
    created: "2026-01-07",
    openedBy: "Jane Doe",
    revisionName: "Manufacturing Process Update",
    state: "Pending Review",
    author: "Michael Chen",
    effectiveDate: "2026-01-25",
    validUntil: "2027-01-25",
    documentName: "Manufacturing Process SOP",
    type: "SOP",
    department: "Production",
  },
  // Pending Approval items (for testing Approval workflow)
  {
    id: "rev-003",
    documentNumber: "POL.0001.01",
    revisionNumber: "1.5",
    created: "2026-01-06",
    openedBy: "Alice Johnson",
    revisionName: "Safety Policy Revision",
    state: "Pending Approval",
    author: "Emily Brown",
    effectiveDate: "2026-02-01",
    validUntil: "2027-02-01",
    documentName: "Workplace Safety Policy",
    type: "Policy",
    department: "Quality Assurance",
  },
  {
    id: "rev-004",
    documentNumber: "SOP.0003.01",
    revisionNumber: "4.0",
    created: "2026-01-05",
    openedBy: "Bob Williams",
    revisionName: "Validation Protocol Update",
    state: "Pending Approval",
    author: "David Lee",
    effectiveDate: "2026-02-05",
    validUntil: "2027-02-05",
    documentName: "Equipment Validation Protocol",
    type: "Protocol",
    department: "R&D",
  },
  // Other statuses for variety
  ...Array.from({ length: 41 }, (_, i) => ({
    id: `${i + 5}`,
    documentNumber: `SOP.${String(i + 5).padStart(4, "0")}.0${(i % 3) + 1}`,
    revisionNumber: `${Math.floor(i / 3) + 1}.${i % 3}`,
    created: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
    openedBy: ["John Smith", "Jane Doe", "Alice Johnson", "Bob Williams"][i % 4],
    revisionName: `Revision ${i + 5}`,
    state: ["Draft", "Approved", "Effective", "Archive"][i % 4] as DocumentStatus,
    author: ["Dr. Sarah Johnson", "Michael Chen", "Emily Brown", "David Lee"][i % 4],
    effectiveDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split("T")[0],
    validUntil: new Date(Date.now() + Math.random() * 20000000000).toISOString().split("T")[0],
    documentName: `Standard Operating Procedure ${i + 5}`,
    type: ["SOP", "Policy", "Form", "Report"][i % 4] as DocumentType,
    department: ["Quality Assurance", "Production", "R&D", "Regulatory Affairs"][i % 4],
  })),
];



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
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });

  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement | null> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    
    // Menu dimensions (estimate max)
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
      case "approve":
        navigate(`/documents/revisions/approval/${id}`);
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



  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            All Revisions
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">
              Document Control
            </button>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">
              Document Revisions
            </button>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">All Revisions</span>
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
            className="whitespace-nowrap gap-2 self-start md:self-auto"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
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
        showTypeFilter={true}
        showDepartmentFilter={true}
      />

      {/* Table Container - Match DocumentListView wrapper */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {paginatedRevisions.length > 0 ? (
            <>
              {/* Table with Horizontal Scroll */}
              <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b-2 border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
                <tr>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">No.</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Document Number</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Revision Number</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Created</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Opened by</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Revision Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">State</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Author</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Effective Date</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Valid Until</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Document Name</th>
                  <th className="sticky right-0 bg-slate-50/80 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRevisions.map((revision, index) => (
                  <tr
                    key={revision.id}
                    onClick={() => handleViewRevision(revision.id)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{startIndex + index + 1}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      <span className="font-medium text-emerald-600">{revision.documentNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.revisionNumber}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.created}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.openedBy}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.revisionName}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      <StatusBadge status={mapStatusToType(revision.state)} />
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.author}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.effectiveDate}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.validUntil}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.documentName}</td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                    >
                      <button
                        ref={getButtonRef(revision.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownToggle(revision.id, e);
                        }}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="More actions"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
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
              title="No Revisions Found"
              description="We couldn't find any revision records matching your filters. Try adjusting your search criteria or clear filters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setTypeFilter("All");
                setDepartmentFilter("All");
                setAuthorFilter("All");
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
      </div>

      {/* Dropdown Menu (Portal) */}
      {openDropdownId && (() => {
        const currentRevision = MOCK_REVISIONS.find(r => r.id === openDropdownId);
        const isPendingReview = currentRevision?.state === "Pending Review";
        const isPendingApproval = currentRevision?.state === "Pending Approval";

        return createPortal(
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
                transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none',
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
                {isPendingReview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction("review", openDropdownId);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <IconEyeCheck className="h-4 w-4 text-slate-500" />
                    <span>Review Revision</span>
                  </button>
                )}
                {isPendingApproval && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction("approve", openDropdownId);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <IconChecks className="h-4 w-4 text-slate-500" />
                    <span>Approve Revision</span>
                  </button>
                )}
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
        );
      })()}
    </div>
  );
};
