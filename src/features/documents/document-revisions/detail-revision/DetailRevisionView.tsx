import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import {
  GeneralInformationTab,
  TrainingInformationTab,
  DocumentTab,
  SignaturesTab,
  AuditTrailTab,
} from "./tabs";
import { Button } from "@/components/ui/button/Button";
import { Breadcrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import { revisionDetail } from "@/components/ui/breadcrumb/breadcrumbs.config";

import type { DocumentType, DocumentStatus } from "@/features/documents/types";

// --- Types ---
type TabType = "general" | "training" | "document" | "signatures" | "audit";

interface RevisionDetail {
  id: string;
  documentId: string;
  title: string;
  type: DocumentType;
  version: string;
  status: DocumentStatus;
  effectiveDate: string;
  validUntil: string;
  author: string;
  department: string;
  created: string;
  openedBy: string;
  description: string;
  owner: string;
  reviewers: string[];
  approvers: string[];
  lastModified: string;
  lastModifiedBy: string;
  isTemplate: boolean;
  titleLocalLanguage: string;
  businessUnit: string;
  knowledgeBase: string;
  subType: string;
  periodicReviewCycle: number;
  periodicReviewNotification: number;
  language: string;
}

interface DetailRevisionViewProps {
  documentId: string;
  onBack: () => void;
  initialTab?: TabType;
  initialStatus?: DocumentStatus;
}

// --- Helper Functions ---
const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Training":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Ready for Publishing":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "Effective":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Obsoleted":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Closed - Cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case "Draft":
      return <Clock className="h-4 w-4" />;
    case "Pending Review":
    case "Pending Approval":
    case "Pending Training":
    case "Ready for Publishing":
      return <AlertCircle className="h-4 w-4" />;
    case "Effective":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Obsoleted":
    case "Closed - Cancelled":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case "SOP":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Policy":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Form":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Report":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Specification":
      return "bg-pink-50 text-pink-700 border-pink-200";
    case "Protocol":
      return "bg-teal-50 text-teal-700 border-teal-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

// --- Mock Data ---
const MOCK_REVISION: RevisionDetail = {
  id: "1",
  documentId: "WIN_00001",
  title: "Test",
  type: "SOP",
  version: "3.0",
  status: "Effective",
  effectiveDate: "2025-12-21",
  validUntil: "2027-12-21",
  author: "Shani Rosenbilt",
  department: "Human Resources & Administrator",
  created: "2025-12-20 15:49:07",
  openedBy: "Shani Rosenbilt",
  description: "Test",
  owner: "Shani Rosenbilt",
  reviewers: ["John Smith", "Mary Williams", "Robert Brown"],
  approvers: ["David Miller", "Jennifer Davis"],
  lastModified: "2023-12-15",
  lastModifiedBy: "Dr. Sarah Johnson",
  isTemplate: false,
  titleLocalLanguage: "",
  businessUnit: "Operation Unit",
  knowledgeBase: "Human Resources & Administrator",
  subType: "-- None --",
  periodicReviewCycle: 24,
  periodicReviewNotification: 14,
  language: "English",
};

// Revision status workflow steps
const REVISION_STATUS_STEPS: DocumentStatus[] = [
  "Draft",
  "Pending Review",
  "Pending Approval",
  "Pending Training",
  "Ready for Publishing",
  "Effective",
  "Obsoleted",
  "Closed - Cancelled",
];

export const DetailRevisionView: React.FC<DetailRevisionViewProps> = ({
  documentId,
  onBack,
  initialTab = "general",
  initialStatus,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { initialStatus?: DocumentStatus };

  // In real app, fetch revision by documentId
  const document = {
    ...MOCK_REVISION,
    status: initialStatus || state?.initialStatus || MOCK_REVISION.status,
  };
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const currentStepIndex = REVISION_STATUS_STEPS.indexOf(document.status) !== -1
    ? REVISION_STATUS_STEPS.indexOf(document.status)
    : REVISION_STATUS_STEPS.indexOf("Effective");

  const tabs = [
    { id: "general" as TabType, label: "General Information" },
    { id: "training" as TabType, label: "Training Information" },
    { id: "document" as TabType, label: "Document" },
    { id: "signatures" as TabType, label: "Signatures" },
    { id: "audit" as TabType, label: "Audit Trail" },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header: Title + Breadcrumb + Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Document Revision Details
            </h1>
            <Breadcrumb items={revisionDetail(navigate)} />
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Button
              onClick={onBack}
              size="sm"
              variant="outline"
              className="whitespace-nowrap gap-2"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="flex items-stretch min-w-full">
            {REVISION_STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFirst = index === 0;
              const isLast = index === REVISION_STATUS_STEPS.length - 1;

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
                    "flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap border-r border-slate-200 last:border-r-0",
                    activeTab === tab.id
                      ? "border-b-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4 md:p-6">
          {activeTab === "general" && (
            <GeneralInformationTab document={document} />
          )}
          {activeTab === "training" && <TrainingInformationTab />}
          {activeTab === "document" && <DocumentTab />}
          {activeTab === "signatures" && <SignaturesTab />}
          {activeTab === "audit" && <AuditTrailTab />}
        </div>
      </div>
    </div>
  );
};
