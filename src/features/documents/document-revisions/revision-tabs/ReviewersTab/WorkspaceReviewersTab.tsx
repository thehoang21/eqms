import React from "react";
import { Users } from "lucide-react";

interface Reviewer {
    id: string;
    name: string;
    username?: string;
    role: string;
    email: string;
    department: string;
    order: number;
    signedOn?: string;
}

interface WorkspaceReviewersTabProps {
    reviewers: Reviewer[];
    onReviewersChange?: (reviewers: Reviewer[]) => void;
    reviewFlowType?: "sequential" | "parallel";
    onReviewFlowTypeChange?: (type: "sequential" | "parallel") => void;
}

export const WorkspaceReviewersTab: React.FC<WorkspaceReviewersTabProps> = ({
    reviewers,
}) => {
    return (
        <div className="space-y-3">
            {reviewers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Users className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-500">No reviewers assigned</p>
                    <p className="text-xs text-slate-400 mt-1">Reviewers will appear here once added</p>
                </div>
            ) : (
                reviewers.map((reviewer, index) => (
                    <div
                        key={reviewer.id}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Reviewer {index + 1} — Name
                            </label>
                            <input
                                type="text"
                                value={reviewer.name}
                                readOnly
                                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none cursor-default"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">
                                Signed On
                            </label>
                            <input
                                type="text"
                                value={reviewer.signedOn || "—"}
                                readOnly
                                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-400 focus:outline-none cursor-default"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

