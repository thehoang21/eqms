import React, { useState } from "react";
import { Calendar, FileText, UserPlus, UserCheck, BookOpen, Copy, LinkIcon, Plus } from "lucide-react";
import { Select } from '@/components/ui/select/Select';
import { MultiSelect } from '@/components/ui/select/MultiSelect';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import {
    DocumentRevisionsTab,
    ReviewersTab,
    ApproversTab,
    DocumentKnowledgesTab,
    ControlledCopiesTab,
    RelatedDocumentsTab,
    CorrelatedDocumentsTab
} from "./subtabs";
import type { Revision } from './subtabs/types';
import { DocumentType, DOCUMENT_TYPES } from "@/types/documentTypes";
import { DocumentRelationships, ParentDocument, RelatedDocument as RelationshipDocument } from './subtabs';

type SubTabId = "revisions" | "reviewers" | "approvers" | "knowledges" | "copies" | "related" | "correlated";

type ReviewFlowType = 'sequential' | 'parallel';

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

interface FormData {
    title: string;
    type: DocumentType;
    author: (string | number)[];
    businessUnit: string;
    department: string;
    knowledgeBase: string;
    subType: string;
    periodicReviewCycle: number;
    periodicReviewNotification: number;
    language: string;
    description: string;
    isTemplate: boolean;
}

interface GeneralTabProps {
    formData: FormData;
    onFormChange: (data: FormData) => void;
    isTemplateMode?: boolean;
    hideTemplateCheckbox?: boolean;
    suggestedDocumentCode?: string; // Suggested code from parent document
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ 
    formData, 
    onFormChange, 
    isTemplateMode = false,
    hideTemplateCheckbox = false,
    suggestedDocumentCode = "",
}) => {
    const [activeSubtab, setActiveSubtab] = useState<SubTabId>("revisions");
    const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
    const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);
    const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
    const [isCorrelatedModalOpen, setIsCorrelatedModalOpen] = useState(false);
    
    // Subtab States - persisted across tab switches
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [reviewFlowType, setReviewFlowType] = useState<ReviewFlowType>('parallel');
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [controlledCopies, setControlledCopies] = useState<ControlledCopy[]>([]);
    const [relatedDocuments, setRelatedDocuments] = useState<RelatedDocument[]>([]);
    
    // Document Relationships State
    const [parentDocument, setParentDocument] = useState<ParentDocument | null>(null);
    const [relationshipDocs, setRelationshipDocs] = useState<RelationshipDocument[]>([]);

    const setFormData = (data: Partial<FormData>) => {
        onFormChange({ ...formData, ...data });
    };

    const subtabs: SubTab[] = [
        { id: "revisions", label: "Document Revisions" },
        { id: "reviewers", label: "Reviewers" },
        { id: "approvers", label: "Approvers" },
        { id: "knowledges", label: "Document Knowledges" },
        { id: "copies", label: "Controlled Copies" },
        { id: "related", label: "Related Documents" },
        { id: "correlated", label: "Correlated Documents" }
    ];

    return (
        <div className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 gap-3 md:gap-4">
                {/* Document Number (read-only, auto-generated) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Document Number</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Created (read-only, auto-generated) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Created (Date - Time)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Opened by (read-only, auto-generated) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Opened by</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Suggested Document Code (if parent is selected) */}
                {suggestedDocumentCode && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-blue-900">Gợi ý mã tài liệu con:</p>
                                    <p className="text-sm font-bold text-blue-700 mt-0.5">{suggestedDocumentCode}</p>
                                </div>
                            </div>
                        </div>
                )}

                {/* Authors (MultiSelect) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Authors<span className="text-red-500 ml-1">*</span></label>
                    <MultiSelect
                        value={formData.author}
                        onChange={(values) => setFormData({ author: values })}
                        options={[
                            { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                            { label: "John Smith", value: "John Smith" },
                            { label: "Mary Williams", value: "Mary Williams" },
                            { label: "Robert Brown", value: "Robert Brown" }
                        ]}
                        enableSearch={true}
                        placeholder="Select authors..."
                        maxVisibleTags={2}
                    />
                </div>

                {/* Is Template - HIDDEN in template mode OR when hideTemplateCheckbox is true */}
                {!isTemplateMode && !hideTemplateCheckbox && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Is Template?</label>
                        <Checkbox
                            id="isTemplate"
                            checked={formData.isTemplate}
                            onChange={(checked) => setFormData({ isTemplate: checked })}
                        />
                    </div>
                )}

                {/* Document Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Document Name<span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ title: e.target.value })}
                        placeholder="Enter document name"
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Document Type (Select) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Document Type<span className="text-red-500 ml-1">*</span></label>
                    <Select
                        value={formData.type}
                        onChange={(value) => setFormData({ type: value as DocumentType })}
                        options={DOCUMENT_TYPES.map(type => ({ label: type, value: type }))}
                        enableSearch={true}
                    />
                </div>

                {/* Sub-Type (Select) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Sub-Type</label>
                    <Select
                        value={formData.subType}
                        onChange={(value) => setFormData({ subType: value })}
                        options={[
                            { label: "-- None --", value: "-- None --" },
                            { label: "Template", value: "Template" },
                            { label: "Guideline", value: "Guideline" },
                            { label: "Checklist", value: "Checklist" }
                        ]}
                        enableSearch={true}
                    />
                </div>

                {/* Business Unit (Select) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Business Unit<span className="text-red-500 ml-1">*</span></label>
                    <Select
                        value={formData.businessUnit}
                        onChange={(value) => setFormData({ businessUnit: value })}
                        options={[
                            { label: "Operation Unit", value: "Operation Unit" },
                            { label: "QA Unit", value: "QA Unit" },
                            { label: "QC Unit", value: "QC Unit" },
                            { label: "HR Unit", value: "HR Unit" }
                        ]}
                        enableSearch={true}
                    />
                </div>

                {/* Department (Select) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Department</label>
                    <Select
                        value={formData.department}
                        onChange={(value) => setFormData({ department: value })}
                        options={[
                            { label: "Human Resources & Administrator", value: "Human Resources & Administrator" },
                            { label: "Production", value: "Production" },
                            { label: "Quality Control", value: "Quality Control" },
                            { label: "Quality Assurance", value: "Quality Assurance" }
                        ]}
                        enableSearch={true}
                    />
                </div>

                {/* Knowledge Base */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Knowledge Base</label>
                    <input
                        type="text"
                        value={formData.knowledgeBase}
                        onChange={(e) => setFormData({ knowledgeBase: e.target.value })}
                        placeholder="Enter knowledge base"
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Periodic Review Cycle */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Periodic Review Cycle (Months)<span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="number"
                        value={formData.periodicReviewCycle}
                        onChange={(e) => setFormData({ periodicReviewCycle: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Periodic Review Notification */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Periodic Review Notification (Days)<span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="number"
                        value={formData.periodicReviewNotification}
                        onChange={(e) => setFormData({ periodicReviewNotification: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Effective Date (read-only, auto-generated) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Effective Date (yyyy-MM-dd)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Set when approved"
                    />
                </div>
                {/* Valid Until (read-only, auto-generated) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Valid Until (yyyy-MM-dd)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Set when approved"
                    />
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Language</label>
                    <Select
                        value={formData.language}
                        onChange={(value) => setFormData({ language: value })}
                        options={[
                            { label: "English", value: "English" },
                            { label: "Vietnamese", value: "Vietnamese" }
                        ]}
                        enableSearch={false}
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ description: e.target.value })}
                        placeholder="Enter document description"
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                </div>

                {/* Add Reviewer, Approver, Related & Correlated Documents Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                    <Button
                        onClick={() => {
                            setActiveSubtab("reviewers");
                            setIsReviewerModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
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
                        className="whitespace-nowrap !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
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
                        className="whitespace-nowrap !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                    >
                        Select Related Documents
                        {relationshipDocs.length > 0 && (
                            <span className="ml-2 text-xs opacity-70">({relationshipDocs.length})</span>
                        )}
                    </Button>
                    <Button
                        onClick={() => {
                            setActiveSubtab("correlated");
                            setIsCorrelatedModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap !border-emerald-600 !text-emerald-600 hover:!bg-emerald-50"
                    >
                        Select Correlated Documents
                        {parentDocument && (
                            <span className="ml-2 text-xs opacity-70">(1)</span>
                        )}
                    </Button>
                </div>
            </div>

            {/* DocumentRelationships Modals */}
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

            {/* Subtabs Card */}
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
                                            : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
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
                    {activeSubtab === "reviewers" && <ReviewersTab 
                        reviewers={reviewers} 
                        onReviewersChange={setReviewers}
                        reviewFlowType={reviewFlowType} 
                        onReviewFlowTypeChange={setReviewFlowType}
                        isModalOpen={isReviewerModalOpen}
                        onModalClose={() => setIsReviewerModalOpen(false)}
                    />}
                    {activeSubtab === "approvers" && <ApproversTab 
                        isModalOpen={isApproverModalOpen}
                        onModalClose={() => setIsApproverModalOpen(false)}
                    />}
                    {activeSubtab === "knowledges" && <DocumentKnowledgesTab />}
                    {activeSubtab === "copies" && <ControlledCopiesTab />}
                    {activeSubtab === "related" && <RelatedDocumentsTab 
                        relatedDocuments={relationshipDocs}
                        onRelatedDocumentsChange={setRelationshipDocs}
                    />}
                    {activeSubtab === "correlated" && <CorrelatedDocumentsTab 
                        parentDocument={parentDocument}
                        onParentDocumentChange={setParentDocument}
                    />}
                </div>
            </div>
        </div>
    );
};
