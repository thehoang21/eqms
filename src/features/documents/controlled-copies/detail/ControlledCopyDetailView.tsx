import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Calendar,
  MapPin,
  User,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Upload,
  Download,
  ChevronLeft,
  AlertTriangle,
  Check,
  Info,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { useToast } from "@/components/ui/toast/Toast";
import { ControlledCopy, ControlledCopyStatus, CurrentStage } from "../types";
import { DestructionTypeSelectionModal } from "../components/DestructionTypeSelectionModal";
import { IconFileShredder, IconShare3, IconSmartHome } from "@tabler/icons-react";
import {
  DocumentInformationTab,
  DistributionInformationTab,
  SignaturesTab,
  AuditTrailTab,
} from "./tabs";

// Mock data - Replace with API call
const MOCK_CONTROLLED_COPY: ControlledCopy = {
  id: "1",
  documentNumber: "CC-2024-001",
  createdDate: "2024-01-05",
  createdTime: "09:30:45",
  openedBy: "John Smith",
  name: "Standard Operating Procedure for Quality Control Testing",
  status: "Ready for Distribution",
  validUntil: "2025-01-05",
  document: "SOP.0001.03",
  distributionList: "QA Lab, Production",
  version: "3.0",
  location: "Quality Assurance Lab",
  locationCode: "LOC-QA-01",
  department: "Quality Assurance",
  reason: "New production line setup",
  // Legacy fields for compatibility
  controlNumber: "CC-2024-001",
  documentId: "SOP.0001.03",
  documentTitle: "Standard Operating Procedure for Quality Control Testing",
  copyNumber: 1,
  totalCopies: 3,
  requestDate: "2024-01-05",
  requestedBy: "John Smith",
  currentStage: "Ready for Print",
  effectiveDate: "2024-01-05",
  distributedDate: undefined,
  distributedBy: undefined,
  recipientName: "QA Manager",
};

// Timeline/History mock data
interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  status: "completed" | "pending" | "rejected";
  comment?: string;
}

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: "1",
    action: "Request Submitted",
    actor: "John Smith",
    timestamp: "2024-01-05 09:30 AM",
    status: "completed",
    comment: "New production line setup",
  },
  {
    id: "2",
    action: "Approved by QM",
    actor: "Jane Doe (QA Manager)",
    timestamp: "2024-01-05 10:15 AM",
    status: "completed",
    comment: "Approved for printing",
  },
  {
    id: "3",
    action: "Printed & Issued",
    actor: "System",
    timestamp: "2024-01-05 11:00 AM",
    status: "completed",
    comment: "Controlled copy printed and delivered to location",
  },
  {
    id: "4",
    action: "Currently In Use",
    actor: "John Smith",
    timestamp: "2024-01-05 11:30 AM",
    status: "completed",
    comment: "Document received at Quality Assurance Lab",
  },
];

// Helper functions
const getStatusColor = (status: ControlledCopyStatus) => {
  switch (status) {
    case "Ready for Distribution":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Distributed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Obsolete":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Closed - Cancelled":
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

const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Timeline Component
const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline dot */}
            <div className="relative z-10">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  event.status === "completed" &&
                    "bg-emerald-50 border-emerald-500",
                  event.status === "pending" && "bg-amber-50 border-amber-500",
                  event.status === "rejected" && "bg-red-50 border-red-500"
                )}
              >
                {event.status === "completed" && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
                {event.status === "pending" && (
                  <Clock className="h-4 w-4 text-amber-600" />
                )}
                {event.status === "rejected" && (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>

            {/* Event content */}
            <div className="flex-1 pb-6">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {event.action}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      by {event.actor}
                    </p>
                    {event.comment && (
                      <p className="text-sm text-slate-500 mt-2 italic">
                        "{event.comment}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {event.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tab Type
type TabType = "document" | "distribution" | "signatures" | "audit";

// Main Component
interface ControlledCopyDetailViewProps {
  controlledCopyId: string;
  onBack: () => void;
  initialTab?: TabType;
}

export const ControlledCopyDetailView: React.FC<ControlledCopyDetailViewProps> = ({
  controlledCopyId,
  onBack,
  initialTab = "document",
}) => {
  const navigate = useNavigate();

  const [controlledCopy] = useState<ControlledCopy>(MOCK_CONTROLLED_COPY);
  const [timeline] = useState<TimelineEvent[]>(MOCK_TIMELINE);
  const [isDestructionModalOpen, setIsDestructionModalOpen] = useState(false);
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [isReportLostDamagedModalOpen, setIsReportLostDamagedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { showToast } = useToast();

  // Status workflow steps
  const statusSteps: ControlledCopyStatus[] = [
    "Ready for Distribution",
    "Distributed",
    "Obsolete",
    "Closed - Cancelled",
  ];
  // Tabs configuration
  const tabs = [
    { id: "document" as TabType, label: "Document Information" },
    { id: "distribution" as TabType, label: "Distribution Information" },
    { id: "signatures" as TabType, label: "Signatures" },
    { id: "audit" as TabType, label: "Audit Trail" },
  ];

  const currentStepIndex = statusSteps.indexOf(controlledCopy.status);

  const handleViewOriginalDocument = () => {
    // Navigate to original document detail view
    navigate(`/documents/${controlledCopy.documentId}`);
  };

  const handleMarkAsDestroyed = (
    formData: any,
    reason: string
  ) => {
    console.log("Mark as destroyed:", formData, reason);
    // TODO: Call API to mark as destroyed with all form data
    // Update controlled copy with destruction info
    // Add timeline event
    alert(
      `Controlled copy marked as destroyed.\nMethod: ${formData.destructionMethod}\nExecutor: ${formData.destructedBy}\nSupervisor: ${formData.destructionSupervisor}`
    );
  };

  const handleDownloadPDF = () => {
    // Mở modal ký điện tử trước khi download
    setIsESignModalOpen(true);
  };

  const handleESignSuccess = (reason: string) => {
    // Đóng modal
    setIsESignModalOpen(false);
    
    // Hiển thị toast thành công
    showToast({
      type: "success",
      title: "E-Signature Verified",
      message: "Document download started successfully.",
      duration: 3500,
    });

    // Thực hiện download
    console.log("E-Signature reason:", reason);
    console.log("Download controlled copy PDF");
    // TODO: Call API to log e-signature event and download PDF
    // Generate download file
    setTimeout(() => {
      alert("Downloading controlled copy document...");
    }, 500);
  };

  const handleDistribute = () => {
    // Mở modal ký điện tử để xác nhận phân phối
    setIsDistributeModalOpen(true);
  };

  const handleDistributeSuccess = (reason: string) => {
    // Đóng modal
    setIsDistributeModalOpen(false);
    
    // Hiển thị toast thành công
    showToast({
      type: "success",
      title: "Controlled Copy Distributed",
      message: "The controlled copy has been successfully distributed.",
      duration: 3500,
    });

    // Thực hiện distribute
    console.log("Distribute reason:", reason);
    console.log("Distribute controlled copy");
    // TODO: Call API to distribute controlled copy
    // Update status to "Distributed"
    // Add audit trail entry
    // Send notification
  };

  const handleReportLostDamaged = () => {
    // Mở modal chọn type
    setIsReportLostDamagedModalOpen(true);
  };

  const handleReportLostDamagedConfirm = (type: "Lost" | "Damaged") => {
    // Đóng modal
    setIsReportLostDamagedModalOpen(false);
    
    // Navigate to destroy page với type parameter
    navigate(`/documents/controlled-copies/${controlledCopy.id}/destroy?type=${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Controlled Copy Details
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
              <IconSmartHome className="h-4 w-4" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Document Control</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Controlled Copies</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">
                {controlledCopy.controlNumber}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Button onClick={onBack} variant="outline" size="sm" className="gap-1.5 shadow-sm">
              Back
            </Button>
            <Button
              onClick={handleViewOriginalDocument}
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-sm hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50"
            >
              View Original
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-sm"
            >
              Download
            </Button>
            {controlledCopy.status === "Ready for Distribution" && (
              <Button
                onClick={handleDistribute}
                variant="default"
                size="sm"
                className="gap-1.5 shadow-sm"
              >
                Distribute
              </Button>
            )}
            {controlledCopy.status === "Distributed" && (
              <Button
                onClick={handleReportLostDamaged}
                variant="outline"
                size="sm"
                className="gap-1.5 shadow-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                Report Lost
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="flex items-stretch min-w-full">
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFirst = index === 0;
              const isLast = index === statusSteps.length - 1;

              return (
                <div
                  key={step}
                  className="relative flex-1 flex items-center justify-center min-w-[150px]"
                  style={{ minHeight: "60px" }}
                >
                  {/* Arrow Shape Background */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-all",
                      isCompleted
                        ? "bg-emerald-100"
                        : isCurrent
                        ? "bg-emerald-600"
                        : "bg-slate-100"
                    )}
                    style={{
                      clipPath: isFirst
                        ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)"
                        : isLast
                        ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)"
                        : "polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2 px-6">
                    {isCompleted && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-xs md:text-sm font-medium text-center",
                        isCurrent
                          ? "text-white"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "document" && (
            <DocumentInformationTab controlledCopy={controlledCopy} />
          )}
          {activeTab === "distribution" && (
            <DistributionInformationTab controlledCopy={controlledCopy} />
          )}
          {activeTab === "signatures" && <SignaturesTab />}
          {activeTab === "audit" && <AuditTrailTab />}
        </div>
      </div>

      {/* E-Signature Modal for Download */}
      <ESignatureModal
        isOpen={isESignModalOpen}
        onClose={() => setIsESignModalOpen(false)}
        onConfirm={handleESignSuccess}
        actionTitle="Download Controlled Copy"
      />

      {/* E-Signature Modal for Distribute */}
      <ESignatureModal
        isOpen={isDistributeModalOpen}
        onClose={() => setIsDistributeModalOpen(false)}
        onConfirm={handleDistributeSuccess}
        actionTitle="Distribute Controlled Copy"
      />

      {/* Destruction Type Selection Modal */}
      <DestructionTypeSelectionModal
        isOpen={isReportLostDamagedModalOpen}
        onClose={() => setIsReportLostDamagedModalOpen(false)}
        onConfirm={handleReportLostDamagedConfirm}
      />
    </div>
  );
};
