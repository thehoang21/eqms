import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Check,
  X,
  Eye,
  Download,
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Tag,
  Hash,
  FileStack,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  RotateCcw,
  Link2,
  ExternalLink,
} from "lucide-react";
import { IconLayoutDashboard, IconChecks } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { AlertModal, AlertModalType } from "@/components/ui/modal/AlertModal";
import { ESignatureModal } from "@/components/ui/esignmodal";
import { cn } from "@/components/ui/utils";
import { getFileIconSrc } from "@/utils/fileIcons";
import { formatDateUS } from "@/utils/format";

// ─── Types ─────────────────────────────────────────────────────────
type MaterialStatus = "Draft" | "Pending" | "Approved" | "Obsolete";

interface TrainingMaterial {
  id: string;
  materialId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Image" | "Document";
  version: string;
  department: string;
  status: MaterialStatus;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  reviewer: string;
  approver: string;
  reviewedAt?: string;
  approvedAt?: string;
  reviewComment?: string;
  approvalComment?: string;
  externalUrl?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────
const MOCK_MATERIAL: TrainingMaterial = {
  id: "3",
  materialId: "TM-PDF-003",
  title: "Equipment Handling Guide",
  description: "Visual guide for proper equipment handling and maintenance procedures. This document covers safety protocols, step-by-step handling instructions, common troubleshooting procedures, and emergency response guidelines for all major equipment in the production facility.",
  type: "PDF",
  version: "1.5",
  department: "Engineering",
  status: "Pending",
  uploadedAt: "2026-02-08",
  uploadedBy: "Mike Johnson",
  fileSize: "8.2 MB",
  reviewer: "Jane Smith",
  approver: "Dr. A. Smith",
};

const WORKFLOW_STEPS: MaterialStatus[] = ["Draft", "Pending", "Approved", "Obsolete"];

// ─── Activity log mock ─────────────────────────────────────────
interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
  icon: React.ReactNode;
  color: string;
}

const generateActivityLog = (material: TrainingMaterial): ActivityEntry[] => {
  const logs: ActivityEntry[] = [
    {
      id: "1",
      action: "Material Created",
      user: material.uploadedBy,
      timestamp: material.uploadedAt,
      comment: "Initial upload of training material.",
      icon: <FileStack className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  if (material.status === "Pending" || material.status === "Approved") {
    logs.push({
      id: "2",
      action: "Submitted for Review",
      user: material.uploadedBy,
      timestamp: material.uploadedAt,
      comment: "Material submitted for review by assigned reviewer.",
      icon: <Send className="h-4 w-4" />,
      color: "bg-amber-100 text-amber-600",
    });
  }

  if (material.reviewedAt) {
    logs.push({
      id: "3",
      action: "Review Completed",
      user: material.reviewer,
      timestamp: material.reviewedAt,
      comment: material.reviewComment || "Reviewed and approved.",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "bg-emerald-100 text-emerald-600",
    });
  }

  if (material.approvedAt) {
    logs.push({
      id: "4",
      action: "Approved",
      user: material.approver,
      timestamp: material.approvedAt,
      comment: material.approvalComment || "Approved for use in training courses.",
      icon: <IconChecks className="h-4 w-4" />,
      color: "bg-emerald-100 text-emerald-600",
    });
  }

  return logs.reverse(); // Newest first
};


// ─── Component ─────────────────────────────────────────────────────
export const MaterialDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { materialId } = useParams<{ materialId: string }>();

  // In real app, fetch from API. For now, use mock
  const [material, setMaterial] = useState<TrainingMaterial>(MOCK_MATERIAL);
  const currentStepIndex = WORKFLOW_STEPS.indexOf(material.status);
  const activityLog = useMemo(() => generateActivityLog(material), [material]);

  // Determine user role (simulated)
  const isReviewer = true; // Current user is the assigned reviewer
  const isApprover = true; // Current user is the assigned approver
  const canReview = material.status === "Pending" && isReviewer;
  const canApprove = material.status === "Pending" && isApprover && !!material.reviewedAt;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AlertModalType>("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // E-Sign modal
  const [showESignModal, setShowESignModal] = useState(false);
  const [eSignAction, setESignAction] = useState<"review-approve" | "review-reject" | "approve" | "reject" | "obsolete" | null>(null);

  // Review/Reject comment
  const [reviewComment, setReviewComment] = useState("");

  // ─── E-Sign Actions ────────────────────────────────────────────
  const handleReviewApprove = () => {
    setESignAction("review-approve");
    setShowESignModal(true);
  };

  const handleReviewReject = () => {
    setESignAction("review-reject");
    setShowESignModal(true);
  };

  const handleApprove = () => {
    setESignAction("approve");
    setShowESignModal(true);
  };

  const handleReject = () => {
    setESignAction("reject");
    setShowESignModal(true);
  };

  const handleMarkObsolete = () => {
    setESignAction("obsolete");
    setShowESignModal(true);
  };

  const getESignTitle = () => {
    switch (eSignAction) {
      case "review-approve": return "Review & Approve Material";
      case "review-reject": return "Reject Material (Review)";
      case "approve": return "Approve Material";
      case "reject": return "Reject Material (Approval)";
      case "obsolete": return "Mark Material as Obsolete";
      default: return "";
    }
  };

  const handleESignConfirm = (reason: string) => {
    setShowESignModal(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      switch (eSignAction) {
        case "review-approve":
          setMaterial((prev) => ({
            ...prev,
            reviewedAt: new Date().toISOString().split("T")[0],
            reviewComment: reason,
          }));
          setModalType("success");
          setModalTitle("Review Completed");
          setModalDescription("Material has been reviewed successfully. It is now ready for approval.");
          setModalAction(null);
          break;

        case "review-reject":
          setMaterial((prev) => ({
            ...prev,
            status: "Draft",
            reviewComment: reason,
          }));
          setModalType("success");
          setModalTitle("Material Returned");
          setModalDescription("Material has been returned to draft. The author will be notified to make changes.");
          setModalAction(() => () => navigate("/training-management/training-materials"));
          break;

        case "approve":
          setMaterial((prev) => ({
            ...prev,
            status: "Approved",
            approvedAt: new Date().toISOString().split("T")[0],
            approvalComment: reason,
          }));
          setModalType("success");
          setModalTitle("Material Approved");
          setModalDescription("Training material has been approved and is now available for use in courses.");
          setModalAction(null);
          break;

        case "reject":
          setMaterial((prev) => ({
            ...prev,
            status: "Draft",
            approvalComment: reason,
          }));
          setModalType("success");
          setModalTitle("Material Rejected");
          setModalDescription("Material has been rejected and returned to draft. The author will be notified.");
          setModalAction(() => () => navigate("/training-management/training-materials"));
          break;

        case "obsolete":
          setMaterial((prev) => ({
            ...prev,
            status: "Obsolete",
          }));
          setModalType("success");
          setModalTitle("Material Obsoleted");
          setModalDescription("Material has been marked as obsolete and will no longer be available for new courses.");
          setModalAction(null);
          break;
      }

      setESignAction(null);
      setIsModalOpen(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Material Detail
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Materials</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Material Detail</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
            onClick={() => navigate("/training-management/training-materials")}
          >
            Back
          </Button>

          {/* Review actions */}
          {canReview && !material.reviewedAt && (
            <>
              <Button size="sm" variant="destructive" className="whitespace-nowrap gap-2" onClick={handleReviewReject}>
                Reject
              </Button>
              <Button size="sm" className="whitespace-nowrap gap-2" onClick={handleReviewApprove}>
                Review & Approve
              </Button>
            </>
          )}

          {/* Approve actions (after review) */}
          {canApprove && (
            <>
              <Button size="sm" variant="destructive" className="whitespace-nowrap gap-2" onClick={handleReject}>
                Reject
              </Button>
              <Button size="sm" className="whitespace-nowrap gap-2" onClick={handleApprove}>
                Approve
              </Button>
            </>
          )}

          {/* Obsolete action */}
          {material.status === "Approved" && (
            <Button size="sm" variant="destructive" className="whitespace-nowrap gap-2" onClick={handleMarkObsolete}>
              <XCircle className="h-4 w-4" />
              Mark Obsolete
            </Button>
          )}
        </div>
      </div>

      {/* ─── Workflow Stepper ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="flex items-stretch min-w-full">
            {WORKFLOW_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFirst = index === 0;
              const isLast = index === WORKFLOW_STEPS.length - 1;
              return (
                <div
                  key={step}
                  className="relative flex-1 flex items-center justify-center min-w-[140px]"
                  style={{ minHeight: "56px" }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 transition-all",
                      isCurrent
                        ? step === "Obsolete" ? "bg-red-500" : "bg-emerald-600"
                        : isCompleted
                        ? "bg-emerald-100"
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
                  <div className="relative z-10 flex items-center gap-2 px-6">
                    {isCompleted && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                    <span
                      className={cn(
                        "text-xs md:text-sm font-medium text-center whitespace-nowrap",
                        isCurrent ? "text-white" : isCompleted ? "text-slate-700" : "text-slate-400"
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

      {/* ─── Content Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6">
        {/* Left: Material Info */}
        <div className="xl:col-span-7 space-y-5">
          {/* Material Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Material Information</h3>
            </div>
            <div className="p-5 space-y-4">
              {/* File preview card */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                  {material.externalUrl ? (
                    <Link2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <img
                      src={getFileIconSrc(
                        material.type === "PDF" ? "file.pdf" :
                        material.type === "Video" ? "file.mp4" :
                        material.type === "Image" ? "file.jpg" :
                        "file.docx"
                      )}
                      alt="file icon"
                      className="h-6 w-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900">{material.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {material.externalUrl
                      ? "External Link"
                      : `${material.fileSize} · ${material.type} · Uploaded ${formatDateUS(material.uploadedAt)}`}
                  </p>
                  {material.externalUrl && (
                    <a
                      href={material.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Link
                    </a>
                  )}
                </div>
                <Button variant="outline" size="xs" className="gap-1.5 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </Button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Hash className="h-3.5 w-3.5" /> Material Code
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">{material.materialId}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Tag className="h-3.5 w-3.5" /> Version
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{material.version}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Building2 className="h-3.5 w-3.5" /> Department
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{material.department}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <User className="h-3.5 w-3.5" /> Uploaded By
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{material.uploadedBy}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5" /> Upload Date
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatDateUS(material.uploadedAt)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <FileStack className="h-3.5 w-3.5" /> File Type
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{material.type}</p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1.5">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{material.description}</p>
              </div>
            </div>
          </div>

          {/* Workflow Assignment Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Workflow Assignment</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reviewer */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Eye className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Reviewer</p>
                      <p className="text-sm font-semibold text-slate-900">{material.reviewer}</p>
                    </div>
                  </div>
                  {material.reviewedAt ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Reviewed on {formatDateUS(material.reviewedAt)}
                    </div>
                  ) : material.status === "Pending" ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      Awaiting review
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      Not started
                    </div>
                  )}
                </div>

                {/* Approver */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <IconChecks className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Approver</p>
                      <p className="text-sm font-semibold text-slate-900">{material.approver}</p>
                    </div>
                  </div>
                  {material.approvedAt ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approved on {formatDateUS(material.approvedAt)}
                    </div>
                  ) : material.reviewedAt ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      Awaiting approval
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      Pending review first
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activity Log */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Activity Log</h3>
            </div>
            <div className="p-5">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-6 bottom-6 w-px bg-slate-200" />

                <div className="space-y-5">
                  {activityLog.map((entry) => (
                    <div key={entry.id} className="relative flex gap-4">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10",
                        entry.color
                      )}>
                        {entry.icon}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{entry.action}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          by <span className="font-medium text-slate-700">{entry.user}</span> · {formatDateUS(entry.timestamp)}
                        </p>
                        {entry.comment && (
                          <p className="text-xs text-slate-600 mt-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            {entry.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review comment input (only if can review/approve) */}
              {(canReview && !material.reviewedAt) && (
                <div className="mt-5 pt-5 border-t border-slate-200">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                    Review Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add a comment for review..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Alert Modal ────────────────────────────────────────── */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction ? () => { modalAction(); setIsModalOpen(false); } : undefined}
        type={modalType}
        title={modalTitle}
        description={modalDescription}
        isLoading={isLoading}
        confirmText="OK"
      />

      {/* ─── E-Signature Modal ──────────────────────────────────── */}
      <ESignatureModal
        isOpen={showESignModal}
        onClose={() => { setShowESignModal(false); setESignAction(null); }}
        onConfirm={handleESignConfirm}
        actionTitle={getESignTitle()}
      />
    </div>
  );
};
