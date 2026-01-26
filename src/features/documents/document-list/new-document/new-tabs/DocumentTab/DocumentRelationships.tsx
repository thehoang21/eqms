import React, { useState, useMemo } from "react";
import { X, FileText, Check, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { Button } from "@/components/ui/button/Button";
import { FormModal } from "@/components/ui/modal/FormModal";
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
  isRelatedModalOpen?: boolean;
  onRelatedModalClose?: () => void;
  isCorrelatedModalOpen?: boolean;
  onCorrelatedModalClose?: () => void;
}

export const DocumentRelationships: React.FC<DocumentRelationshipsProps> = ({
  parentDocument,
  onParentDocumentChange,
  relatedDocuments,
  onRelatedDocumentsChange,
  documentType,
  onSuggestedCodeChange,
  isRelatedModalOpen: externalRelatedModalOpen,
  onRelatedModalClose: externalRelatedModalClose,
  isCorrelatedModalOpen: externalCorrelatedModalOpen,
  onCorrelatedModalClose: externalCorrelatedModalClose,
}) => {
  const [selectedRelatedId, setSelectedRelatedId] = useState<string>("");
  const [internalParentModalOpen, setInternalParentModalOpen] = useState(false);
  const [internalRelatedModalOpen, setInternalRelatedModalOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isParentModalOpen = externalCorrelatedModalOpen !== undefined ? externalCorrelatedModalOpen : internalParentModalOpen;
  const setIsParentModalOpen = externalCorrelatedModalClose || setInternalParentModalOpen;
  const isRelatedModalOpen = externalRelatedModalOpen !== undefined ? externalRelatedModalOpen : internalRelatedModalOpen;
  const setIsRelatedModalOpen = externalRelatedModalClose || setInternalRelatedModalOpen;

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
    <>
      {/* Modals Only - No Buttons */}
      {/* Parent Document Modal */}
      <FormModal
        isOpen={isParentModalOpen}
        onClose={() => typeof setIsParentModalOpen === 'function' ? setIsParentModalOpen(false) : setIsParentModalOpen}
        title="Select Correlated Documents"
        description="Link peer-level documents (e.g., Procurement SOP ↔ Inventory Control SOP)"
        size="md"
        showCancel={false}
        confirmText="Done"
        onConfirm={() => typeof setIsParentModalOpen === 'function' ? setIsParentModalOpen(false) : setIsParentModalOpen}
      >
        <div className="space-y-4">
          {/* Parent Document Select */}
          <div>
            <Select
              label="Correlated Document"
              value={parentDocument?.id || ""}
              onChange={handleParentChange}
              options={parentOptions}
              placeholder="-- None --"
              enableSearch={true}
              searchPlaceholder="Search correlated documents..."
            />
          </div>

          {/* Parent Document Card (if selected) */}
          {parentDocument && (
            <div className="p-1.5 md:p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-sm font-bold text-blue-900">{parentDocument.id}</span>
                    <span className="px-1.5 py-0.5 bg-blue-200 text-blue-900 text-xs font-bold rounded">
                      {parentDocument.type}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 line-clamp-2">{parentDocument.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-blue-700">
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-semibold">Selected as correlated document</span>
                  </div>
                </div>
                <button
                  onClick={() => handleParentChange("")}
                  className="p-1 hover:bg-blue-100 rounded-md transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5 text-blue-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      </FormModal>

      {/* Related Documents Modal */}
      <FormModal
        isOpen={isRelatedModalOpen}
        onClose={() => typeof setIsRelatedModalOpen === 'function' ? setIsRelatedModalOpen(false) : setIsRelatedModalOpen}
        title="Select Related Documents"
        description="Link subordinate documents (Forms, Annexes, Work Instructions, etc.)"
        size="md"
        showCancel={false}
        confirmText="Done"
        onConfirm={() => typeof setIsRelatedModalOpen === 'function' ? setIsRelatedModalOpen(false) : setIsRelatedModalOpen}
      >
        <div className="space-y-4">
          {/* Add Related Document Select */}
          <div>
            <Select
              label="Add Document"
              value={selectedRelatedId}
              onChange={handleAddRelatedDocument}
              options={relatedOptions}
              placeholder="-- Select --"
              enableSearch={true}
              searchPlaceholder="Search documents..."
            />
          </div>

          {/* Related Documents List */}
          {relatedDocuments.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-700">
                  Selected Documents ({relatedDocuments.length})
                </h4>
                {relatedDocuments.length > 0 && (
                  <button
                    onClick={() => onRelatedDocumentsChange([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {relatedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-2 p-1.5 md:p-2 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-sm font-bold text-emerald-900">{doc.id}</span>
                        <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 text-xs font-bold rounded">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-sm text-emerald-800 line-clamp-2">{doc.title}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveRelated(doc.id)}
                      className="p-1 hover:bg-emerald-200 rounded-md transition-colors flex-shrink-0"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5 text-emerald-700" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No documents selected</p>
              <p className="text-sm text-slate-400 mt-1">
                Use the dropdown above to add reference documents
              </p>
            </div>
          )}
        </div>
      </FormModal>
    </>
  );
};
