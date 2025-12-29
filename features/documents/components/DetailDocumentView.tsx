import React, { useState } from "react";
import {
    ChevronRight,
    FileText,
    GraduationCap,
    Clock,
    CheckCircle2,
    AlertCircle,
    History,
    Check,
    FileSignature,
    GitBranch,
    Info,
    ArrowLeft,
} from "lucide-react";
import { cn } from "../../../components/ui/utils";
import {
    GeneralInformationTab,
    TrainingInformationTab,
    DocumentContentTab,
    SignaturesTab,
    AuditTrailTab,
    WorkflowDiagramTab,
} from "./tabs";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
type TabType = "general" | "training" | "document" | "signatures" | "audit" | "workflow";

interface DocumentDetail {
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
    businessUnit: string;
    knowledgeBase: string;
    subType: string;
    periodicReviewCycle: number;
    periodicReviewNotification: number;
    language: string;
}

interface DetailDocumentViewProps {
    documentId: string;
    onBack: () => void;
    initialTab?: TabType;
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
        case "Approved":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Effective":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Archive":
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
            return <AlertCircle className="h-4 w-4" />;
        case "Approved":
        case "Effective":
            return <CheckCircle2 className="h-4 w-4" />;
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

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// --- Mock Data ---
const MOCK_DOCUMENT: DocumentDetail = {
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
    businessUnit: "Operation Unit",
    knowledgeBase: "Human Resources & Administrator",
    subType: "-- None --",
    periodicReviewCycle: 24,
    periodicReviewNotification: 14,
    language: "English",
};

export const DetailDocumentView: React.FC<DetailDocumentViewProps> = ({
    documentId,
    onBack,
    initialTab = "general",
}) => {
    // In real app, fetch document by documentId
    const document = MOCK_DOCUMENT;
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Status workflow steps
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Effective", "Archive"];
    const currentStepIndex = statusSteps.indexOf(document.status);

    const handleShare = () => {
        console.log("Share document:", documentId);
        // TODO: Implement share functionality
    };

    const handleViewHistory = () => {
        console.log("View history:", documentId);
        // TODO: Implement view history functionality
    };

    const tabs = [
        { id: "general" as TabType, label: "General Information", icon: Info },
        { id: "training" as TabType, label: "Training Information", icon: GraduationCap },
        { id: "document" as TabType, label: "Document", icon: FileText },
        { id: "signatures" as TabType, label: "Signatures", icon: FileSignature },
        { id: "audit" as TabType, label: "Audit Trail", icon: History },
        { id: "workflow" as TabType, label: "Workflow Diagram", icon: GitBranch },
    ];

    return (
        <div className="space-y-6 w-full">
            {/* Header: Title + Breadcrumb + Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                            Document Details
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
                            <button
                                onClick={onBack}
                                className="hover:text-slate-700 transition-colors"
                            >
                                Dashboard
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={onBack}
                                className="hover:text-slate-700 transition-colors"
                            >
                                Document Management
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={onBack}
                                className="hover:text-slate-700 transition-colors"
                            >
                                All Documents
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">{document.documentId}</span>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to List
                    </button>
                </div>
            </div>

            {/* Status Stepper */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-stretch">
                    {statusSteps.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const isFirst = index === 0;
                        const isLast = index === statusSteps.length - 1;

                        return (
                            <div
                                key={step}
                                className="relative flex-1 flex items-center justify-center"
                                style={{ minHeight: '60px' }}
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
                                            ? 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)' // Đầu nhọn, đuôi phẳng
                                            : isLast
                                                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)' // Đầu phẳng, đuôi cắt chữ V
                                                : 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)' // Đầu nhọn, đuôi cắt chữ V
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

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
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
                                    <Icon className={cn(
                                        "h-4 w-4 shrink-0",
                                        activeTab === tab.id ? "text-emerald-600" : "text-slate-400"
                                    )} />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "general" && <GeneralInformationTab document={document} />}
                    {activeTab === "training" && <TrainingInformationTab />}
                    {activeTab === "document" && <DocumentContentTab />}
                    {activeTab === "signatures" && <SignaturesTab />}
                    {activeTab === "audit" && <AuditTrailTab />}
                    {activeTab === "workflow" && <WorkflowDiagramTab />}
                </div>
            </div>
        </div>
    );
};
