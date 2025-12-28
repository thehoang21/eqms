import React from "react";
import { GitBranch } from "lucide-react";

export const WorkflowDiagramTab: React.FC = () => {
  return (
    <div className="py-12 text-center">
      <GitBranch className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">
        Workflow diagram content will be displayed here
      </p>
    </div>
  );
};
