import React, { useState } from "react";
import { Globe, CheckCircle2, XCircle, Clock, Copy, Check } from "lucide-react";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { Button } from "@/components/ui/button/Button";
import { useToast } from "@/components/ui/toast/Toast";
import type { ApiInfo } from "../types";

interface ApiTabProps {
  data: ApiInfo;
}

export const ApiTab: React.FC<ApiTabProps> = ({ data }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

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

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(data.baseUrl);
      setCopied(true);
      showToast({
        type: "success",
        message: "API URL copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to copy URL",
        duration: 2000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* API Status */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
              data.status === "online" 
                ? "bg-emerald-100" 
                : "bg-red-100"
            }`}>
              {data.status === "online" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">API Status</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {data.status === "online" 
                  ? "All services operational" 
                  : "API services unavailable"}
              </p>
            </div>
          </div>
          <StatusBadge 
            status={data.status === "online" ? "effective" : "archived"} 
          />
        </div>
      </div>

      {/* API Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-600" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.baseUrl}
                disabled
                className="flex-1 h-10 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
              />
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                API Version
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
                Average Response Time
              </label>
              <div className="flex items-center h-10 px-3.5 border border-slate-200 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-700 font-semibold">{data.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-600" />
          Health Check Information
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Last Health Check
            </label>
            <p className="text-sm text-slate-900 font-medium">
              {formatDate(data.lastHealthCheck)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Health checks run automatically every 5 minutes
            </p>
          </div>
        </div>
      </div>

      {/* API Endpoints Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">API Documentation</h4>
            <p className="text-sm text-blue-700">
              For detailed API endpoint documentation, authentication methods, and integration guides,
              please refer to the developer documentation portal or contact the IT department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
