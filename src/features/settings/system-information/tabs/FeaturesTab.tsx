import React from "react";
import { ToggleLeft, CheckCircle2, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import type { FeatureFlag } from "../types";

interface FeaturesTabProps {
  features: FeatureFlag[];
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ features }) => {
  const enabledFeatures = features.filter(f => f.enabled);
  const disabledFeatures = features.filter(f => !f.enabled);

  return (
    <div className="p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Total Features</p>
              <p className="text-2xl font-bold text-slate-900">{features.length}</p>
            </div>
            <ToggleLeft className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700 mb-1">Enabled</p>
              <p className="text-2xl font-bold text-emerald-900">{enabledFeatures.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Disabled</p>
              <p className="text-2xl font-bold text-slate-900">{disabledFeatures.length}</p>
            </div>
            <XCircle className="h-8 w-8 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Enabled Features */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Enabled Features ({enabledFeatures.length})
        </h3>
        <div className="space-y-2.5 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {enabledFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white border border-slate-200 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={feature.enabled}
                  disabled
                  id={`feature-${feature.id}`}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`feature-${feature.id}`}
                    className="block text-sm font-medium text-slate-900 mb-1 cursor-not-allowed"
                  >
                    {feature.name}
                  </label>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disabled Features */}
      {disabledFeatures.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-slate-400" />
            Disabled Features ({disabledFeatures.length})
          </h3>
          <div className="space-y-2.5 p-4 bg-slate-50 rounded-lg border border-slate-200">
            {disabledFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white border border-slate-200 rounded-lg p-3 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={feature.enabled}
                    disabled
                    id={`feature-${feature.id}`}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`feature-${feature.id}`}
                      className="block text-sm font-medium text-slate-700 mb-1 cursor-not-allowed"
                    >
                      {feature.name}
                    </label>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-900 mb-1">Feature Configuration</h4>
            <p className="text-sm text-amber-700">
              Feature flags are managed by system administrators. To request enabling or disabling
              specific features, please contact your IT department or submit a change request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
