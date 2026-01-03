import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Star, Trash2, Eye, Check } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button/Button";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import pdfIcon from "@/assets/images/image-file/pdf.png";
import wordIcon from "@/assets/images/image-file/word.png";
import excelIcon from "@/assets/images/image-file/excel.png";

type ChildDocumentType = "Form" | "Annex" | "Attachment";

interface BatchDocument {
    id: string;
    fileName: string;
    file: File;
    isParent: boolean;
    childType?: ChildDocumentType; // Only for child documents
    uploadProgress?: number; // 0-100
    isUploading?: boolean;
    formData: {
        title: string;
        type: "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
        author: string;
        businessUnit: string;
        department: string;
        knowledgeBase: string;
        subType: string;
        periodicReviewCycle: number;
        periodicReviewNotification: number;
        language: string;
        description: string;
        isTemplate: boolean;
    };
}

interface BatchDocumentUploadProps {
    documents: BatchDocument[];
    onDocumentsChange: (documents: BatchDocument[] | ((prev: BatchDocument[]) => BatchDocument[])) => void;
}

export const BatchDocumentUpload: React.FC<BatchDocumentUploadProps> = ({
    documents,
    onDocumentsChange,
}) => {
    const [dragOver, setDragOver] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return pdfIcon;
        if (['doc', 'docx'].includes(extension || '')) return wordIcon;
        if (['xls', 'xlsx'].includes(extension || '')) return excelIcon;
        return null;
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        const newDocuments: BatchDocument[] = files.map((file, index) => ({
            id: `doc-${Date.now()}-${index}`,
            fileName: file.name,
            file: file,
            isParent: documents.length === 0 && index === 0, // First document is parent by default
            childType: documents.length === 0 && index === 0 ? undefined : "Form", // Default child type
            uploadProgress: 0,
            isUploading: true,
            formData: {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                type: "SOP",
                author: "",
                businessUnit: "",
                department: "",
                knowledgeBase: "",
                subType: "-- None --",
                periodicReviewCycle: 24,
                periodicReviewNotification: 14,
                language: "English",
                description: "",
                isTemplate: false,
            }
        }));

        onDocumentsChange([...documents, ...newDocuments]);

        // Simulate upload progress for each file
        newDocuments.forEach((doc, index) => {
            simulateUpload(doc.id, index * 300); // Stagger uploads
        });
    };

    const simulateUpload = (docId: string, delay: number = 0) => {
        setTimeout(() => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5; // Random increment between 5-20
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Mark as complete after a short delay
                    setTimeout(() => {
                        onDocumentsChange(prev => 
                            prev.map(doc => 
                                doc.id === docId 
                                    ? { ...doc, uploadProgress: 100, isUploading: false }
                                    : doc
                            )
                        );
                    }, 200);
                }
                
                onDocumentsChange(prev => 
                    prev.map(doc => 
                        doc.id === docId 
                            ? { ...doc, uploadProgress: Math.min(progress, 100) }
                            : doc
                    )
                );
            }, 150);
        }, delay);
    };

    const handleSetParent = (id: string) => {
        const updatedDocuments = documents.map(doc => ({
            ...doc,
            isParent: doc.id === id,
            childType: doc.id === id ? undefined : (doc.childType || "Form")
        }));
        onDocumentsChange(updatedDocuments);
    };

    const handleChildTypeChange = (id: string, type: ChildDocumentType) => {
        const updatedDocuments = documents.map(doc =>
            doc.id === id ? { ...doc, childType: type } : doc
        );
        onDocumentsChange(updatedDocuments);
    };

    const handleRemoveDocument = (id: string) => {
        const removedDoc = documents.find(doc => doc.id === id);
        const filteredDocuments = documents.filter(doc => doc.id !== id);
        
        // If removed document was parent, make first remaining document the parent
        if (removedDoc?.isParent && filteredDocuments.length > 0) {
            filteredDocuments[0].isParent = true;
        }
        
        onDocumentsChange(filteredDocuments);
    };

    const handlePreviewDocument = (file: File) => {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        // Clean up the URL after a delay to prevent memory leaks
        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    };

    const parentDocument = documents.find(doc => doc.isParent);
    const childDocuments = documents.filter(doc => !doc.isParent);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                        Upload Multiple Documents
                    </h3>
                    {documents.length > 0 && (
                        <Button
                            size="sm"
                            onClick={() => setShowDeleteAllModal(true)}
                            className="bg-red-600 text-white hover:bg-red-700 border border-red-600 h-8 shadow-sm"
                        >
                            <IconTrash className="h-4 w-4 mr-2" />
                            Delete All
                        </Button>
                    )}
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Upload all document files at once. You can then select one document to be the parent document, 
                    and the rest will be child documents.
                </p>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                        <span className="text-slate-700">
                            <span className="font-semibold">{documents.length}</span> document(s) uploaded
                        </span>
                    </div>
                    {parentDocument && (
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-slate-700">
                                <span className="font-semibold">1</span> parent
                            </span>
                        </div>
                    )}
                    {childDocuments.length > 0 && (
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-slate-700">
                                <span className="font-semibold">{childDocuments.length}</span> child(ren)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Area */}
            {documents.length === 0 ? (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
                        dragOver 
                            ? "border-emerald-500 bg-emerald-50 scale-[1.02]" 
                            : "border-slate-300 bg-white hover:border-slate-400"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <IconCloudUpload className={cn(
                        "h-16 w-16 mx-auto mb-4 transition-colors",
                        dragOver ? "text-emerald-600" : "text-slate-400"
                    )} />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                        Drop files here or click to browse
                    </h4>
                    <p className="text-sm text-slate-600 mb-6">
                        Support for PDF, DOCX, DOC, and other document formats
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Files
                    </Button>
                </div>
            ) : (
                <LayoutGroup>
                    {/* Documents List */}
                    <div className="space-y-3">
                        {/* Parent Document */}
                        <AnimatePresence mode="popLayout">
                            {parentDocument && (
                                <motion.div
                                    layoutId={parentDocument.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                        Parent Document
                                    </h4>
                                    <div className="border-2 border-amber-300 bg-amber-50/50 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 md:w-12 md:h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                                {getFileIcon(parentDocument.fileName) ? (
                                                    <img 
                                                        src={getFileIcon(parentDocument.fileName)!} 
                                                        alt="File Icon" 
                                                        className="h-10 w-10 md:h-8 md:w-8 object-contain"
                                                    />
                                                ) : (
                                                    <FileText className="h-7 w-7 md:h-6 md:w-6 text-amber-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {parentDocument.fileName}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {(parentDocument.file.size / 1024).toFixed(2)} KB
                                                </p>
                                                
                                                {/* Upload Progress Bar */}
                                                {parentDocument.isUploading && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                                            <span>Uploading...</span>
                                                            <span>{Math.round(parentDocument.uploadProgress || 0)}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
                                                                style={{ width: `${parentDocument.uploadProgress || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Upload Complete Indicator */}
                                                {!parentDocument.isUploading && parentDocument.uploadProgress === 100 && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                                                        <Check className="h-3.5 w-3.5" />
                                                        <span>Upload complete</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                                        <Star className="h-3 w-3 fill-amber-700" />
                                                        Primary Document
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePreviewDocument(parentDocument.file)}
                                                    className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors whitespace-nowrap touch-manipulation active:scale-95"
                                                    title="Preview document"
                                                >
                                                    <Eye className="h-3.5 w-3.5 inline mr-1" />
                                                    <span className="hidden sm:inline">Preview</span>
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveDocument(parentDocument.id)}
                                                    className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors whitespace-nowrap touch-manipulation active:scale-95"
                                                    title="Remove document"
                                                >
                                                    <IconTrash className="h-3.5 w-3.5 inline mr-1" />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Child Documents */}
                        {childDocuments.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Child Documents ({childDocuments.length})
                                </h4>
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {childDocuments.map((doc, index) => (
                                            <motion.div
                                                key={doc.id}
                                                layoutId={doc.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="relative"
                                            >
                                                {/* Connection Line */}
                                                <div className="absolute left-7 md:left-6 -top-3 w-0.5 h-6 bg-gradient-to-b from-amber-200 to-blue-200"></div>
                                                
                                                <div className="border-2 border-slate-200 bg-white rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                            {getFileIcon(doc.fileName) ? (
                                                                <img 
                                                                    src={getFileIcon(doc.fileName)!} 
                                                                    alt="File Icon" 
                                                                    className="h-10 w-10 md:h-8 md:w-8 object-contain"
                                                                />
                                                            ) : (
                                                                <FileText className="h-7 w-7 md:h-6 md:w-6 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 space-y-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                                    {doc.fileName}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {(doc.file.size / 1024).toFixed(2)} KB
                                                                </p>
                                                                
                                                                {/* Upload Progress Bar */}
                                                                {doc.isUploading && (
                                                                    <div className="mt-2 space-y-1">
                                                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                                                            <span>Uploading...</span>
                                                                            <span>{Math.round(doc.uploadProgress || 0)}%</span>
                                                                        </div>
                                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                            <div 
                                                                                className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
                                                                                style={{ width: `${doc.uploadProgress || 0}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Upload Complete Indicator */}
                                                                {!doc.isUploading && doc.uploadProgress === 100 && (
                                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                                                                        <Check className="h-3.5 w-3.5" />
                                                                        <span>Upload complete</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Child Type Selector - iPad Optimized */}
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
                                                                    Document Type:
                                                                </label>
                                                                <div className="flex gap-2">
                                                                    {(["Form", "Annex", "Attachment"] as ChildDocumentType[]).map((type) => (
                                                                        <button
                                                                            key={type}
                                                                            onClick={() => handleChildTypeChange(doc.id, type)}
                                                                            className={cn(
                                                                                "px-4 py-2 text-xs font-medium rounded-lg transition-all touch-manipulation",
                                                                                doc.childType === type
                                                                                    ? "bg-emerald-600 text-white shadow-sm"
                                                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95"
                                                                            )}
                                                                        >
                                                                            {type}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handlePreviewDocument(doc.file)}
                                                                className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors whitespace-nowrap touch-manipulation active:scale-95"
                                                                title="Preview document"
                                                            >
                                                                <Eye className="h-3.5 w-3.5 inline mr-1" />
                                                                <span className="hidden sm:inline">Preview</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleSetParent(doc.id)}
                                                                className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-lg transition-colors whitespace-nowrap touch-manipulation active:scale-95"
                                                                title="Set as parent document"
                                                            >
                                                                <Star className="h-3.5 w-3.5 inline mr-1" />
                                                                <span className="hidden sm:inline">Set Parent</span>
                                                                <span className="sm:hidden">Parent</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveDocument(doc.id)}
                                                                className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors whitespace-nowrap touch-manipulation active:scale-95"
                                                                title="Remove document"
                                                            >
                                                                <IconTrash className="h-3.5 w-3.5 inline mr-1" />
                                                                <span className="hidden sm:inline">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add More Documents */}
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 md:p-6 text-center transition-all duration-200 touch-manipulation",
                            dragOver 
                                ? "border-emerald-500 bg-emerald-50" 
                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <p className="text-sm text-slate-600 mb-4">
                            Drop more files here or click to add
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="touch-manipulation active:scale-95"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Add More Files
                        </Button>
                    </div>

                    {/* Validation Warning */}
                    {documents.length > 0 && !parentDocument && (
                        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900">
                                    No Parent Document Selected
                                </p>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    Please select one document to be the parent document before proceeding.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {documents.length > 0 && parentDocument && (
                        <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-emerald-900">
                                    Ready to Continue
                                </p>
                                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                                    {documents.length} document(s) uploaded with 1 parent and {childDocuments.length} child document(s). 
                                    Click on the <strong>General Information</strong> tab to enter metadata for each document.
                                </p>
                            </div>
                        </div>
                    )}
                </LayoutGroup>
            )}

            <AlertModal
                isOpen={showDeleteAllModal}
                onClose={() => setShowDeleteAllModal(false)}
                onConfirm={() => {
                    onDocumentsChange([]);
                    setShowDeleteAllModal(false);
                }}
                type="error"
                title="Delete All Documents"
                description="Are you sure you want to delete all uploaded documents? This action cannot be undone."
                confirmText="Delete All"
                showCancel={true}
            />
        </div>
    );
};
