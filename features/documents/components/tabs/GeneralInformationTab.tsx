import React from "react";
import { Calendar, User } from "lucide-react";
import { Select } from "../../../../components/ui/select/Select";
import { Popover } from "../../../../components/ui/popover/Popover";
import { Checkbox } from "../../../../components/ui/checkbox/Checkbox";

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
}

export const GeneralInformationTab: React.FC<GeneralInformationTabProps> = ({ document }) => {
  return (
    <div className="space-y-4">
      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-4">
        {/* Document Number */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document Number
          </label>
          <input
            type="text"
            value={document.documentId}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
          />
        </div>

        {/* Created */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Created (yyyy-MM-dd HH:mm:ss)
          </label>
          <input
            type="text"
            value={document.created}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
          />
        </div>

        {/* Opened by */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Opened by
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.openedBy}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
            />
            <Popover
              title=""
              content={<UserDetailPopoverContent />}
              contentClassName="w-[90vw] sm:w-[600px]"
              placement="bottom"
            />
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Author
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.author}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Popover
              title=""
              content={<UserDetailPopoverContent />}
              contentClassName="w-[90vw] sm:w-[600px]"
              placement="bottom"
            />
          </div>
        </div>

        {/* Is Template */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Is Template?
          </label>
          <div className="flex-1">
            <Checkbox
              id="isTemplate"
              checked={document.isTemplate}
            />
          </div>
        </div>

        {/* Business Unit */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Business Unit
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.businessUnit}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Popover
              title="Business Unit"
              content="Information about the business unit will appear here."
            />
          </div>
        </div>

        {/* Document Name */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.title}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Popover
              title="Document Name"
              content="Information about the document name will appear here."
            />
          </div>
        </div>

        {/* Department */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Department
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.department}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
            />
            <Popover
              title="Department"
              content="Information about the department will appear here."
            />
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Knowledge Base
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.knowledgeBase}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Popover
              title="Knowledge Base"
              content="Information about the knowledge base will appear here."
            />
          </div>
        </div>

        {/* Document Type */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document Type
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={document.type}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
            />
            <Popover
              title="Document Type"
              content="Information about the document type will appear here."
            />
          </div>
        </div>

        {/* Sub-Type */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Sub-Type
          </label>
          <div className="flex-1">
            <Select
              value={document.subType}
              onChange={() => {}}
              options={[
                { label: "-- None --", value: "-- None --" }
              ]}
              enableSearch={false}
            />
          </div>
        </div>

        {/* Periodic Review Cycle */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Periodic Review Cycle (Months)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={document.periodicReviewCycle}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Periodic Review Notification */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Periodic Review Notification (Days)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={document.periodicReviewNotification}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Effective Date */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Effective Date (yyyy-MM-dd)
          </label>
          <input
            type="text"
            value={document.effectiveDate}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
          />
        </div>

        {/* Valid Until */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Valid Until (yyyy-MM-dd)
          </label>
          <input
            type="text"
            value={document.validUntil}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700"
          />
        </div>

        {/* Language */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Language
          </label>
          <div className="flex-1">
            <Select
              value={document.language}
              onChange={() => {}}
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
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0 pt-2">
            Description
          </label>
          <textarea
            value={document.description}
            rows={4}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

const UserDetailPopoverContent = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
        <h4 className="text-sm font-semibold text-slate-900">User</h4>
        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded px-2 py-1 hover:bg-emerald-50 transition-colors">
          Open Record
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
        {/* Left Column */}
        <div className="space-y-2">
          <PopoverField label="User ID" value="admin.thehoang" />
          <PopoverField label="First name" value="Admin" />
          <PopoverField label="Last name" value="the Hoang" />
          <PopoverField label="Title" value="" />
          <PopoverField label="Department" value="Quality Assurance" />
          
          <div className="grid grid-cols-[110px_1fr] items-center gap-3">
            <label className="text-xs text-slate-500 text-right">Active</label>
            <div className="flex items-center h-7">
               <Checkbox checked={true} />
            </div>
          </div>
          
          <div className="grid grid-cols-[110px_1fr] items-start gap-3">
            <label className="text-xs text-slate-500 text-right leading-tight mt-1">Internal Integration User</label>
             <div className="flex items-center h-7">
               <Checkbox checked={false} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <PopoverField label="Email" value="admin.thehoang@ngocthien.com" />
          <PopoverField label="Identity type" value="-" />
          <PopoverField label="Language" value="English" />
          <PopoverField label="Notification" value="Enable" />
          <PopoverField label="Date format" value="" />
          <PopoverField label="Photo" value="" />
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
