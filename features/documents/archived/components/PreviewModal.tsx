import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button/Button';
import { ArchivedDocument } from '../types';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: ArchivedDocument | null;
    onDownload: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    isOpen,
    onClose,
    document,
    onDownload
}) => {
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !document) return null;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{document.documentName}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">{document.code}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">Version {document.version}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={onDownload}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center gap-3 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <div className="text-sm text-red-900">
                            <span className="font-semibold">ARCHIVED DOCUMENT - DO NOT USE</span>
                            <span className="mx-2">•</span>
                            <span>This document is obsolete and for reference only</span>
                        </div>
                    </div>

                    {/* Preview Area with Watermark */}
                    <div className="flex-1 bg-slate-100 overflow-hidden relative">
                        {/* Watermark Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                            <div className="transform -rotate-45">
                                <div className="text-red-500/20 font-bold text-8xl whitespace-nowrap select-none">
                                    ARCHIVED - DO NOT USE
                                </div>
                            </div>
                        </div>

                        {/* Repeated Watermarks */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {[...Array(6)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute transform -rotate-45"
                                    style={{
                                        top: `${(i % 2) * 50 + 15}%`,
                                        left: `${Math.floor(i / 2) * 33}%`,
                                    }}
                                >
                                    <div className="text-red-500/15 font-bold text-4xl whitespace-nowrap select-none">
                                        OBSOLETE
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mock PDF Preview */}
                        <div className="h-full overflow-auto p-8">
                            <div className="bg-white shadow-lg rounded-lg p-12 max-w-4xl mx-auto relative">
                                <div className="prose prose-slate max-w-none">
                                    <h1 className="text-2xl font-bold text-slate-900 mb-4">{document.documentName}</h1>
                                    <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-200 pb-4 mb-6">
                                        <div>
                                            <span className="font-semibold text-slate-700">Document Code:</span>
                                            <span className="ml-2 text-slate-600">{document.code}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">Version:</span>
                                            <span className="ml-2 text-slate-600">{document.version}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">Effective Date:</span>
                                            <span className="ml-2 text-slate-600">{new Date(document.effectiveDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">Archived Date:</span>
                                            <span className="ml-2 text-slate-600">{new Date(document.archivedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        This is a preview of the archived document. The actual document content would be rendered here.
                                        In a production environment, this would display the PDF content using a library like PDF.js or similar.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed mt-4">
                                        The watermark overlay ensures that anyone viewing this archived document is clearly aware
                                        that it is obsolete and should not be used for current operations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};
