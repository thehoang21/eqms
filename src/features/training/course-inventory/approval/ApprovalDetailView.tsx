import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XCircle,
  Check,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { cn } from "@/components/ui/utils";
import { CourseApproval, TrainingFile } from "../../types";
import { BasicInfoTab } from "../shared/BasicInfoTab";
import { DocumentTab } from "../shared/DocumentTab";
import { ConfigTab } from "../shared/ConfigTab";

// Tab types
type TabType = "basic-info" | "document-training" | "training-config";

const TABS: { id: TabType; label: string }[] = [
  { id: "basic-info", label: "Basic Information" },
  { id: "document-training", label: "Training Materials" },
  { id: "training-config", label: "Assessment Config" },
];

// Workflow stepper steps (Rejected is an exception, shown as a banner)
const WORKFLOW_STEPS = ["Draft", "Pending Review", "Pending Approval", "Approved"] as const;

// Mock training files
const MOCK_TRAINING_FILES: TrainingFile[] = [
  {
    id: "tf-001",
    file: null as any,
    name: "GMP_Training_Materials_2026.pdf",
    size: 2456789,
    type: "application/pdf",
    progress: 100,
    status: "success",
  },
  {
    id: "tf-002",
    file: null as any,
    name: "GMP_Presentation_Slides.pptx",
    size: 8765432,
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    progress: 100,
    status: "success",
  },
  {
    id: "tf-003",
    file: null as any,
    name: "Quick_Reference_Guide.docx",
    size: 567890,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    progress: 100,
    status: "success",
  },
];

// Mock data - In real app, fetch by ID from API
const MOCK_APPROVALS: CourseApproval[] = [
  {
    id: "CA-001",
    courseId: "1",
    trainingId: "TRN-2026-001",
    courseTitle: "GMP Basic Principles",
    relatedDocument: "SOP-QA-001: Good Manufacturing Practices",
    relatedDocumentId: "DOC-001",
    trainingType: "GMP",
    trainingMethod: "Quiz (Paper-based/Manual)",
    instructorType: "internal",
    submittedBy: "John Smith",
    submittedAt: "2026-02-10",
    department: "Quality Assurance",
    approvalStatus: "Pending Review",
    passScore: 80,
    description: "This comprehensive training covers the fundamental principles of Good Manufacturing Practice (GMP) required for all personnel working in pharmaceutical manufacturing environments.",
    instructor: "Dr. Sarah Williams",
    duration: 4,
    location: "Training Room A",
    scheduledDate: "2026-03-15",
    capacity: 25,
    distributionList: ["Quality Assurance", "Production", "Quality Control"],
    recurrence: { enabled: true, intervalMonths: 12 },
    trainingFiles: MOCK_TRAINING_FILES,
    instruction: "Focus on Chapter 3 (Cleaning Validation) and Appendix B (Equipment Handling). Review all SOPs referenced in Section 2.4 before the training session.",
    examTemplate: "GMP_Exam_Template_2026.pdf",
    answerKey: "GMP_Answer_Key_2026.pdf",
    passingGradeType: "score_10",
    maxAttempts: 3,
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
    relatedDocument: "SOP-CR-002: Cleanroom Operations",
    relatedDocumentId: "DOC-002",
    trainingType: "SOP",
    trainingMethod: "Read & Understood",
    instructorType: "internal",
    submittedBy: "Sarah Johnson",
    submittedAt: "2026-02-12",
    department: "Production",
    approvalStatus: "Pending Review",
    passScore: 100,
    description: "Training on cleanroom classification, gowning procedures, and environmental monitoring requirements.",
    instructor: "Michael Chen",
    duration: 2,
    location: "Cleanroom Facility",
    scheduledDate: "2026-03-20",
    capacity: 15,
    distributionList: ["Production", "Quality Control"],
    recurrence: { enabled: false, intervalMonths: 0 },
    trainingFiles: [
      {
        id: "tf-004",
        file: null as any,
        name: "Cleanroom_SOP_Manual.pdf",
        size: 3456789,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
    ],
    instruction: "Pay special attention to gowning procedures in Section 3 and environmental monitoring protocols in Section 5.",
    passingGradeType: "pass_fail",
    maxAttempts: 1,
    questions: [],
  },
  {
    id: "CA-003",
    courseId: "3",
    trainingId: "TRN-2026-007",
    courseTitle: "HPLC Operation Advanced",
    relatedDocument: "SOP-LAB-005: HPLC Standard Method",
    relatedDocumentId: "DOC-003",
    trainingType: "Technical",
    trainingMethod: "Quiz (Paper-based/Manual)",
    instructorType: "external",
    submittedBy: "Dr. Michael Chen",
    submittedAt: "2026-02-08",
    department: "QC Lab",
    approvalStatus: "Pending Approval",
    passScore: 85,
    description: "Advanced HPLC operation training covering method development, troubleshooting, and maintenance procedures.",
    instructor: "Dr. Emily Parker",
    duration: 8,
    location: "QC Laboratory",
    scheduledDate: "2026-03-25",
    capacity: 10,
    distributionList: ["QC Lab", "R&D"],
    recurrence: { enabled: true, intervalMonths: 24 },
    trainingFiles: [
      {
        id: "tf-005",
        file: null as any,
        name: "HPLC_Advanced_Training.pdf",
        size: 5678901,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
      {
        id: "tf-006",
        file: null as any,
        name: "HPLC_Troubleshooting_Guide.pdf",
        size: 2345678,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
    ],
    instruction: "Review Chapter 4 (Method Development) and practice troubleshooting scenarios in Appendix C before the hands-on session.",
    examTemplate: "HPLC_Exam_2026.pdf",
    answerKey: "HPLC_Answer_Key_2026.pdf",
    passingGradeType: "percentage",
    maxAttempts: 2,
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
  {
    id: "CA-006",
    courseId: "6",
    trainingId: "TRN-2026-011",
    courseTitle: "ISO 14001 Environmental Management",
    relatedDocument: "SOP-ENV-001: Environmental Management System",
    relatedDocumentId: "DOC-006",
    trainingType: "Compliance",
    trainingMethod: "Read & Understood",
    instructorType: "internal",
    submittedBy: "Kevin Tran",
    submittedAt: "2026-02-18",
    department: "HSE",
    approvalStatus: "Pending Approval",
    passScore: 100,
    description: "This training covers the ISO 14001 Environmental Management System requirements, environmental policy, objectives and targets, and compliance monitoring procedures.",
    instructor: "Lisa Nguyen",
    duration: 3,
    location: "HSE Training Center",
    scheduledDate: "2026-03-28",
    capacity: 30,
    distributionList: ["HSE", "Production", "Maintenance"],
    recurrence: { enabled: true, intervalMonths: 12 },
    trainingFiles: [
      {
        id: "tf-007",
        file: null as any,
        name: "ISO14001_Environmental_Management.pdf",
        size: 4567890,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
    ],
    questions: [],
  },
  {
    id: "CA-008",
    courseId: "8",
    trainingId: "TRN-2026-013",
    courseTitle: "Deviation & Non-Conformance Handling",
    relatedDocument: "SOP-QA-007: Deviation Management",
    relatedDocumentId: "DOC-008",
    trainingType: "Compliance",
    trainingMethod: "Quiz (Paper-based/Manual)",
    instructorType: "internal",
    submittedBy: "Alice Pham",
    submittedAt: "2026-02-19",
    department: "Quality Assurance",
    approvalStatus: "Pending Approval",
    passScore: 80,
    description: "Training on deviation detection, documentation, investigation, root cause analysis, and CAPA implementation procedures.",
    instructor: "Dr. Sarah Williams",
    duration: 4,
    location: "Training Room B",
    scheduledDate: "2026-04-01",
    capacity: 20,
    distributionList: ["Quality Assurance", "Production", "QC Lab"],
    recurrence: { enabled: true, intervalMonths: 12 },
    trainingFiles: [
      {
        id: "tf-008",
        file: null as any,
        name: "Deviation_Management_SOP.pdf",
        size: 3456789,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
    ],
    questions: [
      {
        id: "q1",
        text: "What is the first step when a deviation is detected?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "Document and notify QA immediately", isCorrect: true },
          { id: "b", text: "Continue production", isCorrect: false },
          { id: "c", text: "Correct the deviation without reporting", isCorrect: false },
          { id: "d", text: "Wait for the next shift", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "What tool is commonly used for root cause analysis?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "SWOT Analysis", isCorrect: false },
          { id: "b", text: "Fishbone (Ishikawa) Diagram", isCorrect: true },
          { id: "c", text: "Balance Scorecard", isCorrect: false },
          { id: "d", text: "Gantt Chart", isCorrect: false },
        ],
      },
    ],
  },
];

export const ApprovalDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<TabType>("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const trainingFiles = approval.trainingFiles || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoTab
            readOnly
            title={approval.courseTitle}
            description={approval.description || ""}
            trainingType={approval.trainingType as any || "GMP"}
            trainingMethod={approval.trainingMethod as any || "Read & Understood"}
            instructorType={approval.instructorType || "internal"}
            instructor={approval.instructor || ""}
            scheduledDate={approval.scheduledDate || ""}
            duration={approval.duration || 0}
            location={approval.location || ""}
            capacity={approval.capacity || 0}
            distributionList={approval.distributionList || []}
            recurrence={approval.recurrence || { enabled: false, intervalMonths: 0 }}
            linkedDocumentId={approval.relatedDocumentId || ""}
            linkedDocumentTitle={approval.relatedDocument || ""}
            evidenceFiles={[]}
          />
        );
      case "document-training":
        return (
          <DocumentTab
            readOnly
            trainingFiles={trainingFiles}
            instruction={approval.instruction || ""}
          />
        );
      case "training-config":
        return (
          <ConfigTab
            readOnly
            trainingMethod={approval.trainingMethod as any || "Read & Understood"}
            examTemplateName={approval.examTemplate}
            answerKeyName={approval.answerKey}
            passingGradeType={approval.passingGradeType}
            passingScore={approval.passScore}
            maxAttempts={approval.maxAttempts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Title & Breadcrumb with Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              {queueLabel}
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
              <span className="text-slate-700 font-medium">{queueLabel}</span>
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
                  <span className="hidden sm:inline">{isSubmitting ? "Processing..." : "Review"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Review"}</span>
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

      {/* Tab Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-r border-slate-200 last:border-r-0",
                    isActive
                      ? "border-b-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer Actions */}
      {isActionable && (
        <div className="flex items-center justify-start gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>Cancel</Button>
          {isPendingReview && (
            <>
              <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                {isSubmitting ? "Processing..." : "Reject"}
              </Button>
              <Button size="sm" onClick={handleConfirmReview} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                {isSubmitting ? "Processing..." : "Review"}
              </Button>
            </>
          )}
          {isPendingApproval && (
            <>
              <Button size="sm" onClick={handleReject} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                {isSubmitting ? "Processing..." : "Reject"}
              </Button>
              <Button size="sm" onClick={handleApprove} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                {isSubmitting ? "Processing..." : "Approve"}
              </Button>
            </>
          )}
        </div>
      )}

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
    </div>
  );
};
