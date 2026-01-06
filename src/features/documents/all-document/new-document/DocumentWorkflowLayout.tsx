import React from "react";
import {
    ChevronRight,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Check,
    ArrowLeft,
    Home,
    GraduationCap,
    FileSignature,
    History,
    Info,
} from "lucide-react";
import { cn } from '@/components/ui/utils';
import { Button } from "@/components/ui/button/Button";

// --- Types ---
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
type TabType = "document" | "general" | "training" | "signatures" | "audit";

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface TabItem {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface DocumentWorkflowLayoutProps {
    // Header props
    title: string;
    breadcrumbs: BreadcrumbItem[];
    onBack: () => void;
    
    // Document info
    documentId: string;
    documentStatus: DocumentStatus;
    
    // Status stepper
    statusSteps: DocumentStatus[];
    currentStatus: DocumentStatus;
    
    // Tabs
    tabs: TabItem[];
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    
    // Content
    children: React.ReactNode;
}

// --- Helper Functions ---
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

// --- Default Tabs ---
export const DEFAULT_WORKFLOW_TABS: TabItem[] = [
    { id: "document", label: "Document", icon: FileText },
    { id: "general", label: "General Information", icon: Info },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "signatures", label: "Signatures", icon: FileSignature },
    { id: "audit", label: "Audit Trail", icon: History },
];

// --- Main Component ---
export const DocumentWorkflowLayout: React.FC<DocumentWorkflowLayoutProps> = ({
    title,
    breadcrumbs,
    onBack,
    documentId,
    documentStatus,
    statusSteps,
    currentStatus,
    tabs,
    activeTab,
    onTabChange,
    children,
}) => {
    const currentStepIndex = statusSteps.indexOf(currentStatus);

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {title}
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
                            {breadcrumbs.map((item, index) => (
                                <React.Fragment key={index}>
                                    {index === 0 ? (
                                        <>
                                            <button
                                                onClick={item.onClick || onBack}
                                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                                            >
                                                {item.label}
                                            </button>
                                            <Home className="h-4 w-4 sm:hidden" />
                                        </>
                                    ) : item.isActive ? (
                                        <span className="text-slate-700 font-medium">{item.label}</span>
                                    ) : index === breadcrumbs.length - 2 && breadcrumbs.length > 3 ? (
                                        <>
                                            <span className="sm:hidden">...</span>
                                            <button
                                                onClick={item.onClick || onBack}
                                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                                            >
                                                {item.label}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={item.onClick || onBack}
                                            className="hover:text-slate-700 transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={onBack}
                        size="sm"
                        variant="outline"
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to List
                    </Button>
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
                                            ? 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)'
                                            : isLast
                                                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 20px 50%)'
                                                : 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)'
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
                                    onClick={() => onTabChange(tab.id)}
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
                    {children}
                </div>
            </div>
        </div>
    );
};
