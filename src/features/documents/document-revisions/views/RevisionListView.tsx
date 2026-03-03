import React, { useState, useMemo, useRef, createRef, RefObject, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '@/app/routes.constants';
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
  FilePlusCorner,
  FileStack,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { StatusBadge, StatusType } from '@/components/ui/statusbadge/StatusBadge';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { TableEmptyState } from '@/components/ui/table/TableEmptyState';
import { DocumentFilters } from "@/features/documents/shared/components";
import { cn } from '@/components/ui/utils';
import { IconFileCheck, IconFileTime, IconInfoCircle, IconFileExport, IconLayoutDashboard, IconEyeCheck, IconChecks } from "@tabler/icons-react";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";
import { Revision, MOCK_REVISIONS } from "./mockData";

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
  const [relatedDocumentFilter, setRelatedDocumentFilter] = useState("All");
  const [correlatedDocumentFilter, setCorrelatedDocumentFilter] = useState("All");
  const [templateFilter, setTemplateFilter] = useState("All");
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

      const matchesCreatedDate = (() => {
        if (!createdFromDate && !createdToDate) return true;
        const revisionDate = new Date(revision.created);
        let matchesFrom = true;
        let matchesTo = true;
        if (createdFromDate) {
          const parts = createdFromDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const from = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 0, 0, 0);
            matchesFrom = revisionDate >= from;
          }
        }
        if (createdToDate) {
          const parts = createdToDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const to = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 23, 59, 59);
            matchesTo = revisionDate <= to;
          }
        }
        return matchesFrom && matchesTo;
      })();

      const matchesEffectiveDate = (() => {
        if (!effectiveFromDate && !effectiveToDate) return true;
        const revisionDate = new Date(revision.effectiveDate);
        let matchesFrom = true;
        let matchesTo = true;
        if (effectiveFromDate) {
          const parts = effectiveFromDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const from = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 0, 0, 0);
            matchesFrom = revisionDate >= from;
          }
        }
        if (effectiveToDate) {
          const parts = effectiveToDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const to = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 23, 59, 59);
            matchesTo = revisionDate <= to;
          }
        }
        return matchesFrom && matchesTo;
      })();

      const matchesValidDate = (() => {
        if (!validFromDate && !validToDate) return true;
        const revisionDate = new Date(revision.validUntil);
        let matchesFrom = true;
        let matchesTo = true;
        if (validFromDate) {
          const parts = validFromDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const from = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 0, 0, 0);
            matchesFrom = revisionDate >= from;
          }
        }
        if (validToDate) {
          const parts = validToDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (parts) {
            const to = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), 23, 59, 59);
            matchesTo = revisionDate <= to;
          }
        }
        return matchesFrom && matchesTo;
      })();

      const matchesRelatedDocument =
        relatedDocumentFilter === "All" ||
        (relatedDocumentFilter === "yes" ? !!revision.hasRelatedDocuments : !revision.hasRelatedDocuments);

      const matchesCorrelatedDocument =
        correlatedDocumentFilter === "All" ||
        (correlatedDocumentFilter === "yes" ? !!revision.hasCorrelatedDocuments : !revision.hasCorrelatedDocuments);

      const matchesTemplate =
        templateFilter === "All" ||
        (templateFilter === "yes" ? !!revision.isTemplate : !revision.isTemplate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDepartment &&
        matchesAuthor &&
        matchesCreatedDate &&
        matchesEffectiveDate &&
        matchesValidDate &&
        matchesRelatedDocument &&
        matchesCorrelatedDocument &&
        matchesTemplate
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
    relatedDocumentFilter,
    correlatedDocumentFilter,
    templateFilter,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredRevisions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRevisions = useMemo(() => {
    return filteredRevisions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRevisions, startIndex, itemsPerPage]);

  // Handlers
  const handleViewRevision = (id: string) => {
    // Navigate to document detail view - revisions use the same detail view as documents
    navigate(ROUTES.DOCUMENTS.DETAIL(id));
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

  const handleNewRevision = (revision: Revision) => {
    if (revision.hasRelatedDocuments) {
      navigate(ROUTES.DOCUMENTS.REVISIONS.NEW_MULTI(revision.id), { state: { from: ROUTES.DOCUMENTS.REVISIONS.ALL } });
    } else {
      navigate(ROUTES.DOCUMENTS.REVISIONS.NEW_STANDALONE(revision.id), { state: { from: ROUTES.DOCUMENTS.REVISIONS.ALL } });
    }
    setOpenDropdownId(null);
  };

  const handlePrintControlledCopy = (revision: Revision) => {
    const relatedDocuments = revision.hasRelatedDocuments
      ? [
          {
            id: revision.id,
            documentId: revision.documentNumber,
            title: revision.revisionName,
            version: revision.revisionNumber,
            status: revision.state as any,
            isParent: true,
          },
        ]
      : [];

    navigate(ROUTES.DOCUMENTS.CONTROLLED_COPIES.REQUEST, {
      state: {
        documentId: revision.documentNumber,
        documentTitle: revision.revisionName,
        documentVersion: revision.revisionNumber,
        relatedDocuments,
      },
    });
    setOpenDropdownId(null);
  };

  const handleMenuAction = (action: string, id: string) => {
    setOpenDropdownId(null);
    
    switch (action) {
      case "view":
        navigate(ROUTES.DOCUMENTS.DETAIL(id));
        break;
      case "review":
        navigate(ROUTES.DOCUMENTS.REVISIONS.REVIEW(id));
        break;
      case "approve":
        navigate(ROUTES.DOCUMENTS.REVISIONS.APPROVAL(id));
        break;
      case "audit":
        // TODO: Navigate to audit trail view
        navigate(`${ROUTES.DOCUMENTS.DETAIL(id)}?tab=audit`);
        break;
      default:
        break;
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
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">
              Document Control
            </span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">
              Document Revisions
            </span>
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
        relatedDocumentFilter={relatedDocumentFilter}
        onRelatedDocumentFilterChange={(value) => {
          setRelatedDocumentFilter(value);
          setCurrentPage(1);
        }}
        correlatedDocumentFilter={correlatedDocumentFilter}
        onCorrelatedDocumentFilterChange={(value) => {
          setCorrelatedDocumentFilter(value);
          setCurrentPage(1);
        }}
        templateFilter={templateFilter}
        onTemplateFilterChange={(value) => {
          setTemplateFilter(value);
          setCurrentPage(1);
        }}
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
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Opened By</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Revision Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">State</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Document Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Document Type</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Related Document</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Correlated Document</th>
                  <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Template</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Author</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Effective Date</th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Valid Until</th>
                  <th className="sticky right-0 bg-slate-50/80 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedRevisions.map((revision, index) => (
                  <tr
                    key={revision.id}
                    onClick={() => handleViewRevision(revision.id)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{startIndex + index + 1}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      <span className="font-medium text-emerald-600">{revision.documentNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {revision.revisionNumber}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.created}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.openedBy}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      <span className="font-medium text-slate-900">{revision.revisionName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      <StatusBadge status={mapStatusToType(revision.state)} />
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">{revision.documentName}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.type}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                      {revision.hasRelatedDocuments ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                      {revision.hasCorrelatedDocuments ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                      {revision.isTemplate ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.department}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.author}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.effectiveDate}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">{revision.validUntil}</td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
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
        const isEffective = currentRevision?.state === "Effective";

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
                {isEffective && currentRevision && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewRevision(currentRevision);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <FilePlusCorner className="h-4 w-4 text-slate-500" />
                      <span>Upgrade Revision</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintControlledCopy(currentRevision);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <FileStack className="h-4 w-4 text-slate-500" />
                      <span>Request Controlled Copy</span>
                    </button>
                  </>
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
