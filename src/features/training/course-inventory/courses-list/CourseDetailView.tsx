import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Check,
  Edit,
  BarChart3,
  ClipboardList,
  Users,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import {
  TrainingRecord,
  TrainingFile,
  TrainingMethod,
  TrainingStatus,
  Recurrence,
} from "../../types";
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

// Workflow stepper steps
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

// Mock courses — in real app, fetch from API by ID
const MOCK_COURSES: (TrainingRecord & {
  trainingFiles: TrainingFile[];
  instruction: string;
  examTemplate?: string;
  answerKey?: string;
  passingGradeType?: "pass_fail" | "score_10" | "percentage";
  maxAttempts?: number;
  questions: any[];
  instructorType: "internal" | "external";
  distributionList: string[];
  linkedDocumentId: string;
  linkedDocumentTitle: string;
})[] = [
  {
    id: "1",
    trainingId: "TRN-2026-001",
    title: "GMP Basic Principles",
    description:
      "This comprehensive training covers the fundamental principles of Good Manufacturing Practice (GMP) required for all personnel working in pharmaceutical manufacturing environments.",
    type: "GMP",
    trainingMethod: "Quiz (Paper-based/Manual)",
    status: "In-Progress",
    instructor: "Dr. Sarah Williams",
    instructorType: "internal",
    scheduledDate: "2026-03-15",
    duration: 4,
    location: "Training Room A",
    capacity: 25,
    enrolled: 20,
    department: "Quality Assurance",
    mandatory: true,
    passScore: 80,
    recurrence: { enabled: true, intervalMonths: 12 },
    linkedDocumentId: "DOC-001",
    linkedDocumentTitle: "SOP-QA-001: Good Manufacturing Practices",
    distributionList: ["Quality Assurance", "Production", "Quality Control"],
    trainingFiles: MOCK_TRAINING_FILES,
    instruction:
      "Focus on Chapter 3 (Cleaning Validation) and Appendix B (Equipment Handling). Review all SOPs referenced in Section 2.4 before the training session.",
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
    ],
    createdBy: "Admin",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-20",
  },
  {
    id: "2",
    trainingId: "TRN-2026-002",
    title: "Cleanroom Qualification",
    description:
      "Training on cleanroom classification, gowning procedures, and environmental monitoring requirements.",
    type: "Technical",
    trainingMethod: "Read & Understood",
    status: "Scheduled",
    instructor: "Michael Chen",
    instructorType: "internal",
    scheduledDate: "2026-03-20",
    duration: 2,
    location: "Cleanroom Facility",
    capacity: 15,
    enrolled: 15,
    department: "Production",
    mandatory: true,
    passScore: 100,
    recurrence: { enabled: false, intervalMonths: 0 },
    linkedDocumentId: "DOC-002",
    linkedDocumentTitle: "SOP-CR-002: Cleanroom Operations",
    distributionList: ["Production", "Quality Control"],
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
    instruction:
      "Pay special attention to gowning procedures in Section 3 and environmental monitoring protocols in Section 5.",
    passingGradeType: "pass_fail",
    maxAttempts: 1,
    questions: [],
    createdBy: "QA Manager",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-25",
  },
  {
    id: "3",
    trainingId: "TRN-2026-003",
    title: "Emergency Response Procedures",
    description:
      "Training on fire safety, chemical spill response, and emergency evacuation procedures aligned with OSHA guidelines.",
    type: "Safety",
    trainingMethod: "Hands-on/OJT",
    status: "Completed",
    instructor: "Robert Lee",
    instructorType: "external",
    scheduledDate: "2026-01-20",
    duration: 6,
    location: "Assembly Point A",
    capacity: 50,
    enrolled: 45,
    department: "All Departments",
    mandatory: true,
    passScore: 70,
    recurrence: { enabled: true, intervalMonths: 6 },
    linkedDocumentId: "DOC-003",
    linkedDocumentTitle: "SOP-HSE-001: Emergency Response Plan",
    distributionList: ["All Departments"],
    trainingFiles: [
      {
        id: "tf-005",
        file: null as any,
        name: "Emergency_Response_Guide.pdf",
        size: 4567890,
        type: "application/pdf",
        progress: 100,
        status: "success",
      },
    ],
    instruction: "Complete all fire extinguisher drills during hands-on session.",
    questions: [],
    createdBy: "HSE Manager",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-21",
  },
];

const getStatusColor = (status: TrainingStatus): string => {
  switch (status) {
    case "Scheduled":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "In-Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Overdue":
      return "bg-red-50 text-red-700 border-red-200";
    case "Cancelled":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getWorkflowStepForStatus = (status: TrainingStatus) => {
  // Mapping training status to workflow step
  switch (status) {
    case "Scheduled":
    case "In-Progress":
    case "Completed":
      return 3; // Approved (past all steps)
    default:
      return 0;
  }
};

export const CourseDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("basic-info");

  // Find course by ID
  const course = MOCK_COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="space-y-6 w-full flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="gap-2">
            Back
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-lg font-medium text-slate-900">Course not found</p>
          <p className="text-sm text-slate-500 mt-1">
            The requested training course does not exist.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getWorkflowStepForStatus(course.status);

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoTab
            readOnly
            title={course.title}
            description={course.description || ""}
            trainingType={course.type}
            trainingMethod={course.trainingMethod}
            instructorType={course.instructorType}
            instructor={course.instructor}
            scheduledDate={course.scheduledDate}
            duration={course.duration}
            location={course.location}
            capacity={course.capacity}
            distributionList={course.distributionList}
            recurrence={course.recurrence || { enabled: false, intervalMonths: 0 }}
            linkedDocumentId={course.linkedDocumentId}
            linkedDocumentTitle={course.linkedDocumentTitle}
            evidenceFiles={[]}
          />
        );
      case "document-training":
        return (
          <DocumentTab readOnly trainingFiles={course.trainingFiles} instruction={course.instruction} />
        );
      case "training-config":
        return (
          <ConfigTab
            readOnly
            trainingMethod={course.trainingMethod}
            examTemplateName={course.examTemplate}
            answerKeyName={course.answerKey}
            passingGradeType={course.passingGradeType}
            passingScore={course.passScore}
            maxAttempts={course.maxAttempts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Course Detail
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Course Detail</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/training-management/courses-list")}
          >
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/training-management/courses/${courseId}/edit`)}
            className="gap-1.5"
          >
            Edit Course
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/training-management/courses/${courseId}/progress`)}
            className="gap-1.5"
          >
            View Progress
          </Button>
          {course.trainingMethod === "Quiz (Paper-based/Manual)" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/training-management/courses/${courseId}/result-entry`)}
              className="gap-1.5"
            >
              Result Entry
            </Button>
          )}
        </div>
      </div>

      {/* Course Summary Card */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-slate-500 font-mono">{course.trainingId}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(course.status)
                )}
              >
                {course.status}
              </span>
              {course.mandatory && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  Mandatory
                </span>
              )}
            </div>
            <h2 className="text-base lg:text-lg font-semibold text-slate-900 mt-1">
              {course.title}
            </h2>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Enrolled</p>
                <p className="text-sm font-semibold text-slate-900">
                  {course.enrolled}/{course.capacity}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(course.scheduledDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm font-semibold text-slate-900">{course.duration}h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm font-semibold text-slate-900 truncate max-w-[100px]">
                  {course.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Workflow Stepper */}
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
                      isCompleted ? "bg-emerald-100" : isCurrent ? "bg-emerald-600" : "bg-slate-100"
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
        <div className="animate-in fade-in duration-200">{renderTabContent()}</div>
      </div>
    </div>
  );
};
