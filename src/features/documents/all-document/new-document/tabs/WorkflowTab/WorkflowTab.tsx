import React from "react";
import { GitBranch } from "lucide-react";

export const WorkflowTab: React.FC = () => {
    return (
        <div className="py-12 text-center text-slate-500">
            <GitBranch className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">Workflow Diagram</p>
            <p className="text-xs mt-1">Document approval workflow visualization will be shown here.</p>
        </div>
    );
};
