import React from "react";
import { Calendar, User } from "lucide-react";
import { Select } from '@/components/ui/select/Select';
import { Popover } from '@/components/ui/popover/Popover';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';

interface DocumentDetail {
  documentId: string;
  title: string;
  type: string;
  created: string;
  openedBy: string;
  author: string;
  isTemplate: boolean;
  businessUnit: string;
  department: string;
  knowledgeBase: string;
  subType: string;
  periodicReviewCycle: number;
  periodicReviewNotification: number;
  effectiveDate: string;
  validUntil: string;
  language: string;
  description: string;
}

interface GeneralInformationTabProps {
  document: DocumentDetail;
  isReadOnly?: boolean;
}

export const GeneralInformationTab: React.FC<GeneralInformationTabProps> = ({ document, isReadOnly = false }) => {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {/* Document Number (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Document Number</label>
          <input
            type="text"
            value={document.documentId}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after save"
          />
        </div>

        {/* Created (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Created (Date - Time)</label>
          <input
            type="text"
            value={document.created}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after save"
          />
        </div>

        {/* Opened by (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Opened by</label>
          <input
            type="text"
            value={document.openedBy}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after save"
          />
        </div>

        {/* Author */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Author<span className="text-red-500 ml-1">*</span></label>
          <input
            type="text"
            value={document.author}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Is Template */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Is Template?</label>
          <Checkbox id="isTemplate" checked={document.isTemplate} disabled={true} />
        </div>

        {/* Document Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Document Name<span className="text-red-500 ml-1">*</span></label>
          <input
            type="text"
            value={document.title}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Document Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Document Type<span className="text-red-500 ml-1">*</span></label>
          <input
            type="text"
            value={document.type}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Sub-Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Sub-Type</label>
          <input
            type="text"
            value={document.subType}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Business Unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Business Unit<span className="text-red-500 ml-1">*</span></label>
          <input
            type="text"
            value={document.businessUnit}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Department</label>
          <input
            type="text"
            value={document.department}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Knowledge Base */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Knowledge Base</label>
          <input
            type="text"
            value={document.knowledgeBase}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Periodic Review Cycle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Periodic Review Cycle (Months)<span className="text-red-500 ml-1">*</span></label>
          <input
            type="number"
            value={document.periodicReviewCycle}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Periodic Review Notification */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Periodic Review Notification (Days)<span className="text-red-500 ml-1">*</span></label>
          <input
            type="number"
            value={document.periodicReviewNotification}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Effective Date (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Effective Date (dd/MM/yyyy)</label>
          <input
            type="text"
            value={document.effectiveDate}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>

        {/* Valid Until (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Valid Until (dd/MM/yyyy)</label>
          <input
            type="text"
            value={document.validUntil}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <input
            type="text"
            value={document.language}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={document.description}
            rows={4}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

const PopoverField = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[110px_1fr] items-center gap-3">
    <label className="text-xs text-slate-500 text-right truncate" title={label}>{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none h-7"
    />
  </div>
);
