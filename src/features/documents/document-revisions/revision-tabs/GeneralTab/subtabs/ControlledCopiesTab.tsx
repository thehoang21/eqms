import React from "react";
import { Copy } from "lucide-react";

export const ControlledCopiesTab: React.FC = () => {
    return (
        <div className="space-y-3 md:space-y-4">
            {/* Info Message */}
            <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs md:text-sm text-blue-800">
                    Controlled copies will be managed automatically once the document is approved and becomes effective.
                </p>
            </div>

            {/* Empty State */}
            <div className="text-center py-6 md:py-8 text-slate-500">
                <Copy className="h-6 w-6 md:h-8 md:w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs md:text-sm">No controlled copies yet</p>
                <p className="text-xs mt-1">Controlled copies will be created after document approval</p>
            </div>
        </div>
    );
};
