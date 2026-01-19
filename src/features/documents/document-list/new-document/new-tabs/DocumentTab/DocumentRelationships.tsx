import React, { useState, useMemo } from "react";
import { Link2, X, FileText, Check, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";

// Mock data - Replace with API call
const MOCK_EFFECTIVE_DOCUMENTS = [
  { id: "SOP.0045", title: "Quality Control Testing Procedure", type: "SOP", status: "Effective" },
  { id: "SOP.0023", title: "Equipment Maintenance Protocol", type: "SOP", status: "Effective" },
  { id: "WI.0112", title: "Calibration Work Instruction", type: "Work Instruction", status: "Effective" },
  { id: "FORM.0089", title: "Inspection Checklist Template", type: "Form", status: "Effective" },
  { id: "SOP.0156", title: "Document Control Procedure", type: "SOP", status: "Effective" },
];

const MOCK_ALL_DOCUMENTS = [
  ...MOCK_EFFECTIVE_DOCUMENTS,
  { id: "SOP.0067", title: "Training Management Procedure", type: "SOP", status: "Effective" },
  { id: "WI.0234", title: "Sampling Work Instruction", type: "Work Instruction", status: "Effective" },
  { id: "POLICY.0012", title: "Quality Policy Document", type: "Policy", status: "Effective" },
];

export interface ParentDocument {
  id: string;
  title: string;
  type: string;
}

export interface RelatedDocument {
  id: string;
  title: string;
  type: string;
}

interface DocumentRelationshipsProps {
  parentDocument: ParentDocument | null;
  onParentDocumentChange: (parent: ParentDocument | null) => void;
  relatedDocuments: RelatedDocument[];
  onRelatedDocumentsChange: (docs: RelatedDocument[]) => void;
  documentType?: string; // Current document type to suggest numbering
  onSuggestedCodeChange?: (code: string) => void; // Callback to update suggested document code
}

export const DocumentRelationships: React.FC<DocumentRelationshipsProps> = ({
  parentDocument,
  onParentDocumentChange,
  relatedDocuments,
  onRelatedDocumentsChange,
  documentType,
  onSuggestedCodeChange,
}) => {
  const [selectedRelatedId, setSelectedRelatedId] = useState<string>("");

  // Prepare options for parent document select (only Effective documents)
  const parentOptions = useMemo(() => [
    { label: "-- None (This is a standalone document) --", value: "" },
    ...MOCK_EFFECTIVE_DOCUMENTS.map((doc) => ({
      label: `${doc.id} - ${doc.title}`,
      value: doc.id,
    })),
  ], []);

  // Prepare options for related documents (all except current parent and already selected)
  const relatedOptions = useMemo(() => {
    const excludedIds = [
      parentDocument?.id,
      ...relatedDocuments.map((d) => d.id),
    ].filter(Boolean);

    return [
      { label: "-- Select a document to add --", value: "" },
      ...MOCK_ALL_DOCUMENTS.filter((doc) => !excludedIds.includes(doc.id)).map((doc) => ({
        label: `${doc.id} - ${doc.title}`,
        value: doc.id,
      })),
    ];
  }, [parentDocument, relatedDocuments]);

  // Handle parent document selection
  const handleParentChange = (value: string) => {
    if (value === "") {
      onParentDocumentChange(null);
      onSuggestedCodeChange?.(""); // Clear suggested code
    } else {
      const selected = MOCK_EFFECTIVE_DOCUMENTS.find((doc) => doc.id === value);
      if (selected) {
        onParentDocumentChange({
          id: selected.id,
          title: selected.title,
          type: selected.type,
        });

        // Generate suggested code based on parent and document type
        const suggestedCode = generateChildDocumentCode(selected.id, documentType || "");
        onSuggestedCodeChange?.(suggestedCode);
      }
    }
  };

  // Handle related document addition
  const handleAddRelatedDocument = (value: string) => {
    if (value === "") return;

    const selected = MOCK_ALL_DOCUMENTS.find((doc) => doc.id === value);
    if (selected) {
      const newRelated: RelatedDocument = {
        id: selected.id,
        title: selected.title,
        type: selected.type,
      };
      onRelatedDocumentsChange([...relatedDocuments, newRelated]);
      setSelectedRelatedId(""); // Reset select
    }
  };

  // Remove related document
  const handleRemoveRelated = (id: string) => {
    onRelatedDocumentsChange(relatedDocuments.filter((doc) => doc.id !== id));
  };

  // Generate child document code based on parent and type
  const generateChildDocumentCode = (parentId: string, docType: string): string => {
    // Extract next number for child documents
    // Example: SOP.0045 -> SOP.0045-F01 for Form, SOP.0045-A01 for Annex
    let suffix = "01";
    
    if (docType.toLowerCase().includes("form")) {
      suffix = "F01";
    } else if (docType.toLowerCase().includes("annex")) {
      suffix = "A01";
    } else if (docType.toLowerCase().includes("appendix")) {
      suffix = "AP01";
    } else {
      suffix = "01"; // Default child numbering
    }

    return `${parentId}-${suffix}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Section A: Parent Link */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
        {/* Card Header */}
        <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Link2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-slate-900 truncate">
                Link to Parent Document
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 mt-0.5 truncate">
                If this is an Annex/Form of SOP
              </p>
            </div>
            {parentDocument && (
              <span className="hidden sm:inline-flex px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                Linked
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 md:p-5 space-y-3 md:space-y-4 flex-1">
          {/* Parent Document Select */}
          <div>
            <Select
              label="Select Parent Document"
              value={parentDocument?.id || ""}
              onChange={handleParentChange}
              options={parentOptions}
              placeholder="-- None --"
              enableSearch={true}
              searchPlaceholder="Search..."
            />
            <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5">
              Only <span className="font-semibold">Effective</span> documents
            </p>
          </div>

          {/* Parent Document Card (if selected) */}
          {parentDocument && (
            <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <span className="text-xs md:text-sm font-bold text-blue-900">{parentDocument.id}</span>
                    <span className="px-1.5 md:px-2 py-0.5 bg-blue-200 text-blue-900 text-[10px] md:text-xs font-bold rounded">
                      {parentDocument.type}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-blue-800 mt-1 line-clamp-2">{parentDocument.title}</p>
                  <div className="flex items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2 text-[10px] md:text-xs text-blue-700">
                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0" />
                    <span className="font-semibold">Selected</span>
                  </div>
                </div>
                <button
                  onClick={() => handleParentChange("")}
                  className="p-1 md:p-1.5 hover:bg-blue-100 rounded-md transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-700" />
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 md:gap-2.5 p-2.5 md:p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] md:text-xs text-amber-800">
              <p className="font-semibold">Document Code Note:</p>
              <p className="mt-0.5 md:mt-1">
                System auto-suggests (e.g., <strong>SOP.0045-F01</strong> for Form)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Related Documents */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
        {/* Card Header */}
        <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-slate-900 truncate">
                Related Documents
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 mt-0.5 truncate">
                Referenced documents
              </p>
            </div>
            {relatedDocuments.length > 0 && (
              <span className="hidden sm:inline-flex px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex-shrink-0">
                {relatedDocuments.length}
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 md:p-5 space-y-3 md:space-y-4 flex-1">
          {/* Add Related Document Select */}
          <div>
            <Select
              label="Add Document"
              value={selectedRelatedId}
              onChange={handleAddRelatedDocument}
              options={relatedOptions}
              placeholder="-- Select --"
              enableSearch={true}
              searchPlaceholder="Search..."
            />
            <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5">
              Select multiple reference documents
            </p>
          </div>

          {/* Related Documents Tags/Badges */}
          {relatedDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] md:text-xs font-bold text-slate-700">
                Selected ({relatedDocuments.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-[180px] md:max-h-[200px] overflow-y-auto">
                {relatedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-1 md:gap-1.5 flex-1 min-w-0">
                      <FileText className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-600 flex-shrink-0" />
                      <div className="text-[10px] md:text-xs min-w-0">
                        <span className="font-bold text-emerald-900">{doc.id}</span>
                        <span className="text-emerald-700 ml-0.5 md:ml-1 truncate block sm:inline">
                          - {doc.title}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveRelated(doc.id)}
                      className="p-0.5 hover:bg-emerald-200 rounded transition-colors flex-shrink-0"
                      title="Remove"
                    >
                      <X className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-700" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {relatedDocuments.length === 0 && (
            <div className="p-4 md:p-6 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-slate-300 mx-auto mb-1.5 md:mb-2" />
              <p className="text-xs md:text-sm text-slate-500 font-medium">No documents yet</p>
              <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1">
                Add reference documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
