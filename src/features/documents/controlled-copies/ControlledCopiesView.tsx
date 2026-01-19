import React, { useState, useMemo, createRef, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  Download,
  Search,
  MoreVertical,
  Info,
  Edit,
  FileX,
  Link2,
  Shredder,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { CreateLinkModal } from "../views/CreateLinkModal";
import { CancelDistributionModal } from "./components/CancelDistributionModal";
import { DestructionTypeSelectionModal } from "./components/DestructionTypeSelectionModal";
import { useToast } from "@/components/ui/toast/Toast";
import type { ControlledCopy, ControlledCopyStatus, TableColumn } from "./types";
import { IconShare3 } from "@tabler/icons-react";

// ==================== MOCK DATA ====================

const MOCK_ALL_CONTROLLED_COPIES: ControlledCopy[] = [
  {
    id: "cc-001",
    documentNumber: "CC-2024-001",
    createdDate: "2024-01-10",
    createdTime: "09:30:45",
    openedBy: "John Smith",
    name: "Standard Operating Procedure for Material Receipt",
    status: "Ready for Distribution",
    validUntil: "2025-01-10",
    document: "SOP.0015.02",
    distributionList: "Warehouse Team, QC Team",
    version: "2.0",
    location: "Warehouse - Receiving",
    department: "Operations",
    reason: "Annual review and update",
  },
  {
    id: "cc-002",
    documentNumber: "CC-2024-002",
    createdDate: "2024-01-08",
    createdTime: "14:22:10",
    openedBy: "Sarah Johnson",
    name: "Work Instruction for Equipment Maintenance",
    status: "Distributed",
    validUntil: "2024-12-31",
    document: "WI.0028.01",
    distributionList: "Maintenance, Production",
    version: "1.0",
    recipientName: "Mike Maintenance",
    distributedDate: "2024-01-09",
    distributedBy: "Document Controller",
    department: "Maintenance",
  },
  {
    id: "cc-003",
    documentNumber: "CC-2024-003",
    createdDate: "2024-01-05",
    createdTime: "11:15:33",
    openedBy: "David Wilson",
    name: "Quality Control Inspection Procedure",
    status: "Obsolete",
    validUntil: "2024-01-05",
    document: "QCP.0112.03",
    distributionList: "QC Department",
    version: "3.0",
    department: "Quality Control",
    reason: "Superseded by new version",
  },
  {
    id: "cc-004",
    documentNumber: "CC-2024-004",
    createdDate: "2024-01-03",
    createdTime: "08:45:20",
    openedBy: "Emily Brown",
    name: "Training Manual for New Operators",
    status: "Closed - Cancelled",
    validUntil: "2024-01-03",
    document: "TM.0045.01",
    distributionList: "HR, Training Team",
    version: "1.0",
    department: "Human Resources",
    reason: "Cancelled due to policy change",
  },
  {
    id: "cc-005",
    documentNumber: "CC-2024-005",
    createdDate: "2024-01-12",
    createdTime: "16:50:12",
    openedBy: "Robert Lee",
    name: "Validation Protocol for Sterilization Process",
    status: "Ready for Distribution",
    validUntil: "2025-06-30",
    document: "VP.0087.02",
    distributionList: "Validation Team, Production",
    version: "2.0",
    location: "Sterilization Area",
    department: "Validation",
  },
  {
    id: "cc-006",
    documentNumber: "CC-2024-006",
    createdDate: "2024-01-11",
    createdTime: "10:20:55",
    openedBy: "Lisa Anderson",
    name: "Cleaning and Sanitization Procedure",
    status: "Distributed",
    validUntil: "2024-12-15",
    document: "SOP.0156.01",
    distributionList: "Cleaning Staff, QA",
    version: "1.0",
    recipientName: "Cleaning Supervisor",
    distributedDate: "2024-01-11",
    distributedBy: "QA Manager",
    department: "Quality Assurance",
  },
  {
    id: "cc-007",
    documentNumber: "CC-2023-089",
    createdDate: "2023-12-20",
    createdTime: "13:40:18",
    openedBy: "Michael Chen",
    name: "Batch Record Template - Legacy",
    status: "Obsolete",
    validUntil: "2023-12-31",
    document: "BRT.0234.05",
    distributionList: "Production, QC",
    version: "5.0",
    department: "Manufacturing",
    reason: "Replaced by new template",
  },
  {
    id: "cc-008",
    documentNumber: "CC-2024-008",
    createdDate: "2024-01-09",
    createdTime: "15:30:42",
    openedBy: "Anna Martinez",
    name: "Equipment Calibration Schedule",
    status: "Ready for Distribution",
    validUntil: "2025-01-09",
    document: "CS.0067.01",
    distributionList: "Calibration Lab, Maintenance",
    version: "1.0",
    location: "Calibration Lab",
    department: "Metrology",
  },
  {
    id: "cc-009",
    documentNumber: "CC-2024-009",
    createdDate: "2024-01-07",
    createdTime: "11:25:30",
    openedBy: "Peter Zhang",
    name: "Environmental Monitoring Procedure",
    status: "Distributed",
    validUntil: "2025-01-07",
    document: "SOP.0234.01",
    distributionList: "QA Team, Production",
    version: "1.0",
    recipientName: "QA Lead",
    distributedDate: "2024-01-08",
    distributedBy: "Quality Manager",
    department: "Quality Assurance",
  },
  {
    id: "cc-010",
    documentNumber: "CC-2023-101",
    createdDate: "2023-11-15",
    createdTime: "14:10:22",
    openedBy: "Jessica White",
    name: "Equipment Qualification Protocol - Old",
    status: "Closed - Cancelled",
    validUntil: "2023-11-15",
    document: "EQP.0156.02",
    distributionList: "Engineering, Validation",
    version: "2.0",
    department: "Engineering",
    reason: "Project cancelled",
  },
];

// Default Columns Configuration
const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "documentNumber", label: "Document Number", visible: true, order: 1, locked: true },
  { id: "created", label: "Created", visible: true, order: 2 },
  { id: "openedBy", label: "Opened by", visible: true, order: 3 },
  { id: "name", label: "Name", visible: true, order: 4 },
  { id: "status", label: "State", visible: true, order: 5 },
  { id: "validUntil", label: "Valid Until", visible: true, order: 6 },
  { id: "document", label: "Document", visible: true, order: 7 },
  { id: "distributionList", label: "Distribution List", visible: true, order: 8 },
];

// View types
type ViewType = "all" | "ready" | "distributed";

// ==================== HELPER FUNCTIONS ====================

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(`${date}T${time}`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getStatusConfig = (status: ControlledCopyStatus) => {
  const configs = {
    "Ready for Distribution": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "Distributed": {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    "Obsolete": {
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    "Closed - Cancelled": {
      color: "bg-red-50 text-red-700 border-red-200",
    },
  };
  return configs[status] || configs["Ready for Distribution"];
};

// ==================== PAGINATION COMPONENT ====================

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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
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
        </Button>
      </div>
    </div>
  );
};

// ==================== DROPDOWN MENU COMPONENT ====================

const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
  onViewDetails: () => void;
  onEdit: () => void;
  onCancel?: () => void;
  onDistribute?: () => void;
  onReportLostDamaged?: () => void;
  onCreateLink?: () => void;
  viewType: ViewType;
}> = ({
  isOpen,
  onClose,
  position,
  onViewDetails,
  onEdit,
  onCancel,
  onDistribute,
  onReportLostDamaged,
  onCreateLink,
  viewType,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
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
              onViewDetails();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Info className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Edit className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Edit</span>
          </button>
          {onDistribute && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDistribute();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <IconShare3 className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Distribute</span>
            </button>
          )}
          {onCreateLink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateLink();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Link2 className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Create Shareable Link</span>
            </button>
          )}
          {viewType === "ready" && onCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <FileX className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Cancel Distribution</span>
            </button>
          )}
          {viewType === "distributed" && onReportLostDamaged && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReportLostDamaged();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <Shredder className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Report Lost/Damaged</span>
            </button>
          )}
          {viewType === "all" && onCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <FileX className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Cancel Distribution</span>
            </button>
          )}
          {viewType === "all" && onReportLostDamaged && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReportLostDamaged();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <Shredder className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Report Lost/Damaged</span>
            </button>
          )}
        </div>
      </div>
    </>,
    window.document.body
  );
};

// ==================== MAIN COMPONENT ====================

export const ControlledCopiesView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get view type from URL params, default to "all"
  const viewType = (searchParams.get("view") as ViewType) || "all";

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ControlledCopyStatus | "All">("All");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Modal states
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedCopyForLink, setSelectedCopyForLink] = useState<ControlledCopy | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCopyForCancel, setSelectedCopyForCancel] = useState<ControlledCopy | null>(null);
  const [cancelFormData, setCancelFormData] = useState({
    cancellationReason: "",
    returnToStage: "Draft" as "Draft" | "Cancelled"
  });
  const [cancelFormErrors, setCancelFormErrors] = useState<{ cancellationReason?: string }>({});
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const [isDistributeESignModalOpen, setIsDistributeESignModalOpen] = useState(false);
  const [selectedCopyForDistribute, setSelectedCopyForDistribute] = useState<ControlledCopy | null>(null);

  // Report Lost/Damaged modal
  const [isReportLostDamagedModalOpen, setIsReportLostDamagedModalOpen] = useState(false);
  const [selectedCopyForReportLostDamaged, setSelectedCopyForReportLostDamaged] = useState<ControlledCopy | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const buttonRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Change view type handler
  const handleViewChange = (view: ViewType) => {
    setSearchParams({ view });
    setCurrentPage(1);
    setStatusFilter("All");
  };

  // Get filtered data based on view type
  const baseData = useMemo(() => {
    switch (viewType) {
      case "ready":
        return MOCK_ALL_CONTROLLED_COPIES.filter((copy) => copy.status === "Ready for Distribution");
      case "distributed":
        return MOCK_ALL_CONTROLLED_COPIES.filter((copy) => copy.status === "Distributed");
      case "all":
      default:
        return MOCK_ALL_CONTROLLED_COPIES;
    }
  }, [viewType]);

  // Apply filters
  const filteredData = useMemo(() => {
    return baseData.filter((copy) => {
      const matchesSearch =
        searchQuery === "" ||
        copy.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
        copy.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = viewType !== "all" || statusFilter === "All" || copy.status === statusFilter;

      const matchesDateFrom =
        dateFromFilter === "" || new Date(copy.createdDate) >= new Date(dateFromFilter);

      const matchesDateTo =
        dateToFilter === "" || new Date(copy.createdDate) <= new Date(dateToFilter);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [baseData, searchQuery, statusFilter, dateFromFilter, dateToFilter, viewType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Event handlers
  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const menuHeight = 180;
    const menuWidth = 200;
    const safeMargin = 8;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;

    let top: number;
    if (shouldShowAbove) {
      top = rect.top + window.scrollY - 4;
    } else {
      top = rect.bottom + window.scrollY + 4;
    }

    const viewportWidth = window.innerWidth;
    let left = rect.right + window.scrollX - menuWidth;

    if (left + menuWidth > viewportWidth - safeMargin) {
      left = viewportWidth - menuWidth - safeMargin + window.scrollX;
    }

    if (left < safeMargin + window.scrollX) {
      left = safeMargin + window.scrollX;
    }

    setDropdownPosition({ top, left, showAbove: shouldShowAbove });
    setOpenDropdownId(id);
  };

  const handleViewDetails = (copy: ControlledCopy) => {
    navigate(`/documents/controlled-copies/${copy.id}`);
  };

  const handleEdit = (copy: ControlledCopy) => {
    console.log("Edit copy:", copy);
    // TODO: Navigate to edit page
  };

  const handleCreateLink = (copy: ControlledCopy) => {
    setSelectedCopyForLink(copy);
    setIsCreateLinkModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCancel = (copy: ControlledCopy) => {
    setSelectedCopyForCancel(copy);
    setIsCancelModalOpen(true);
    setCancelFormData({ cancellationReason: "", returnToStage: "Draft" });
    setCancelFormErrors({});
    setOpenDropdownId(null);
  };

  const handleCancelFormSubmit = () => {
    // Validate form
    const errors: { cancellationReason?: string } = {};
    if (!cancelFormData.cancellationReason.trim()) {
      errors.cancellationReason = "Cancellation reason is required";
    } else if (cancelFormData.cancellationReason.trim().length < 10) {
      errors.cancellationReason = "Cancellation reason must be at least 10 characters";
    }

    if (Object.keys(errors).length > 0) {
      setCancelFormErrors(errors);
      return;
    }

    // Open ESignature modal
    setIsCancelModalOpen(false);
    setIsESignModalOpen(true);
  };

  const handleESignConfirm = (reason: string) => {
    // Process cancellation
    console.log("Cancellation confirmed:", {
      copy: selectedCopyForCancel,
      ...cancelFormData,
      eSignReason: reason
    });

    setIsESignModalOpen(false);
    setSelectedCopyForCancel(null);
    setCancelFormData({ cancellationReason: "", returnToStage: "Draft" });
    
    showToast({
      type: "success",
      message: `Controlled copy ${selectedCopyForCancel?.documentNumber} has been cancelled and returned to ${cancelFormData.returnToStage} status.`
    });
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setSelectedCopyForCancel(null);
    setCancelFormData({ cancellationReason: "", returnToStage: "Draft" });
    setCancelFormErrors({});
  };

  const handleReportLostDamaged = (copy: ControlledCopy) => {
    setSelectedCopyForReportLostDamaged(copy);
    setIsReportLostDamagedModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleReportLostDamagedConfirm = (type: "Lost" | "Damaged") => {
    setIsReportLostDamagedModalOpen(false);
    if (selectedCopyForReportLostDamaged) {
      navigate(`/documents/controlled-copies/${selectedCopyForReportLostDamaged.id}/destroy?type=${type}`);
    }
  };

  const handleDistribute = (copy: ControlledCopy) => {
    setSelectedCopyForDistribute(copy);
    setIsDistributeESignModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDistributeESignConfirm = (reason: string) => {
    setIsDistributeESignModalOpen(false);
    
    showToast({
      type: "success",
      title: "Controlled Copy Distributed",
      message: "The controlled copy has been successfully distributed.",
      duration: 3500,
    });

    console.log("Distribute reason:", reason);
    console.log("Distribute controlled copy:", selectedCopyForDistribute);
    // TODO: Call API to distribute controlled copy
    // Update status to "Distributed"
    // Add audit trail entry
    // Send notification
    
    setSelectedCopyForDistribute(null);
  };

  const handleViewRow = (copy: ControlledCopy) => {
    handleViewDetails(copy);
  };

  const statusOptions = [
    { label: "All States", value: "All" },
    { label: "Ready for Distribution", value: "Ready for Distribution" },
    { label: "Distributed", value: "Distributed" },
    { label: "Obsolete", value: "Obsolete" },
    { label: "Closed - Cancelled", value: "Closed - Cancelled" },
  ];

  // Get page title and breadcrumb based on view type
  const getPageTitle = () => {
    switch (viewType) {
      case "ready":
        return "Ready for Distribution";
      case "distributed":
        return "Distributed Copies";
      case "all":
      default:
        return "All Controlled Copies";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">{getPageTitle()}</h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
              <span className="hidden sm:inline">Dashboard</span>
              <Home className="h-4 w-4 sm:hidden" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Controlled Copies</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">{getPageTitle()}</span>
            </div>
          </div>
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

      {/* Filters & Tabs Combined */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => handleViewChange("all")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              viewType === "all"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Controlled Copies
          </button>
          <button
            onClick={() => handleViewChange("ready")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              viewType === "ready"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Ready for Distribution
          </button>
          <button
            onClick={() => handleViewChange("distributed")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              viewType === "distributed"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Distributed
          </button>
        </div>

        {/* Filters Section */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
            <div className="xl:col-span-4">
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Document #, Name, Document ID..."
                  className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            <div className="xl:col-span-3">
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">State</label>
              {viewType === "all" ? (
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as ControlledCopyStatus | "All")}
                  options={statusOptions}
                  placeholder="All States"
                />
              ) : (
                <Select
                  value={viewType === "ready" ? "Ready for Distribution" : "Distributed"}
                  onChange={() => {}}
                  options={[
                    {
                      label: viewType === "ready" ? "Ready for Distribution" : "Distributed",
                      value: viewType === "ready" ? "Ready for Distribution" : "Distributed",
                    },
                  ]}
                  placeholder={viewType === "ready" ? "Ready for Distribution" : "Distributed"}
                  disabled
                />
              )}
            </div>
            <div className="xl:col-span-2">
              <DateTimePicker
                label="From Date"
                value={dateFromFilter}
                onChange={setDateFromFilter}
                placeholder="Select date"
              />
            </div>
            <div className="xl:col-span-3">
              <DateTimePicker
                label="To Date"
                value={dateToFilter}
                onChange={setDateToFilter}
                placeholder="Select date"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left w-16">
                  No.
                </th>
                {DEFAULT_COLUMNS.filter((c) => c.visible).map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={DEFAULT_COLUMNS.filter((c) => c.visible).length + 2}
                    className="py-12 text-center text-slate-500"
                  >
                    No controlled copies found
                  </td>
                </tr>
              ) : (
                paginatedData.map((copy, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const statusConfig = getStatusConfig(copy.status);

                  return (
                    <tr
                      key={copy.id}
                      onClick={() => handleViewRow(copy)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-emerald-600">{copy.documentNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDateTime(copy.createdDate, copy.createdTime)}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {copy.openedBy}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-900 max-w-xs truncate">
                        {copy.name}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                        >
                          {copy.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(copy.validUntil)}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-slate-900">{copy.document}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 max-w-xs truncate">
                        {copy.distributionList}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          ref={getButtonRef(copy.id)}
                          onClick={(e) => handleDropdownToggle(copy.id, e)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
      {openDropdownId && (() => {
        const selectedCopy = paginatedData.find((c) => c.id === openDropdownId);
        return (
          <DropdownMenu
            isOpen={openDropdownId !== null}
            onClose={() => setOpenDropdownId(null)}
            position={dropdownPosition}
            viewType={viewType}
            onViewDetails={() => {
              if (selectedCopy) handleViewDetails(selectedCopy);
            }}
            onEdit={() => {
              if (selectedCopy) handleEdit(selectedCopy);
            }}
            onCreateLink={() => {
              if (selectedCopy) handleCreateLink(selectedCopy);
            }}
            onDistribute={
              selectedCopy && selectedCopy.status === "Ready for Distribution"
                ? () => handleDistribute(selectedCopy)
                : undefined
            }
            onCancel={
              viewType === "ready" || viewType === "all"
                ? () => {
                    if (selectedCopy) handleCancel(selectedCopy);
                  }
                : undefined
            }
            onReportLostDamaged={
              viewType === "distributed" || viewType === "all"
                ? () => {
                    if (selectedCopy) handleReportLostDamaged(selectedCopy);
                  }
                : undefined
            }
          />
        );
      })()}

      {/* Create Shareable Link Modal */}
      {selectedCopyForLink && (
        <CreateLinkModal
          isOpen={isCreateLinkModalOpen}
          onClose={() => {
            setIsCreateLinkModalOpen(false);
            setSelectedCopyForLink(null);
          }}
          documentId={selectedCopyForLink.documentNumber}
          documentTitle={selectedCopyForLink.name}
        />
      )}

      {/* Cancel Distribution Modal */}
      {selectedCopyForCancel && (
        <CancelDistributionModal
          isOpen={isCancelModalOpen}
          onClose={handleCancelModalClose}
          onConfirm={handleCancelFormSubmit}
          formData={cancelFormData}
          onFormDataChange={setCancelFormData}
          errors={cancelFormErrors}
          onErrorChange={setCancelFormErrors}
        />
      )}

      {/* ESignature Modal - Cancel Distribution */}
      <ESignatureModal
        isOpen={isESignModalOpen}
        onClose={() => setIsESignModalOpen(false)}
        onConfirm={handleESignConfirm}
        actionTitle="Cancel Distribution"
      />

      {/* ESignature Modal - Distribute */}
      <ESignatureModal
        isOpen={isDistributeESignModalOpen}
        onClose={() => {
          setIsDistributeESignModalOpen(false);
          setSelectedCopyForDistribute(null);
        }}
        onConfirm={handleDistributeESignConfirm}
        actionTitle="Confirm Distribution of Controlled Copy"
      />

      {/* Destruction Type Selection Modal */}
      <DestructionTypeSelectionModal
        isOpen={isReportLostDamagedModalOpen}
        onClose={() => {
          setIsReportLostDamagedModalOpen(false);
          setSelectedCopyForReportLostDamaged(null);
        }}
        onConfirm={handleReportLostDamagedConfirm}
      />
    </div>
  );
};
