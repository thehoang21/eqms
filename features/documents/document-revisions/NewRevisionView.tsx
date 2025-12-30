import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, X, Send, Home } from "lucide-react";
import { Button } from "../../../components/ui/button/Button";

export const NewRevisionView: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/documents/revisions/all");
    };

    const handleSave = () => {
        // TODO: Implement save logic
        console.log("Save new revision");
        navigate("/documents/revisions/all");
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                            New Revision
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <button className="hover:text-slate-700 transition-colors hidden sm:inline">Dashboard</button>
                            <Home className="h-4 w-4 sm:hidden" />
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={handleBack}
                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                            >
                                All Revisions
                            </button>
                            <span className="sm:hidden">...</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">New Revision</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" onClick={handleBack}>
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} className="shadow-sm">
                            Save Draft
                        </Button>
                        {/* button submit next step */}
                        <Button 
                            size="sm" 
                            onClick={handleSave} 
                            className="flex items-center gap-2 !bg-blue-600 hover:!bg-blue-700 text-white shadow-sm"
                        >
                            <Send className="h-4 w-4" />
                            Submit Revision
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8">
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                        New Revision form will be implemented here
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                        Form fields and validation coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};
