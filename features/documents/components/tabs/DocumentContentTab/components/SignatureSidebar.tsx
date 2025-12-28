import React from "react";
import { Check, UserRoundPenIcon } from "lucide-react";
import { Signature } from "../types";

interface SignatureSidebarProps {
    isOpen: boolean;
    signatures: Signature[];
}

export const SignatureSidebar: React.FC<SignatureSidebarProps> = ({
    isOpen,
    signatures
}) => {
    if (!isOpen) return null;

    return (
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Electronic Signatures</h3>
                <div className="space-y-3">
                    {signatures.map((sig, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-semibold text-sm text-slate-900">{sig.name}</div>
                                    <div className="text-xs text-slate-600">{sig.role}</div>
                                </div>
                                <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="text-xs space-y-1 text-slate-600">
                                <div><span className="font-medium">Action:</span> {sig.action}</div>
                                <div><span className="font-medium">Date/Time:</span> {sig.timestamp}</div>
                                <div><span className="font-medium">Signature ID:</span> {sig.signatureId}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
