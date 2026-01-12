import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Calendar,
  MapPin,
  User,
  FileText,
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
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { FormModal } from "@/components/ui/modal/FormModal";
import { MarkAsDestroyedModal } from "./MarkAsDestroyedModal";
import { useToast } from "@/components/ui/toast/Toast";
import { ControlledCopy, ControlledCopyStatus, CurrentStage } from "./types";
import { IconFileShredder } from "@tabler/icons-react";

// Mock data - Replace with API call
const MOCK_CONTROLLED_COPY: ControlledCopy = {
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
    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Recalled":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Obsolete":
      return "bg-red-50 text-red-700 border-red-200";
    case "Destroyed":
      return "bg-slate-800 text-white border-slate-900";
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

// Main Component
interface ControlledCopyDetailViewProps {
  controlledCopyId: string;
  onBack: () => void;
}

export const ControlledCopyDetailView: React.FC<ControlledCopyDetailViewProps> = ({
  controlledCopyId,
  onBack,
}) => {
  const navigate = useNavigate();

  const [controlledCopy] = useState<ControlledCopy>(MOCK_CONTROLLED_COPY);
  const [timeline] = useState<TimelineEvent[]>(MOCK_TIMELINE);
  const [isDestructionModalOpen, setIsDestructionModalOpen] = useState(false);
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const { showToast } = useToast();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Controlled Copy Details
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
            <span className="text-slate-700 font-medium">
              {controlledCopy.controlNumber}
            </span>
          </div>
        </div>

        {/* Status Badges & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2",
                getStatusColor(controlledCopy.status)
              )}
            >
              {controlledCopy.status}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2",
                getStageColor(controlledCopy.currentStage)
              )}
            >
              {controlledCopy.currentStage}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* button Back to All Controlled Copies */}
            <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to List
            </Button>
            <Button
              onClick={handleViewOriginalDocument}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Original Document
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Copy
            </Button>
            {controlledCopy.status === "Active" && (
              <Button
                onClick={() => setIsDestructionModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <IconFileShredder className="h-4 w-4" />
                Mark as Destroyed
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Control Number
                  </label>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {controlledCopy.controlNumber}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Copy Number
                  </label>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Copy {controlledCopy.copyNumber} of{" "}
                    {controlledCopy.totalCopies}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Document ID
                </label>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {controlledCopy.documentId}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Document Title
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {controlledCopy.documentTitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Version
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    v{controlledCopy.version}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Department
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {controlledCopy.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                Location Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location Name
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {controlledCopy.location}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location Code
                </label>
                <p className="mt-1 text-sm font-mono text-slate-700">
                  {controlledCopy.locationCode}
                </p>
              </div>
            </div>
          </div>

          {/* Request Information Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                Request Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Requested By
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {controlledCopy.requestedBy}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Request Date
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {formatDate(controlledCopy.requestDate)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Effective Date
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {formatDate(controlledCopy.effectiveDate)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Reason
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {controlledCopy.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Destruction Evidence Card - Only show if destroyed */}
          {controlledCopy.status === "Destroyed" && controlledCopy.destructionEvidenceUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-50 shadow-sm overflow-hidden">
              <div className="border-b border-slate-300 bg-slate-800 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Destruction Evidence
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Evidence Photo */}
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Evidence Photo
                  </label>
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={controlledCopy.destructionEvidenceUrl}
                      alt="Destruction Evidence"
                      className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(controlledCopy.destructionEvidenceUrl, '_blank')}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Click to view full size
                  </p>
                </div>

                {/* Destruction Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Destruction Date
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {controlledCopy.destructionDate && formatDate(controlledCopy.destructionDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Method
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {controlledCopy.destructionMethod}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Executor
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {controlledCopy.destructedBy}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Supervisor
                    </label>
                    <p className="mt-1 text-sm text-slate-900">
                      {controlledCopy.destructionSupervisor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                Approval Workflow Timeline
              </h2>
            </div>
            <div className="p-6">
              <Timeline events={timeline} />
            </div>
          </div>
        </div>
      </div>

      {/* Destruction Modal */}
      <MarkAsDestroyedModal
        isOpen={isDestructionModalOpen}
        onClose={() => setIsDestructionModalOpen(false)}
        onConfirm={handleMarkAsDestroyed}
        controlledCopy={controlledCopy}
      />

      {/* E-Signature Modal for Download */}
      <ESignatureModal
        isOpen={isESignModalOpen}
        onClose={() => setIsESignModalOpen(false)}
        onConfirm={handleESignSuccess}
        actionTitle="Download Controlled Copy"
      />
    </div>
  );
};
