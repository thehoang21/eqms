import React from "react";
import { Link, X, ExternalLink, Network } from "lucide-react";
import { Button } from '@/components/ui/button/Button';

interface ParentDocument {
    id: string;
    title: string;
    type: string;
}

interface CorrelatedDocumentsTabProps {
    parentDocument: ParentDocument | null;
    onParentDocumentChange: (parent: ParentDocument | null) => void;
}

export const CorrelatedDocumentsTab: React.FC<CorrelatedDocumentsTabProps> = ({ 
    parentDocument,
    onParentDocumentChange 
}) => {
    const handleRemoveDocument = () => {
        onParentDocumentChange(null);
    };

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm text-slate-600">Link documents that are correlated to this document</p>
            </div>

            {/* Correlated Documents List */}
            {parentDocument ? (
                <div className="space-y-2">
                    <div
                        className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-md hover:border-emerald-300 hover:shadow-sm transition-all group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Link className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-slate-900 text-sm truncate">{parentDocument.id}</h4>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                    {parentDocument.type}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 truncate">{parentDocument.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => {}}
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                title="View document"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleRemoveDocument}
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                title="Remove correlation"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <Network className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No correlated documents added yet</p>
                </div>
            )}
        </div>
    );
};
