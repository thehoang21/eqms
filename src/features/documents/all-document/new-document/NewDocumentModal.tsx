import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Files, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";

interface NewDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectSingle: () => void;
    onSelectBatch: () => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
    isOpen,
    onClose,
    onSelectSingle,
    onSelectBatch,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<"single" | "batch" | null>(null);

    const handleSelectSingle = () => {
        setIsLoading(true);
        setLoadingType("single");
        // Simulate loading delay for better UX
        setTimeout(() => {
            onSelectSingle();
            onClose();
            setIsLoading(false);
            setLoadingType(null);
        }, 500);
    };

    const handleSelectBatch = () => {
        setIsLoading(true);
        setLoadingType("batch");
        // Simulate loading delay for better UX
        setTimeout(() => {
            onSelectBatch();
            onClose();
            setIsLoading(false);
            setLoadingType(null);
        }, 500);
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[calc(100%-2rem)] max-w-lg md:max-w-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white rounded-lg md:rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-cyan-50">
                        <div className="flex-1 min-w-0 pr-2">
                            <h2 className="text-base md:text-xl font-bold text-slate-900 truncate">
                                Create New Document
                            </h2>
                            <p className="text-xs md:text-sm text-slate-600 mt-0.5 md:mt-1 hidden sm:block">
                                Choose how you want to create your document(s)
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors shrink-0 touch-manipulation"
                        >
                            <X className="h-4 w-4 md:h-5 md:w-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {/* Single Document Option */}
                            <button
                                onClick={handleSelectSingle}
                                disabled={isLoading}
                                className={cn(
                                    "group relative p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200",
                                    "text-left focus:outline-none focus:ring-2 focus:ring-emerald-500",
                                    "touch-manipulation active:scale-98",
                                    isLoading
                                        ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
                                        : "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50"
                                )}
                            >
                                <div className="flex flex-col items-start gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                        {isLoading && loadingType === "single" ? (
                                            <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-emerald-600 animate-spin" />
                                        ) : (
                                            <FileText className="h-6 w-6 md:h-8 md:w-8 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">
                                            Single Document
                                        </h3>
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-sm font-medium text-emerald-600">
                                    <span>Create Single Document</span>
                                    <svg className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Batch Documents Option */}
                            <button
                                onClick={handleSelectBatch}
                                disabled={isLoading}
                                className={cn(
                                    "group relative p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200",
                                    "text-left focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    "touch-manipulation active:scale-98",
                                    isLoading
                                        ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
                                        : "border-slate-200 hover:border-blue-500 hover:bg-blue-50/50"
                                )}
                            >
                                <div className="flex flex-col items-start gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        {isLoading && loadingType === "batch" ? (
                                            <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 animate-spin" />
                                        ) : (
                                            <Files className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">
                                            Batch Documents
                                        </h3>
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-sm font-medium text-blue-600">
                                    <span>Create Multiple Documents</span>
                                    <svg className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-lg">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-700">💡 Tip:</strong> Use <strong>Batch Documents</strong> when you need to create 
                                multiple related documents (parent - children) at the same time to save time and maintain relationships.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={isLoading}
                            className="touch-manipulation"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        window.document.body
    );
};
