import React, { useState } from "react";
import {
  Calendar,
  FileText,
  UserPlus,
  UserCheck,
  BookOpen,
  Copy,
  LinkIcon,
  Plus,
} from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { MultiSelect } from "@/components/ui/select/MultiSelect";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Button } from "@/components/ui/button/Button";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { cn } from "@/components/ui/utils";
import {
  DocumentRevisionsTab,
  ReviewersTab,
  ApproversTab,
  ControlledCopiesTab,
  RelatedDocumentsTab,
  CorrelatedDocumentsTab,
} from "./subtabs";
import type { Revision } from "./subtabs/types";
import { DocumentType, DOCUMENT_TYPES } from "@/types/documentTypes";
import {
  DocumentRelationships,
  ParentDocument,
  RelatedDocument as RelationshipDocument,
} from "./subtabs";

type SubTabId =
  | "revisions"
  | "reviewers"
  | "approvers"
  | "copies"
  | "related"
  | "correlated";

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

interface Knowledge {
  id: string;
  title: string;
  category: string;
}

interface ControlledCopy {
  id: string;
  location: string;
  custodian: string;
}

interface RelatedDocument {
  id: string;
  documentNumber: string;
  title: string;
  type: string;
}

interface SubTab {
  id: SubTabId;
  label: string;
}

// Export FormData interface to be reused by parent components
export interface GeneralTabFormData {
  title: string;
  type: DocumentType;
  author: string;
  coAuthors: (string | number)[];
  businessUnit: string;
  department: string;
  knowledgeBase: string;
  subType: string;
  periodicReviewCycle: number;
  periodicReviewNotification: number;
  language: string;
  reviewDate: string;
  description: string;
  isTemplate: boolean;
}

// Alias for backward compatibility
type FormData = GeneralTabFormData;

interface GeneralTabProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  isTemplateMode?: boolean;
  hideTemplateCheckbox?: boolean;
  suggestedDocumentCode?: string; // Suggested code from parent document
  isSaved?: boolean; // Whether the document has been saved - shows additional options when true
  documentNumber?: string; // Auto-generated document number
  createdDateTime?: string; // Auto-generated created date/time
  openedBy?: string; // Auto-generated opened by user
  onReviewersChange?: (reviewers: Reviewer[]) => void; // Callback when reviewers are added/changed
  onApproversChange?: (approvers: Approver[]) => void; // Callback when approvers are added/changed
  // Action button callbacks - for duplicate buttons at bottom
  onCancel?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  canSave?: boolean;
  // Obsolete functionality
  onObsolete?: (reason: string) => void;
  isObsoleted?: boolean;
  onBackToList?: () => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  formData,
  onFormChange,
  isTemplateMode = false,
  hideTemplateCheckbox = false,
  suggestedDocumentCode = "",
  isSaved = true, // Default to true for backwards compatibility with existing views
  documentNumber = "",
  createdDateTime = "",
  openedBy = "",
  onReviewersChange,
  onApproversChange,
  onCancel,
  onSave,
  isSaving = false,
  canSave = true,
  onObsolete,
  isObsoleted = false,
  onBackToList,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<SubTabId>("revisions");
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [isCorrelatedModalOpen, setIsCorrelatedModalOpen] = useState(false);
  const [isObsoleteModalOpen, setIsObsoleteModalOpen] = useState(false);

  // Subtab States - persisted across tab switches
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [reviewFlowType, setReviewFlowType] =
    useState<ReviewFlowType>("parallel");
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [controlledCopies, setControlledCopies] = useState<ControlledCopy[]>(
    [],
  );
  const [relatedDocuments, setRelatedDocuments] = useState<RelatedDocument[]>(
    [],
  );

  // Document Relationships State
  const [parentDocument, setParentDocument] = useState<ParentDocument | null>(
    null,
  );
  const [relationshipDocs, setRelationshipDocs] = useState<
    RelationshipDocument[]
  >([]);

  // Notify parent when reviewers change
  const handleReviewersChange = (newReviewers: Reviewer[]) => {
    setReviewers(newReviewers);
    onReviewersChange?.(newReviewers);
  };

  // Notify parent when approvers change
  const handleApproversChange = (newApprovers: Approver[]) => {
    setApprovers(newApprovers);
    onApproversChange?.(newApprovers);
  };

  const setFormData = (data: Partial<FormData>) => {
    onFormChange({ ...formData, ...data });
  };

  const subtabs: SubTab[] = [
    { id: "revisions", label: "Document Revisions" },
    { id: "reviewers", label: "Reviewers" },
    { id: "approvers", label: "Approvers" },
    { id: "copies", label: "Controlled Copies" },
    { id: "related", label: "Related Documents" },
    { id: "correlated", label: "Correlated Documents" },
  ];

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Document Number (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Number
          </label>
          <input
            type="text"
            value={documentNumber}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after Next Step"
          />
        </div>

        {/* Created (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Created (Date - Time)
          </label>
          <input
            type="text"
            value={createdDateTime}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after Next Step"
          />
        </div>

        {/* Suggested Document Code (if parent is selected) */}
        {suggestedDocumentCode && (
          <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-900">
                  Gợi ý mã tài liệu con:
                </p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">
                  {suggestedDocumentCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Author, Co-Author & Opened by - Same row with 2-1-1 ratio */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {/* Opened by (read-only, auto-generated) */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Opened by
            </label>
            <input
              type="text"
              value={openedBy}
              readOnly
              className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
              placeholder="Auto-generated after Next Step"
            />
          </div>
          {/* Author (Select) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Author<span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              value={formData.author}
              onChange={(value) =>
                !isObsoleted && setFormData({ author: value })
              }
              options={[
                { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                { label: "John Smith", value: "John Smith" },
                { label: "Mary Williams", value: "Mary Williams" },
                { label: "Robert Brown", value: "Robert Brown" },
              ]}
              enableSearch={true}
              placeholder="Select author..."
              disabled={isObsoleted}
            />
          </div>

          {/* Co-Authors (MultiSelect) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Co-Authors
            </label>
            <MultiSelect
              value={formData.coAuthors}
              onChange={(values) =>
                !isObsoleted && setFormData({ coAuthors: values })
              }
              options={[
                { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                { label: "John Smith", value: "John Smith" },
                { label: "Mary Williams", value: "Mary Williams" },
                { label: "Robert Brown", value: "Robert Brown" },
              ]}
              enableSearch={true}
              placeholder="Select co-authors..."
              maxVisibleTags={2}
              disabled={isObsoleted}
            />
          </div>
        </div>

        {/* Is Template */}
        {!isTemplateMode && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="isTemplate"
              className={cn(
                "text-sm font-medium text-slate-700",
                !isObsoleted && "cursor-pointer",
              )}
            >
              Is Template?
            </label>
            <Checkbox
              id="isTemplate"
              checked={formData.isTemplate}
              onChange={(checked) =>
                !isObsoleted && setFormData({ isTemplate: checked })
              }
              disabled={isObsoleted}
            />
          </div>
        )}

        {/* Business Unit (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Business Unit<span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            value={formData.businessUnit}
            onChange={(value) =>
              !isObsoleted && setFormData({ businessUnit: value })
            }
            options={[
              { label: "Operation Unit", value: "Operation Unit" },
              { label: "QA Unit", value: "QA Unit" },
              { label: "QC Unit", value: "QC Unit" },
              { label: "HR Unit", value: "HR Unit" },
            ]}
            enableSearch={true}
            disabled={isObsoleted}
          />
        </div>

        {/* Document Name - Full width */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Document Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              !isObsoleted && setFormData({ title: e.target.value })
            }
            placeholder="Enter document name"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Department (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Department
          </label>
          <Select
            value={formData.department}
            onChange={(value) =>
              !isObsoleted && setFormData({ department: value })
            }
            options={[
              {
                label: "Human Resources & Administrator",
                value: "Human Resources & Administrator",
              },
              { label: "Production", value: "Production" },
              { label: "Quality Control", value: "Quality Control" },
              { label: "Quality Assurance", value: "Quality Assurance" },
            ]}
            enableSearch={true}
            disabled={isObsoleted}
          />
        </div>

        {/* Knowledge Base */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Knowledge Base
          </label>
          <input
            type="text"
            value={formData.knowledgeBase}
            onChange={(e) =>
              !isObsoleted && setFormData({ knowledgeBase: e.target.value })
            }
            placeholder="Enter knowledge base"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Document Type (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Type<span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            value={formData.type}
            onChange={(value) =>
              !isObsoleted && setFormData({ type: value as DocumentType })
            }
            options={DOCUMENT_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            enableSearch={true}
            placeholder="Select document type..."
            disabled={isObsoleted}
          />
        </div>

        {/* Sub-Type (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Sub-Type</label>
          <Select
            value={formData.subType}
            onChange={(value) =>
              !isObsoleted && setFormData({ subType: value })
            }
            options={[
              { label: "-- None --", value: "" },
              { label: "Template", value: "Template" },
              { label: "Guideline", value: "Guideline" },
              { label: "Checklist", value: "Checklist" },
            ]}
            enableSearch={true}
            placeholder="Select sub-type..."
            disabled={isObsoleted}
          />
        </div>

        {/* Periodic Review Cycle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Periodic Review Cycle (Months)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={formData.periodicReviewCycle || ""}
            onChange={(e) =>
              !isObsoleted &&
              setFormData({
                periodicReviewCycle: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Enter review cycle in months"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Periodic Review Notification */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Periodic Review Notification (Days)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={formData.periodicReviewNotification || ""}
            onChange={(e) =>
              !isObsoleted &&
              setFormData({
                periodicReviewNotification: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Enter notification days before review"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Effective Date (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Effective Date (dd/MM/yyyy)
          </label>
          <input
            type="text"
            value={""}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>
        {/* Valid Until (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Valid Until (dd/MM/yyyy)
          </label>
          <input
            type="text"
            value={""}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <Select
            value={formData.language}
            onChange={(value) =>
              !isObsoleted && setFormData({ language: value })
            }
            options={[
              { label: "English", value: "English" },
              { label: "Vietnamese", value: "Vietnamese" },
            ]}
            enableSearch={false}
            disabled={isObsoleted}
          />
        </div>

        {/* Review Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Review Date
          </label>
          <DateTimePicker
            value={formData.reviewDate || ""}
            onChange={(value) =>
              !isObsoleted && setFormData({ reviewDate: value })
            }
            placeholder="Select review date"
            disabled={isObsoleted}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              !isObsoleted && setFormData({ description: e.target.value })
            }
            placeholder="Enter document description"
            rows={4}
            disabled={isObsoleted}
            className={cn(
              "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          {!isSaved && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <span className="font-medium">💡 Tip:</span> Click "Next Step"
                to create the document and generate Document Number. You can
                then add Reviewers, Approvers, and Related Documents.
              </p>
            </div>
          )}
        </div>

        {/* Cancel & Save Buttons - Always shown when callbacks are provided */}
        {(onCancel || onSave || onBackToList) && (
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            {/* Back to List button - shown when obsoleted */}
            {isObsoleted && onBackToList && (
              <Button
                onClick={onBackToList}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Back to List
              </Button>
            )}

            {/* Cancel button - hidden when obsoleted */}
            {!isObsoleted && onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Cancel
              </Button>
            )}

            {/* Save/Next Step button - always shown but disabled when obsoleted */}
            {onSave && (
              <Button
                onClick={onSave}
                disabled={isObsoleted || !canSave || isSaving}
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
            )}

            {/* Obsolete button - hidden when obsoleted, only show after saved */}
            {!isObsoleted && isSaved && onObsolete && (
              <Button
                onClick={() => setIsObsoleteModalOpen(true)}
                size="sm"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Obsolete
              </Button>
            )}

            {/* Divider - only show when saved and not obsoleted */}
            {isSaved && !isObsoleted && (onCancel || onSave) && (
              <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />
            )}

            {/* Other action buttons - only show after saved and not obsoleted */}
            {isSaved && !isObsoleted && (
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
        )}
      </div>

      {/* E-Signature Modal for Obsolete */}
      <ESignatureModal
        isOpen={isObsoleteModalOpen}
        onClose={() => setIsObsoleteModalOpen(false)}
        onConfirm={(reason) => {
          setIsObsoleteModalOpen(false);
          onObsolete?.(reason);
        }}
        actionTitle="Obsolete Document"
      />

      {/* DocumentRelationships Modals - Only render when saved */}
      {isSaved && (
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
      )}

      {/* Subtabs Card - Only show after saved */}
      {isSaved && (
        <div className="mt-6 border rounded-xl bg-white shadow-sm overflow-hidden">
          {/* Subtab Navigation */}
          <div className="border-b border-slate-200 bg-white">
            <div className="flex overflow-x-auto">
              {subtabs.map((subtab) => {
                return (
                  <button
                    key={subtab.id}
                    onClick={() => setActiveSubtab(subtab.id)}
                    className={cn(
                      "flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                      activeSubtab === subtab.id
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200",
                    )}
                  >
                    {subtab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtab Content */}
          <div className="p-4 md:p-6">
            {activeSubtab === "revisions" && <DocumentRevisionsTab />}
            {activeSubtab === "reviewers" && (
              <ReviewersTab
                reviewers={reviewers}
                onReviewersChange={handleReviewersChange}
                reviewFlowType={reviewFlowType}
                onReviewFlowTypeChange={setReviewFlowType}
                isModalOpen={isReviewerModalOpen}
                onModalClose={() => setIsReviewerModalOpen(false)}
              />
            )}
            {activeSubtab === "approvers" && (
              <ApproversTab
                approvers={approvers}
                onApproversChange={handleApproversChange}
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
    </div>
  );
};
