import React, { useState } from "react";
import { Package, Server, Database, Globe, ToggleLeft, Shield, Download, RefreshCw, Copy, ChevronDown, ChevronUp, Calendar, Tag, CheckCircle2, Wrench, Bug } from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { useToast } from "@/components/ui/toast/Toast";
import { cn } from "@/components/ui/utils";
import type { TabType } from "./types";
import { MOCK_SYSTEM_INFO, MOCK_CHANGELOG } from "./mockData";
import { ApplicationTab } from "./tabs/ApplicationTab";
import { ServerTab } from "./tabs/ServerTab";
import { DatabaseTab } from "./tabs/DatabaseTab";
import { ApiTab } from "./tabs/ApiTab";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { LicenseTab } from "./tabs/LicenseTab";

const TABS = [
  {
    id: "application" as TabType,
    label: "Application",
    icon: Package,
    description: "Application version, build information, and environment details",
  },
  {
    id: "server" as TabType,
    label: "Server",
    icon: Server,
    description: "Server configuration, system resources, and runtime environment",
  },
  {
    id: "database" as TabType,
    label: "Database",
    icon: Database,
    description: "Database connection details, version, and backup information",
  },
  {
    id: "api" as TabType,
    label: "API",
    icon: Globe,
    description: "API endpoints, version, health status, and performance metrics",
  },
  {
    id: "features" as TabType,
    label: "Features",
    icon: ToggleLeft,
    description: "Enabled and disabled feature flags for the application",
  },
  {
    id: "license" as TabType,
    label: "License",
    icon: Shield,
    description: "License details, expiration date, and user allocation",
  },
];

export const SystemInformationView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("application");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set([MOCK_CHANGELOG[0]?.version]));

  const currentTab = TABS.find(tab => tab.id === activeTab);

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(version)) {
        newSet.delete(version);
      } else {
        newSet.add(version);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleExport = () => {
    // TODO: Implement actual export functionality
    const dataStr = JSON.stringify(MOCK_SYSTEM_INFO, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `system-info-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      message: "System information exported successfully",
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        type: "success",
        message: "System information refreshed",
        duration: 2500,
      });
    }, 800);
  };

  const handleCopyAll = async () => {
    try {
      const textData = `
System Information Report
Generated: ${new Date().toLocaleString()}

APPLICATION
- Name: ${MOCK_SYSTEM_INFO.application.name}
- Version: ${MOCK_SYSTEM_INFO.application.version}
- Environment: ${MOCK_SYSTEM_INFO.application.environment}
- Build: ${MOCK_SYSTEM_INFO.application.buildNumber}

SERVER
- OS: ${MOCK_SYSTEM_INFO.server.os}
- Node: ${MOCK_SYSTEM_INFO.server.nodeVersion}
- Memory: ${MOCK_SYSTEM_INFO.server.memoryUsed} / ${MOCK_SYSTEM_INFO.server.memoryTotal} (${MOCK_SYSTEM_INFO.server.memoryUsagePercent}%)
- Uptime: ${MOCK_SYSTEM_INFO.server.uptime}

DATABASE
- Type: ${MOCK_SYSTEM_INFO.database.type} ${MOCK_SYSTEM_INFO.database.version}
- Status: ${MOCK_SYSTEM_INFO.database.connectionStatus}
- Database: ${MOCK_SYSTEM_INFO.database.database}

API
- URL: ${MOCK_SYSTEM_INFO.api.baseUrl}
- Status: ${MOCK_SYSTEM_INFO.api.status}
- Response Time: ${MOCK_SYSTEM_INFO.api.responseTime}

LICENSE
- Type: ${MOCK_SYSTEM_INFO.license.licenseType}
- Company: ${MOCK_SYSTEM_INFO.license.companyName}
- Expiry: ${MOCK_SYSTEM_INFO.license.expiryDate} (${MOCK_SYSTEM_INFO.license.daysUntilExpiry} days)
- Users: ${MOCK_SYSTEM_INFO.license.activeUsers} / ${MOCK_SYSTEM_INFO.license.maxUsers}
      `.trim();

      await navigator.clipboard.writeText(textData);
      showToast({
        type: "success",
        message: "System information copied to clipboard",
        duration: 2500,
      });
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to copy system information",
        duration: 2500,
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "application":
        return <ApplicationTab data={MOCK_SYSTEM_INFO.application} />;
      case "server":
        return <ServerTab data={MOCK_SYSTEM_INFO.server} />;
      case "database":
        return <DatabaseTab data={MOCK_SYSTEM_INFO.database} />;
      case "api":
        return <ApiTab data={MOCK_SYSTEM_INFO.api} />;
      case "features":
        return <FeaturesTab features={MOCK_SYSTEM_INFO.features} />;
      case "license":
        return <LicenseTab data={MOCK_SYSTEM_INFO.license} />;
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
            System Information
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">System Information</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

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

      {/* Changelog Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">System Changelog</h2>
          <p className="text-sm text-slate-500 mt-1">
            Version history and release notes for system updates
          </p>
        </div>
        <div className="divide-y divide-slate-200">
          {MOCK_CHANGELOG.map((entry) => {
            const isExpanded = expandedVersions.has(entry.version);
            const hasFeatures = entry.changes.features && entry.changes.features.length > 0;
            const hasImprovements = entry.changes.improvements && entry.changes.improvements.length > 0;
            const hasBugFixes = entry.changes.bugFixes && entry.changes.bugFixes.length > 0;

            return (
              <div key={entry.version} className="transition-colors hover:bg-slate-50/50">
                <button
                  onClick={() => toggleVersion(entry.version)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-emerald-600" />
                      <span className="font-mono font-semibold text-slate-900">
                        v{entry.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(entry.releaseDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      {hasFeatures && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          {entry.changes.features!.length} new
                        </span>
                      )}
                      {hasImprovements && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <Wrench className="h-3 w-3" />
                          {entry.changes.improvements!.length} improved
                        </span>
                      )}
                      {hasBugFixes && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Bug className="h-3 w-3" />
                          {entry.changes.bugFixes!.length} fixed
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {hasFeatures && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          New Features
                        </h4>
                        <ul className="space-y-1.5 ml-6">
                          {entry.changes.features!.map((feature, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasImprovements && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-600" />
                          Improvements
                        </h4>
                        <ul className="space-y-1.5 ml-6">
                          {entry.changes.improvements!.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasBugFixes && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <Bug className="h-4 w-4 text-amber-600" />
                          Bug Fixes
                        </h4>
                        <ul className="space-y-1.5 ml-6">
                          {entry.changes.bugFixes!.map((fix, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-amber-600 mt-1">•</span>
                              <span>{fix}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
