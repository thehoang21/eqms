import React from "react";
import { OutlineItem } from "../types";

interface OutlineSidebarProps {
    isOpen: boolean;
    outlines: OutlineItem[];
    onGoToPage: (page: number) => void;
}

export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
    isOpen,
    outlines,
    onGoToPage
}) => {
    if (!isOpen) return null;

    return (
        <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Table of Contents</h3>
                <div className="space-y-1">
                    {outlines.map((outline) => (
                        <button
                            key={outline.id}
                            onClick={() => onGoToPage(outline.page)}
                            className="w-full text-left px-3 py-2 rounded text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between group"
                        >
                            <span className={outline.title.startsWith("4.") ? "pl-4 text-slate-600" : "text-slate-700"}>
                                {outline.title}
                            </span>
                            <span className="text-xs text-slate-400 group-hover:text-emerald-600">
                                {outline.page}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
