import React, { useState } from 'react';
import { FileBarChart, ShieldAlert, History, Clock } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { IconLayoutDashboard } from '@tabler/icons-react';
import type { TabView } from './types';
import { useTemplatesTab } from './components/TemplatesTab';
import { useHistoryTab } from './components/HistoryTab';
import { useScheduledTab } from './components/ScheduledTab';

export const ReportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('templates');

  // Each tab manages its own state via custom hooks
  const templates = useTemplatesTab('templates');
  const compliance = useTemplatesTab('compliance');
  const history = useHistoryTab();
  const scheduled = useScheduledTab();

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Reports & Analytics</span>
          </div>
        </div>
      </div>

      {/* Tabs + Filters Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'templates' as TabView, label: 'Report Templates', icon: FileBarChart },
              { id: 'compliance' as TabView, label: 'Compliance Reports', icon: ShieldAlert },
              { id: 'history' as TabView, label: 'Report History', icon: History },
              { id: 'scheduled' as TabView, label: 'Scheduled Reports', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-r border-slate-200 last:border-r-0',
                    isActive
                      ? 'border-b-emerald-600 text-emerald-700 bg-emerald-50/50'
                      : 'border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Filter Section */}
        <div className="animate-in fade-in duration-200">
          {activeTab === 'templates' && templates.filterElement}
          {activeTab === 'compliance' && compliance.filterElement}
          {activeTab === 'history' && history.filterElement}
          {activeTab === 'scheduled' && scheduled.filterElement}
        </div>
      </div>

      {/* Tab Content Section */}
      {activeTab === 'templates' && templates.contentElement}
      {activeTab === 'compliance' && compliance.contentElement}
      {activeTab === 'history' && history.contentElement}
      {activeTab === 'scheduled' && scheduled.contentElement}
    </div>
  );
};
