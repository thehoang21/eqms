import React from "react";
import { MapPin, Building2 } from "lucide-react";
import { ControlledCopy } from "../../types";

interface DistributionInformationTabProps {
  controlledCopy: ControlledCopy;
}

export const DistributionInformationTab: React.FC<DistributionInformationTabProps> = ({
  controlledCopy,
}) => {
  return (
    <div className="space-y-6">
      {/* Location Information Section */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          Location Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Location Name
            </label>
            <input
              type="text"
              value={controlledCopy.location || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Location Code
            </label>
            <input
              type="text"
              value={controlledCopy.locationCode || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Distribution Details Section */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          Distribution Details
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Distribution List
            </label>
            <input
              type="text"
              value={controlledCopy.distributionList || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Department
            </label>
            <input
              type="text"
              value={controlledCopy.department || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Recipient Name
            </label>
            <input
              type="text"
              value={controlledCopy.recipientName || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Distributed By
            </label>
            <input
              type="text"
              value={controlledCopy.distributedBy || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Distributed Date
            </label>
            <input
              type="text"
              value={controlledCopy.distributedDate || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Request Information Section */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Request Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Requested By
            </label>
            <input
              type="text"
              value={controlledCopy.requestedBy || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0">
              Request Date
            </label>
            <input
              type="text"
              value={controlledCopy.requestDate || ""}
              readOnly
              className="flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
            <label className="text-sm font-medium text-slate-700 text-left md:w-56 md:flex-shrink-0 md:pt-2">
              Reason
            </label>
            <textarea
              value={controlledCopy.reason || ""}
              readOnly
              rows={3}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
