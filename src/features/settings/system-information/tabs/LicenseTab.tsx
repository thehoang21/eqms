import React from "react";
import { Shield, Calendar, Users, Package, AlertTriangle } from "lucide-react";
import type { LicenseInfo } from "../types";

interface LicenseTabProps {
  data: LicenseInfo;
}

export const LicenseTab: React.FC<LicenseTabProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const isExpiringSoon = data.daysUntilExpiry <= 90;
  const userUsagePercent = (data.activeUsers / data.maxUsers) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Expiry Warning */}
      {isExpiringSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-900 mb-1">License Expiring Soon</h4>
              <p className="text-sm text-amber-700">
                Your license will expire in <strong>{data.daysUntilExpiry} days</strong> on{" "}
                <strong>{formatDate(data.expiryDate)}</strong>.
                Please contact your account manager to renew your license.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* License Details */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-600" />
          License Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              License Type
            </label>
            <input
              type="text"
              value={data.licenseType}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={data.companyName}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Validity Period */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          Validity Period
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Issued Date
            </label>
            <input
              type="text"
              value={formatDate(data.issuedDate)}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Expiry Date
            </label>
            <input
              type="text"
              value={formatDate(data.expiryDate)}
              disabled
              className={`w-full h-11 px-3.5 text-sm border rounded-lg cursor-not-allowed font-semibold ${
                isExpiringSoon
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Days Until Expiry
            </label>
            <div className={`flex items-center h-11 px-3.5 border rounded-lg ${
              isExpiringSoon
                ? "border-amber-300 bg-amber-50"
                : "border-slate-200 bg-slate-50"
            }`}>
              <span className={`text-sm font-semibold ${
                isExpiringSoon ? "text-amber-900" : "text-slate-700"
              }`}>
                {data.daysUntilExpiry} days remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Licenses */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-600" />
          User Licenses
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Active Users
              </label>
              <p className="text-lg font-semibold text-slate-900">{data.activeUsers}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Maximum Users
              </label>
              <p className="text-lg font-semibold text-slate-900">{data.maxUsers}</p>
            </div>
          </div>
          
          {/* User Usage Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">
                License Utilization
              </label>
              <span className="text-xs font-semibold text-slate-700">
                {userUsagePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  userUsagePercent >= 90
                    ? "bg-red-600"
                    : userUsagePercent >= 75
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${userUsagePercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {userUsagePercent >= 90 && "⚠️ License limit approaching"}
              {userUsagePercent >= 75 && userUsagePercent < 90 && "⚠️ High license usage"}
              {userUsagePercent < 75 && `${data.maxUsers - data.activeUsers} licenses available`}
            </p>
          </div>
        </div>
      </div>

      {/* Licensed Modules */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-600" />
          Licensed Modules ({data.modules.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.modules.map((module, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center justify-center h-6 w-6 rounded bg-emerald-100">
                <svg className="h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-900">{module}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">License Support</h4>
            <p className="text-sm text-blue-700">
              For license renewal, upgrade inquiries, or additional user licenses,
              please contact your account manager or email: licensing@eqms.company.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
