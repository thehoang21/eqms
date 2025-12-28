import React, { useState } from "react";
import { FileText, Users, CheckCircle, Book, Copy, Link2 } from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { TabType } from "./types";
import { RevisionsTab } from "./RevisionsTab";
import { ReviewersTab } from "./ReviewersTab";
import { ApproversTab, KnowledgesTab, ControlledCopiesTab, RelatedDocumentsTab } from "./OtherTabs";

export const DocumentDetailsCard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("revisions");
    const [counters, setCounters] = useState({
        revisions: 0,
        reviewers: 0,
        approvers: 0,
        knowledges: 0,
        copies: 0,
        related: 0
    });

    const updateCounter = (tab: TabType, count: number) => {
        setCounters(prev => ({ ...prev, [tab]: count }));
    };

    const tabs = [
        { id: "revisions" as TabType, label: "Document Revisions" },
        { id: "reviewers" as TabType, label: "Reviewers" },
        { id: "approvers" as TabType, label: "Approvers" },
        { id: "knowledges" as TabType, label: "Document Knowledges" },
        { id: "copies" as TabType, label: "Controlled Copies" },
        { id: "related" as TabType, label: "Related Documents" },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 bg-slate-50/50">
                <div className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                        const count = counters[tab.id];
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                    activeTab === tab.id
                                        ? "border-emerald-500 text-emerald-600 bg-white"
                                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                                )}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className={cn(
                                        "py-0.5 text-xs rounded-full",
                                        activeTab === tab.id
                                            ? "text-emerald-700"
                                            : "text-slate-600"
                                    )}>
                                        ({count})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                <div className={activeTab === "revisions" ? "" : "hidden"}>
                    <RevisionsTab onCountChange={(count) => updateCounter("revisions", count)} />
                </div>
                <div className={activeTab === "reviewers" ? "" : "hidden"}>
                    <ReviewersTab onCountChange={(count) => updateCounter("reviewers", count)} />
                </div>
                <div className={activeTab === "approvers" ? "" : "hidden"}>
                    <ApproversTab onCountChange={(count) => updateCounter("approvers", count)} />
                </div>
                <div className={activeTab === "knowledges" ? "" : "hidden"}>
                    <KnowledgesTab onCountChange={(count) => updateCounter("knowledges", count)} />
                </div>
                <div className={activeTab === "copies" ? "" : "hidden"}>
                    <ControlledCopiesTab onCountChange={(count) => updateCounter("copies", count)} />
                </div>
                <div className={activeTab === "related" ? "" : "hidden"}>
                    <RelatedDocumentsTab onCountChange={(count) => updateCounter("related", count)} />
                </div>
            </div>
        </div>
    );
};

export type { TabType } from "./types";
