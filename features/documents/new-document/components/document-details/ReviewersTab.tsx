import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import { Reviewer } from "./types";

interface ReviewersTabProps {
    onCountChange?: (count: number) => void;
}

export const ReviewersTab: React.FC<ReviewersTabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: reviewers } = useQuery('reviewers', fetchReviewers);
    const [reviewers, setReviewers] = useState<Reviewer[]>([
        {
            id: "1",
            name: "Sarah Wilson",
            department: "Quality Assurance",
            email: "sarah.wilson@company.com",
            assignedDate: "2024-03-15",
            status: "Pending"
        },
        {
            id: "2",
            name: "David Chen",
            department: "Regulatory Affairs",
            email: "david.chen@company.com",
            assignedDate: "2024-03-15",
            status: "Reviewed"
        }
    ]);

    useEffect(() => {
        onCountChange?.(reviewers.length);
    }, [reviewers.length, onCountChange]);

    const addReviewer = () => {
        const newReviewer: Reviewer = {
            id: Date.now().toString(),
            name: "",
            email: "",
            department: ""
        };
        setReviewers([...reviewers, newReviewer]);
    };

    const removeReviewer = (id: string) => {
        setReviewers(reviewers.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Document Reviewers</h3>
                <button
                    onClick={addReviewer}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Add Reviewer
                </button>
            </div>

            {reviewers.length > 0 ? (
                <div className="space-y-3">
                    {reviewers.map((reviewer) => (
                        <div key={reviewer.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Users className="h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Reviewer name"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                            <button
                                onClick={() => removeReviewer(reviewer.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No Reviewers Added</p>
                    <p className="text-xs text-slate-500 mt-1">Add reviewers who will review this document</p>
                </div>
            )}
        </div>
    );
};
