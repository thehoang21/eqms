import React, { useState, useMemo, useRef, createRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  FileX,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Home,
  Layers,
  CheckCircle2,
  Info,
  XCircle,
  Download,
  Printer,
} from "lucide-react";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { ControlledCopy, ControlledCopyStatus, CurrentStage, TableColumn } from "./types";

// --- Mock Data ---
const MOCK_CONTROLLED_COPIES: ControlledCopy[] = [
  // Pending Approval - Batch Request (for testing approval)
  {
    id: "pending-1",
    controlNumber: "CC-2024-010",
    documentId: "WI.0025.02",
    documentTitle: "Work Instruction for Equipment Calibration",
    version: "2.1",
    location: "Calibration Lab",
    locationCode: "LOC-CAL-01",
    copyNumber: 1,
    totalCopies: 2,
    requestDate: "2024-01-10",
    requestedBy: "Jane Doe",
    status: "Pending Approval",
    currentStage: "Waiting for QM",
    reason: "Equipment upgrade requires new calibration procedures",
    department: "Quality Control",
    effectiveDate: "2024-01-10",
  },
  {
    id: "pending-2",
    controlNumber: "CC-2024-011",
    documentId: "WI.0025.02",
    documentTitle: "Work Instruction for Equipment Calibration",
    version: "2.1",
    location: "Manufacturing Lab",
    locationCode: "LOC-MFG-01",
    copyNumber: 2,
    totalCopies: 2,
    requestDate: "2024-01-10",
    requestedBy: "Jane Doe",
    status: "Pending Approval",
    currentStage: "Waiting for QM",
    reason: "Equipment upgrade requires new calibration procedures",
    department: "Manufacturing",
    effectiveDate: "2024-01-10",
  },
  // Pending Approval - Single Request (for testing approval)
  {
    id: "pending-3",
    controlNumber: "CC-2024-012",
    documentId: "SOP.0089.01",
    documentTitle: "Standard Operating Procedure for Environmental Monitoring",
    version: "1.0",
    location: "Clean Room A",
    locationCode: "LOC-CR-A01",
    copyNumber: 1,
    totalCopies: 1,
    requestDate: "2024-01-09",
    requestedBy: "David Wilson",
    status: "Pending Approval",
    currentStage: "Waiting for QM",
    reason: "New clean room facility setup",
    department: "Quality Assurance",
    effectiveDate: "2024-01-09",
  },
  // Ready for Print - Testing print functionality
  {
    id: "ready-1",
    controlNumber: "CC-2024-013",
    documentId: "SOP.0050.01",
    documentTitle: "Standard Operating Procedure for Laboratory Safety",
    version: "1.0",
    location: "Safety Lab",
    locationCode: "LOC-SAFE-01",
    copyNumber: 1,
    totalCopies: 1,
    requestDate: "2024-01-08",
    requestedBy: "Mark Johnson",
    status: "Pending Approval",
    currentStage: "Ready for Print",
    reason: "New safety regulations implementation",
    department: "Safety & Compliance",
    effectiveDate: "2024-01-08",
  },
  {
    id: "1",
    controlNumber: "CC-2024-001",
    documentId: "SOP.0001.03",
    documentTitle: "Standard Operating Procedure for Quality Control Testing",
    version: "3.0",
    location: "Quality Assurance Lab",
    locationCode: "LOC-QA-01",
    copyNumber: 1,
    totalCopies: 3,
    requestDate: "2024-01-05",
    requestedBy: "John Smith",
    status: "Active",
    currentStage: "In Use",
    reason: "New production line setup",
    department: "Quality Assurance",
    effectiveDate: "2024-01-05",
  },
  {
    id: "2",
    controlNumber: "CC-2024-002",
    documentId: "SOP.0001.03",
    documentTitle: "Standard Operating Procedure for Quality Control Testing",
    version: "3.0",
    location: "Production Floor A",
    locationCode: "LOC-PROD-01",
    copyNumber: 2,
    totalCopies: 3,
    requestDate: "2024-01-05",
    requestedBy: "John Smith",
    status: "Active",
    currentStage: "In Use",
    reason: "New production line setup",
    department: "Production",
    effectiveDate: "2024-01-05",
  },
  {
    id: "3",
    controlNumber: "CC-2024-003",
    documentId: "SOP.0001.03",
    documentTitle: "Standard Operating Procedure for Quality Control Testing",
    version: "3.0",
    location: "Quality Control Lab",
    locationCode: "LOC-QC-01",
    copyNumber: 3,
    totalCopies: 3,
    requestDate: "2024-01-05",
    requestedBy: "John Smith",
    status: "Active",
    currentStage: "In Use",
    reason: "New production line setup",
    department: "Quality Control",
    effectiveDate: "2024-01-05",
  },
  {
    id: "4",
    controlNumber: "CC-2023-045",
    documentId: "SOP.0012.03",
    documentTitle: "Batch Production Record Procedure",
    version: "3.5",
    location: "Production Floor B",
    locationCode: "LOC-PROD-02",
    copyNumber: 1,
    totalCopies: 2,
    requestDate: "2023-11-20",
    requestedBy: "Sarah Johnson",
    status: "Recalled",
    currentStage: "In Use",
    reason: "Replace damaged copy",
    department: "Production",
    effectiveDate: "2023-11-20",
    recalledDate: "2024-01-08",
  },
  {
    id: "5",
    controlNumber: "CC-2023-046",
    documentId: "SOP.0012.03",
    documentTitle: "Batch Production Record Procedure",
    version: "3.5",
    location: "Warehouse - Raw Material",
    locationCode: "LOC-WHS-01",
    copyNumber: 2,
    totalCopies: 2,
    requestDate: "2023-11-20",
    requestedBy: "Sarah Johnson",
    status: "Recalled",
    currentStage: "In Use",
    reason: "Replace damaged copy",
    department: "Warehouse",
    effectiveDate: "2023-11-20",
    recalledDate: "2024-01-08",
  },
  {
    id: "6",
    controlNumber: "CC-2023-028",
    documentId: "POL.0005.01",
    documentTitle: "Quality Management System Policy",
    version: "1.0",
    location: "Engineering Office",
    locationCode: "LOC-ENG-01",
    copyNumber: 1,
    totalCopies: 1,
    requestDate: "2023-08-15",
    requestedBy: "Michael Chen",
    status: "Obsolete",
    currentStage: "In Use",
    reason: "Document archived",
    department: "Engineering",
    effectiveDate: "2023-08-15",
    recalledDate: "2023-12-20",
  },
  {
    id: "7",
    controlNumber: "CC-2024-004",
    documentId: "SPEC.0045.02",
    documentTitle: "Raw Material Specification - API Grade A",
    version: "2.0",
    location: "R&D Laboratory",
    locationCode: "LOC-RD-01",
    copyNumber: 1,
    totalCopies: 1,
    requestDate: "2024-01-08",
    requestedBy: "Lisa Park",
    status: "Active",
    currentStage: "In Use",
    reason: "Additional copy for research team",
    department: "Research & Development",
    effectiveDate: "2024-01-08",
  },
];

// Batch group interface
interface BatchGroup {
  id: string;
  documentId: string;
  documentTitle: string;
  version: string;
  totalCopies: number;
  requestDate: string;
  requestedBy: string;
  status: ControlledCopyStatus;
  currentStage: CurrentStage;
  reason: string;
  department: string;
  effectiveDate: string;
  copies: ControlledCopy[];
}

// Helper function to group copies into batches
const groupIntoBatches = (
  copies: ControlledCopy[]
): (BatchGroup | ControlledCopy)[] => {
  const batchMap = new Map<string, ControlledCopy[]>();
  const singles: ControlledCopy[] = [];

  copies.forEach((copy) => {
    if (copy.totalCopies > 1) {
      const batchKey = `${copy.documentId}-${copy.requestDate}-${copy.requestedBy}`;
      if (!batchMap.has(batchKey)) {
        batchMap.set(batchKey, []);
      }
      batchMap.get(batchKey)!.push(copy);
    } else {
      singles.push(copy);
    }
  });

  const batches: BatchGroup[] = Array.from(batchMap.values()).map((copies) => {
    const first = copies[0];
    return {
      id: `batch-${first.documentId}-${first.requestDate}`,
      documentId: first.documentId,
      documentTitle: first.documentTitle,
      version: first.version,
      totalCopies: first.totalCopies,
      requestDate: first.requestDate,
      requestedBy: first.requestedBy,
      status: first.status,
      currentStage: first.currentStage,
      reason: first.reason,
      department: first.department,
      effectiveDate: first.effectiveDate,
      copies: copies.sort((a, b) => a.copyNumber - b.copyNumber),
    };
  });

  return [...batches, ...singles].sort((a, b) => {
    const dateA = new Date(a.requestDate);
    const dateB = new Date(b.requestDate);
    return dateB.getTime() - dateA.getTime();
  });
};

// Type guard to check if item is BatchGroup
const isBatchGroup = (
  item: BatchGroup | ControlledCopy
): item is BatchGroup => {
  return "copies" in item;
};

// Default columns configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  {
    id: "controlNumber",
    label: "Control Number",
    visible: true,
    order: 1,
    locked: true,
  },
  {
    id: "documentId",
    label: "Document ID",
    visible: true,
    order: 2,
    locked: true,
  },
  { id: "documentTitle", label: "Document Title", visible: true, order: 3 },
  { id: "version", label: "Version", visible: true, order: 4 },
  { id: "location", label: "Location", visible: true, order: 5 },
  { id: "copyNumber", label: "Copy #", visible: true, order: 6 },
  { id: "requestDate", label: "Request Date", visible: true, order: 7 },
  { id: "requestedBy", label: "Requested By", visible: true, order: 8 },
  { id: "status", label: "Status", visible: true, order: 9 },
  { id: "currentStage", label: "Current Stage", visible: true, order: 10 },
  { id: "department", label: "Department", visible: false, order: 11 },
  { id: "effectiveDate", label: "Effective Date", visible: false, order: 12 },
];

// --- Helper Functions ---
const getStatusColor = (status: ControlledCopyStatus) => {
  switch (status) {
    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Recalled":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Obsolete":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStageColor = (stage: CurrentStage) => {
  switch (stage) {
    case "Waiting for QM":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Ready for Print":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "In Use":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
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
          Showing{" "}
          <span className="font-medium text-slate-900">{startItem}</span> to{" "}
          <span className="font-medium text-slate-900">{endItem}</span> of{" "}
          <span className="font-medium text-slate-900">{totalItems}</span>{" "}
          results
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// --- Column Customizer Component ---
const ColumnCustomizer: React.FC<{
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}> = ({ columns, onColumnsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const draggedCol = columns.find((c) => c.id === draggedColumn);
    const targetCol = columns.find((c) => c.id === targetColumnId);
    if (!draggedCol || !targetCol || draggedCol.locked || targetCol.locked)
      return;

    const newColumns = [...columns];
    const draggedIndex = newColumns.findIndex((c) => c.id === draggedColumn);
    const targetIndex = newColumns.findIndex((c) => c.id === targetColumnId);

    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedCol);

    const reordered = newColumns.map((col, idx) => ({
      ...col,
      order: idx + 1,
    }));
    onColumnsChange(reordered);
  };

  const handleVisibilityToggle = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (col?.locked) return;

    const updated = columns.map((c) =>
      c.id === columnId ? { ...c, visible: !c.visible } : c
    );
    onColumnsChange(updated);
  };

  const handleReset = () => {
    onColumnsChange([...DEFAULT_COLUMNS]);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <GripVertical className="h-4 w-4" />
        <span className="hidden sm:inline">Columns</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 left-0 top-full mt-2 z-50 min-w-[280px] rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">
                Customize Columns
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Reset
              </button>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {columns
                .sort((a, b) => a.order - b.order)
                .map((col) => (
                  <div
                    key={col.id}
                    draggable={!col.locked}
                    onDragStart={() => handleDragStart(col.id)}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-50 transition-colors",
                      col.locked && "opacity-60 cursor-not-allowed",
                      !col.locked && "cursor-move"
                    )}
                  >
                    {!col.locked && (
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    )}
                    {col.locked && <div className="h-4 w-4" />}
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => handleVisibilityToggle(col.id)}
                      disabled={col.locked}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-slate-700 flex-1">
                      {col.label}
                    </span>
                    {col.locked && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Locked
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Dropdown Menu Component ---
const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onViewDetails: () => void;
  onRecall: () => void;
  onApprove: () => void;
  onReject: () => void;
  onPrint: () => void;
  status: ControlledCopyStatus;
  currentStage: CurrentStage;
}> = ({
  isOpen,
  onClose,
  position,
  onViewDetails,
  onRecall,
  onApprove,
  onReject,
  onPrint,
  status,
  currentStage,
}) => {
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
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          {status === "Pending Approval" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                  onClose();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Approve & Issue</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                  onClose();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <XCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Reject Request</span>
              </button>
            </>
          )}
          {currentStage === "Ready for Print" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Print Controlled Copy</span>
            </button>
          )}
          {status === "Active" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecall();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <FileX className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Recall Copy</span>
            </button>
          )}
        </div>
      </div>
    </>,
    window.document.body
  );
};

// --- Render Helper ---
const renderCellContent = (
  col: TableColumn,
  item: ControlledCopy | BatchGroup,
  isExpandedChild = false
) => {
  const isBatch = isBatchGroup(item);

  switch (col.id) {
    case "controlNumber":
      if (isBatch) {
        return (
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="inline-flex items-center gap-1 px-1 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
              {(item as BatchGroup).totalCopies} copies
            </span>
          </div>
        );
      }
      return (
        <div className={isExpandedChild ? "pl-8" : ""}>
          <span className="font-medium text-slate-900">
            {(item as ControlledCopy).controlNumber}
          </span>
        </div>
      );

    case "documentId":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return (
        <span className="font-medium text-emerald-700">{item.documentId}</span>
      );

    case "documentTitle":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return (
        <div className="max-w-md">
          <span className="text-slate-900">{item.documentTitle}</span>
        </div>
      );

    case "version":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return <span className="text-slate-700">v{item.version}</span>;

    case "location": {
      if (isBatch) {
        return <span className="text-slate-500 text-xs">Multiple locations</span>;
      }
      const copy = item as ControlledCopy;
      return (
        <div>
          <div className="text-slate-900">{copy.location}</div>
          <div className="text-xs text-slate-500">{copy.locationCode}</div>
        </div>
      );
    }

    case "copyNumber": {
      if (isBatch) return <span className="text-slate-500 text-xs">—</span>;
      const c = item as ControlledCopy;
      if (isExpandedChild) {
        return (
          <span className="text-slate-700">
            Copy {c.copyNumber} of {c.totalCopies}
          </span>
        );
      }
      return <span className="text-slate-700">Copy {c.copyNumber}</span>;
    }

    case "requestDate":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return (
        <span className="text-slate-700">{formatDate(item.requestDate)}</span>
      );

    case "requestedBy":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return <span className="text-slate-700">{item.requestedBy}</span>;

    case "status":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            getStatusColor(item.status)
          )}
        >
          {item.status}
        </span>
      );

    case "currentStage":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            getStageColor(item.currentStage)
          )}
        >
          {item.currentStage}
        </span>
      );

    case "department":
      return <span className="text-slate-700">{item.department}</span>;

    case "effectiveDate":
      if (isExpandedChild)
        return <span className="text-slate-500 text-xs">—</span>;
      return (
        <span className="text-slate-700">
          {formatDate(item.effectiveDate)}
        </span>
      );

    default:
      return null;
  }
};

// --- Filters Component ---
const Filters: React.FC<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: ControlledCopyStatus | "All";
  onStatusChange: (value: ControlledCopyStatus | "All") => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  dateFromFilter: string;
  onDateFromChange: (value: string) => void;
  dateToFilter: string;
  onDateToChange: (value: string) => void;
}> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  dateFromFilter,
  onDateFromChange,
  dateToFilter,
  onDateToChange,
}) => {
  const locationOptions = [
    { label: "All Locations", value: "All" },
    { label: "Quality Assurance Lab", value: "LOC-QA-01" },
    { label: "Production Floor A", value: "LOC-PROD-01" },
    { label: "Production Floor B", value: "LOC-PROD-02" },
    { label: "Quality Control Lab", value: "LOC-QC-01" },
    { label: "Warehouse - Raw Material", value: "LOC-WHS-01" },
    { label: "R&D Laboratory", value: "LOC-RD-01" },
    { label: "Engineering Office", value: "LOC-ENG-01" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Active", value: "Active" },
    { label: "Recalled", value: "Recalled" },
    { label: "Obsolete", value: "Obsolete" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
        {/* Search input */}
        <div className="xl:col-span-4">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Control #, Document ID, Title..."
              className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="xl:col-span-2">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Status
          </label>
          <Select
            value={statusFilter}
            onChange={(value) =>
              onStatusChange(value as ControlledCopyStatus | "All")
            }
            options={statusOptions}
            placeholder="Select status"
          />
        </div>

        {/* Location Filter */}
        <div className="xl:col-span-2">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Location
          </label>
          <Select
            value={locationFilter}
            onChange={onLocationChange}
            options={locationOptions}
            placeholder="Select location"
            enableSearch
          />
        </div>

        {/* Date From */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="From Date"
            value={dateFromFilter}
            onChange={onDateFromChange}
            placeholder="Select date"
          />
        </div>

        {/* Date To */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="To Date"
            value={dateToFilter}
            onChange={onDateToChange}
            placeholder="Select date"
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const AllControlledCopiesView: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ControlledCopyStatus | "All"
  >("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Column customization
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<{
    [key: string]: React.RefObject<HTMLButtonElement>;
  }>({});

  // Expanded batches state
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(
    new Set()
  );

  // E-Signature modal state
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const [copyToApprove, setCopyToApprove] = useState<ControlledCopy | null>(
    null
  );
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    const filtered = MOCK_CONTROLLED_COPIES.filter((copy) => {
      const matchesSearch =
        searchQuery === "" ||
        copy.controlNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || copy.status === statusFilter;

      const matchesLocation =
        locationFilter === "All" || copy.locationCode === locationFilter;

      const matchesDateFrom =
        dateFromFilter === "" ||
        new Date(copy.requestDate) >= new Date(dateFromFilter);

      const matchesDateTo =
        dateToFilter === "" ||
        new Date(copy.requestDate) <= new Date(dateToFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    return groupIntoBatches(filtered);
  }, [searchQuery, statusFilter, locationFilter, dateFromFilter, dateToFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) => col.visible).sort((a, b) => a.order - b.order),
    [columns]
  );

  const handleDropdownToggle = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 200,
    });
    setOpenDropdownId(id);
  };

  const handleViewDetails = (copy: ControlledCopy) => {
    navigate(`/documents/controlled-copies/${copy.id}`);
  };

  const handleRecall = (copy: ControlledCopy) => {
    console.log("Recall copy:", copy);
    // TODO: Implement recall functionality
  };

  const handleApproveRequest = (copy: ControlledCopy) => {
    setCopyToApprove(copy);
    setActionType("approve");
    setIsESignModalOpen(true);
    setOpenDropdownId(null); // Close dropdown
  };

  const handleRejectRequest = (copy: ControlledCopy) => {
    setCopyToApprove(copy);
    setActionType("reject");
    setIsESignModalOpen(true);
    setOpenDropdownId(null); // Close dropdown
  };

  const generatePDFWithWatermark = (copy: ControlledCopy) => {
    // Generate PDF content with watermark
    const pdfContent = `
===========================================
CONTROLLED COPY - APPROVED
===========================================

Control Number: ${copy.controlNumber}
Document ID: ${copy.documentId}
Document Title: ${copy.documentTitle}
Version: ${copy.version}

Location: ${copy.location}
Location Code: ${copy.locationCode}
Copy Number: ${copy.copyNumber} of ${copy.totalCopies}

Requested By: ${copy.requestedBy}
Department: ${copy.department}
Request Date: ${formatDate(copy.requestDate)}
Effective Date: ${formatDate(copy.effectiveDate)}

Status: APPROVED
Reason: ${copy.reason}

-------------------------------------------
WATERMARK: CONTROLLED COPY
This is a controlled document. 
Unauthorized copying is prohibited.
-------------------------------------------

Approved on: ${new Date().toLocaleString()}
===========================================
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${copy.controlNumber}_Controlled_Copy.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = (copy: ControlledCopy) => {
    console.log("Printing copy:", copy);
    // TODO: Call API to mark as printed and update currentStage to "In Use"
    // Update status from "Pending Approval" to "Active"
    // Generate and download PDF with watermark
    generatePDFWithWatermark(copy);
    
    // Show success message
    alert("Controlled copy printed successfully! Status updated to In Use.");
  };

  const handleESignatureConfirm = (reason: string) => {
    if (copyToApprove) {
      if (actionType === "approve") {
        console.log("Approving copy:", copyToApprove);
        console.log("Approval reason:", reason);
        // TODO: Call API to approve the controlled copy
        // Update currentStage from "Waiting for QM" to "Ready for Print"
        // Status remains "Pending Approval" until printed
        
        // Show success message (you can add toast notification here)
        alert("Controlled copy approved! Status: Ready for Print.");
      } else {
        console.log("Rejecting copy:", copyToApprove);
        console.log("Rejection reason:", reason);
        // TODO: Call API to reject the controlled copy
        // Update status to "Rejected" or delete the request
        
        // Show success message
        alert("Controlled copy request rejected.");
      }
      
      setIsESignModalOpen(false);
      setCopyToApprove(null);
    }
  };

  const handleViewRow = (copy: ControlledCopy) => {
    handleViewDetails(copy);
  };

  const toggleBatchExpand = (batchId: string) => {
    setExpandedBatches((prev) => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  const findCopyById = (id: string): ControlledCopy | undefined => {
    for (const item of paginatedData) {
      if (isBatchGroup(item)) {
        const copy = item.copies.find((c) => c.id === id);
        if (copy) return copy;
      } else {
        if (item.id === id) return item;
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              All Controlled Copies
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hidden sm:inline">Controlled Copies</span>
              <span className="sm:hidden">...</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-700 font-medium">All Controlled Copies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        dateFromFilter={dateFromFilter}
        onDateFromChange={setDateFromFilter}
        dateToFilter={dateToFilter}
        onDateToChange={setDateToFilter}
      />

      {/* Table Container */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-12">
                  {/* Expand column */}
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-16">
                  No.
                </th>
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 3}
                    className="py-12 text-center text-slate-500"
                  >
                    No controlled copies found
                  </td>
                </tr>
              ) : (
                paginatedData.flatMap((item, index) => {
                  const rowNumber =
                    (currentPage - 1) * itemsPerPage + index + 1;

                  if (isBatchGroup(item)) {
                    // Batch group row
                    const batch = item;
                    const isExpanded = expandedBatches.has(batch.id);
                    const rows = [
                      <tr
                        key={batch.id}
                        onClick={() => toggleBatchExpand(batch.id)}
                        className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                          <div className="inline-flex items-center justify-center h-6 w-6">
                            {isExpanded ? (
                              <IconChevronDown className="h-4 w-4 text-slate-600" />
                            ) : (
                              <IconChevronRight className="h-4 w-4 text-slate-600" />
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 font-medium">
                          {rowNumber}
                        </td>
                        {visibleColumns.map((col) => (
                          <td
                            key={col.id}
                            className="py-3.5 px-4 text-sm whitespace-nowrap"
                          >
                            {renderCellContent(col, batch)}
                          </td>
                        ))}
                        <td
                          onClick={(e) => e.stopPropagation()}
                          className="sticky right-0 bg-blue-50/30 py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-blue-50/50"
                        >
                          <span className="text-xs text-slate-500">—</span>
                        </td>
                      </tr>,
                    ];

                    // Add expanded detail rows if batch is expanded
                    if (isExpanded) {
                      batch.copies.forEach((copy) => {
                        rows.push(
                          <tr
                            key={copy.id}
                            onClick={() => handleViewRow(copy)}
                            className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer group border-l-2 border-l-blue-300"
                          >
                            <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                              {/* Empty for expanded rows */}
                            </td>
                            <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                              {/* Empty for expanded rows */}
                            </td>
                            {visibleColumns.map((col) => (
                              <td
                                key={col.id}
                                className="py-3.5 px-4 text-sm whitespace-nowrap"
                              >
                                {renderCellContent(col, copy, true)}
                              </td>
                            ))}
                            <td
                              onClick={(e) => e.stopPropagation()}
                              className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                            >
                              <button
                                ref={getButtonRef(copy.id)}
                                onClick={(e) =>
                                  handleDropdownToggle(copy.id, e)
                                }
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                                aria-label="Actions"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-600" />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    }

                    return rows;
                  } else {
                    // Single copy row
                    const copy = item;
                    return (
                      <tr
                        key={copy.id}
                        onClick={() => handleViewRow(copy)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                          {/* Empty for single copies */}
                        </td>
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 font-medium">
                          {rowNumber}
                        </td>
                        {visibleColumns.map((col) => (
                          <td
                            key={col.id}
                            className="py-3.5 px-4 text-sm whitespace-nowrap"
                          >
                            {renderCellContent(col, copy)}
                          </td>
                        ))}
                        <td
                          onClick={(e) => e.stopPropagation()}
                          className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                        >
                          <button
                            ref={getButtonRef(copy.id)}
                            onClick={(e) => handleDropdownToggle(copy.id, e)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                            aria-label="Actions"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {openDropdownId && (
        <DropdownMenu
          isOpen={openDropdownId !== null}
          onClose={() => setOpenDropdownId(null)}
          position={dropdownPosition}
          onViewDetails={() => {
            const copy = findCopyById(openDropdownId);
            if (copy) handleViewDetails(copy);
          }}
          onRecall={() => {
            const copy = findCopyById(openDropdownId);
            if (copy) handleRecall(copy);
          }}
          onApprove={() => {
            const copy = findCopyById(openDropdownId);
            if (copy) handleApproveRequest(copy);
          }}
          onReject={() => {
            const copy = findCopyById(openDropdownId);
            if (copy) handleRejectRequest(copy);
          }}
          onPrint={() => {
            const copy = findCopyById(openDropdownId);
            if (copy) handlePrint(copy);
          }}
          status={findCopyById(openDropdownId)?.status || "Active"}
          currentStage={findCopyById(openDropdownId)?.currentStage || "In Use"}
        />
      )}

      {/* E-Signature Modal */}
      <ESignatureModal
        isOpen={isESignModalOpen}
        onClose={() => {
          setIsESignModalOpen(false);
          setCopyToApprove(null);
        }}
        onConfirm={handleESignatureConfirm}
        actionTitle={
          actionType === "approve"
            ? "Approve Controlled Copy Request"
            : "Reject Controlled Copy Request"
        }
      />
    </div>
  );
};
