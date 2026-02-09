import React, { useState } from "react";
import {
  ChevronRight,
  Building2,
  MapPin,
  Archive,
  Home,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { IconFileCode2, IconSmartHome } from "@tabler/icons-react";
import { DocumentTypesTab } from "./tabs/DocumentTypesTab";
import { DepartmentsTab } from "./tabs/DepartmentsTab";
import { StorageLocationsTab } from "./tabs/StorageLocationsTab";
import { RetentionPoliciesTab } from "./tabs/RetentionPoliciesTab";

// --- Types ---
type DictionaryType = "document-types" | "departments" | "storage-locations" | "retention-policies";

interface Dictionary {
  id: DictionaryType;
  label: string;
  icon: React.ElementType;
}

// --- Tab Configuration ---
const DICTIONARIES: Dictionary[] = [
  {
    id: "document-types",
    label: "Document Types",
    icon: IconFileCode2,
  },
  {
    id: "departments",
    label: "Departments",
    icon: Building2,
  },
  {
    id: "storage-locations",
    label: "Storage Locations",
    icon: MapPin,
  },
  {
    id: "retention-policies",
    label: "Retention Policies",
    icon: Archive,
  },
];

export const DictionariesView: React.FC = () => {
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryType>("document-types");

  // Render active tab content
  const renderTabContent = () => {
    switch (selectedDictionary) {
      case "document-types":
        return <DocumentTypesTab />;
      case "departments":
        return <DepartmentsTab />;
      case "storage-locations":
        return <StorageLocationsTab />;
      case "retention-policies":
        return <RetentionPoliciesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">Dictionaries Management</h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Dictionaries</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tabs & Content Combined */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-slate-200">
            {DICTIONARIES.map((dict) => {
              const Icon = dict.icon;
              const isSelected = selectedDictionary === dict.id;
              return (
                <button
                  key={dict.id}
                  onClick={() => setSelectedDictionary(dict.id)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-2 border-b-2 border-r border-slate-200 last:border-r-0 whitespace-nowrap",
                    isSelected
                      ? "border-b-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{dict.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
