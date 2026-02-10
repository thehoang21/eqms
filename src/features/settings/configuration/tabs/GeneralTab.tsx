import React, { useState, useEffect } from 'react';
import { GeneralConfig } from '../types';
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';

interface GeneralTabProps {
  config: GeneralConfig;
  onChange: (config: GeneralConfig) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ config, onChange }) => {
  const [timeZones, setTimeZones] = useState<Array<{ label: string; value: string }>>([]);

  // Fetch time zones using Intl API
  useEffect(() => {
    try {
      // Get all supported time zones from browser
      const zones = Intl.supportedValuesOf('timeZone');
      
      // Format time zones with offset information
      const formatted = zones.map((zone) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          timeZoneName: 'shortOffset',
        });
        
        // Get current time to calculate offset
        const parts = formatter.formatToParts(new Date());
        const offset = parts.find((part) => part.type === 'timeZoneName')?.value || '';
        
        return {
          label: `${zone.replace(/_/g, ' ')} ${offset}`,
          value: zone,
        };
      });

      // Sort by zone name
      formatted.sort((a, b) => a.value.localeCompare(b.value));

      setTimeZones(formatted);
    } catch (error) {
      console.error('Failed to load time zones:', error);
      // Fallback to basic options
      setTimeZones([
        { label: 'UTC', value: 'UTC' },
        { label: 'Asia/Bangkok (UTC+7)', value: 'Asia/Bangkok' },
        { label: 'Asia/Ho_Chi_Minh (UTC+7)', value: 'Asia/Ho_Chi_Minh' },
        { label: 'America/New_York (EST)', value: 'America/New_York' },
        { label: 'America/Los_Angeles (PST)', value: 'America/Los_Angeles' },
        { label: 'Europe/London (GMT)', value: 'Europe/London' },
      ]);
    }
  }, []);

  const handleChange = (key: keyof GeneralConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleCompanyInfoChange = (key: keyof GeneralConfig['companyInfo'], value: string) => {
    onChange({
      ...config,
      companyInfo: {
        ...config.companyInfo,
        [key]: value,
      },
    });
  };

  const handleBackupSettingsChange = (key: keyof GeneralConfig['backupSettings'], value: any) => {
    onChange({
      ...config,
      backupSettings: {
        ...config.backupSettings,
        [key]: value,
      },
    });
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
                className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="EQMS - Quality Management System"
              />
              <p className="text-xs text-slate-500 mt-1">
                Displayed in browser tab title
              </p>
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
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="admin@example.com"
            />
            <p className="text-xs text-slate-500 mt-1">
              Primary contact for system notifications
            </p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={config.companyInfo.companyName}
              onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="ACME Corporation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tax ID / Registration Number
            </label>
            <input
              type="text"
              value={config.companyInfo.taxId}
              onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="TAX-123456789"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Address
            </label>
            <input
              type="text"
              value={config.companyInfo.companyAddress}
              onChange={(e) => handleCompanyInfoChange('companyAddress', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="123 Business Street, Tech City, TC 12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Phone
            </label>
            <input
              type="tel"
              value={config.companyInfo.companyPhone}
              onChange={(e) => handleCompanyInfoChange('companyPhone', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="+1-555-0123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Website
            </label>
            <input
              type="url"
              value={config.companyInfo.companyWebsite}
              onChange={(e) => handleCompanyInfoChange('companyWebsite', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://www.company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Industry
            </label>
            <input
              type="text"
              value={config.companyInfo.industry}
              onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Pharmaceutical Manufacturing"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Regulatory Body / Standards
            </label>
            <input
              type="text"
              value={config.companyInfo.regulatoryBody}
              onChange={(e) => handleCompanyInfoChange('regulatoryBody', e.target.value)}
              className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="FDA, ISO 9001:2015"
            />
            <p className="text-xs text-slate-500 mt-1">
              e.g., FDA, ISO 9001, ISO 13485, GMP, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Backup & Data Management */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Backup & Data Management
        </h3>
        <div className="space-y-4">
          <Checkbox
            id="enableAutoBackup"
            label="Enable Automatic Backup"
            checked={config.backupSettings.enableAutoBackup}
            onChange={(checked) => handleBackupSettingsChange('enableAutoBackup', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            Automatically backup system data at scheduled intervals
          </p>
          
          {config.backupSettings.enableAutoBackup && (
            <div className="ml-7 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Backup Frequency"
                  value={config.backupSettings.backupFrequency}
                  onChange={(val) => handleBackupSettingsChange('backupFrequency', val as 'daily' | 'weekly' | 'monthly')}
                  options={[
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' },
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    value={config.backupSettings.backupTime}
                    onChange={(e) => handleBackupSettingsChange('backupTime', e.target.value)}
                    className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    System local time (24-hour format)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Retention Period (Days)
                  </label>
                  <input
                    type="number"
                    value={config.backupSettings.retentionDays}
                    onChange={(e) => handleBackupSettingsChange('retentionDays', parseInt(e.target.value))}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    min={7}
                    max={365}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Keep backups for {config.backupSettings.retentionDays} days
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Backup Location"
                  value={config.backupSettings.backupLocation}
                  onChange={(val) => handleBackupSettingsChange('backupLocation', val as 'local' | 'cloud' | 's3')}
                  options={[
                    { label: 'Local Server', value: 'local' },
                    { label: 'Cloud Storage', value: 'cloud' },
                    { label: 'Amazon S3', value: 's3' },
                  ]}
                />
                <div className="flex items-center pt-8">
                  <Checkbox
                    id="notifyOnBackupFailure"
                    label="Notify on Backup Failure"
                    checked={config.backupSettings.notifyOnBackupFailure}
                    onChange={(checked) => handleBackupSettingsChange('notifyOnBackupFailure', checked)}
                  />
                </div>
              </div>
            </div>
          )}
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
            options={timeZones}
            enableSearch
            placeholder="Select time zone..."
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
