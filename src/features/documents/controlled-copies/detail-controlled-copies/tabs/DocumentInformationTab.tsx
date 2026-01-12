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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4">

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document Number
          </label>
          <input
            type="text"
            value={controlledCopy.documentNumber}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Created
          </label>
          <input
            type="text"
            value={formatDateTime(controlledCopy.createdDate, controlledCopy.createdTime)}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Opened by
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={controlledCopy.openedBy}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Name
          </label>
          <input
            type="text"
            value={controlledCopy.name}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={controlledCopy.document}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Document Revision
          </label>
          <input
            type="text"
            value={controlledCopy.version || ""}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Valid Until
          </label>
          <input
            type="text"
            value={formatDate(controlledCopy.validUntil)}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Revision Number
          </label>
          <input
            type="text"
            value={controlledCopy.version || ""}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Copy Number
          </label>
          <input
            type="text"
            value={controlledCopy.copyNumber?.toString() || "1"}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
          <div className="w-full text-xs text-slate-500 italic bg-blue-50 px-3 py-2 rounded border border-blue-200">
            The Copy Number field represents the n'th copy of the related revision
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Total Copies Number
          </label>
          <input
            type="text"
            value={controlledCopy.totalCopies?.toString() || "1"}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
          <div className="w-full text-xs text-slate-500 italic bg-blue-50 px-3 py-2 rounded border border-blue-200">
            The Total Copies Number field represents the total number of all copies of the related revision
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Business Unit
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={controlledCopy.department || ""}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Recall Date
          </label>
          <input
            type="text"
            value=""
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
            Delivered By
          </label>
          <input
            type="text"
            value=""
            readOnly
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex items-start gap-4">
          <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0 pt-2">
            Comments
          </label>
          <textarea
            value={controlledCopy.reason || ""}
            readOnly
            rows={3}
            className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
