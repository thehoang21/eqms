import React, { useState } from 'react';
import { NotificationConfig } from '../types';
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Eye, EyeOff } from 'lucide-react';

interface NotificationTabProps {
  config: NotificationConfig;
  onChange: (config: NotificationConfig) => void;
}

export const NotificationTab: React.FC<NotificationTabProps> = ({ config, onChange }) => {
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [showWhatsAppToken, setShowWhatsAppToken] = useState(false);

  const handleChange = (key: keyof NotificationConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleEmailConfigChange = (key: keyof NotificationConfig['emailConfig'], value: any) => {
    onChange({
      ...config,
      emailConfig: {
        ...config.emailConfig,
        [key]: value,
      },
    });
  };

  const handleTelegramConfigChange = (key: keyof NotificationConfig['telegramConfig'], value: any) => {
    onChange({
      ...config,
      telegramConfig: {
        ...config.telegramConfig,
        [key]: value,
      },
    });
  };

  const handleWhatsAppConfigChange = (key: keyof NotificationConfig['whatsappConfig'], value: any) => {
    onChange({
      ...config,
      whatsappConfig: {
        ...config.whatsappConfig,
        [key]: value,
      },
    });
  };

  const handleTriggerChange = (trigger: keyof NotificationConfig['triggers'], checked: boolean) => {
    onChange({
      ...config,
      triggers: {
        ...config.triggers,
        [trigger]: checked,
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notification Channels */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Notification Channels
        </h3>
        <div className="space-y-3">
          <Checkbox
            id="enableInAppNotifications"
            label="Enable In-App Notifications"
            checked={config.enableInAppNotifications}
            onChange={(checked) => handleChange('enableInAppNotifications', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            Display notifications within the application interface
          </p>
        </div>
      </div>

      {/* Email Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Email Notifications (SMTP)
        </h3>
        <div className="space-y-4">
          <Checkbox
            id="enableEmailNotifications"
            label="Enable Email Notifications"
            checked={config.enableEmailNotifications}
            onChange={(checked) => handleChange('enableEmailNotifications', checked)}
          />
          
          {config.enableEmailNotifications && (
            <div className="ml-7 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={config.emailConfig.smtpHost}
                    onChange={(e) => handleEmailConfigChange('smtpHost', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={config.emailConfig.smtpPort}
                    onChange={(e) => handleEmailConfigChange('smtpPort', parseInt(e.target.value))}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={config.emailConfig.smtpUsername}
                    onChange={(e) => handleEmailConfigChange('smtpUsername', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="username@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    SMTP Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? "text" : "password"}
                      value={config.emailConfig.smtpPassword}
                      onChange={(e) => handleEmailConfigChange('smtpPassword', e.target.value)}
                      className="w-full h-10 px-3.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showSmtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={config.emailConfig.senderEmail}
                    onChange={(e) => handleEmailConfigChange('senderEmail', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="noreply@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={config.emailConfig.senderName}
                    onChange={(e) => handleEmailConfigChange('senderName', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="EQMS Notification"
                  />
                </div>
              </div>
              <Checkbox
                id="useSSL"
                label="Use SSL/TLS Encryption"
                checked={config.emailConfig.useSSL}
                onChange={(checked) => handleEmailConfigChange('useSSL', checked)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Telegram Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Telegram Notifications
        </h3>
        <div className="space-y-4">
          <Checkbox
            id="enableTelegramNotifications"
            label="Enable Telegram Notifications"
            checked={config.enableTelegramNotifications}
            onChange={(checked) => handleChange('enableTelegramNotifications', checked)}
          />
          
          {config.enableTelegramNotifications && (
            <div className="ml-7 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bot Token
                  </label>
                  <div className="relative">
                    <input
                      type={showTelegramToken ? "text" : "password"}
                      value={config.telegramConfig.botToken}
                      onChange={(e) => handleTelegramConfigChange('botToken', e.target.value)}
                      className="w-full h-10 px-3.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                      placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTelegramToken(!showTelegramToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showTelegramToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Get token from @BotFather on Telegram
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Chat ID / Group ID
                  </label>
                  <input
                    type="text"
                    value={config.telegramConfig.chatId}
                    onChange={(e) => handleTelegramConfigChange('chatId', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    placeholder="-1001234567890"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use @userinfobot to get your Chat ID
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          WhatsApp Notifications (Business API)
        </h3>
        <div className="space-y-4">
          <Checkbox
            id="enableWhatsAppNotifications"
            label="Enable WhatsApp Notifications"
            checked={config.enableWhatsAppNotifications}
            onChange={(checked) => handleChange('enableWhatsAppNotifications', checked)}
          />
          
          {config.enableWhatsAppNotifications && (
            <div className="ml-7 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={config.whatsappConfig.phoneNumberId}
                    onChange={(e) => handleWhatsAppConfigChange('phoneNumberId', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    placeholder="123456789012345"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    From Meta Business Manager
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Business Account ID
                  </label>
                  <input
                    type="text"
                    value={config.whatsappConfig.businessAccountId}
                    onChange={(e) => handleWhatsAppConfigChange('businessAccountId', e.target.value)}
                    className="w-full h-10 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    placeholder="987654321098765"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    WhatsApp Business Account ID
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Access Token
                  </label>
                  <div className="relative">
                    <input
                      type={showWhatsAppToken ? "text" : "password"}
                      value={config.whatsappConfig.accessToken}
                      onChange={(e) => handleWhatsAppConfigChange('accessToken', e.target.value)}
                      className="w-full h-10 px-3.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                      placeholder="EAAxxxxxxxxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showWhatsAppToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Permanent token from Meta Business Manager
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digest Settings */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Email Digest Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Email Digest Frequency"
            value={config.emailDigestFrequency}
            onChange={(val) => handleChange('emailDigestFrequency', val)}
            options={[
              { label: 'Instant (Send immediately)', value: 'instant' },
              { label: 'Daily Digest', value: 'daily' },
              { label: 'Weekly Summary', value: 'weekly' },
            ]}
            disabled={!config.enableEmailNotifications}
          />
        </div>
        {!config.enableEmailNotifications && (
          <p className="text-xs text-amber-600 mt-2">
            Enable email notifications to configure digest settings
          </p>
        )}
      </div>

      {/* Notification Triggers */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Notification Triggers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Checkbox
              id="trigger-approval"
              label="Document Approval Requests"
              checked={config.triggers.documentApproval}
              onChange={(checked) => handleTriggerChange('documentApproval', checked)}
            />
            <p className="text-xs text-slate-500 ml-7 mt-1">
              When a document requires your approval
            </p>
          </div>
          <div>
            <Checkbox
              id="trigger-tasks"
              label="Task Assignments"
              checked={config.triggers.taskAssignment}
              onChange={(checked) => handleTriggerChange('taskAssignment', checked)}
            />
            <p className="text-xs text-slate-500 ml-7 mt-1">
              When a task is assigned to you
            </p>
          </div>
          <div>
            <Checkbox
              id="trigger-alerts"
              label="System Alerts"
              checked={config.triggers.systemAlerts}
              onChange={(checked) => handleTriggerChange('systemAlerts', checked)}
            />
            <p className="text-xs text-slate-500 ml-7 mt-1">
              Critical system messages and updates
            </p>
          </div>
          <div>
            <Checkbox
              id="trigger-capa"
              label="CAPA & Deviation Due Dates"
              checked={config.triggers.capaDue}
              onChange={(checked) => handleTriggerChange('capaDue', checked)}
            />
            <p className="text-xs text-slate-500 ml-7 mt-1">
              Reminders for upcoming due dates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
