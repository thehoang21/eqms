import React from "react";
import { FileText, Star, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { DocumentType } from "@/types/documentTypes";

type ChildDocumentType = "Form" | "Annex" | "Attachment";

interface BatchDocument {
    id: string;
    fileName: string;
    file: File;
    childType?: ChildDocumentType;
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

interface DocumentTreeViewProps {
    documents: BatchDocument[];
    currentDocumentIndex: number;
    onDocumentSelect: (index: number) => void;
    batchParentId?: string;
    globalParentId?: string;
    globalParentData?: {
        documentId: string;
        documentName: string;
        type: string;
        version: string;
        status: string;
    };
    className?: string;
}

export const DocumentTreeView: React.FC<DocumentTreeViewProps> = ({
    documents,
    currentDocumentIndex,
    onDocumentSelect,
    batchParentId,
    globalParentId,
    globalParentData,
    className
}) => {
    // Find parent document from batch
    const parentDocument = batchParentId ? documents.find(doc => doc.id === batchParentId) : null;
    
    // Get child documents (all except batch parent)
    const childDocuments = batchParentId 
        ? documents.filter(doc => doc.id !== batchParentId)
        : documents;
    
    const parentIndex = parentDocument ? documents.findIndex(doc => doc.id === batchParentId) : -1;

    const getTypeIcon = (type?: ChildDocumentType) => {
        switch (type) {
            case "Form":
                return "📝";
            case "Annex":
                return "📎";
            case "Attachment":
                return "📄";
            default:
                return "📄";
        }
    };
    
    const getDocumentTypeLabel = (type: "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol") => {
        return type; // Returns the type as-is (SOP, Policy, Form, etc.)
    };

    const getDocumentStatus = (doc: BatchDocument) => {
        const formData = doc.formData;
        const isValid = !!(
            formData.title.trim() &&
            String(formData.type || "").trim() &&
            formData.author.trim() &&
            formData.businessUnit.trim() &&
            Number.isFinite(formData.periodicReviewCycle) && formData.periodicReviewCycle > 0 &&
            Number.isFinite(formData.periodicReviewNotification) && formData.periodicReviewNotification > 0
        );
        return isValid;
    };

    const completedCount = documents.filter(getDocumentStatus).length;
    const progressPercentage = Math.round((completedCount / documents.length) * 100);

    return (
        <div className={cn("flex flex-col bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden", className)}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-md">
                        <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Document Tree</h3>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {documents.length} files
                </span>
            </div>

            {/* Tree Content */}
            <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-none">
                {/* External Parent Document (if exists) */}
                {globalParentId && globalParentData && (
                    <div className="relative z-10 mb-3">
                        <div className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-blue-100 border border-blue-200 text-blue-600 shadow-sm">
                                <FileText className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-blue-900">
                                    {globalParentData.documentId}
                                </p>
                                <p className="text-xs truncate text-blue-700/80">
                                    🏢 External Parent (v{globalParentData.version})
                                </p>
                            </div>
                            
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        </div>
                        
                        {/* Vertical Connector Line */}
                        {(parentDocument || childDocuments.length > 0) && (
                            <div className="absolute left-[1.85rem] top-12 bottom-[-10px] w-px bg-blue-300 -z-10" />
                        )}
                    </div>
                )}
                
                {/* Batch Parent Document */}
                {parentDocument && (
                    <div className="relative z-10">
                                <button
                                    onClick={() => onDocumentSelect(parentIndex)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border group relative overflow-hidden",
                                        currentDocumentIndex === parentIndex
                                            ? "bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-100"
                                            : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                                    )}
                                >                                   
                                    <div className={cn(
                                        "flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors shadow-sm border",
                                        currentDocumentIndex === parentIndex 
                                            ? "bg-amber-100 border-amber-200 text-amber-600" 
                                            : "bg-white border-slate-100 text-slate-400 group-hover:border-slate-200"
                                    )}>
                                        <Star className={cn("h-4 w-4", currentDocumentIndex === parentIndex ? "fill-current" : "")} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm font-medium truncate transition-colors", 
                                            currentDocumentIndex === parentIndex ? "text-amber-900" : "text-slate-700 group-hover:text-slate-900"
                                        )}>
                                            {parentDocument.formData.title || parentDocument.fileName}
                                        </p>
                                        <p className={cn(
                                            "text-xs truncate transition-colors",
                                            currentDocumentIndex === parentIndex ? "text-amber-700/80" : "text-slate-500"
                                        )}>
                                            ⭐ Batch Parent • {getDocumentTypeLabel(parentDocument.formData.type)}
                                        </p>
                                    </div>
                                    
                                    {getDocumentStatus(parentDocument) ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-slate-200 shrink-0" />
                                    )}
                                </button>
                                
                                {/* Vertical Connector Line */}
                                {childDocuments.length > 0 && (
                                    <div className={cn(
                                        "absolute left-[1.85rem] top-12 bottom-[-10px] w-px -z-10",
                                        globalParentId ? "bg-blue-300" : "bg-slate-200"
                                    )} />
                                )}
                            </div>
                        )}

                        {/* Child Documents - Show all when no batch parent, or children when batch parent exists */}
                        <div className="space-y-1 pt-1">
                                {childDocuments.map((doc, index) => {
                            const docIndex = documents.findIndex(d => d.id === doc.id);
                            const isActive = currentDocumentIndex === docIndex;
                            const isLast = index === childDocuments.length - 1;
                            
                            return (
                                <div key={doc.id} className={cn(
                                    "relative",
                                    (batchParentId || globalParentId) ? "pl-8" : ""
                                )}>
                                    {/* Horizontal Connector - Only show if there's a parent */}
                                    {(batchParentId || globalParentId) && (
                                        <div className={cn(
                                            "absolute left-[1.85rem] top-1/2 w-4 h-px -translate-y-1/2",
                                            globalParentId ? "bg-blue-300" : "bg-slate-200"
                                        )} />
                                    )}
                                    
                                    {/* Cover vertical line for last item */}
                                    {(batchParentId || globalParentId) && isLast && (
                                        <div className="absolute left-[1.85rem] top-1/2 bottom-0 w-px bg-white" />
                                    )}

                                    <button
                                        onClick={() => onDocumentSelect(docIndex)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200 border group relative overflow-hidden",
                                            isActive
                                                ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100"
                                                : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-base transition-colors shadow-sm border",
                                            isActive 
                                                ? "bg-blue-100 border-blue-200" 
                                                : "bg-white border-slate-100 group-hover:border-slate-200"
                                        )}>
                                            {getTypeIcon(doc.childType)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium truncate transition-colors", 
                                                isActive ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                                            )}>
                                                {doc.formData.title || doc.fileName}
                                            </p>
                                            <p className={cn(
                                                "text-xs capitalize truncate transition-colors",
                                                isActive ? "text-blue-700/80" : "text-slate-500"
                                            )}>
                                                {getDocumentTypeLabel(doc.formData.type)}
                                            </p>
                                        </div>
                                        
                                        {getDocumentStatus(doc) ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-slate-200 shrink-0" />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
            </div>

            {/* Footer / Progress */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 font-medium">Completion Progress</span>
                    <span className={cn(
                        "font-bold",
                        progressPercentage === 100 ? "text-emerald-600" : "text-slate-900"
                    )}>
                        {completedCount} / {documents.length} ({progressPercentage}%)
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className={cn(
                            "h-full transition-all duration-500 ease-out rounded-full",
                            progressPercentage === 100 ? "bg-emerald-500" : "bg-blue-500"
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
