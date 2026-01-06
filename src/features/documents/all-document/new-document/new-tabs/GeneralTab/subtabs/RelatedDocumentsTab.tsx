import React, { useState } from "react";
import { Link as LinkIcon, Plus, X, ExternalLink } from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';

interface RelatedDocument {
    id: string;
    documentId: string;
    title: string;
    type: string;
    relationship: string;
}

export const RelatedDocumentsTab: React.FC = () => {
    const [relatedDocs, setRelatedDocs] = useState<RelatedDocument[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState("");
    const [relationship, setRelationship] = useState("References");

    const availableDocuments = [
        { label: "SOP-QA-001 - Quality Control Testing", value: "SOP-QA-001|Quality Control Testing|SOP" },
        { label: "POL-QMS-005 - Quality Management System Policy", value: "POL-QMS-005|Quality Management System Policy|Policy" },
        { label: "SOP-PR-012 - Batch Production Record", value: "SOP-PR-012|Batch Production Record|SOP" },
        { label: "SPEC-RAW-003 - Raw Material Specification", value: "SPEC-RAW-003|Raw Material Specification|Specification" }
    ];

    const relationshipTypes = [
        { label: "References", value: "References" },
        { label: "Supersedes", value: "Supersedes" },
        { label: "Related To", value: "Related To" },
        { label: "Depends On", value: "Depends On" }
    ];

    const handleAddDocument = () => {
        if (selectedDoc) {
            const [docId, title, type] = selectedDoc.split("|");
            const newDoc: RelatedDocument = {
                id: Date.now().toString(),
                documentId: docId,
                title: title,
                type: type,
                relationship: relationship
            };
            setRelatedDocs([...relatedDocs, newDoc]);
            setSelectedDoc("");
            setRelationship("References");
            setIsAdding(false);
        }
    };

    const handleRemoveDocument = (id: string) => {
        setRelatedDocs(relatedDocs.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Link related documents that reference or depend on this document
                </p>
                {!isAdding && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Add Related Document
                    </Button>
                )}
            </div>

            {/* Add Document Form */}
            {isAdding && (
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">
                            Select Document<span className="text-red-500 ml-1">*</span>
                        </label>
                        <Select
                            value={selectedDoc}
                            onChange={setSelectedDoc}
                            options={availableDocuments}
                            placeholder="Search and select document..."
                            enableSearch={true}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">
                            Relationship Type
                        </label>
                        <Select
                            value={relationship}
                            onChange={setRelationship}
                            options={relationshipTypes}
                            enableSearch={false}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleAddDocument}
                            size="sm"
                            disabled={!selectedDoc}
                        >
                            Add
                        </Button>
                        <Button
                            onClick={() => {
                                setIsAdding(false);
                                setSelectedDoc("");
                                setRelationship("References");
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Related Documents List */}
            {relatedDocs.length > 0 ? (
                <div className="space-y-2">
                    {relatedDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <LinkIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">{doc.documentId}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-0.5">{doc.title}</p>
                                    <p className="text-xs text-emerald-600 mt-1">
                                        <span className="font-medium">Relationship:</span> {doc.relationship}
                                    </p>
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
                    <LinkIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No related documents added yet</p>
                </div>
            )}
        </div>
    );
};
