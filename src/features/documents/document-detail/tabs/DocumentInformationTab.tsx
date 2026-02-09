import React, { useState } from "react";

interface DocumentInformationTabProps {
  isReadOnly?: boolean;
  documentName?: string;
  documentNumber?: string;
  documentCreated?: string; // dd/MM/yyyy HH:mm:ss
  onDocumentNameChange?: (value: string) => void;
  onDocumentNumberChange?: (value: string) => void;
  onDocumentCreatedChange?: (value: string) => void;
}

export const DocumentInformationTab: React.FC<DocumentInformationTabProps> = ({
  isReadOnly = false,
  documentName: externalDocumentName,
  documentNumber: externalDocumentNumber,
  documentCreated: externalDocumentCreated,
  onDocumentNameChange,
  onDocumentNumberChange,
  onDocumentCreatedChange,
}) => {
  const [internalDocumentName, setInternalDocumentName] = useState("");
  const [internalDocumentNumber, setInternalDocumentNumber] = useState("");
  const [internalDocumentCreated, setInternalDocumentCreated] = useState("");

  const documentName = externalDocumentName !== undefined ? externalDocumentName : internalDocumentName;
  const documentNumber = externalDocumentNumber !== undefined ? externalDocumentNumber : internalDocumentNumber;
  const documentCreated = externalDocumentCreated !== undefined ? externalDocumentCreated : internalDocumentCreated;

  const handleDocumentNameChange = (value: string) => {
    if (onDocumentNameChange) {
      onDocumentNameChange(value);
    } else {
      setInternalDocumentName(value);
    }
  };

  const handleDocumentNumberChange = (value: string) => {
    if (onDocumentNumberChange) {
      onDocumentNumberChange(value);
    } else {
      setInternalDocumentNumber(value);
    }
  };

  const handleDocumentCreatedChange = (value: string) => {
    if (onDocumentCreatedChange) {
      onDocumentCreatedChange(value);
    } else {
      setInternalDocumentCreated(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Document Name - Full Width Row */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Document Name
        </label>
        <input
          type="text"
          value={documentName}
          onChange={(e) => handleDocumentNameChange(e.target.value)}
          placeholder="Enter document name..."
          disabled={isReadOnly}
          className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
        />
      </div>

      {/* Document Number and Created - Same Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Document Number
          </label>
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => handleDocumentNumberChange(e.target.value)}
            placeholder="Enter document number..."
            disabled={isReadOnly}
            className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Document Created
          </label>
          <input
            type="text"
            value={documentCreated}
            onChange={(e) => handleDocumentCreatedChange(e.target.value)}
            placeholder="dd/MM/yyyy HH:mm:ss"
            disabled={isReadOnly}
            className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
