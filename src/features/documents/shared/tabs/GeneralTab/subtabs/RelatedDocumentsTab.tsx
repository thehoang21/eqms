import React from "react";
import { Link as LinkIcon, X, ExternalLink, Network } from "lucide-react";

interface RelatedDocument {
    id: string;
    title: string;
    type: string;
}

interface RelatedDocumentsTabProps {
    relatedDocuments: RelatedDocument[];
    onRelatedDocumentsChange: (docs: RelatedDocument[]) => void;
}

export const RelatedDocumentsTab: React.FC<RelatedDocumentsTabProps> = ({ 
    relatedDocuments, 
    onRelatedDocumentsChange 
}) => {
    const handleRemoveDocument = (id: string) => {
        onRelatedDocumentsChange(relatedDocuments.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <p className="text-sm text-slate-600">
                    Link related documents that reference or depend on this document
                </p>
            </div>

            {/* Related Documents List */}
            {relatedDocuments.length > 0 ? (
                <div className="space-y-2">
                    {relatedDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Network className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{doc.id}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-0.5">{doc.title}</p>
                                </div>
                                <button
                                    className="p-2 hover:bg-slate-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    title="Open document"
                                >
                                    <ExternalLink className="h-4 w-4 text-slate-600" />
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="p-1 hover:bg-slate-200 rounded transition-colors ml-2"
                            >
                                <X className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <Network className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No related documents added yet</p>
                </div>
            )}
        </div>
    );
};
