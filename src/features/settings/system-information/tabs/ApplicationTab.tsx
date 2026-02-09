import React from "react";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import type { ApplicationInfo } from "../types";

interface ApplicationTabProps {
  data: ApplicationInfo;
}

export const ApplicationTab: React.FC<ApplicationTabProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const getEnvironmentBadge = (env: string) => {
    const badges = {
      production: "effective",
      staging: "pendingApproval",
      development: "draft",
    };
    return badges[env as keyof typeof badges] || "draft";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Application Details */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Application Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Application Name
            </label>
            <input
              type="text"
              value={data.name}
              disabled
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Version
            </label>
            <input
              type="text"
              value={data.version}
              disabled
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Environment
            </label>
            <div className="flex items-center h-10 px-3.5 border border-slate-200 rounded-lg bg-slate-50">
              <StatusBadge status={getEnvironmentBadge(data.environment) as any} />
              <span className="ml-2 text-sm text-slate-700 font-medium capitalize">
                {data.environment}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Build Number
            </label>
            <input
              type="text"
              value={data.buildNumber}
              disabled
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Build Date
            </label>
            <input
              type="text"
              value={formatDate(data.buildDate)}
              disabled
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Description
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">System Information</h4>
            <p className="text-sm text-blue-700">
              This information is read-only and automatically updated with each application deployment.
              For support inquiries, please reference the build number and version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
