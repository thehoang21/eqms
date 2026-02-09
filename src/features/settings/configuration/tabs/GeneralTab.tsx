import React, { useState } from 'react';
import { GeneralConfig } from '../types';
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Upload, Image, FileIcon } from 'lucide-react';

interface GeneralTabProps {
  config: GeneralConfig;
  onChange: (config: GeneralConfig) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof GeneralConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleFileUpload = (key: 'systemLogo' | 'systemFavicon', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In production, upload to server and get URL
      // For now, create a local URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Branding */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Branding
        </h3>
        <div className="space-y-4">
          {/* System Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                System Name (Internal)
              </label>
              <input
                type="text"
                value={config.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
                className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="EQMS Enterprise"
              />
              <p className="text-xs text-slate-500 mt-1">
                Internal system identifier
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Display Name (Browser Tab)
              </label>
              <input
                type="text"
                value={config.systemDisplayName}
                onChange={(e) => handleChange('systemDisplayName', e.target.value)}
                className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="EQMS - Quality Management System"
              />
              <p className="text-xs text-slate-500 mt-1">
                Displayed in browser tab title
              </p>
            </div>
          </div>

          {/* Logo & Favicon Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Logo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                System Logo
              </label>
              <div className="flex items-start gap-3">
                {config.systemLogo && (
                  <div className="flex-shrink-0 w-16 h-16 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={config.systemLogo}
                      alt="System Logo"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <Image className="h-8 w-8 text-slate-400 hidden" />
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('systemLogo', e)}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Recommended: PNG or SVG, 200x50px
                  </p>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Favicon
              </label>
              <div className="flex items-start gap-3">
                {config.systemFavicon && (
                  <div className="flex-shrink-0 w-16 h-16 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={config.systemFavicon}
                      alt="Favicon"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <FileIcon className="h-8 w-8 text-slate-400 hidden" />
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="favicon-upload"
                    className="inline-flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Favicon
                  </label>
                  <input
                    id="favicon-upload"
                    type="file"
                    accept="image/x-icon,image/png"
                    onChange={(e) => handleFileUpload('systemFavicon', e)}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Recommended: ICO or PNG, 32x32px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={config.adminEmail}
              onChange={(e) => handleChange('adminEmail', e.target.value)}
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="admin@example.com"
            />
            <p className="text-xs text-slate-500 mt-1">
              Primary contact for system notifications
            </p>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Localization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Date & Time Format"
            value={config.dateTimeFormat}
            onChange={(val) => handleChange('dateTimeFormat', val)}
            options={[
              { label: 'DD/MM/YYYY HH:mm:ss', value: 'DD/MM/YYYY HH:mm:ss' },
              { label: 'DD/MM/YYYY HH:mm', value: 'DD/MM/YYYY HH:mm' },
              { label: 'MM/DD/YYYY HH:mm:ss', value: 'MM/DD/YYYY HH:mm:ss' },
              { label: 'MM/DD/YYYY HH:mm', value: 'MM/DD/YYYY HH:mm' },
              { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
              { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
              { label: 'DD-MMM-YYYY HH:mm:ss', value: 'DD-MMM-YYYY HH:mm:ss' },
              { label: 'DD-MMM-YYYY HH:mm', value: 'DD-MMM-YYYY HH:mm' },
              { label: 'MMMM DD, YYYY HH:mm:ss', value: 'MMMM DD, YYYY HH:mm:ss' },
              { label: 'MMMM DD, YYYY HH:mm', value: 'MMMM DD, YYYY HH:mm' },
            ]}
          />
          <Select
            label="Time Zone"
            value={config.timeZone}
            onChange={(val) => handleChange('timeZone', val)}
            options={[
              { label: 'UTC', value: 'UTC' },
              { label: 'UTC+7 (Bangkok, Hanoi)', value: 'UTC+7' },
              { label: 'EST', value: 'EST' },
              { label: 'PST', value: 'PST' },
            ]}
          />
        </div>
      </div>

      {/* System Maintenance */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          System Maintenance
        </h3>
        <div className="space-y-3">
          <Checkbox
            id="maintenanceMode"
            label="Enable Maintenance Mode"
            checked={config.maintenanceMode}
            onChange={(checked) => handleChange('maintenanceMode', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            When enabled, only administrators can access the system. Regular users will see a maintenance notice.
          </p>
        </div>
      </div>
    </div>
  );
};
