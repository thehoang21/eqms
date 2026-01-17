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
  Check,
  Send,
  CheckCircle2,
  AlertCircle,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import {
  GeneralTab,
  TrainingTab,
  SignaturesTab,
  AuditTab,
} from "@/features/documents/all-document/new-document/new-tabs";
import { BatchDocumentUpload } from "./components/BatchDocumentUpload";
import { DocumentTreeView } from "./components/DocumentTreeView";
import { IconChevronRight, IconStar } from "@tabler/icons-react";
import { DocumentType } from "@/types/documentTypes";

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
  | "audit";
type ChildDocumentType = "Form" | "Annex" | "Attachment";

interface BatchDocument {
  id: string;
  fileName: string;
  file: File;
  childType?: ChildDocumentType;
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

export const BatchDocumentView: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("document");
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [documents, setDocuments] = useState<BatchDocument[]>([]);
  const [globalParentId, setGlobalParentId] = useState<string>(""); // External parent (Effective docs)
  const [batchParentId, setBatchParentId] = useState<string>(""); // Batch parent document ID
  const [globalParentData, setGlobalParentData] = useState<any>(null); // Store parent metadata
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isESignOpen, setIsESignOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationModalMessage, setValidationModalMessage] =
    useState<React.ReactNode>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const currentDocument = documents[currentDocIndex];

  // Check if all documents have valid data
  const allDocumentsValid = useMemo(() => {
    return documents.every((doc) => {
      const formData = doc.formData;
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
    });
  }, [documents]);

  // Check if current document is valid
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

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    navigate("/documents/all");
  };

  const handleFormChange = (newFormData: typeof currentDocument.formData) => {
    setDocuments((prev) =>
      prev.map((doc, idx) =>
        idx === currentDocIndex ? { ...doc, formData: newFormData } : doc
      )
    );
  };

  const handleSaveDraft = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Batch documents saved as draft:", documents);

      setIsSaving(false);
      setShowSaveModal(false);
      navigate("/documents/all");
    } catch (error) {
      console.error("Error saving batch documents:", error);
      setIsSaving(false);
    }
  };

  const handleSubmitForActive = () => {
    if (!allDocumentsValid) {
      const invalidDocs = documents.filter((doc) => {
        const formData = doc.formData;
        return !(
          formData.title.trim() &&
          String(formData.type || "").trim() &&
          formData.author.trim() &&
          formData.businessUnit.trim() &&
          Number.isFinite(formData.periodicReviewCycle) &&
          formData.periodicReviewCycle > 0 &&
          Number.isFinite(formData.periodicReviewNotification) &&
          formData.periodicReviewNotification > 0
        );
      });

      setValidationModalMessage(
        <div className="space-y-2">
          <p>Please complete all required fields for all documents before submitting:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {invalidDocs.map((doc) => (
              <li key={doc.id}>{doc.formData.title || doc.fileName}</li>
            ))}
          </ul>
        </div>
      );
      setIsValidationModalOpen(true);
      return;
    }
    setIsESignOpen(true);
  };

  const handleESignConfirm = async (reason: string) => {
    setIsSubmitting(true);
    try {
      console.log("Batch documents submitted for review:", {
        documents,
        eSignatureReason: reason,
      });
      setIsESignOpen(false);
      navigate("/documents/all");
    } catch (error) {
      console.error("Error submitting batch documents:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextDocument = () => {
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

    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex((prev) => prev + 1);
    }
  };

  const handlePreviousDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex((prev) => prev - 1);
    }
  };

  const handleDocumentsChange = (docs: BatchDocument[]) => {
    setDocuments(docs);
  };

  const handleGlobalParentChange = (parentId: string, parentData?: any) => {
    setGlobalParentId(parentId);
    setGlobalParentData(parentData);

    // Clear batch parent when global parent is selected
    if (parentId) {
      setBatchParentId("");
    }
  };

  const handleBatchParentChange = (docId: string) => {
    setBatchParentId(docId);

    // Clear global parent when batch parent is selected
    if (docId) {
      setGlobalParentId("");
      setGlobalParentData(null);
    }
  };

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
  const currentStepIndex = 0;

  const tabs = [
    { id: "document" as TabType, label: "Upload Documents", icon: FileText },
    { id: "general" as TabType, label: "General Information", icon: Info },
    { id: "training" as TabType, label: "Training", icon: GraduationCap },
    { id: "signatures" as TabType, label: "Signatures", icon: FileSignature },
    { id: "audit" as TabType, label: "Audit Trail", icon: History },
  ];

  if (documents.length === 0 && activeTab !== "document") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900">
            No Documents Uploaded
          </h2>
          <p className="text-slate-600">Please upload documents first.</p>
          <Button onClick={() => setActiveTab("document")}>Go to Upload</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Batch Document Creation
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs md:text-sm">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-slate-700 transition-colors hidden sm:inline"
              >
                Dashboard
              </button>
              <Home className="h-3.5 w-3.5 md:h-4 md:w-4 sm:hidden" />
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
              <span className="text-slate-700 font-medium">
                Batch Document Creation
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 md:gap-2 touch-manipulation"
            >
              <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Cancel</span>
            </Button>
            <Button
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitting || documents.length === 0}
              size="sm"
              className="flex items-center gap-1.5 md:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 touch-manipulation"
            >
              <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">
                {isSaving ? "Saving..." : "Save Draft"}
              </span>
            </Button>
            <Button
              onClick={handleSubmitForActive}
              disabled={
                isSaving ||
                isSubmitting ||
                documents.length === 0 ||
                !allDocumentsValid
              }
              size="sm"
              className="flex items-center gap-1.5 md:gap-2 !bg-blue-600 hover:!bg-blue-700 text-white disabled:!bg-slate-300 touch-manipulation"
            >
              <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">
                {isSubmitting ? "Submitting..." : "Submit"}
              </span>
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
            <BatchDocumentUpload
              documents={documents}
              onDocumentsChange={handleDocumentsChange}
              globalParentId={globalParentId}
              batchParentId={batchParentId}
              onGlobalParentChange={handleGlobalParentChange}
              onBatchParentChange={handleBatchParentChange}
            />
          )}

          {activeTab === "general" && currentDocument && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Tree View Sidebar */}
              <div className="lg:col-span-3 xl:col-span-3 mb-6 lg:mb-0">
                <div className="lg:sticky lg:top-6">
                  <DocumentTreeView
                    documents={documents}
                    currentDocumentIndex={currentDocIndex}
                    onDocumentSelect={(index) => setCurrentDocIndex(index)}
                    batchParentId={batchParentId}
                    globalParentId={globalParentId}
                    globalParentData={globalParentData}
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 xl:col-span-9 space-y-4 md:space-y-6">
                {/* Global Parent Info - Show when external parent is selected */}
                {globalParentId && globalParentData && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-lg md:rounded-xl p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
                          🏢 External Parent Document
                        </h4>
                        <p className="text-xs md:text-sm text-slate-700 font-medium">
                          {globalParentData.documentId} -{" "}
                          {globalParentData.documentName}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Version {globalParentData.version} •{" "}
                          {globalParentData.type} • Status:{" "}
                          {globalParentData.status}
                        </p>
                        <div className="mt-2 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg inline-block">
                          <p className="text-xs text-emerald-700">
                            ✓ Metadata inherited from parent document
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Parent Info - Show when batch parent is selected */}
                {batchParentId &&
                  documents.find((d) => d.id === batchParentId) && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg md:rounded-xl p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <IconStar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
                            ⭐ Batch Parent Document
                          </h4>
                          <p className="text-xs md:text-sm text-slate-700 font-medium">
                            {
                              documents.find((d) => d.id === batchParentId)
                                ?.fileName
                            }
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Parent of{" "}
                            {
                              documents.filter((d) => d.id !== batchParentId)
                                .length
                            }{" "}
                            document(s) in this batch
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Current Document Context */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base lg:text-lg font-semibold text-slate-900 mb-1.5 md:mb-2">
                        {currentDocument.id === batchParentId
                          ? "⭐ Batch Parent Document"
                          : batchParentId || globalParentId
                          ? `${
                              currentDocument.childType === "Form"
                                ? "📝"
                                : currentDocument.childType === "Annex"
                                ? "📎"
                                : "📄"
                            } ${currentDocument.childType || "Child Document"}`
                          : "📄 Document"}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 mb-1 md:mb-2 truncate">
                        File: {currentDocument.fileName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-600">Document</div>
                      <div className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
                        {currentDocIndex + 1} / {documents.length}
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
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200">
                  <Button
                    onClick={handlePreviousDocument}
                    disabled={currentDocIndex === 0}
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center gap-2 w-full md:w-auto touch-manipulation"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    <span className="text-sm">Previous Document</span>
                  </Button>

                  <div className="flex items-center justify-center gap-2 order-first md:order-none">
                    {missingRequiredFields.length > 0 && (
                      <div className="text-xs md:text-sm text-amber-600 flex items-center gap-1.5 px-3 py-2 bg-amber-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">
                          {missingRequiredFields.length} required field(s)
                          missing
                        </span>
                        <span className="sm:hidden">
                          {missingRequiredFields.length} missing
                        </span>
                      </div>
                    )}
                  </div>

                  {currentDocIndex < documents.length - 1 ? (
                    <Button
                      onClick={handleNextDocument}
                      variant="default"
                      size="sm"
                      className="flex items-center justify-center gap-2 w-full md:w-auto touch-manipulation"
                    >
                      <span className="text-sm">Next Document</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setActiveTab("training")}
                      variant="default"
                      size="sm"
                      disabled={!isCurrentDocumentValid}
                      className="flex items-center justify-center gap-2 w-full md:w-auto touch-manipulation"
                    >
                      <span className="text-sm">Complete & Continue</span>
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "training" && <TrainingTab />}
          {activeTab === "signatures" && <SignaturesTab />}
          {activeTab === "audit" && <AuditTab />}
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
        actionTitle="Submit batch documents for review"
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
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        type="warning"
        title="Cancel Creation?"
        description={
          <div className="space-y-3">
            <p>Are you sure you want to cancel batch document creation?</p>
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
              <p className="text-amber-800">
                ⚠️ <span className="font-semibold">Warning:</span> All unsaved
                changes will be lost.
              </p>
              <p>
                <span className="font-semibold">Documents:</span>{" "}
                {documents.length} document(s)
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
        title="Save Documents as Draft?"
        description={
          <div className="space-y-3">
            <p>Are you sure you want to save all documents as drafts?</p>
            <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <p>
                <span className="font-semibold">Total Documents:</span>{" "}
                {documents.length}
              </p>
              <p>
                <span className="font-semibold">Parent Document:</span>{" "}
                {batchParentId
                  ? documents.find((d) => d.id === batchParentId)?.fileName ||
                    "None"
                  : globalParentId && globalParentData
                  ? globalParentData.documentId
                  : "None"}
              </p>
              <p>
                <span className="font-semibold">Child Documents:</span>{" "}
                {batchParentId
                  ? documents.filter((d) => d.id !== batchParentId).length
                  : globalParentId
                  ? documents.length
                  : 0}
              </p>
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
