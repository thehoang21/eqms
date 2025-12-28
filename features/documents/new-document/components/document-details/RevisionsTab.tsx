import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, User } from "lucide-react";
import { Revision } from "./types";

interface RevisionsTabProps {
    onCountChange?: (count: number) => void;
}

export const RevisionsTab: React.FC<RevisionsTabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: revisions } = useQuery('revisions', fetchRevisions);
    const [revisions, setRevisions] = useState<Revision[]>([
        {
            id: "1",
            version: "1.0",
            date: "2024-01-15",
            author: "John Doe",
            changes: "Initial document creation",
            status: "Approved"
        },
        {
            id: "2",
            version: "1.1",
            date: "2024-02-20",
            author: "Jane Smith",
            changes: "Updated section 3.2 with new requirements",
            status: "Approved"
        },
        {
            id: "3",
            version: "2.0",
            date: "2024-03-10",
            author: "Mike Johnson",
            changes: "Major revision - restructured entire document",
            status: "Draft"
        }
    ]);

    // Update counter when revisions change
    useEffect(() => {
        onCountChange?.(revisions.length);
    }, [revisions.length, onCountChange]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Revision History</h3>
                <span className="text-xs text-slate-500">{revisions.length} revision(s)</span>
            </div>

            <div className="space-y-3">
                {revisions.map((revision) => (
                    <div key={revision.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-slate-900">Version {revision.version}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        revision.status === "Approved" 
                                            ? "bg-emerald-100 text-emerald-700" 
                                            : "bg-amber-100 text-amber-700"
                                    }`}>
                                        {revision.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 mb-3">{revision.changes}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        <span>{revision.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{revision.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="ml-4 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
