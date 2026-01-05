import React from "react";
import { History } from "lucide-react";

export const AuditTab: React.FC = () => {
    return (
        <div className="py-12 text-center text-slate-500">
            <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">Audit Trail</p>
            <p className="text-xs mt-1">Document change history will appear here.</p>
        </div>
    );
};
