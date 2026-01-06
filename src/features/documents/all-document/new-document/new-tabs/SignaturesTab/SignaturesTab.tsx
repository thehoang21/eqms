import React from "react";
import { FileSignature } from "lucide-react";

export const SignaturesTab: React.FC = () => {
    return (
        <div className="py-12 text-center text-slate-500">
            <FileSignature className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">Electronic Signatures</p>
            <p className="text-xs mt-1">Document signature workflow will be displayed here.</p>
        </div>
    );
};
