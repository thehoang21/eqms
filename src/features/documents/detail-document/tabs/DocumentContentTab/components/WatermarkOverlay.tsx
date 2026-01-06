import React, { useState } from "react";
import { Info, X } from "lucide-react";

interface WatermarkOverlayProps {
    documentStatus: string;
    currentUser: string;
    documentNumber: string;
    documentVersion: string;
    userCanCopy: boolean;
}

// Format current date/time for watermark
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
    documentStatus,
    currentUser,
    documentNumber,
    documentVersion,
    userCanCopy
}) => {
    const showDraftWatermark = documentStatus === "Draft" || documentStatus === "Pending Review";
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    return (
        <>
            {/* Main Watermark */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="transform -rotate-45">
                    {showDraftWatermark ? (
                        <div className="text-8xl font-bold text-red-600 opacity-20 whitespace-nowrap">
                            {documentStatus === "Draft" ? "DRAFT" : "FOR REVIEW ONLY"}
                        </div>
                    ) : (
                        <div className="opacity-10">
                            <div className="text-6xl font-bold text-slate-800 whitespace-nowrap">
                                UNCONTROLLED COPY
                            </div>
                            <div className="text-2xl font-semibold text-slate-700 text-center mt-4">
                                FOR VIEWING ONLY
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Watermark Info - Button & Popover */}
            <div className="absolute bottom-4 left-4 z-10">
                <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-sm text-white rounded-lg text-xs font-medium transition-all shadow-lg hover:shadow-xl"
                    title="View document info"
                >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Document Info</span>
                </button>

                {/* Popover */}
                {isInfoOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setIsInfoOpen(false)}
                        />
                        
                        {/* Popover Content */}
                        <div className="absolute bottom-full left-0 mb-2 z-30 w-80 max-w-[calc(100vw-2rem)]">
                            <div className="bg-slate-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-emerald-400" />
                                        <span className="font-semibold text-sm">Document Information</span>
                                    </div>
                                    <button
                                        onClick={() => setIsInfoOpen(false)}
                                        className="p-1 hover:bg-slate-800 rounded transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                
                                {/* Content */}
                                <div className="px-4 py-3 text-xs space-y-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Viewed by:</span>
                                        <span className="text-white">{currentUser} (192.168.1.100)</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Date/Time:</span>
                                        <span className="text-white">{getCurrentDateTime()}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Document Number:</span>
                                        <span className="text-white">{documentNumber} v{documentVersion}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Purpose:</span>
                                        <span className="text-white">Online Viewing Only</span>
                                    </div>
                                    {!userCanCopy && (
                                        <div className="mt-3 pt-3 border-t border-slate-700">
                                            <div className="flex items-center gap-2 text-amber-300 bg-amber-400/10 px-3 py-2 rounded">
                                                <span>⚠</span>
                                                <span className="font-medium">Copy/Download Restricted</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
