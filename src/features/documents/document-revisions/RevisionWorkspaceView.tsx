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
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { AlertModal } from "@/components/ui/modal/AlertModal";

// Import tabs from new-document (reusing the same tabs)
import {
    GeneralTab,
    TrainingTab,
    DocumentTab,
    SignaturesTab,
    AuditTab,
    WorkflowTab,
} from "../new-document/tabs";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
type TabType = "general" | "training" | "document" | "signatures" | "audit" | "workflow";

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
}

export const RevisionWorkspaceView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isESignOpen, setIsESignOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalMessage, setValidationModalMessage] = useState<React.ReactNode>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Initialize workspace documents from Impact Analysis decisions
    const [workspaceDocuments, setWorkspaceDocuments] = useState<WorkspaceDocument[]>([]);

    useEffect(() => {
        if (state?.linkedDocuments && state?.impactDecisions) {
            // Create draft documents for upgraded items
            const upgradedDocs = state.linkedDocuments
                .filter(doc => state.impactDecisions![doc.id])
                .map(doc => ({
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
                    }
                }));
            setWorkspaceDocuments(upgradedDocs);
        }
    }, [state]);

    const currentDocument = workspaceDocuments[currentDocIndex];

    const missingRequiredFields = useMemo(() => {
        if (!currentDocument) return [];
        const missing: string[] = [];
        const formData = currentDocument.formData;
        
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
    }, [currentDocument]);

    const validateOrWarn = () => {
        if (missingRequiredFields.length === 0) return true;

        setValidationModalMessage(
            <div className="space-y-2">
                <p>Please fill in all required fields for <strong>{currentDocument?.name}</strong> before proceeding:</p>
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
        // Navigate back to Impact Analysis with preserved state
        navigate("/documents/revisions/new", {
            state: {
                sourceDocument: state?.sourceDocument,
                impactDecisions: state?.impactDecisions,
                linkedDocuments: state?.linkedDocuments,
                reasonForChange: state?.reasonForChange
            }
        });
    };

    const handleFormChange = (newFormData: typeof currentDocument.formData) => {
        setWorkspaceDocuments(prev => 
            prev.map((doc, idx) => 
                idx === currentDocIndex 
                    ? { ...doc, formData: newFormData }
                    : doc
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
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // TODO: Integrate with API service
            console.log("Revision workspace saved:", {
                sourceDocument: state?.sourceDocument,
                documents: workspaceDocuments,
                reasonForChange: state?.reasonForChange
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
                reasonForChange: state?.reasonForChange
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
        if (currentDocIndex < workspaceDocuments.length - 1) {
            setCurrentDocIndex(prev => prev + 1);
            setActiveTab("general"); // Reset to general tab
        }
    };

    const handlePreviousDocument = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex(prev => prev - 1);
            setActiveTab("general"); // Reset to general tab
        }
    };

    // Status workflow steps
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Effective", "Archive"];
    const currentStepIndex = 0; // Always "Draft" for new revisions

    const tabs = [
        { id: "general" as TabType, label: "General Information", icon: Info },
        { id: "training" as TabType, label: "Training Information", icon: GraduationCap },
        { id: "document" as TabType, label: "Document", icon: FileText },
        { id: "signatures" as TabType, label: "Signatures", icon: FileSignature },
        { id: "audit" as TabType, label: "Audit Trail", icon: History },
        { id: "workflow" as TabType, label: "Workflow Diagram", icon: GitBranch },
    ];

    if (workspaceDocuments.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
                    <h2 className="text-xl font-semibold text-slate-900">No Documents to Process</h2>
                    <p className="text-slate-600">Please go back and complete the Impact Analysis.</p>
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
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={() => navigate("/documents/revisions/all")}
                                className="hover:text-slate-700 transition-colors"
                            >
                                All Revisions
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">Revision Workspace</span>
                        </div>
                        {state?.sourceDocument && (
                            <div className="mt-2 text-sm text-slate-600">
                                <span className="font-medium">Source:</span> {state.sourceDocument.code} - {state.sourceDocument.name}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button                            onClick={handleBackToImpactAnalysis}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Back to Impact Analysis
                        </Button>
                        <Button                            onClick={handleBack}
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
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button
                            onClick={handleSubmitForReview}
                            disabled={isSaving || isSubmitting}
                            size="sm"
                            className="flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 text-white"
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? "Submitting..." : "Submit for Review"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Document Navigator */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Document {currentDocIndex + 1} of {workspaceDocuments.length}
                            </p>
                            <p className="text-xs text-slate-600">
                                {currentDocument?.code} - {currentDocument?.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePreviousDocument}
                            disabled={currentDocIndex === 0}
                            className="px-3"
                        >
                            Previous
                        </Button>
                        <div className="px-3 py-2 bg-white rounded-md border border-slate-200 text-sm font-medium">
                            {currentDocIndex + 1} / {workspaceDocuments.length}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleNextDocument}
                            disabled={currentDocIndex === workspaceDocuments.length - 1}
                            className="px-3"
                        >
                            Next
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
                    {currentDocument && (
                        <>
                            {activeTab === "general" && (
                                <GeneralTab 
                                    formData={currentDocument.formData} 
                                    onFormChange={handleFormChange} 
                                />
                            )}

                            {activeTab === "training" && (
                                <TrainingTab />
                            )}

                            {activeTab === "document" && (
                                <DocumentTab />
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
                        </>
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
                        <p>Are you sure you want to cancel and exit the Revision Workspace?</p>
                        <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                            <p className="text-amber-800">⚠️ <span className="font-semibold">Warning:</span> All unsaved changes will be lost.</p>
                            <p><span className="font-semibold">Documents in Progress:</span> {workspaceDocuments.length} document(s)</p>
                            {state?.reasonForChange && (
                                <p><span className="font-semibold">Draft Reason:</span> {state.reasonForChange.length} characters</p>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">You will be redirected back to the All Revisions screen.</p>
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
                        <p>Are you sure you want to save all documents in the workspace as drafts?</p>
                        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                            {state?.sourceDocument && (
                                <p><span className="font-semibold">Source Document:</span> {state.sourceDocument.code}</p>
                            )}
                            <p><span className="font-semibold">Total Documents:</span> {workspaceDocuments.length}</p>
                            <p><span className="font-semibold">Current Progress:</span> Document {currentDocIndex + 1} of {workspaceDocuments.length}</p>
                        </div>
                        <p className="text-xs text-slate-500">You can continue editing these drafts later from the All Revisions screen.</p>
                    </div>
                }
                confirmText="Save All"
                cancelText="Cancel"
                isLoading={isSaving}
                showCancel={true}
            />
        </div>
    );
};
