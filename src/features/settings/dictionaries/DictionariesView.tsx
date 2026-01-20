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
  description: string;
}

// --- Tab Configuration ---
const DICTIONARIES: Dictionary[] = [
  {
    id: "document-types",
    label: "Document Types",
    icon: IconFileCode2,
    description: "Manage document type classifications with auto-numbering codes",
  },
  {
    id: "departments",
    label: "Departments",
    icon: Building2,
    description: "Organizational departments and divisions",
  },
  {
    id: "storage-locations",
    label: "Storage Locations",
    icon: MapPin,
    description: "Physical and digital storage locations for documents",
  },
  {
    id: "retention-policies",
    label: "Retention Policies",
    icon: Archive,
    description: "Document retention and archival policies",
  },
];

export const DictionariesView: React.FC = () => {
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryType>("document-types");

  // Get current dictionary config
  const currentDictConfig = DICTIONARIES.find((d) => d.id === selectedDictionary)!;

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
            <button className="hover:text-slate-700 transition-colors hidden sm:inline">Dashboard</button>
            <IconSmartHome className="h-4 w-4 sm:hidden" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Dictionaries</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {DICTIONARIES.map((dict) => {
                const Icon = dict.icon;
                const isSelected = selectedDictionary === dict.id;
                return (
                  <button
                    key={dict.id}
                    onClick={() => setSelectedDictionary(dict.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                      isSelected
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "text-emerald-600" : "text-slate-400"
                      )}
                    />
                    <span className="hidden md:inline">{dict.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-sm text-slate-600">{currentDictConfig.description}</p>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};
