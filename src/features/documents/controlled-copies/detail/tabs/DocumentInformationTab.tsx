import React from "react";
import { ControlledCopy } from "../../types";

interface DocumentInformationTabProps {
  controlledCopy: ControlledCopy;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(`${date}T${time}`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
};

export const DocumentInformationTab: React.FC<DocumentInformationTabProps> = ({
  controlledCopy,
}) => {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

        {/* Document Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Number
          </label>
          <input
            type="text"
            value={controlledCopy.documentNumber}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Created */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Created
          </label>
          <input
            type="text"
            value={formatDateTime(controlledCopy.createdDate, controlledCopy.createdTime)}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Opened by */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Opened by
          </label>
          <input
            type="text"
            value={controlledCopy.openedBy}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Business Unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Business Unit
          </label>
          <input
            type="text"
            value={controlledCopy.department || ""}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Name - Full width */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            value={controlledCopy.name}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Document */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document
          </label>
          <input
            type="text"
            value={controlledCopy.document}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Document Revision */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Revision
          </label>
          <input
            type="text"
            value={controlledCopy.version || ""}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Valid Until */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Valid Until
          </label>
          <input
            type="text"
            value={formatDate(controlledCopy.validUntil)}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Revision Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Revision Number
          </label>
          <input
            type="text"
            value={controlledCopy.version || ""}
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Copy Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Copy Number
          </label>
          <div className="space-y-1.5">
            <input
              type="text"
              value={controlledCopy.copyNumber?.toString() || "1"}
              readOnly
              className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
            />
            <p className="text-xs text-slate-500 italic">
              The Copy Number field represents the n'th copy of the related revision
            </p>
          </div>
        </div>

        {/* Total Copies Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Total Copies Number
          </label>
          <div className="space-y-1.5">
            <input
              type="text"
              value={controlledCopy.totalCopies?.toString() || "1"}
              readOnly
              className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
            />
            <p className="text-xs text-slate-500 italic">
              The Total Copies Number field represents the total number of all copies of the related revision
            </p>
          </div>
        </div>

        {/* Recall Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Recall Date
          </label>
          <input
            type="text"
            value=""
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Delivered By */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Delivered By
          </label>
          <input
            type="text"
            value=""
            readOnly
            className="w-full h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none"
          />
        </div>

        {/* Comments - Full width */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Comments
          </label>
          <textarea
            value={controlledCopy.reason || ""}
            readOnly
            rows={3}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
