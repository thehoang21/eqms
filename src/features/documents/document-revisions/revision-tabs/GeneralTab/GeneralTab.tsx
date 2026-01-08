import React, { useState } from "react";
import { Calendar, FileText, UserPlus, UserCheck, BookOpen, Copy, LinkIcon } from "lucide-react";
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import { DocumentType, DOCUMENT_TYPES } from "@/types/documentTypes";
import {
    DocumentRevisionsTab,
    ReviewersTab,
    ApproversTab,
    DocumentKnowledgesTab,
    ControlledCopiesTab,
    RelatedDocumentsTab
} from "./subtabs";
import type { Revision } from './subtabs/types';

type SubTabId = "revisions" | "reviewers" | "approvers" | "knowledges" | "copies" | "related";

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
}

interface GeneralTabProps {
    formData: FormData;
    onFormChange: (data: FormData) => void;
    isTemplateMode?: boolean;
    hideTemplateCheckbox?: boolean;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ 
    formData, 
    onFormChange, 
    isTemplateMode = false,
    hideTemplateCheckbox = false
}) => {
    const [activeSubtab, setActiveSubtab] = useState<SubTabId>("revisions");
    
    // Subtab States - persisted across tab switches
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [reviewFlowType, setReviewFlowType] = useState<ReviewFlowType>('parallel');
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [controlledCopies, setControlledCopies] = useState<ControlledCopy[]>([]);
    const [relatedDocuments, setRelatedDocuments] = useState<RelatedDocument[]>([]);

    const setFormData = (data: Partial<FormData>) => {
        onFormChange({ ...formData, ...data });
    };

    const subtabs: SubTab[] = [
        { id: "revisions", label: "Document Revisions" },
        { id: "reviewers", label: "Reviewers" },
        { id: "approvers", label: "Approvers" },
        { id: "knowledges", label: "Document Knowledges" },
        { id: "copies", label: "Controlled Copies" },
        { id: "related", label: "Related Documents" }
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                {/* Document Number (read-only, auto-generated) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Document Number</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Created (read-only, auto-generated) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Created (yyyy-MM-dd HH:mm:ss)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Opened by (read-only, auto-generated) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Opened by</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Auto-generated after save"
                    />
                </div>

                {/* Author (Select) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Author<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex-1">
                        <Select
                            value={formData.author}
                            onChange={(value) => setFormData({ author: value })}
                            options={[
                                { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                                { label: "John Smith", value: "John Smith" },
                                { label: "Mary Williams", value: "Mary Williams" },
                                { label: "Robert Brown", value: "Robert Brown" }
                            ]}
                            enableSearch={true}
                        />
                    </div>
                </div>

                {/* Is Template - HIDDEN in template mode OR when hideTemplateCheckbox is true */}
                {!isTemplateMode && !hideTemplateCheckbox && (
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Is Template?</label>
                        <div className="flex-1">
                            <Checkbox
                                id="isTemplate"
                                checked={formData.isTemplate}
                                onChange={(checked) => setFormData({ isTemplate: checked })}
                            />
                        </div>
                    </div>
                )}

                {/* Document Name */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Document Name<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ title: e.target.value })}
                            placeholder="Enter document name"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Document Type (Select) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Document Type<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex-1">
                        <Select
                            value={formData.type}
                            onChange={(value) => setFormData({ type: value as DocumentType })}
                            options={DOCUMENT_TYPES.map(type => ({ label: type, value: type }))}
                            enableSearch={true}
                        />
                    </div>
                </div>

                {/* Sub-Type (Select) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Sub-Type</label>
                    <div className="flex-1">
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
                </div>

                {/* Business Unit (Select) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Business Unit<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex-1">
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
                </div>

                {/* Department (Select) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Department</label>
                    <div className="flex-1">
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
                </div>

                {/* Knowledge Base */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Knowledge Base</label>
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.knowledgeBase}
                            onChange={(e) => setFormData({ knowledgeBase: e.target.value })}
                            placeholder="Enter knowledge base"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Periodic Review Cycle */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Periodic Review Cycle (Months)<span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="number"
                        value={formData.periodicReviewCycle}
                        onChange={(e) => setFormData({ periodicReviewCycle: parseInt(e.target.value) })}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Periodic Review Notification */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Periodic Review Notification (Days)<span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="number"
                        value={formData.periodicReviewNotification}
                        onChange={(e) => setFormData({ periodicReviewNotification: parseInt(e.target.value) })}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Effective Date (read-only, auto-generated) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Effective Date (yyyy-MM-dd)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Set when approved"
                    />
                </div>

                {/* Valid Until (read-only, auto-generated) */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Valid Until (yyyy-MM-dd)</label>
                    <input
                        type="text"
                        value={''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
                        placeholder="Set when approved"
                    />
                </div>

                {/* Language */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">Language</label>
                    <div className="flex-1">
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
                </div>

                {/* Description */}
                <div className="flex gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0 pt-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ description: e.target.value })}
                        placeholder="Enter document description"
                        rows={4}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                </div>
            </div>

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
                                        "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
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
                <div className="p-6">
                    {activeSubtab === "revisions" && (
                        <DocumentRevisionsTab 
                            revisions={revisions}
                            onRevisionsChange={setRevisions}
                        />
                    )}
                    {activeSubtab === "reviewers" && (
                        <ReviewersTab 
                            reviewers={reviewers}
                            onReviewersChange={setReviewers}
                            reviewFlowType={reviewFlowType}
                            onReviewFlowTypeChange={setReviewFlowType}
                        />
                    )}
                    {activeSubtab === "approvers" && (
                        <ApproversTab 
                            approvers={approvers}
                            onApproversChange={setApprovers}
                        />
                    )}
                    {activeSubtab === "knowledges" && (
                        <DocumentKnowledgesTab 
                            knowledges={knowledges}
                            onKnowledgesChange={setKnowledges}
                        />
                    )}
                    {activeSubtab === "copies" && (
                        <ControlledCopiesTab 
                            copies={controlledCopies}
                            onCopiesChange={setControlledCopies}
                        />
                    )}
                    {activeSubtab === "related" && (
                        <RelatedDocumentsTab 
                            documents={relatedDocuments}
                            onDocumentsChange={setRelatedDocuments}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
