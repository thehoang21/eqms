import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { FormModal } from "@/components/ui/modal/FormModal";

interface UploadRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File, note: string, useTemplate: boolean) => void;
  documentName: string;
  revisionNumber: string;
}

export const UploadRevisionModal: React.FC<UploadRevisionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  documentName,
  revisionNumber,
}) => {
  const [note, setNote] = useState("");
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = `${documentName}_${revisionNumber}`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onConfirm(selectedFile, note, useTemplate);
      // Reset state
      setNote("");
      setUseTemplate(false);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    // Reset state
    setNote("");
    setUseTemplate(false);
    setSelectedFile(null);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Upload revision"
      confirmText="OK"
      cancelText="Cancel"
      size="lg"
      isLoading={false}
      confirmDisabled={!selectedFile}
    >
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={displayName}
            disabled
            className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Note: The uploaded file will be renamed to the name above
          </p>
        </div>

        {/* Revision Number Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Revision Number
          </label>
          <input
            type="text"
            value={revisionNumber}
            disabled
            className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm cursor-not-allowed"
          />
        </div>

        {/* Note Textarea */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter notes about this revision..."
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Checkbox */}
        <div>
          <Checkbox
            id="use-template"
            checked={useTemplate}
            onChange={(checked) => setUseTemplate(checked)}
            label="Select file from template"
          />
        </div>

        {/* File Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
            <span className="text-sm text-slate-600 truncate">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>
      </div>
    </FormModal>
  );
};
