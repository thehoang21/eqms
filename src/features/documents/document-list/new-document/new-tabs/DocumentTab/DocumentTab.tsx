import React, { useState, useRef } from "react";
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { FilePreview } from "./FilePreview";
import {
  DocumentRelationships,
  ParentDocument,
  RelatedDocument,
} from "./DocumentRelationships";
import { IconCloudUpload } from "@tabler/icons-react";
import pdfIcon from "@/assets/images/image-file/pdf.png";
import docIcon from "@/assets/images/image-file/doc.png";
import docxIcon from "@/assets/images/image-file/docx.png";
import xlsIcon from "@/assets/images/image-file/xls.png";
import xlsxIcon from "@/assets/images/image-file/xlsx.png";
import pptIcon from "@/assets/images/image-file/ppt.png";
import fileIcon from "@/assets/images/image-file/file.png";
// Map pptx to ppt icon; remove incorrect jpg mapping
import jpgIcon from "@/assets/images/image-file/jpg.png";
import jpegIcon from "@/assets/images/image-file/jpeg.png";
import pngIcon from "@/assets/images/image-file/png.png";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

interface DocumentTabProps {
  uploadedFiles: UploadedFile[];
  onFilesChange: (
    files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[]),
  ) => void;
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  maxFiles?: number; // Maximum number of files allowed (undefined = unlimited)
  // Document Relationships
  parentDocument?: ParentDocument | null;
  onParentDocumentChange?: (parent: ParentDocument | null) => void;
  relatedDocuments?: RelatedDocument[];
  onRelatedDocumentsChange?: (docs: RelatedDocument[]) => void;
  documentType?: string;
  onSuggestedCodeChange?: (code: string) => void;
}

export const DocumentTab: React.FC<DocumentTabProps> = ({
  uploadedFiles,
  onFilesChange,
  selectedFile,
  onSelectFile,
  maxFiles,
  parentDocument,
  onParentDocumentChange,
  relatedDocuments = [],
  onRelatedDocumentsChange,
  documentType,
  onSuggestedCodeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [isCorrelatedModalOpen, setIsCorrelatedModalOpen] = useState(false);

  // Check if max files limit is reached
  const isMaxFilesReached =
    maxFiles !== undefined && uploadedFiles.length >= maxFiles;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMaxFilesReached) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (isMaxFilesReached) return;

    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !isMaxFilesReached) {
      const files = Array.from(e.target.files) as File[];
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Limit files based on maxFiles
    let filesToUpload = files;
    if (maxFiles !== undefined) {
      const remainingSlots = maxFiles - uploadedFiles.length;
      if (remainingSlots <= 0) return;
      filesToUpload = files.slice(0, remainingSlots);
    }

    const newFiles: UploadedFile[] = filesToUpload.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "uploading",
    }));

    onFilesChange((prev) => [...prev, ...newFiles]);

    // Auto-select first file for preview
    if (!selectedFile && newFiles.length > 0) {
      onSelectFile(newFiles[0].file);
    }

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      onFilesChange((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f,
        ),
      );

      if (progress >= 100) {
        clearInterval(interval);
        onFilesChange((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "success" } : f)),
        );
      }
    }, 200);
  };

  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    onFilesChange((prev) => prev.filter((f) => f.id !== fileId));

    // If removed file was selected, clear preview or select another
    if (fileToRemove && selectedFile === fileToRemove.file) {
      const remaining = uploadedFiles.filter((f) => f.id !== fileId);
      onSelectFile(remaining.length > 0 ? remaining[0].file : null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Buttons Row: Upload File + Document Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Upload File Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple={maxFiles === undefined || maxFiles > 1}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
            disabled={isMaxFilesReached}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isMaxFilesReached}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm font-medium rounded-lg border transition-all shadow-sm",
              isMaxFilesReached
                ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                : "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700 active:scale-95"
            )}
          >
            <span>Upload File</span>
          </button>
        </div>

        {/* Document Relationships Buttons */}
        {onParentDocumentChange && onRelatedDocumentsChange && (
          <>
            <div>
              <button
                onClick={() => setIsRelatedModalOpen(true)} 
                className="w-full h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm transition-all active:scale-95 inline-flex items-center justify-center"
              >
                Select Related Documents
                {relatedDocuments.length > 0 && (
                  <span className="ml-2 text-xs text-slate-500">
                    ({relatedDocuments.length})
                  </span>
                )}
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsCorrelatedModalOpen(true)}
                className="w-full h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm transition-all active:scale-95 inline-flex items-center justify-center"
              >
                Select Correlated Documents
                {parentDocument && (
                  <span className="ml-2 text-xs text-slate-500">
                    ({parentDocument.id})
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* DocumentRelationships Modals */}
      {onParentDocumentChange && onRelatedDocumentsChange && (
        <DocumentRelationships
          parentDocument={parentDocument || null}
          onParentDocumentChange={onParentDocumentChange}
          relatedDocuments={relatedDocuments}
          onRelatedDocumentsChange={onRelatedDocumentsChange}
          documentType={documentType}
          onSuggestedCodeChange={onSuggestedCodeChange}
          isRelatedModalOpen={isRelatedModalOpen}
          onRelatedModalClose={() => setIsRelatedModalOpen(false)}
          isCorrelatedModalOpen={isCorrelatedModalOpen}
          onCorrelatedModalClose={() => setIsCorrelatedModalOpen(false)}
        />
      )}

      {/* File Preview and Uploaded Files */}
      <div className="space-y-4 md:space-y-6">
        {/* Uploaded Files List - Horizontal scroll on desktop */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">
                Uploaded Files ({uploadedFiles.length})
              </h4>
              {maxFiles !== undefined && (
                <span className="text-xs text-slate-500">
                  {uploadedFiles.length}/{maxFiles}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className={cn(
                    "relative group bg-white border rounded-lg p-3 transition-all cursor-pointer hover:shadow-md",
                    selectedFile === uploadedFile.file
                      ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/30"
                      : "border-slate-200 hover:border-emerald-500/50",
                  )}
                  onClick={() => onSelectFile(uploadedFile.file)}
                >
                  <div className="flex items-start gap-2">
                    {/* File Icon */}
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      {(() => {
                        const name = uploadedFile.file.name.toLowerCase();
                        const ext = name.split(".").pop() || "";
                        const iconMap: Record<string, string> = {
                          pdf: pdfIcon,
                          doc: docIcon,
                          docx: docxIcon,
                          xls: xlsIcon,
                          xlsx: xlsxIcon,
                          ppt: pptIcon,
                          pptx: pptIcon,
                          jpg: jpgIcon,
                          jpeg: jpegIcon,
                          png: pngIcon,
                        };
                        const iconSrc = iconMap[ext] || fileIcon;
                        return (
                          <img
                            src={iconSrc}
                            alt="file icon"
                            className="h-7 w-7 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        );
                      })()}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {uploadedFile.file.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatFileSize(uploadedFile.file.size)}
                          </p>
                        </div>

                        {/* Status & Remove */}
                        <div className="flex items-center gap-1">
                          {uploadedFile.status === "success" && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                          {uploadedFile.status === "error" && (
                            <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(uploadedFile.id);
                            }}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                            title="Remove"
                          >
                            <X className="h-3.5 w-3.5 text-slate-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {uploadedFile.status === "uploading" && (
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                            <span>Uploading...</span>
                            <span>{uploadedFile.progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                              style={{ width: `${uploadedFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Status Messages */}
                      {uploadedFile.status === "success" && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          ✓ Uploaded
                        </p>
                      )}
                      {uploadedFile.status === "error" && (
                        <p className="text-xs text-red-600 mt-1">
                          {uploadedFile.error || "Upload failed"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Preview - Full width */}
        <div className="h-[600px]">
          {(() => {
            if (uploadedFiles.length === 0) {
              return (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                      <File className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">No files uploaded</p>
                    <p className="text-sm text-slate-500">Click "Upload File" button to add documents</p>
                  </div>
                </div>
              );
            }

            const selected = uploadedFiles.find(
              (f) => f.file === selectedFile,
            );
            
            if (!selected || selected.status !== "success") {
              return (
                <div className="h-full flex items-center justify-center border rounded-xl bg-slate-50">
                  <div className="text-center p-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                      {selected?.status === "uploading" ? (
                        <Upload className="h-6 w-6 text-slate-400 animate-pulse" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {selected?.status === "uploading" && "Uploading file..."}
                      {selected?.status === "error" && "File upload failed"}
                      {!selected && "Select a file to preview"}
                    </p>
                  </div>
                </div>
              );
            }
            
            return <FilePreview file={selectedFile} />;
          })()}
        </div>
      </div>
    </div>
  );
};
