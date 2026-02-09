import React from "react";
import { Database, CheckCircle2, XCircle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import type { DatabaseInfo } from "../types";

interface DatabaseTabProps {
  data: DatabaseInfo;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ data }) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Connection Status */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
              data.connectionStatus === "connected" 
                ? "bg-emerald-100" 
                : "bg-red-100"
            }`}>
              {data.connectionStatus === "connected" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Database Connection</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {data.connectionStatus === "connected" 
                  ? "Connection established successfully" 
                  : "Unable to connect to database"}
              </p>
            </div>
          </div>
          <StatusBadge 
            status={data.connectionStatus === "connected" ? "effective" : "archived"} 
          />
        </div>
      </div>

      {/* Database Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-600" />
          Database Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Database Type
            </label>
            <input
              type="text"
              value={data.type}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-semibold"
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
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Host
            </label>
            <input
              type="text"
              value={data.host}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Port
            </label>
            <input
              type="text"
              value={data.port}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Database Name
            </label>
            <input
              type="text"
              value={data.database}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
        </div>
      </div>

      {/* Backup Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-600" />
          Backup Information
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Last Backup
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {formatDate(data.lastBackup)}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-900 mb-1">Sensitive Information</h4>
            <p className="text-sm text-amber-700">
              Database credentials and connection strings are not displayed for security reasons.
              Contact system administrators for database access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
