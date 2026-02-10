import React, { useState } from 'react';
import { Save, RotateCcw, Settings, Shield, FileText, Bell } from 'lucide-react';
import { IconSmartHome } from '@tabler/icons-react';
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { useToast } from '@/components/ui/toast/Toast';
import { AlertModal } from '@/components/ui/modal/AlertModal';
import { SystemConfig } from './types';
import { MOCK_SYSTEM_CONFIG } from './mockData';
import { GeneralTab } from './tabs/GeneralTab';
import { SecurityTab } from './tabs/SecurityTab';
import { DocumentTab } from './tabs/DocumentTab';
import { NotificationTab } from './tabs/NotificationTab';

type TabId = 'general' | 'security' | 'document' | 'notification';

const TABS = [
  {
    id: 'general' as TabId,
    label: 'General',
    icon: Settings,
    description: 'Basic system settings, localization, and maintenance mode',
  },
  {
    id: 'security' as TabId,
    label: 'Security',
    icon: Shield,
    description: 'Password policies, session management, and authentication settings',
  },
  {
    id: 'document' as TabId,
    label: 'Documents',
    icon: FileText,
    description: 'Document retention, watermarking, and download policies',
  },
  {
    id: 'notification' as TabId,
    label: 'Notifications',
    icon: Bell,
    description: 'Email and in-app notification channels and triggers',
  },
];

export const ConfigurationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [config, setConfig] = useState<SystemConfig>(MOCK_SYSTEM_CONFIG);
  const [isDirty, setIsDirty] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const { showToast } = useToast();

  const handleConfigChange = <K extends keyof SystemConfig>(section: K, value: SystemConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      [section]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // In real app, API call here
    console.log('Saving config:', config);
    setIsDirty(false);
    showToast({
      type: "success",
      title: "Changes saved",
      message: "System configuration has been updated successfully.",
    });
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    setConfig(MOCK_SYSTEM_CONFIG);
    setIsDirty(false);
    setShowResetModal(false);
    showToast({
      type: "info",
      title: "Changes discarded",
      message: "Configuration reset to last saved state.",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab config={config.general} onChange={(val) => handleConfigChange('general', val)} />;
      case 'security':
        return <SecurityTab config={config.security} onChange={(val) => handleConfigChange('security', val)} />;
      case 'document':
        return <DocumentTab config={config.documents} onChange={(val) => handleConfigChange('documents', val)} />;
      case 'notification':
        return <NotificationTab config={config.notifications} onChange={(val) => handleConfigChange('notifications', val)} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            System Configuration
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Configuration</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleResetClick} 
            disabled={!isDirty}
            size="sm"
            className="gap-2"
          >
            Reset
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave} 
            disabled={!isDirty} 
            size="sm"
            className="gap-2"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AlertModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetConfirm}
        type="warning"
        title="Discard unsaved changes?"
        description={
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              All unsaved changes will be lost and the configuration will be reset to the last saved state.
            </p>
            <p className="text-sm font-medium text-amber-700">
              This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Discard Changes"
        cancelText="Keep Editing"
      />

      {/* Tabbed Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-r border-slate-200 last:border-r-0",
                    isActive
                      ? "border-b-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className={cn("animate-in fade-in duration-200")}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
