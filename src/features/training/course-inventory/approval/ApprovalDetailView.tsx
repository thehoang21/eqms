import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  FileText,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { cn } from "@/components/ui/utils";
import { CourseApproval } from "../../types";

// Workflow stepper steps (Rejected is an exception, shown as a banner)
const WORKFLOW_STEPS = ["Draft", "Pending Review", "Pending Approval", "Approved"] as const;

// Mock data - In real app, fetch by ID from API
const MOCK_APPROVALS: CourseApproval[] = [
  {
    id: "CA-001",
    courseId: "1",
    trainingId: "TRN-2026-001",
    courseTitle: "GMP Basic Principles",
    relatedSOP: "SOP-QA-001: Good Manufacturing Practices",
    sopDocumentId: "DOC-001",
    trainingMethod: "Theory Quiz",
    submittedBy: "John Smith",
    submittedAt: "2026-02-10",
    department: "Quality Assurance",
    approvalStatus: "Pending Review",
    passScore: 80,
    questions: [
      {
        id: "q1",
        text: "What is the primary purpose of GMP?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "To increase production speed", isCorrect: false },
          { id: "b", text: "To ensure product quality and safety", isCorrect: true },
          { id: "c", text: "To reduce manufacturing costs", isCorrect: false },
          { id: "d", text: "To improve employee satisfaction", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which document defines the standard operating procedures for cleanroom entry?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "SOP-QA-001", isCorrect: false },
          { id: "b", text: "SOP-CR-002", isCorrect: true },
          { id: "c", text: "SOP-PR-003", isCorrect: false },
          { id: "d", text: "SOP-IT-004", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "How often should GMP training be renewed?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "Every 6 months", isCorrect: false },
          { id: "b", text: "Every year", isCorrect: true },
          { id: "c", text: "Every 2 years", isCorrect: false },
          { id: "d", text: "Only once at onboarding", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "CA-002",
    courseId: "2",
    trainingId: "TRN-2026-006",
    courseTitle: "Cleanroom Qualification",
    relatedSOP: "SOP-CR-002: Cleanroom Operations",
    sopDocumentId: "DOC-002",
    trainingMethod: "Read & Understood",
    submittedBy: "Sarah Johnson",
    submittedAt: "2026-02-12",
    department: "Production",
    approvalStatus: "Pending Review",
    passScore: 100,
    questions: [],
  },
  {
    id: "CA-003",
    courseId: "3",
    trainingId: "TRN-2026-007",
    courseTitle: "HPLC Operation Advanced",
    relatedSOP: "SOP-LAB-005: HPLC Standard Method",
    sopDocumentId: "DOC-003",
    trainingMethod: "Theory Quiz",
    submittedBy: "Dr. Michael Chen",
    submittedAt: "2026-02-08",
    department: "QC Lab",
    approvalStatus: "Pending Approval",
    passScore: 85,
    questions: [
      {
        id: "q1",
        text: "What is the recommended mobile phase flow rate for analytical HPLC?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "0.1 mL/min", isCorrect: false },
          { id: "b", text: "1.0 mL/min", isCorrect: true },
          { id: "c", text: "5.0 mL/min", isCorrect: false },
          { id: "d", text: "10.0 mL/min", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which detector is most commonly used for UV-absorbing compounds?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "DAD/PDA detector", isCorrect: true },
          { id: "b", text: "Refractive Index detector", isCorrect: false },
          { id: "c", text: "Fluorescence detector", isCorrect: false },
          { id: "d", text: "Conductivity detector", isCorrect: false },
        ],
      },
    ],
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const ApprovalDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(true);
  const [showESignModal, setShowESignModal] = useState(false);
  const [eSignAction, setESignAction] = useState<"confirm-review" | "approve" | "reject" | null>(null);

  // Find approval by ID
  const approval = MOCK_APPROVALS.find((a) => a.id === id);

  if (!approval) {
    return (
      <div className="space-y-6 w-full flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            Back
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-lg font-medium text-slate-900">Course approval not found</p>
          <p className="text-sm text-slate-500 mt-1">The requested approval does not exist.</p>
        </div>
      </div>
    );
  }

  const isPendingReview = approval.approvalStatus === "Pending Review";
  const isPendingApproval = approval.approvalStatus === "Pending Approval";
  const isActionable = isPendingReview || isPendingApproval;
  const isRejected = approval.approvalStatus === "Rejected";

  const handleBack = () => {
    if (isPendingReview) {
      navigate("/training-management/pending-review");
    } else if (isPendingApproval) {
      navigate("/training-management/pending-approval");
    } else {
      window.history.back();
    }
  };

  const queueLabel =
    isPendingReview
      ? "Pending Review"
      : isPendingApproval
      ? "Pending Approval"
      : isRejected
      ? "Course History"
      : "Approved Courses";

  const handleConfirmReview = () => {
    setESignAction("confirm-review");
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

  const handleESignConfirm = (reason: string) => {
    setIsSubmitting(true);
    setShowESignModal(false);
    
    setTimeout(() => {
      if (eSignAction === "confirm-review") {
        console.log("Content review confirmed:", approval.id, "Reason:", reason);
      } else if (eSignAction === "approve") {
        console.log("Approved:", approval.id, "Reason:", reason);
      } else {
        console.log("Rejected:", approval.id, "Rejection Reason:", reason);
      }
      
      setIsSubmitting(false);
      setESignAction(null);
      handleBack();
    }, 500);
  };

  const currentStepIndex = isRejected
    ? -1
    : WORKFLOW_STEPS.indexOf(approval.approvalStatus as typeof WORKFLOW_STEPS[number]);

  const totalPoints = approval.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Title & Breadcrumb with Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              {approval.courseTitle}
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
              <IconSmartHome className="h-4 w-4" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Training Management</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">Course Inventory</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden sm:inline">{queueLabel}</span>
              <span className="sm:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">{approval.trainingId}</span>
            </div>
          </div>

          {/* Action Buttons (Header) */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleBack} className="hidden sm:inline-flex">
              Cancel
            </Button>
            {isPendingReview && (
              <>
                <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  <span className="hidden sm:inline">{isSubmitting ? "Processing..." : "Reject"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Reject"}</span>
                </Button>
                <Button size="sm" onClick={handleConfirmReview} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">{isSubmitting ? "Processing..." : "Confirm Review"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Confirm"}</span>
                </Button>
              </>
            )}
            {isPendingApproval && (
              <>
                <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  <span className="hidden sm:inline">{isSubmitting ? "Processing..." : "Reject"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Reject"}</span>
                </Button>
                <Button size="sm" onClick={handleApprove} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">{isSubmitting ? "Processing..." : "Approve"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Approve"}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Workflow Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="flex items-stretch min-w-full">
            {WORKFLOW_STEPS.map((step, index) => {
              const isCompleted = !isRejected && index < currentStepIndex;
              const isCurrent = !isRejected && index === currentStepIndex;
              const isFirst = index === 0;
              const isLast = index === WORKFLOW_STEPS.length - 1;
              return (
                <div key={step} className="relative flex-1 flex items-center justify-center min-w-[140px]" style={{ minHeight: "56px" }}>
                  <div
                    className={cn(
                      "absolute inset-0 transition-all",
                      isRejected ? "bg-slate-100" : isCompleted ? "bg-emerald-100" : isCurrent ? "bg-emerald-600" : "bg-slate-100"
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
                    {!isRejected && isCompleted && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                    <span className={cn("text-xs md:text-sm font-medium text-center", !isRejected && isCurrent ? "text-white" : !isRejected && isCompleted ? "text-slate-700" : "text-slate-400")}>
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isRejected && (
          <div className="flex items-start gap-3 px-5 py-3.5 bg-red-50 border-t border-red-200">
            <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Course Rejected</p>
              {approval.rejectionReason && (
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{approval.rejectionReason}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 space-y-6">
          {/* Course Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Related SOP */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Related SOP
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                {approval.relatedSOP}
              </p>
            </div>

            {/* Training Method */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Training Method
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                    approval.trainingMethod === "Theory Quiz"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  )}
                >
                  {approval.trainingMethod}
                </span>
                <span className="text-sm text-slate-600">
                  Pass Score: <span className="font-semibold text-slate-900">{approval.passScore}%</span>
                </span>
              </div>
            </div>

            {/* Submitted By */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Submitted By
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900">{approval.submittedBy}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {approval.department} — {formatDate(approval.submittedAt)}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                {(isPendingReview || isPendingApproval) ? (
                  <AlertTriangle className={cn("h-4 w-4", isPendingReview ? "text-amber-600" : "text-blue-600")} />
                ) : approval.approvalStatus === "Approved" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  isPendingReview && "bg-amber-50 text-amber-700 border-amber-200",
                  isPendingApproval && "bg-blue-50 text-blue-700 border-blue-200",
                  approval.approvalStatus === "Approved" &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                  isRejected && "bg-red-50 text-red-700 border-red-200"
                )}
              >
                {approval.approvalStatus}
              </span>
              {approval.approvedBy && (
                <p className="text-xs text-slate-500 mt-1.5">
                  By {approval.approvedBy} on {formatDate(approval.approvedAt!)}
                </p>
              )}
            </div>
          </div>

          {/* Previous Rejection Reason */}
          {isRejected && approval.rejectionReason && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                  Rejection Reason
                </span>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">{approval.rejectionReason}</p>
            </div>
          )}

          {/* Questions & Answers Section */}
          {approval.trainingMethod === "Theory Quiz" && approval.questions.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => setExpandedQuestions(!expandedQuestions)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    Test Content ({approval.questions.length} questions — Total: {totalPoints} points)
                  </span>
                </div>
                {expandedQuestions ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>

              {/* Questions List */}
              {expandedQuestions && (
                <div className="divide-y divide-slate-100">
                  {approval.questions.map((question, qIndex) => (
                    <div key={question.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-slate-900 leading-relaxed flex-1">
                              {question.text}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold shrink-0">
                              {question.points} pts
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {question.type === "multiple_choice" ? "Multiple Choice" : "Essay"}
                          </p>

                          {/* Options */}
                          {question.options && question.options.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border",
                                    option.isCorrect
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                      : "bg-white border-slate-200 text-slate-600"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                                      option.isCorrect
                                        ? "border-emerald-500 bg-emerald-500"
                                        : "border-slate-300"
                                    )}
                                  >
                                    {option.isCorrect && (
                                      <CheckCircle2 className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <span>{option.text}</span>
                                  {option.isCorrect && (
                                    <span className="ml-auto text-xs font-medium text-emerald-600">
                                      Correct Answer
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Read & Understood - No questions */}
          {approval.trainingMethod === "Read & Understood" && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  Training Method Note
                </span>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                This course uses the <strong>Read &amp; Understood</strong> method. Trainees will
                read the related SOP document and confirm acknowledgment. No quiz questions are
                required.
              </p>
            </div>
          )}


        </div>

        {/* E-Signature Modal */}
        <ESignatureModal
          isOpen={showESignModal}
          onClose={() => {
            setShowESignModal(false);
            setESignAction(null);
          }}
          onConfirm={handleESignConfirm}
          actionTitle={eSignAction === "confirm-review" ? "Confirm Content Review" : eSignAction === "approve" ? "Approve Course" : "Reject Course"}
        />

        {/* Footer Actions */}
        {isActionable && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
            {isPendingReview && (
              <>
                <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSubmitting ? "Processing..." : "Reject"}
                </Button>
                <Button size="sm" onClick={handleConfirmReview} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <ClipboardList className="h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Confirm Review"}
                </Button>
              </>
            )}
            {isPendingApproval && (
              <>
                <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSubmitting ? "Processing..." : "Reject"}
                </Button>
                <Button size="sm" onClick={handleApprove} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Approve"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
