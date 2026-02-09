import React from 'react';
import { SecurityConfig } from '../types';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';

interface SecurityTabProps {
  config: SecurityConfig;
  onChange: (config: SecurityConfig) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof SecurityConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Password Policies */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Password Policies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={config.passwordMinLength}
              onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              min={8}
            />
            <p className="text-xs text-slate-500 mt-1">
              Minimum: 8 characters
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              value={config.sessionTimeoutMinutes}
              onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Idle time before automatic logout
            </p>
          </div>
        </div>
      </div>

      {/* Password Requirements */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Password Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Checkbox
            id="requireUppercase"
            label="Require Uppercase Letters (A-Z)"
            checked={config.requireUppercase}
            onChange={(checked) => handleChange('requireUppercase', checked)}
          />
          <Checkbox
            id="requireLowercase"
            label="Require Lowercase Letters (a-z)"
            checked={config.requireLowercase}
            onChange={(checked) => handleChange('requireLowercase', checked)}
          />
          <Checkbox
            id="requireSpecialChars"
            label="Require Special Characters (@, #, $, etc.)"
            checked={config.requireSpecialChars}
            onChange={(checked) => handleChange('requireSpecialChars', checked)}
          />
          <Checkbox
            id="requireNumbers"
            label="Require Numbers (0-9)"
            checked={config.requireNumbers}
            onChange={(checked) => handleChange('requireNumbers', checked)}
          />
        </div>
      </div>

      {/* Password Expiry & History */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Password Expiry & History
        </h3>
        <div className="space-y-3">
          <Checkbox
            id="enablePasswordExpiry"
            label="Enable Password Expiration"
            checked={config.enablePasswordExpiry}
            onChange={(checked) => handleChange('enablePasswordExpiry', checked)}
          />
          <p className="text-xs text-slate-500 ml-7">
            Force users to change their password periodically
          </p>
          {config.enablePasswordExpiry && (
            <div className="ml-7 mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password Expiry Period (Days)
              </label>
              <input
                type="number"
                value={config.passwordExpiryDays}
                onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
                className="w-full md:w-64 h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                min={30}
                max={365}
              />
              <p className="text-xs text-slate-500 mt-1">
                Users must change password every {config.passwordExpiryDays} days
              </p>
            </div>
          )}
          
          <div className="pt-2">
            <Checkbox
              id="preventPasswordReuse"
              label="Prevent Password Reuse"
              checked={config.preventPasswordReuse}
              onChange={(checked) => handleChange('preventPasswordReuse', checked)}
            />
            <p className="text-xs text-slate-500 ml-7">
              Prevent users from reusing recent passwords
            </p>
            {config.preventPasswordReuse && (
              <div className="ml-7 mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password History Count
                </label>
                <input
                  type="number"
                  value={config.passwordHistoryCount}
                  onChange={(e) => handleChange('passwordHistoryCount', parseInt(e.target.value))}
                  className="w-full md:w-64 h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  min={3}
                  max={24}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Remember last {config.passwordHistoryCount} passwords and prevent reuse
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session & Account Security */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Session & Account Security
        </h3>
        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div>
            <Checkbox
              id="enable2FA"
              label="Enforce Two-Factor Authentication (2FA)"
              checked={config.enable2FA}
              onChange={(checked) => handleChange('enable2FA', checked)}
            />
            <p className="text-xs text-slate-500 ml-7">
              All users must set up 2FA using an authenticator app (Google Authenticator, Authy, etc.)
            </p>
          </div>

          {/* Auto Logout */}
          <div className="pt-2">
            <Checkbox
              id="enableAutoLogout"
              label="Enable Automatic Logout"
              checked={config.enableAutoLogout}
              onChange={(checked) => handleChange('enableAutoLogout', checked)}
            />
            <p className="text-xs text-slate-500 ml-7">
              Automatically log out users after a period of inactivity
            </p>
            {config.enableAutoLogout && (
              <div className="ml-7 mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Auto Logout After (Minutes)
                </label>
                <input
                  type="number"
                  value={config.autoLogoutMinutes}
                  onChange={(e) => handleChange('autoLogoutMinutes', parseInt(e.target.value))}
                  className="w-full md:w-64 h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  min={1}
                  max={120}
                />
                <p className="text-xs text-slate-500 mt-1">
                  System will automatically logout after {config.autoLogoutMinutes} minutes of inactivity
                </p>
              </div>
            )}
          </div>

          {/* Account Lockout */}
          <div className="pt-2">
            <Checkbox
              id="enableAccountLockout"
              label="Enable Account Lockout"
              checked={config.enableAccountLockout}
              onChange={(checked) => handleChange('enableAccountLockout', checked)}
            />
            <p className="text-xs text-slate-500 ml-7">
              Lock user accounts after multiple failed login attempts
            </p>
            {config.enableAccountLockout && (
              <div className="ml-7 mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  value={config.maxLoginAttempts}
                  onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full md:w-64 h-11 px-3.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  min={3}
                  max={10}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Account will be locked after {config.maxLoginAttempts} consecutive failed login attempts. Only administrators can unlock the account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
