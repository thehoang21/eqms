import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    Home,
    Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { AlertModal } from "@/components/ui/modal/AlertModal";

// Import tabs from new-document (reusing the same tabs)
import {
    GeneralTab,
    TrainingTab,
    SignaturesTab,
    AuditTab
} from "../revision-tabs";
import { MultiDocumentUpload } from "./MultiDocumentUpload";
import { DocumentType } from "@/types/documentTypes";
import { IconChevronRight } from "@tabler/icons-react";

// --- Types ---
type DocumentStatus =
    | "Draft"
    | "Pending Review"
    | "Pending Approval"
    | "Approved"
    | "Pending Training"
    | "Ready for Publishing"
    | "Published"
    | "Effective"
    | "Archive";
type TabType =
    | "general"
    | "training"
    | "document"
    | "signatures"
    | "audit"
    | "workflow";

interface WorkspaceDocument {
    id: string;
    code: string;
    name: string;
    type: "Form" | "Annex" | "Template" | "Reference";
    currentVersion: string;
    nextVersion: string;
    isUpgraded: boolean;
    formData: {
        title: string;
        type: DocumentType;
        author: string;
        businessUnit: string;
        department: string;
        knowledgeBase: string;
        subType: string;
        periodicReviewCycle: number;
        periodicReviewNotification: number;
        language: string;
        description: string;
        isTemplate: boolean;
    };
}

interface LocationState {
    sourceDocument?: {
        code: string;
        name: string;
        version: string;
        type?: string;
    };
    impactDecisions?: { [key: string]: boolean };
    linkedDocuments?: Array<{
        id: string;
        code: string;
        name: string;
        type: "Form" | "Annex" | "Template" | "Reference";
        currentVersion: string;
        nextVersion: string;
    }>;
    reasonForChange?: string;
    isStandalone?: boolean; // Flag để phân biệt standalone vs parent-child
}

export const RevisionWorkspaceView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<{
        [documentId: string]: File | null;
    }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isESignOpen, setIsESignOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalMessage, setValidationModalMessage] =
        useState<React.ReactNode>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Initialize workspace documents from Impact Analysis decisions
    const [workspaceDocuments, setWorkspaceDocuments] = useState<
        WorkspaceDocument[]
    >([]);

    useEffect(() => {
        if (state?.sourceDocument) {
            const documents: WorkspaceDocument[] = [];

            // Switch case để xử lý standalone vs parent-child
            switch (state.isStandalone) {
                case true:
                    // CASE 1: Standalone Document (1 tài liệu duy nhất)
                    documents.push({
                        id: `source-${state.sourceDocument.code}`,
                        code: state.sourceDocument.code,
                        name: state.sourceDocument.name,
                        type: "Form", // Default type
                        currentVersion: state.sourceDocument.version,
                        nextVersion: incrementVersion(state.sourceDocument.version),
                        isUpgraded: true,
                        formData: {
                            title: state.sourceDocument.name,
                            type: (state.sourceDocument.type || "SOP") as DocumentType,
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
                        },
                    });
                    break;

                case false:
                default:
                    // CASE 2: Parent-Child Documents (nhiều tài liệu liên kết)
                    // Add Source Document (always included)
                    documents.push({
                        id: `source-${state.sourceDocument.code}`,
                        code: state.sourceDocument.code,
                        name: state.sourceDocument.name,
                        type: "Form", // Default type, can be adjusted
                        currentVersion: state.sourceDocument.version,
                        nextVersion: incrementVersion(state.sourceDocument.version),
                        isUpgraded: true,
                        formData: {
                            title: state.sourceDocument.name,
                            type: (state.sourceDocument.type || "SOP") as DocumentType,
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
                        },
                    });

                    // Add upgraded linked documents (if any)
                    if (state.linkedDocuments && state.impactDecisions) {
                        const upgradedDocs = state.linkedDocuments
                            .filter((doc) => state.impactDecisions![doc.id])
                            .map((doc) => ({
                                id: doc.id,
                                code: doc.code,
                                name: doc.name,
                                type: doc.type,
                                currentVersion: doc.currentVersion,
                                nextVersion: doc.nextVersion,
                                isUpgraded: true,
                                formData: {
                                    title: doc.name,
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
                                },
                            }));
                        documents.push(...upgradedDocs);
                    }
                    break;
            }

            setWorkspaceDocuments(documents);
        }
    }, [state]);

    // Helper function to increment version
    const incrementVersion = (version: string): string => {
        const parts = version.split(".");
        if (parts.length > 0) {
            const lastPart = parseInt(parts[parts.length - 1]);
            parts[parts.length - 1] = String(lastPart + 1);
            return parts.join(".");
        }
        return version;
    };

    const currentDocument = workspaceDocuments[currentDocIndex];

    // Check if all files are uploaded
    const allFilesUploaded = useMemo(() => {
        return workspaceDocuments.every(
            (doc) =>
                uploadedFiles[doc.id] !== null && uploadedFiles[doc.id] !== undefined
        );
    }, [workspaceDocuments, uploadedFiles]);

    // Check if current document has all required fields
    const isCurrentDocumentValid = useMemo(() => {
        if (!currentDocument) return false;
        const formData = currentDocument.formData;

        return !!(
            formData.title.trim() &&
            String(formData.type || "").trim() &&
            formData.author.trim() &&
            formData.businessUnit.trim() &&
            Number.isFinite(formData.periodicReviewCycle) &&
            formData.periodicReviewCycle > 0 &&
            Number.isFinite(formData.periodicReviewNotification) &&
            formData.periodicReviewNotification > 0
        );
    }, [currentDocument]);

    const missingRequiredFields = useMemo(() => {
        if (!currentDocument) return [];
        const missing: string[] = [];
        const formData = currentDocument.formData;

        if (!formData.title.trim()) missing.push("Document Name");
        if (!String(formData.type || "").trim()) missing.push("Document Type");
        if (!formData.author.trim()) missing.push("Author");
        if (!formData.businessUnit.trim()) missing.push("Business Unit");
        if (
            !Number.isFinite(formData.periodicReviewCycle) ||
            formData.periodicReviewCycle <= 0
        ) {
            missing.push("Periodic Review Cycle (Months)");
        }
        if (
            !Number.isFinite(formData.periodicReviewNotification) ||
            formData.periodicReviewNotification <= 0
        ) {
            missing.push("Periodic Review Notification (Days)");
        }
        return missing;
    }, [currentDocument]);

    const validateOrWarn = () => {
        if (missingRequiredFields.length === 0) return true;

        setValidationModalMessage(
            <div className="space-y-2">
                <p>
                    Please fill in all required fields for{" "}
                    <strong>{currentDocument?.name}</strong> before proceeding:
                </p>
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
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        navigate("/documents/revisions/all");
    };

    const handleBackToImpactAnalysis = () => {
        // Navigate back based on document type
        if (state?.isStandalone) {
            // Standalone: Navigate back to StandaloneRevisionView
            navigate(
                `/documents/revisions/standalone?sourceDocId=${state.sourceDocument?.code}`,
                {
                    state: {
                        sourceDocument: state.sourceDocument,
                        reasonForChange: state.reasonForChange,
                    },
                }
            );
        } else {
            // Parent-Child: Navigate back to Impact Analysis
            navigate("/documents/revisions/new", {
                state: {
                    sourceDocument: state?.sourceDocument,
                    impactDecisions: state?.impactDecisions,
                    linkedDocuments: state?.linkedDocuments,
                    reasonForChange: state?.reasonForChange,
                },
            });
        }
    };

    const handleFormChange = (newFormData: typeof currentDocument.formData) => {
        setWorkspaceDocuments((prev) =>
            prev.map((doc, idx) =>
                idx === currentDocIndex ? { ...doc, formData: newFormData } : doc
            )
        );
    };

    const handleSave = () => {
        if (!validateOrWarn()) return;
        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        setIsSaving(true);
        try {
            // Simulate save operation
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // TODO: Integrate with API service
            console.log("Revision workspace saved:", {
                sourceDocument: state?.sourceDocument,
                documents: workspaceDocuments,
                reasonForChange: state?.reasonForChange,
            });

            setIsSaving(false);
            setShowSaveModal(false);
            navigate("/documents/revisions/all");
        } catch (error) {
            console.error("Error saving revision workspace:", error);
            setIsSaving(false);
        }
    };

    const handleSubmitForReview = () => {
        // Validate all documents
        for (let i = 0; i < workspaceDocuments.length; i++) {
            setCurrentDocIndex(i);
            if (!validateOrWarn()) return;
        }
        setIsESignOpen(true);
    };

    const handleESignConfirm = async (reason: string) => {
        setIsSubmitting(true);
        try {
            // TODO: Integrate with API service
            console.log("Revision submitted for review:", {
                sourceDocument: state?.sourceDocument,
                documents: workspaceDocuments,
                eSignatureReason: reason,
                reasonForChange: state?.reasonForChange,
            });
            setIsESignOpen(false);
            navigate("/documents/revisions/all");
        } catch (error) {
            console.error("Error submitting revision:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextDocument = () => {
        // Validate current document before moving to next
        if (!isCurrentDocumentValid) {
            setValidationModalMessage(
                <div className="space-y-2">
                    <p>Please fill in all required fields before proceeding:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {missingRequiredFields.map((field) => (
                            <li key={field}>{field}</li>
                        ))}
                    </ul>
                </div>
            );
            setIsValidationModalOpen(true);
            return;
        }

        if (currentDocIndex < workspaceDocuments.length - 1) {
            setCurrentDocIndex((prev) => prev + 1);
            // Stay on general tab for data entry
        }
    };

    const handlePreviousDocument = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex((prev) => prev - 1);
            // Stay on general tab for data entry
        }
    };

    const handleFilesChange = (files: { [documentId: string]: File | null }) => {
        setUploadedFiles(files);
    };

    // Status workflow steps
    const statusSteps: DocumentStatus[] = [
        "Draft",
        "Pending Review",
        "Pending Approval",
        "Approved",
        "Pending Training",
        "Ready for Publishing",
        "Published",
        "Effective",
        "Archive",
    ];
    const currentStepIndex = 0; // Always "Draft" for new revisions

    const tabs = [
        { id: "document" as TabType, label: "Document", icon: FileText },
        { id: "general" as TabType, label: "General Information", icon: Info },
        { id: "training" as TabType, label: "Training", icon: GraduationCap },
        { id: "signatures" as TabType, label: "Signatures", icon: FileSignature },
        { id: "audit" as TabType, label: "Audit Trail", icon: History },
    ];

    if (workspaceDocuments.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
                    <h2 className="text-xl font-semibold text-slate-900">
                        No Documents to Process
                    </h2>
                    <p className="text-slate-600">
                        Please go back and complete the Impact Analysis.
                    </p>
                    <Button onClick={handleBack}>Back to Revisions</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Header: Title + Breadcrumb + Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Revision Workspace
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                            >
                                Dashboard
                            </button>
                            <Home className="h-4 w-4 sm:hidden" />
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="hidden sm:inline">Document Control</span>
                            <span className="sm:hidden">...</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <button
                                onClick={() => navigate("/documents/revisions/all")}
                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                            >
                                All Revisions
                            </button>
                            <span className="sm:hidden">...</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-slate-700 font-medium">
                                Revision Workspace
                            </span>
                        </div>
                        {/* {state?.sourceDocument && (
                            <div className="mt-2 text-sm text-slate-600">
                                <span className="font-medium">Source:</span> {state.sourceDocument.code} - {state.sourceDocument.name}
                                {state.isStandalone && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        Standalone
                                    </span>
                                )}
                                {!state.isStandalone && workspaceDocuments.length > 1 && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                        {workspaceDocuments.length} Documents
                                    </span>
                                )}
                            </div>
                        )} */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleBackToImpactAnalysis}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Back
                        </Button>
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
                            disabled={isSaving || isSubmitting || !allFilesUploaded}
                            size="sm"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button
                            onClick={handleSubmitForReview}
                            disabled={isSaving || isSubmitting || !allFilesUploaded}
                            size="sm"
                            className="flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 text-white disabled:!bg-slate-300"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Status Stepper */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    <div className="flex items-stretch min-w-full">
                        {statusSteps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isFirst = index === 0;
                            const isLast = index === statusSteps.length - 1;

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

                {/* Modals */}
                <ESignatureModal
                    isOpen={isESignOpen}
                    onClose={() => {
                        if (isSubmitting) return;
                        setIsESignOpen(false);
                    }}
                    onConfirm={handleESignConfirm}
                    actionTitle="Submit revisions for review"
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

                {/* Cancel Confirmation Modal */}
                <AlertModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleConfirmCancel}
                    type="warning"
                    title="Cancel Revision Workspace?"
                    description={
                        <div className="space-y-3">
                            <p>
                                Are you sure you want to cancel and exit the Revision Workspace?
                            </p>
                            <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                                <p className="text-amber-800">
                                    ⚠️ <span className="font-semibold">Warning:</span> All unsaved
                                    changes will be lost.
                                </p>
                                <p>
                                    <span className="font-semibold">Documents in Progress:</span>{" "}
                                    {workspaceDocuments.length} document(s)
                                </p>
                                {state?.reasonForChange && (
                                    <p>
                                        <span className="font-semibold">Draft Reason:</span>{" "}
                                        {state.reasonForChange.length} characters
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">
                                You will be redirected back to the All Revisions screen.
                            </p>
                        </div>
                    }
                    confirmText="Yes, Cancel"
                    cancelText="No, Stay"
                    showCancel={true}
                />

                {/* Save Draft Confirmation Modal */}
                <AlertModal
                    isOpen={showSaveModal}
                    onClose={() => setShowSaveModal(false)}
                    onConfirm={handleConfirmSave}
                    type="confirm"
                    title="Save All Documents?"
                    description={
                        <div className="space-y-3">
                            <p>
                                Are you sure you want to save all documents in the workspace as
                                drafts?
                            </p>
                            <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                                {state?.sourceDocument && (
                                    <p>
                                        <span className="font-semibold">Source Document:</span>{" "}
                                        {state.sourceDocument.code}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Total Documents:</span>{" "}
                                    {workspaceDocuments.length}
                                </p>
                                <p>
                                    <span className="font-semibold">Current Progress:</span>{" "}
                                    Document {currentDocIndex + 1} of {workspaceDocuments.length}
                                </p>
                            </div>
                            <p className="text-xs text-slate-500">
                                You can continue editing these drafts later from the All
                                Revisions screen.
                            </p>
                        </div>
                    }
                    confirmText="Save All"
                    cancelText="Cancel"
                    isLoading={isSaving}
                    showCancel={true}
                />
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
                                    <Icon
                                        className={cn(
                                            "h-4 w-4 shrink-0",
                                            activeTab === tab.id
                                                ? "text-emerald-600"
                                                : "text-slate-400"
                                        )}
                                    />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "document" && (
                        <MultiDocumentUpload
                            documents={workspaceDocuments.map((doc) => ({
                                id: doc.id,
                                code: doc.code,
                                name: doc.name,
                                type: doc.type,
                                nextVersion: doc.nextVersion,
                            }))}
                            uploadedFiles={uploadedFiles}
                            onFilesChange={handleFilesChange}
                        />
                    )}

                    {activeTab === "general" && currentDocument && (
                        <div className="space-y-6">
                            {/* Current Document Context */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            Editing: {currentDocument.code}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-2">
                                            {currentDocument.name}
                                        </p>
                                        {uploadedFiles[currentDocument.id] && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                                <span className="text-blue-700 font-medium">
                                                    File: {uploadedFiles[currentDocument.id]?.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-600">Document</div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {currentDocIndex + 1} / {workspaceDocuments.length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <GeneralTab
                                formData={currentDocument.formData}
                                onFormChange={handleFormChange}
                                hideTemplateCheckbox={true}
                            />

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <Button
                                    onClick={handlePreviousDocument}
                                    disabled={currentDocIndex === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Previous Document
                                </Button>

                                <div className="flex items-center gap-2">
                                    {missingRequiredFields.length > 0 && (
                                        <div className="text-xs text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {missingRequiredFields.length} required field(s) missing
                                        </div>
                                    )}
                                </div>

                                {currentDocIndex < workspaceDocuments.length - 1 ? (
                                    <Button
                                        onClick={handleNextDocument}
                                        variant="default"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        Next Document
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setActiveTab("training")}
                                        variant="default"
                                        size="sm"
                                        disabled={!isCurrentDocumentValid}
                                        className="flex items-center gap-2"
                                    >
                                        Complete & Continue
                                        <IconChevronRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "training" && <TrainingTab />}

                    {activeTab === "signatures" && <SignaturesTab />}

                    {activeTab === "audit" && <AuditTab />}
                </div>
            </div>
        </div>
    );
};
