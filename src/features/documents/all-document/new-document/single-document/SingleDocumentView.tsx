import React, { useState, useMemo, useEffect } from "react";
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
    type UploadedFile,
} from "@/features/documents/all-document/new-document/new-tabs";
import { DocumentType } from "@/types/documentTypes";

// --- Types ---
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";
type TabType = "general" | "training" | "document" | "signatures" | "audit" | "workflow";

export const SingleDocumentView: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isESignOpen, setIsESignOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalMessage, setValidationModalMessage] = useState<React.ReactNode>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // File state
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        type: "Standard Operating Procedure" as DocumentType,
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

    // Auto-populate Document Name from uploaded file
    useEffect(() => {
        if (uploadedFiles.length > 0 && !formData.title.trim()) {
            const firstFile = uploadedFiles[0];
            // Extract filename without extension
            const fileNameWithoutExt = firstFile.file.name.replace(/\.[^/.]+$/, "");
            setFormData((prev) => ({
                ...prev,
                title: fileNameWithoutExt,
            }));
        }
    }, [uploadedFiles]);

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

    const handleCancel = () => {
        setIsCancelModalOpen(true);
    };

    const handleCancelConfirm = () => {
        setIsCancelModalOpen(false);
        navigate("/documents/all");
    };

    const handleSaveDraft = () => {
        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: Integrate with API service
            console.log("Document saved as draft:", formData);
            
            setIsSaving(false);
            setShowSaveModal(false);
            navigate("/documents/all");
        } catch (error) {
            console.error("Error saving document:", error);
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
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Pending Training", "Ready for Publishing", "Published", "Effective", "Archive"];
    const currentStepIndex = 0; // Always "Draft" for new documents

    const tabs = [
        { id: "document" as TabType, label: "Document", icon: FileText },
        { id: "general" as TabType, label: "General Information", icon: Info },
        { id: "training" as TabType, label: "Training", icon: GraduationCap },
        { id: "signatures" as TabType, label: "Signatures", icon: FileSignature },
        { id: "audit" as TabType, label: "Audit Trail", icon: History },
    ];

    return (
        <div className="space-y-6 w-full">
            {/* Header: Title + Breadcrumb + Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Single Document Creation
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="hover:text-slate-700 transition-colors"
                            >
                                Dashboard
                            </button>
                            <span className="text-slate-400 mx-1">/</span>
                            <button className="hover:text-slate-700 transition-colors">
                                <span className="hidden md:inline">Document Control</span>
                                <span className="md:hidden">...</span>
                            </button>
                            <span className="text-slate-400 mx-1">/</span>
                            <button
                                onClick={() => navigate("/documents/all")}
                                className="hover:text-slate-700 transition-colors"
                            >
                                <span className="hidden md:inline">All Documents</span>
                                <span className="md:hidden">...</span>
                            </button>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-slate-700 font-medium">Single Document Creation</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveDraft}
                            disabled={isSaving || isSubmitting || uploadedFiles.length === 0}
                            size="sm"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button
                            onClick={handleSubmitForActive}
                            disabled={isSaving || isSubmitting || uploadedFiles.length === 0 || missingRequiredFields.length > 0}
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
                            maxFiles={1}
                        />
                    )}

                    {activeTab === "signatures" && (
                        <SignaturesTab />
                    )}

                    {activeTab === "audit" && (
                        <AuditTab />
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

            <AlertModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelConfirm}
                type="warning"
                title="Cancel Creation?"
                description={
                    <div className="space-y-3">
                        <p>Are you sure you want to cancel document creation?</p>
                        <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-amber-800">
                                ⚠️ <span className="font-semibold">Warning:</span> All unsaved changes will be lost.
                            </p>
                        </div>
                    </div>
                }
                confirmText="Yes, Cancel"
                cancelText="No, Stay"
                showCancel={true}
            />

            <AlertModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={handleConfirmSave}
                type="confirm"
                title="Save Document as Draft?"
                description={
                    <div className="space-y-3">
                        <p>Are you sure you want to save this document as a draft?</p>
                        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                            <p><span className="font-semibold">Document Name:</span> {formData.title || "(Not set)"}</p>
                            <p><span className="font-semibold">Type:</span> {formData.type}</p>
                            <p><span className="font-semibold">Author:</span> {formData.author || "(Not set)"}</p>
                        </div>
                    </div>
                }
                confirmText="Save Draft"
                cancelText="Cancel"
                isLoading={isSaving}
                showCancel={true}
            />
        </div>
    );
};
