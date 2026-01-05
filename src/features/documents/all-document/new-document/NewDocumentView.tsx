import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronRight,
    FileText,
    Info,
    Save,
    X,
    GraduationCap,
    FileSignature,
    History,
    GitBranch,
    Check,
    Send,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import {
    GeneralTab,
    TrainingTab,
    DocumentTab,
    SignaturesTab,
    AuditTab,
    WorkflowTab,
    type UploadedFile,
} from "./tabs";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
type TabType = "general" | "training" | "document" | "signatures" | "audit" | "workflow";

export const NewDocumentView: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isESignOpen, setIsESignOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalMessage, setValidationModalMessage] = useState<React.ReactNode>(null);

    // File state
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        type: "SOP" as DocumentType,
        author: "",
        businessUnit: "",
        department: "",
        knowledgeBase: "",
        subType: "-- None --",
        periodicReviewCycle: 24,
        periodicReviewNotification: 14,
        language: "English",
        description: "",
        isTemplate: false,
    });

    const missingRequiredFields = useMemo(() => {
        const missing: string[] = [];
        if (!formData.title.trim()) missing.push("Document Name");
        if (!String(formData.type || "").trim()) missing.push("Document Type");
        if (!formData.author.trim()) missing.push("Author");
        if (!formData.businessUnit.trim()) missing.push("Business Unit");
        if (!Number.isFinite(formData.periodicReviewCycle) || formData.periodicReviewCycle <= 0) {
            missing.push("Periodic Review Cycle (Months)");
        }
        if (!Number.isFinite(formData.periodicReviewNotification) || formData.periodicReviewNotification <= 0) {
            missing.push("Periodic Review Notification (Days)");
        }
        return missing;
    }, [
        formData.title,
        formData.type,
        formData.author,
        formData.businessUnit,
        formData.periodicReviewCycle,
        formData.periodicReviewNotification,
    ]);

    const validateOrWarn = () => {
        if (missingRequiredFields.length === 0) return true;

        setValidationModalMessage(
            <div className="space-y-2">
                <p>Please fill in all required fields before submitting:</p>
                <ul className="list-disc pl-5 space-y-1">
                    {missingRequiredFields.map((field) => (
                        <li key={field}>{field}</li>
                    ))}
                </ul>
            </div>
        );
        setIsValidationModalOpen(true);
        return false;
    };

    const handleBack = () => {
        navigate("/documents/all");
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!validateOrWarn()) return;

            // TODO: Integrate with API service
            console.log("Document created:", formData);
            navigate("/documents/all");
        } catch (error) {
            console.error("Error creating document:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitForActive = () => {
        if (!validateOrWarn()) return;
        setIsESignOpen(true);
    };

    const handleESignConfirm = async (reason: string) => {
        setIsSubmitting(true);
        try {
            // TODO: Integrate with API service
            console.log("Document submitted for activation:", { ...formData, eSignatureReason: reason });
            setIsESignOpen(false);
            navigate("/documents/all");
        } catch (error) {
            console.error("Error submitting document:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Status workflow steps
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Effective", "Archive"];
    const currentStepIndex = 0; // Always "Draft" for new documents

    const tabs = [
        { id: "document" as TabType, label: "Document", icon: FileText },
        { id: "general" as TabType, label: "General Information", icon: Info },
        { id: "training" as TabType, label: "Training Information", icon: GraduationCap },
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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            New Document
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="hover:text-slate-700 transition-colors"
                            >
                                Dashboard
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                className="hover:text-slate-700 transition-colors"
                            >
                                Document Control
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={() => navigate("/documents/all")}
                                className="hover:text-slate-700 transition-colors"
                            >
                                All Documents
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">New Document</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleBack}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || isSubmitting}
                            size="sm"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            onClick={handleSubmitForActive}
                            disabled={isSaving || isSubmitting}
                            size="sm"
                            className="flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 text-white"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
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
                                        activeTab === tab.id
                                            ? "text-emerald-600"
                                            : "text-slate-400"
                                    )} />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "general" && (
                        <GeneralTab 
                            formData={formData} 
                            onFormChange={setFormData}
                            hideTemplateCheckbox={true}
                        />
                    )}

                    {activeTab === "training" && (
                        <TrainingTab />
                    )}

                    {activeTab === "document" && (
                        <DocumentTab 
                            uploadedFiles={uploadedFiles}
                            onFilesChange={setUploadedFiles}
                            selectedFile={selectedFile}
                            onSelectFile={setSelectedFile}
                        />
                    )}

                    {activeTab === "signatures" && (
                        <SignaturesTab />
                    )}

                    {activeTab === "audit" && (
                        <AuditTab />
                    )}

                    {activeTab === "workflow" && (
                        <WorkflowTab />
                    )}
                </div>
            </div>

            {/* Modals */}
            <ESignatureModal
                isOpen={isESignOpen}
                onClose={() => {
                    if (isSubmitting) return;
                    setIsESignOpen(false);
                }}
                onConfirm={handleESignConfirm}
                actionTitle="Submit document for activation"
            />

            <AlertModal
                isOpen={isValidationModalOpen}
                onClose={() => setIsValidationModalOpen(false)}
                type="warning"
                title="Missing required information"
                description={validationModalMessage}
                confirmText="OK"
                showCancel={false}
            />
        </div>
    );
};
