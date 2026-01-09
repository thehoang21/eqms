import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { ArchivedDocument } from '../types';
import { renderAsync } from "docx-preview";
import "../../detail-document/tabs/docx-preview.css";

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
    const docxContainerRef = useRef<HTMLDivElement>(null);
    const [mockFile, setMockFile] = useState<File | null>(null);

    // Load sample.docx for preview
    useEffect(() => {
        fetch("/src/assets/sample.docx")
            .then(res => res.blob())
            .then(blob => {
                const file = new window.File([blob], "sample.docx", { 
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                });
                setMockFile(file);
            })
            .catch(err => console.error("Error loading sample.docx:", err));
    }, []);

    // Render DOCX
    useEffect(() => {
        if (mockFile && docxContainerRef.current && isOpen) {
            docxContainerRef.current.innerHTML = "";
            renderAsync(mockFile, docxContainerRef.current, undefined, {
                breakPages: true,
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: false,
                renderHeaders: true,
                renderFooters: true,
            }).catch((error) => {
                console.error("Error rendering docx:", error);
            });
        }
    }, [mockFile, isOpen]);

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

                        {/* DOCX Viewer */}
                        <div className="h-full overflow-auto p-8">
                            <div className="max-w-4xl mx-auto">
                                <div
                                    ref={docxContainerRef}
                                    className="docx-preview-container bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};
