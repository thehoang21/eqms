import React from 'react';
import { DocumentConfig } from '../types';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';

interface DocumentTabProps {
  config: DocumentConfig;
  onChange: (config: DocumentConfig) => void;
}

export const DocumentTab: React.FC<DocumentTabProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof DocumentConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Retention & Storage */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Retention & Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Default Retention Period (Days)
            </label>
            <input
              type="number"
              value={config.defaultRetentionPeriodDays}
              onChange={(e) => handleChange('defaultRetentionPeriodDays', parseInt(e.target.value))}
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              min={0}
            />
            <p className="text-xs text-slate-500 mt-1">
              Number of days to retain documents after archiving
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={config.maxFileSizeMB}
              onChange={(e) => handleChange('maxFileSizeMB', parseInt(e.target.value))}
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              min={1}
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum file size for document uploads
            </p>
          </div>
        </div>
      </div>

      {/* Protection & Distribution */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Protection & Distribution
        </h3>
        <div className="space-y-3">
          <Checkbox
            id="enableWatermark"
            label="Enable Watermarking"
            checked={config.enableWatermark}
            onChange={(checked) => handleChange('enableWatermark', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            Apply "Confidential" watermark to all document previews and downloads
          </p>
          
          <Checkbox
            id="allowDownload"
            label="Allow Document Download"
            checked={config.allowDownload}
            onChange={(checked) => handleChange('allowDownload', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            If disabled, documents can only be viewed within the system viewer
          </p>
        </div>
      </div>
    </div>
  );
};
