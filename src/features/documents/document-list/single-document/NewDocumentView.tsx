import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { TrainingTab, SignaturesTab, AuditTab } from "@/features/documents/shared/tabs";
import {
    DocumentRevisionsTab,
    ReviewersTab,
    ApproversTab,
    ControlledCopiesTab,
    RelatedDocumentsTab,
    CorrelatedDocumentsTab,
    DocumentRelationships,
    type ParentDocument,
    type RelatedDocument,
    type Revision,
} from "@/features/documents/shared/tabs/GeneralTab/subtabs";
import {
    GeneralTab,
    DocumentTab,
    type UploadedFile,
} from "@/features/documents/document-list/new-document/new-tabs";
import { DocumentType } from "@/types/documentTypes";
import { IconSmartHome } from "@tabler/icons-react";

// --- Types ---
type DocumentStatus = "Draft" | "Active" | "Obsoleted" | "Closed - Cancelled";
type TabType = "general" | "training" | "document" | "signatures" | "audit";
type SubTabId = "revisions" | "reviewers" | "approvers" | "copies" | "related" | "correlated";
type ReviewFlowType = "sequential" | "parallel";

interface Reviewer {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    order: number;
}

interface Approver {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
}

export const NewDocumentView: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [isSaving, setIsSaving] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalMessage, setValidationModalMessage] = useState<React.ReactNode>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isObsoleteModalOpen, setIsObsoleteModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // Track if document has been saved
    const [documentStatus, setDocumentStatus] = useState<DocumentStatus>("Draft"); // Track current document status

    // Subtab states
    const [activeSubtab, setActiveSubtab] = useState<SubTabId>("revisions");
    const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
    const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);
    const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
    const [isCorrelatedModalOpen, setIsCorrelatedModalOpen] = useState(false);
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [reviewFlowType, setReviewFlowType] = useState<ReviewFlowType>("parallel");
    // Initial mock data for testing
    const [relationshipDocs, setRelationshipDocs] = useState<RelatedDocument[]>([
        {
            id: "1",
            documentNumber: "DOC-2024-002",
            created: "2024-01-10",
            openedBy: "John Doe",
            documentName: "Quality Control Procedures",
            state: "effective",
            documentType: "SOP",
            department: "Quality Assurance",
            authorCoAuthor: "John Doe, Jane Smith",
            effectiveDate: "2024-02-01",
            validUntil: "2025-02-01"
        },
        {
            id: "2",
            documentNumber: "DOC-2024-003",
            created: "2024-01-15",
            openedBy: "Jane Smith",
            documentName: "Manufacturing Guidelines",
            state: "approved",
            documentType: "WI",
            department: "Production",
            authorCoAuthor: "Jane Smith",
            effectiveDate: "2024-03-01",
            validUntil: "2025-03-01"
        }
    ]);

    // Auto-generated fields
    const [documentNumber, setDocumentNumber] = useState<string>("");
    const [createdDateTime, setCreatedDateTime] = useState<string>("");
    const [openedBy, setOpenedBy] = useState<string>("");

    // Reviewers and Approvers state
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [approvers, setApprovers] = useState<Approver[]>([]);

    // File state
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Document Relationships state
    // Initial mock data for testing
    const [parentDocument, setParentDocument] = useState<ParentDocument | null>({
        id: "1",
        documentNumber: "DOC-2024-005",
        created: "2024-01-05",
        openedBy: "Alice Brown",
        documentName: "Equipment Maintenance Schedule",
        state: "effective",
        documentType: "Schedule",
        department: "Maintenance",
        authorCoAuthor: "Alice Brown",
        effectiveDate: "2024-01-15",
        validUntil: "2025-01-15"
    });
    const [suggestedDocumentCode, setSuggestedDocumentCode] = useState<string>("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        type: "" as DocumentType,
        author: "",
        coAuthors: [] as (string | number)[],
        businessUnit: "",
        department: "",
        knowledgeBase: "",
        subType: "",
        periodicReviewCycle: 0,
        periodicReviewNotification: 0,
        language: "English",
        reviewDate: "",
        description: "",
        isTemplate: false,
    });

    // Auto-transition to Active when all conditions are met:
    // 1. Document has been saved (isSaved = true)
    // 2. All required fields are filled (missingRequiredFields.length === 0)
    // 3. At least one file is uploaded
    // 4. At least one reviewer is added
    // 5. At least one approver is added
    // Calculate current step index based on document status
    const currentStepIndex = useMemo(() => {
        const statusSteps: DocumentStatus[] = ["Draft", "Active", "Obsoleted", "Closed - Cancelled"];
        return statusSteps.indexOf(documentStatus);
    }, [documentStatus]);

    const missingRequiredFields = useMemo(() => {
        const missing: string[] = [];
        if (!formData.title.trim()) missing.push("Document Name");
        if (!String(formData.type || "").trim()) missing.push("Document Type");
        if (!formData.author || formData.author.length === 0) missing.push("Authors");
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
            // Simulate API call with 3 second loading
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            if (!isSaved) {
                // First save (Next Step): Generate auto fields
                const now = new Date();
                const docNum = `DOC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
                const created = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                
                setDocumentNumber(docNum);
                setCreatedDateTime(created);
                setOpenedBy("Current User"); // TODO: Replace with actual logged-in user
                setIsSaved(true);
                
                console.log("Document created:", {
                    documentNumber: docNum,
                    created,
                    openedBy: "Current User",
                    ...formData
                });
            } else {
                // Second save: transition to Active (only possible when reviewers and approvers are selected)
                setDocumentStatus("Active");
                console.log("Document saved:", formData);
            }
            
            setIsSaving(false);
            setShowSaveModal(false);
        } catch (error) {
            console.error("Error saving document:", error);
            setIsSaving(false);
        }
    };

    const handleObsolete = (reason: string) => {
        // TODO: Integrate with API - save obsolete reason
        console.log("Document obsoleted with reason:", reason);
        setDocumentStatus("Obsoleted");
    };

    const handleBackToList = () => {
        navigate("/documents/all");
    };

    // Status workflow steps - simplified for new document creation
    const statusSteps: DocumentStatus[] = ["Draft", "Active", "Obsoleted", "Closed - Cancelled"];
    // currentStepIndex is now calculated in useMemo above based on documentStatus

    const tabs = [
        { id: "general" as TabType, label: "General Information" },
        { id: "document" as TabType, label: "Document" },
        { id: "training" as TabType, label: "Training" },
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
                            New Document
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
                            <IconSmartHome className="h-4 w-4" />
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
                            <span className="text-slate-700 font-medium">New Document</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={documentStatus === "Obsoleted"}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveDraft}
                            disabled={
                                documentStatus === "Obsoleted" ||
                                isSaving ||
                                missingRequiredFields.length > 0 ||
                                (isSaved && (reviewers.length === 0 || approvers.length === 0))
                            }
                            size="sm"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300"
                        >
                            {isSaving ? (isSaved ? "Saving..." : "Processing...") : (isSaved ? "Save" : "Next Step")}
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
                            
                            // Special case: When status is "Obsoleted", show "Closed - Cancelled" as skipped (striped)
                            const isObsoletedStatus = documentStatus === "Obsoleted";
                            const isClosedCancelledStep = step === "Closed - Cancelled";
                            const isSkipped = isObsoletedStatus && isClosedCancelledStep;
                            
                            // For Obsoleted status: Draft and Active are considered completed
                            const showAsCompleted = isObsoletedStatus && (step === "Draft" || step === "Active");

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
                                        isSkipped
                                            ? "" // Will use striped pattern
                                            : isCompleted || showAsCompleted
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
                                                : 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)',
                                        ...(isSkipped ? {
                                            background: 'repeating-linear-gradient(135deg, #e2e8f0, #e2e8f0 8px, #f1f5f9 8px, #f1f5f9 16px)'
                                        } : {})
                                    }}
                                />

                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-2 px-6">
                                    {(isCompleted || showAsCompleted) && !isSkipped && (
                                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                                    )}
                                    <span
                                        className={cn(
                                            "text-xs md:text-sm font-medium text-center",
                                            isSkipped
                                                ? "text-slate-400"
                                                : isCurrent
                                                    ? "text-white"
                                                    : (isCompleted || showAsCompleted)
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
                                        "flex items-center justify-center gap-2 px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "border-emerald-600 text-emerald-700"
                                            : "border-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                                    )}
                                >
                                    {tab.label}
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
                            suggestedDocumentCode={suggestedDocumentCode}
                            documentNumber={documentNumber}
                            createdDateTime={createdDateTime}
                            openedBy={openedBy}
                            isObsoleted={documentStatus === "Obsoleted"}
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
                            isObsoleted={documentStatus === "Obsoleted"}
                            parentDocument={parentDocument}
                            onParentDocumentChange={setParentDocument}
                            relatedDocuments={relationshipDocs}
                            onRelatedDocumentsChange={setRelationshipDocs}
                            documentType={formData.type}
                            onSuggestedCodeChange={setSuggestedDocumentCode}
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

            {/* Action Buttons - Outside tabs */}
            <div className="">
                <div className="bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Back to List button - shown when obsoleted */}
                        {documentStatus === "Obsoleted" && (
                            <Button
                                onClick={handleBackToList}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                Back to List
                            </Button>
                        )}

                        {/* Cancel button - hidden when obsoleted */}
                        {documentStatus !== "Obsoleted" && (
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                Cancel
                            </Button>
                        )}

                        {/* Save/Next Step button - always shown but disabled when obsoleted */}
                        <Button
                            onClick={handleSaveDraft}
                            disabled={
                                documentStatus === "Obsoleted" ||
                                missingRequiredFields.length > 0 ||
                                (isSaved && (reviewers.length === 0 || approvers.length === 0)) ||
                                isSaving
                            }
                            size="sm"
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300"
                        >
                            {isSaving
                                ? isSaved
                                    ? "Saving..."
                                    : "Processing..."
                                : isSaved
                                    ? "Save"
                                    : "Next Step"}
                        </Button>

                        {/* Obsolete button - hidden when obsoleted, only show after saved */}
                        {documentStatus !== "Obsoleted" && isSaved && (
                            <Button
                                onClick={() => setIsObsoleteModalOpen(true)}
                                size="sm"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Obsolete
                            </Button>
                        )}

                        {/* Divider - only show when saved and not obsoleted */}
                        {isSaved && documentStatus !== "Obsoleted" && (
                            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />
                        )}

                        {/* Other action buttons - only show after saved and not obsoleted */}
                        {isSaved && documentStatus !== "Obsoleted" && (
                            <>
                                <Button
                                    onClick={() => {
                                        setActiveSubtab("reviewers");
                                        setIsReviewerModalOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="whitespace-nowrap px-6 !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                                >
                                    Reviewers
                                </Button>
                                <Button
                                    onClick={() => {
                                        setActiveSubtab("approvers");
                                        setIsApproverModalOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="whitespace-nowrap px-6 !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                                >
                                    Approvers
                                </Button>
                                <Button
                                    onClick={() => {
                                        setActiveSubtab("related");
                                        setIsRelatedModalOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="whitespace-nowrap px-6 !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                                >
                                    Select Related Documents
                                    {relationshipDocs.length > 0 && (
                                        <span className="ml-2 text-xs opacity-70">
                                            ({relationshipDocs.length})
                                        </span>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setActiveSubtab("correlated");
                                        setIsCorrelatedModalOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="whitespace-nowrap px-6 !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                                >
                                    Select Correlated Documents
                                    {parentDocument && (
                                        <span className="ml-2 text-xs opacity-70">(1)</span>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtabs Card - Only show after saved */}
            {isSaved && (
                <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    {/* Subtab Navigation */}
                    <div className="border-b border-slate-200 bg-white">
                        <div className="flex overflow-x-auto">
                            {[
                                { id: "revisions" as SubTabId, label: "Document Revisions" },
                                { id: "reviewers" as SubTabId, label: "Reviewers" },
                                { id: "approvers" as SubTabId, label: "Approvers" },
                                { id: "copies" as SubTabId, label: "Controlled Copies" },
                                { id: "related" as SubTabId, label: "Related Documents" },
                                { id: "correlated" as SubTabId, label: "Correlated Documents" },
                            ].map((subtab) => (
                                <button
                                    key={subtab.id}
                                    onClick={() => setActiveSubtab(subtab.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                                        activeSubtab === subtab.id
                                            ? "border-emerald-600 text-emerald-600"
                                            : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200"
                                    )}
                                >
                                    {subtab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subtab Content */}
                    <div className="p-4 md:p-6">
                        {activeSubtab === "revisions" && <DocumentRevisionsTab />}
                        {activeSubtab === "reviewers" && (
                            <ReviewersTab
                                reviewers={reviewers}
                                onReviewersChange={setReviewers}
                                reviewFlowType={reviewFlowType}
                                onReviewFlowTypeChange={setReviewFlowType}
                                isModalOpen={isReviewerModalOpen}
                                onModalClose={() => setIsReviewerModalOpen(false)}
                            />
                        )}
                        {activeSubtab === "approvers" && (
                            <ApproversTab
                                approvers={approvers}
                                onApproversChange={setApprovers}
                                isModalOpen={isApproverModalOpen}
                                onModalClose={() => setIsApproverModalOpen(false)}
                            />
                        )}
                        {activeSubtab === "copies" && <ControlledCopiesTab />}
                        {activeSubtab === "related" && (
                            <RelatedDocumentsTab
                                relatedDocuments={relationshipDocs}
                                onRelatedDocumentsChange={setRelationshipDocs}
                            />
                        )}
                        {activeSubtab === "correlated" && (
                            <CorrelatedDocumentsTab
                                parentDocument={parentDocument}
                                onParentDocumentChange={setParentDocument}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <DocumentRelationships
                parentDocument={parentDocument}
                onParentDocumentChange={setParentDocument}
                relatedDocuments={relationshipDocs}
                onRelatedDocumentsChange={setRelationshipDocs}
                documentType={formData.type}
                isRelatedModalOpen={isRelatedModalOpen}
                onRelatedModalClose={() => setIsRelatedModalOpen(false)}
                isCorrelatedModalOpen={isCorrelatedModalOpen}
                onCorrelatedModalClose={() => setIsCorrelatedModalOpen(false)}
            />

            <ESignatureModal
                isOpen={isObsoleteModalOpen}
                onClose={() => setIsObsoleteModalOpen(false)}
                onConfirm={(reason) => {
                    setIsObsoleteModalOpen(false);
                    handleObsolete(reason);
                }}
                actionTitle="Obsolete Document"
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
                title={isSaved ? "Save Document?" : "Proceed to Next Step?"}
                description={
                    <div className="space-y-3">
                        <p>{isSaved ? "Are you sure you want to save this document?" : "This will create the document and generate Document Number. You can then add Reviewers and Approvers."}</p>
                    </div>
                }
                confirmText={isSaved ? "Save" : "Next Step"}
                cancelText="Cancel"
                isLoading={isSaving}
                showCancel={true}
            />
        </div>
    );
};
