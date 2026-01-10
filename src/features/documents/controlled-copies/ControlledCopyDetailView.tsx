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
import { ControlledCopy, ControlledCopyStatus, CurrentStage } from "./types";

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

// Destruction Modal Component
const DestructionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: "upload" | "esign", data?: File | string) => void;
  controlledCopy: ControlledCopy;
}> = ({ isOpen, onClose, onConfirm, controlledCopy }) => {
  const [method, setMethod] = useState<"upload" | "esign" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        await onConfirm("upload", selectedFile);
        handleClose();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleESignConfirm = async (reason: string) => {
    setIsLoading(true);
    try {
      await onConfirm("esign", reason);
      setIsESignModalOpen(false);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMethod(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const handleBackToSelection = () => {
    setMethod(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Method selection view
  if (!method) {
    return (
      <>
        <FormModal
          isOpen={isOpen}
          onClose={handleClose}
          title="Mark Controlled Copy as Destroyed"
          description={
            <div className="space-y-2">
              <p>
                You are about to mark this controlled copy as destroyed. This action requires confirmation through one of the following methods:
              </p>
              <div className="bg-slate-50 rounded-lg p-3 mt-3 border border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-slate-700">Control #:</span>
                    <span className="ml-1 text-slate-900">{controlledCopy.controlNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Copy:</span>
                    <span className="ml-1 text-slate-900">
                      {controlledCopy.copyNumber} of {controlledCopy.totalCopies}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-slate-700">Location:</span>
                    <span className="ml-1 text-slate-900">{controlledCopy.location}</span>
                  </div>
                </div>
              </div>
            </div>
          }
          size="lg"
          showCancel={false}
        >
          <div className="space-y-3 py-2">
            {/* Upload Method */}
            <button
              onClick={() => setMethod("upload")}
              className="w-full flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                <Upload className="h-6 w-6 text-slate-600 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Upload Destruction Document
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload a photo or PDF of the signed destruction record form. The document should show evidence of proper disposal according to company procedures.
                </p>
              </div>
            </button>

            {/* E-Signature Method */}
            <button
              onClick={() => {
                setMethod("esign");
                setIsESignModalOpen(true);
              }}
              className="w-full flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                <FileText className="h-6 w-6 text-slate-600 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 mb-1">
                  E-Signature Confirmation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Confirm destruction electronically with your credentials and provide a reason. This method creates a digital audit trail.
                </p>
              </div>
            </button>

            {/* Warning Box */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-amber-900 font-medium mb-1">
                  Important Notice
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Once marked as destroyed, this controlled copy will be permanently removed from active inventory. Ensure the physical document has been properly disposed according to company policy.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </FormModal>

        {/* E-Signature Modal */}
        <ESignatureModal
          isOpen={isESignModalOpen}
          onClose={() => {
            setIsESignModalOpen(false);
            setMethod(null);
          }}
          onConfirm={handleESignConfirm}
          actionTitle="Confirm Controlled Copy Destruction"
        />
      </>
    );
  }

  // Upload form view
  if (method === "upload") {
    return (
      <FormModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Upload Destruction Document"
        description={
          <div className="space-y-2">
            <p>
              Upload a clear photo or scanned PDF of the signed destruction record form.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 mt-2 border border-slate-200">
              <div className="text-xs">
                <span className="font-medium text-slate-700">Destroying:</span>
                <span className="ml-1 text-slate-900">
                  {controlledCopy.controlNumber} - {controlledCopy.location}
                </span>
              </div>
            </div>
          </div>
        }
        size="lg"
        showCancel={false}
      >
        <div className="space-y-4">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Destruction Document <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100
                  file:transition-colors
                  cursor-pointer border border-slate-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Accepted formats: JPG, PNG, PDF (Max 10MB)
            </p>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border border-slate-300"
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center bg-slate-200 rounded border border-slate-300">
                      <FileText className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-medium">
                      File selected successfully
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Document Requirements:
            </h4>
            <ul className="space-y-1 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Clear image showing all document details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Must include signature of authorized personnel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Date and time of destruction visible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Control number matching: {controlledCopy.controlNumber}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" size="sm" onClick={handleBackToSelection} disabled={isLoading}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={handleUploadSubmit}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1.5" />
                Upload & Confirm Destruction
              </>
            )}
          </Button>
        </div>
      </FormModal>
    );
  }

  return null;
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

  const handleViewOriginalDocument = () => {
    // Navigate to original document detail view
    navigate(`/documents/${controlledCopy.documentId}`);
  };

  const handleMarkAsDestroyed = (
    method: "upload" | "esign",
    data?: File | string
  ) => {
    console.log("Mark as destroyed:", method, data);
    // TODO: Call API to mark as destroyed
    alert(
      `Controlled copy marked as destroyed via ${
        method === "upload" ? "document upload" : "e-signature"
      }`
    );
  };

  const handleDownloadPDF = () => {
    console.log("Download controlled copy PDF");
    // TODO: Generate and download PDF
    alert("Downloading controlled copy document...");
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
                <Trash2 className="h-4 w-4" />
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
      <DestructionModal
        isOpen={isDestructionModalOpen}
        onClose={() => setIsDestructionModalOpen(false)}
        onConfirm={handleMarkAsDestroyed}
        controlledCopy={controlledCopy}
      />
    </div>
  );
};
