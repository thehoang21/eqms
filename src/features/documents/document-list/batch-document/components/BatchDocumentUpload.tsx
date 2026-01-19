import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Star, Trash2, Eye, Check, Network, XCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button/Button";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { Select } from "@/components/ui/select/Select";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { DocumentType } from "@/types/documentTypes";
import pdfIcon from '@/assets/images/image-file/pdf.png';
import docIcon from '@/assets/images/image-file/doc.png';
import docxIcon from '@/assets/images/image-file/docx.png';
import xlsIcon from '@/assets/images/image-file/xls.png';
import xlsxIcon from '@/assets/images/image-file/xlsx.png';
import pptIcon from '@/assets/images/image-file/ppt.png';
import pptxIcon from '@/assets/images/image-file/pptx.png';
import jpgIcon from '@/assets/images/image-file/jpg.png';
import jpegIcon from '@/assets/images/image-file/jpeg.png';
import pngIcon from '@/assets/images/image-file/png.png';
import fileIcon from '@/assets/images/image-file/file.png';

type ChildDocumentType = "Form" | "Annex" | "Attachment";

// Mock parent documents for selection
interface ParentDocumentOption {
    id: string;
    documentId: string;
    documentName: string;
    type: string;
    version: string;
    status: "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
}

const MOCK_PARENT_DOCUMENTS: ParentDocumentOption[] = [
    { id: "1", documentId: "DOC-SOP-001", documentName: "Quality Management System Overview", type: "SOP", version: "2.0", status: "Effective" },
    { id: "2", documentId: "DOC-POL-002", documentName: "Document Control Policy", type: "Policy", version: "1.5", status: "Effective" },
    { id: "3", documentId: "DOC-SOP-003", documentName: "Training Management Procedure", type: "SOP", version: "3.0", status: "Approved" }, // Not Effective - will be filtered
    { id: "4", documentId: "DOC-SPEC-004", documentName: "Product Specifications Standard", type: "Specification", version: "1.8", status: "Effective" },
    { id: "5", documentId: "DOC-SOP-005", documentName: "Change Control Procedure", type: "SOP", version: "2.2", status: "Effective" },
    { id: "6", documentId: "DOC-POL-006", documentName: "Quality Policy (Draft)", type: "Policy", version: "1.0", status: "Draft" }, // Not Effective - will be filtered
];

interface BatchDocument {
    id: string;
    fileName: string;
    file: File;
    childType?: ChildDocumentType; // Type if this is a child document
    uploadProgress?: number; // 0-100
    isUploading?: boolean;
    formData: {
        title: string;
        type: DocumentType;
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
    onGlobalParentChange?: (parentId: string, parentData?: ParentDocumentOption) => void; // Callback when global parent changes to load metadata
    globalParentId?: string; // Controlled global parent ID
    batchParentId?: string; // Controlled batch parent ID
    onBatchParentChange?: (docId: string) => void; // Callback when batch parent changes
}

export const BatchDocumentUpload: React.FC<BatchDocumentUploadProps> = ({
    documents,
    onDocumentsChange,
    onGlobalParentChange,
    globalParentId: externalGlobalParentId,
    batchParentId: externalBatchParentId,
    onBatchParentChange,
}) => {
    const [dragOver, setDragOver] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    
    // Use controlled props if provided, otherwise use internal state
    const [internalBatchParentId, setInternalBatchParentId] = useState<string>("");
    const [internalGlobalParentId, setInternalGlobalParentId] = useState<string>("");
    
    const batchParentId = externalBatchParentId !== undefined ? externalBatchParentId : internalBatchParentId;
    const globalParentId = externalGlobalParentId !== undefined ? externalGlobalParentId : internalGlobalParentId;
    
    const setBatchParentId = (id: string) => {
        if (onBatchParentChange) {
            onBatchParentChange(id);
        } else {
            setInternalBatchParentId(id);
        }
    };
    
    const setGlobalParentId = (id: string) => {
        setInternalGlobalParentId(id);
    };
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') return pdfIcon;
        if (extension === 'doc') return docIcon;
        if (extension === 'docx') return docxIcon;
        if (extension === 'xls') return xlsIcon;
        if (extension === 'xlsx') return xlsxIcon;
        if (extension === 'ppt') return pptIcon;
        if (extension === 'pptx') return pptxIcon;
        if (extension === 'jpg') return jpgIcon;
        if (extension === 'jpeg') return jpegIcon;
        if (extension === 'png') return pngIcon;
        return fileIcon;
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
            parentDocumentId: undefined, // No parent by default (Level 1 documents)
            childType: undefined, // No child type by default
            uploadProgress: 0,
            isUploading: true,
            formData: {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                type: "Standard Operating Procedure" as DocumentType,
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

    const handleSetAsBatchParent = (docId: string) => {
        // Set this document as parent of all other documents in batch
        setBatchParentId(docId);
        
        // Clear global parent when batch parent is set
        setGlobalParentId("");
        
        // Update all documents (except the parent) to have this as child type
        const updatedDocuments = documents.map(doc => ({
            ...doc,
            childType: doc.id === docId ? undefined : (doc.childType || "Form")
        }));
        onDocumentsChange(updatedDocuments);
    };

    const handleClearBatchParent = () => {
        setBatchParentId("");
        
        // Clear child types from all documents
        const updatedDocuments = documents.map(doc => ({
            ...doc,
            childType: undefined
        }));
        onDocumentsChange(updatedDocuments);
    };

    const handleGlobalParentChange = (parentId: string) => {
        setGlobalParentId(parentId);
        
        // Clear batch parent when global parent is selected
        if (parentId) {
            setBatchParentId("");
            
            // Set all documents as children
            const updatedDocuments = documents.map(doc => ({
                ...doc,
                childType: doc.childType || "Form"
            }));
            onDocumentsChange(updatedDocuments);
            
            // Notify parent component to load metadata
            const parentData = MOCK_PARENT_DOCUMENTS.find(p => p.id === parentId);
            if (onGlobalParentChange && parentData) {
                onGlobalParentChange(parentId, parentData);
            }
        } else {
            // Clear child types when no parent
            const updatedDocuments = documents.map(doc => ({
                ...doc,
                childType: undefined
            }));
            onDocumentsChange(updatedDocuments);
            
            if (onGlobalParentChange) {
                onGlobalParentChange("");
            }
        }
    };

    const handleChildTypeChange = (id: string, type: ChildDocumentType) => {
        const updatedDocuments = documents.map(doc =>
            doc.id === id ? { ...doc, childType: type } : doc
        );
        onDocumentsChange(updatedDocuments);
    };

    const handleRemoveDocument = (id: string) => {
        const filteredDocuments = documents.filter(doc => doc.id !== id);
        onDocumentsChange(filteredDocuments);
    };

    const handlePreviewDocument = (file: File) => {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        // Clean up the URL after a delay to prevent memory leaks
        setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    };

    // Get effective parent for a document
    const getEffectiveParent = (doc: BatchDocument) => {
        // If this document is the batch parent, it has no parent
        if (doc.id === batchParentId) {
            return "";
        }
        
        // If there's a batch parent, return it
        if (batchParentId) {
            return batchParentId;
        }
        
        // Otherwise return global parent (if any)
        return globalParentId;
    };
    
    // Check if document is the batch parent
    const isBatchParent = (docId: string) => {
        return docId === batchParentId;
    };
    
    // Get parent info (from batch or existing documents)
    const getParentInfo = (parentId: string) => {
        // Check if it's from batch
        const batchParent = documents.find(d => d.id === parentId);
        if (batchParent) {
            return {
                id: batchParent.id,
                label: batchParent.fileName,
                source: 'batch' as const
            };
        }
        
        // Check existing documents (only Effective)
        const existingParent = MOCK_PARENT_DOCUMENTS.find(p => p.id === parentId && p.status === "Effective");
        if (existingParent) {
            return {
                id: existingParent.id,
                label: `${existingParent.documentId} - ${existingParent.documentName}`,
                source: 'existing' as const
            };
        }
        
        return null;
    };

    // Count documents by category
    const independentDocs = documents.filter(doc => !getEffectiveParent(doc));
    const childDocs = documents.filter(doc => !!getEffectiveParent(doc));
    
    // Prepare parent document options for global dropdown (only Effective from existing docs)
    const globalParentOptions = [
        { label: "-- No Global Parent --", value: "" },
        ...MOCK_PARENT_DOCUMENTS
            .filter(parent => parent.status === "Effective")
            .map(parent => ({
                label: `${parent.documentId} - ${parent.documentName} (v${parent.version})`,
                value: parent.id
            }))
    ];

    return (
        <div className="space-y-6">
            {/* Combined: Document Hierarchy + Upload Info */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
                {/* Header with actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 mb-3">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <Network className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                        <h4 className="text-sm md:text-base font-semibold text-slate-900">
                            {(batchParentId || globalParentId) ? "Document Relationship" : "Upload Multiple Documents"}
                        </h4>
                    </div>
                    {documents.length > 0 && (
                        <Button
                            size="sm"
                            onClick={() => setShowDeleteAllModal(true)}
                            className="bg-red-600 text-white hover:bg-red-700 border border-red-600 h-8 shadow-sm w-full sm:w-auto"
                        >
                            <IconTrash className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                            <span className="text-xs md:text-sm">Delete All</span>
                        </Button>
                    )}
                </div>
                
                {/* Description */}
                <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 leading-relaxed">
                    {(batchParentId || globalParentId) 
                        ? "Documents are linked in a parent-child hierarchy. The parent document manages its children."
                        : "Upload all document files at once. By default, all documents are independent (Level 1). You can optionally assign a parent document to create child relationships."
                    }
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-600" />
                        <span className="text-slate-700">
                            <span className="font-semibold">{documents.length}</span> total
                        </span>
                    </div>
                    {independentDocs.length > 0 && (
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-600" />
                            <span className="text-slate-700">
                                <span className="font-semibold">{independentDocs.length}</span> independent
                            </span>
                        </div>
                    )}
                    {childDocs.length > 0 && (
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <Network className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" />
                            <span className="text-slate-700">
                                <span className="font-semibold">{childDocs.length}</span> with parent
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Hierarchy Tree - Show when parent exists */}
                {(batchParentId || globalParentId) && documents.length > 0 && (
                    <div className="space-y-2 md:space-y-3 pt-2 md:pt-3 border-t border-slate-200">
                        {/* Parent Node */}
                        {batchParentId ? (
                            <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-lg">
                                <Star className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                                        Parent Document (Batch)
                                    </p>
                                    <p className="text-xs md:text-sm font-medium text-slate-900 mt-1 truncate">
                                        {documents.find(d => d.id === batchParentId)?.fileName}
                                    </p>
                                </div>
                            </div>
                        ) : globalParentId && (() => {
                            const parentInfo = getParentInfo(globalParentId);
                            return parentInfo ? (
                                <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg">
                                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-xs font-semibold text-blue-800 uppercase tracking-wide">
                                            Parent Document (External)
                                        </p>
                                        <p className="text-xs md:text-sm font-medium text-slate-900 mt-1 truncate">
                                            {parentInfo.label}
                                        </p>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                        
                        {/* Children Nodes */}
                        {childDocs.length > 0 && (
                            <div className="ml-4 md:ml-8 space-y-2 border-l-2 border-slate-300 pl-2 md:pl-4">
                                <p className="text-xs md:text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                    Child Documents ({childDocs.length})
                                </p>
                                {childDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-1.5 md:gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                        <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 shrink-0" />
                                        <p className="text-xs text-slate-700 truncate">
                                            {doc.fileName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Global Parent Assignment Section - Only show when no batch parent is set */}
            {documents.length > 0 && !batchParentId && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 md:p-5 shadow-sm">
                    <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Network className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-1">
                                External Parent Assignment (Optional)
                            </h4>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                Select an existing Effective document as parent for all uploaded files. 
                                <strong className="text-blue-700"> Metadata will be inherited from the selected parent.</strong>
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <Select
                            label="Parent Document (Effective Only)"
                            value={globalParentId}
                            onChange={handleGlobalParentChange}
                            options={globalParentOptions}
                            placeholder="Select parent document to inherit metadata"
                            enableSearch={true}
                        />
                        
                        {globalParentId && (
                            <div className="flex items-center gap-1.5 md:gap-2 p-2.5 md:p-3 bg-emerald-100 border border-emerald-200 rounded-lg">
                                <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 shrink-0" />
                                <span className="text-xs md:text-sm text-emerald-800">
                                    Metadata will be loaded from parent
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Batch Parent Info - Show when batch parent is set */}
            {documents.length > 0 && batchParentId && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-4 md:p-5 shadow-sm">
                    <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <Star className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h4 className="text-sm md:text-base font-semibold text-slate-900">
                                    Batch Parent Document
                                </h4>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleClearBatchParent}
                                >
                                    <XCircle className="h-4 w-4 mr-1.5" />
                                    Clear
                                </Button>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 p-2.5 md:p-3 bg-white border border-emerald-200 rounded-lg">
                                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 shrink-0" />
                                <span className="text-xs md:text-sm text-slate-700 font-medium">
                                    {documents.find(d => d.id === batchParentId)?.fileName}
                                </span>
                                <span className="text-xs text-slate-500 ml-auto">
                                    Parent of {childDocs.length} document{childDocs.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">
                                Other documents in this batch will be linked as child documents
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {documents.length === 0 ? (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-200",
                        dragOver 
                            ? "border-emerald-500 bg-emerald-50 scale-[1.02]" 
                            : "border-slate-300 bg-white hover:border-slate-400"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <IconCloudUpload className={cn(
                        "h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 transition-colors",
                        dragOver ? "text-emerald-600" : "text-slate-400"
                    )} />
                    <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                        Drop files here or click to browse
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 mb-4 md:mb-6">
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
                        Browse Files
                    </Button>
                </div>
            ) : (
                <LayoutGroup>
                    {/* Documents List */}
                    <div className="space-y-2 md:space-y-3">
                        <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                            <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-600" />
                            Documents ({documents.length})
                        </h4>
                        <div className="space-y-2 md:space-y-3">
                            <AnimatePresence mode="popLayout">
                                {documents.map((doc, index) => {
                                    const effectiveParent = getEffectiveParent(doc);
                                    
                                    return (
                                        <motion.div
                                            key={doc.id}
                                            layoutId={doc.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            <div className={cn(
                                                "border-2 rounded-xl p-3 md:p-5 transition-all",
                                                isBatchParent(doc.id)
                                                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 hover:border-emerald-400 ring-2 ring-emerald-200"
                                                    : effectiveParent
                                                        ? "border-blue-200 bg-blue-50/30 hover:border-blue-300"
                                                        : "border-slate-200 bg-white hover:border-slate-300",
                                                "hover:shadow-md"
                                            )}>
                                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
                                                    {/* Top Row: Number, Icon, Content */}
                                                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                                                        {/* Document Number */}
                                                        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 border-2 border-slate-200 shrink-0">
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* File Icon */}
                                                        <div className={cn(
                                                            "w-12 h-12 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0",
                                                            isBatchParent(doc.id)
                                                                ? "bg-emerald-100"
                                                                : effectiveParent 
                                                                    ? "bg-blue-100" 
                                                                    : "bg-slate-100"
                                                        )}>
                                                            {getFileIcon(doc.fileName) ? (
                                                                <img 
                                                                    src={getFileIcon(doc.fileName)!} 
                                                                    alt="File Icon" 
                                                                    className="h-8 w-8 md:h-8 md:w-8 object-contain"
                                                                />
                                                            ) : (
                                                                <FileText className={cn(
                                                                    "h-6 w-6 md:h-6 md:w-6",
                                                                    isBatchParent(doc.id)
                                                                        ? "text-emerald-600"
                                                                        : effectiveParent 
                                                                            ? "text-blue-600" 
                                                                            : "text-slate-600"
                                                                )} />
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                                                        {/* File Info */}
                                                        <div>
                                                            <p className="text-xs md:text-sm font-semibold text-slate-900 truncate">
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
                                                        
                                                        {/* Parent/Child Status Badge */}
                                                        {isBatchParent(doc.id) ? (
                                                            <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-lg">
                                                                <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                                                        Parent Document
                                                                    </p>
                                                                    <p className="text-xs text-emerald-600 mt-0.5">
                                                                        Other {childDocs.length} file{childDocs.length !== 1 ? 's' : ''} will be linked as children
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : effectiveParent ? (
                                                            <div className="flex items-start gap-1.5 md:gap-2 p-2 md:p-2.5 bg-blue-100 border border-blue-200 rounded-lg">
                                                                <Network className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 shrink-0 mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    {(() => {
                                                                        const parentInfo = getParentInfo(effectiveParent);
                                                                        if (!parentInfo) return null;
                                                                        
                                                                        return (
                                                                            <>
                                                                                <p className="text-xs text-blue-800 font-medium">
                                                                                    Child of: {parentInfo.source === 'batch' ? '📄 Batch' : '🏢 External'}
                                                                                </p>
                                                                                <p className="text-xs text-blue-600 truncate">
                                                                                    {parentInfo.label}
                                                                                </p>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Actions Row - Mobile: full width below, Desktop: beside content */}
                                                    <div className="flex items-center gap-1.5 md:gap-2 w-full md:w-auto md:shrink-0">
                                                        {/* Set Parent Button - Show on all documents except current parent */}
                                                        {!isBatchParent(doc.id) && (
                                                            <Button
                                                                onClick={() => handleSetAsBatchParent(doc.id)}
                                                                variant="default"
                                                                size="xs"
                                                                className="flex-1 md:flex-initial justify-center gap-1 md:gap-1.5"
                                                                title="Set as parent document"
                                                            >
                                                                <Star className="h-3.5 w-3.5" />
                                                                <span>Set Parent</span>
                                                            </Button>
                                                        )}
                                                        
                                                        <Button
                                                            onClick={() => handlePreviewDocument(doc.file)}
                                                            variant="outline"
                                                            size="xs"
                                                            className="flex-1 md:flex-initial justify-center gap-1 md:gap-1.5 text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                                                            title="Preview document"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>Preview</span>
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleRemoveDocument(doc.id)}
                                                            variant="outline"
                                                            size="xs"
                                                            className="flex-1 md:flex-initial justify-center gap-1 md:gap-1.5 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                                                            title="Remove document"
                                                        >
                                                            <IconTrash className="h-3.5 w-3.5" />
                                                            <span>Remove</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
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
                        <p className="text-sm text-slate-500 mb-4">
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
                            Add More Files
                        </Button>
                    </div>

                    {/* Validation Warning - Removed, no longer needed */}

                    {/* Success Message */}
                    {documents.length > 0 && (
                        <div className="flex items-start gap-2 md:gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 md:p-5 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs md:text-sm font-medium text-emerald-900">
                                    Ready to Continue
                                </p>
                                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                                    {documents.length} document(s) uploaded: {independentDocs.length} independent document(s) and {childDocs.length} with parent relationship(s). 
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
