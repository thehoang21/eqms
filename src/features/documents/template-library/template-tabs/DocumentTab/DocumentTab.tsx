import React, { useState, useRef } from "react";
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from '@/components/ui/utils';
import { FilePreview } from "./FilePreview";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import pdfIcon from '@/assets/images/image-file/pdf.png';
import wordIcon from '@/assets/images/image-file/word.png';
import excelIcon from '@/assets/images/image-file/excel.png';

export interface UploadedFile {
    id: string;
    file: File;
    progress: number;
    status: "uploading" | "success" | "error";
    error?: string;
}

interface DocumentTabProps {
    uploadedFiles: UploadedFile[];
    onFilesChange: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
    selectedFile: File | null;
    onSelectFile: (file: File | null) => void;
    maxFiles?: number; // Maximum number of files allowed (undefined = unlimited)
}

export const DocumentTab: React.FC<DocumentTabProps> = ({
    uploadedFiles,
    onFilesChange,
    selectedFile,
    onSelectFile,
    maxFiles
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if max files limit is reached
    const isMaxFilesReached = maxFiles !== undefined && uploadedFiles.length >= maxFiles;

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
                    f.id === fileId
                        ? { ...f, progress: Math.min(progress, 100) }
                        : f
                )
            );

            if (progress >= 100) {
                clearInterval(interval);
                onFilesChange((prev) =>
                    prev.map((f) =>
                        f.id === fileId
                            ? { ...f, status: "success" }
                            : f
                    )
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
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Column: Upload Area */}
            <div className="space-y-6">
                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
                        isMaxFilesReached
                            ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                            : isDragging
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple={maxFiles === undefined || maxFiles > 1}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                        disabled={isMaxFilesReached}
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors",
                            isMaxFilesReached ? "bg-slate-200" : isDragging ? "bg-emerald-100" : "bg-slate-200"
                        )}>
                            <IconCloudUpload className={cn(
                                "h-7 w-7 transition-colors",
                                isMaxFilesReached ? "text-slate-400" : isDragging ? "text-emerald-600" : "text-slate-500"
                            )} />
                        </div>

                        <h3 className="text-base font-semibold text-slate-900 mb-2">
                            {isMaxFilesReached 
                                ? `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} uploaded`
                                : isDragging 
                                    ? "Drop files here" 
                                    : "Upload Document Files"}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {isMaxFilesReached
                                ? "Remove existing file to upload a new one"
                                : maxFiles === 1
                                    ? "Upload a single document file"
                                    : "Drag and drop your files here, or click to browse"}
                        </p>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isMaxFilesReached}
                            className={cn(
                                "px-5 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm",
                                isMaxFilesReached
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            )}
                        >
                            Browse Files
                        </button>

                        <p className="text-xs text-slate-400 mt-3">
                            PDF, Office, Images, Text (Max 50MB)
                            {maxFiles !== undefined && ` • Max ${maxFiles} file${maxFiles > 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-700">
                                Uploaded Files ({uploadedFiles.length})
                            </h4>
                            {uploadedFiles.length > 1 && (
                                <button
                                    type="button"
                                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors font-medium inline-flex items-center gap-1.5"
                                    onClick={() => {
                                        onFilesChange([]);
                                        onSelectFile(null);
                                    }}
                                >
                                    <IconTrash className="h-3.5 w-3.5 text-red-700" />
                                    Remove All Files
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {uploadedFiles.map((uploadedFile) => (
                                <div
                                    key={uploadedFile.id}
                                    className={cn(
                                        "bg-white border rounded-lg p-3 transition-all cursor-pointer",
                                        selectedFile === uploadedFile.file
                                            ? "border-emerald-500 shadow-md ring-2 ring-emerald-100"
                                            : "border-slate-200 hover:shadow-md hover:border-emerald-300"
                                    )}
                                    onClick={() => onSelectFile(uploadedFile.file)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* File Icon */}
                                        <div className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                            selectedFile === uploadedFile.file
                                                ? "bg-emerald-100"
                                                : "bg-slate-50"
                                        )}>
                                            {(() => {
                                                const name = uploadedFile.file.name.toLowerCase();
                                                let iconSrc: string | null = null;
                                                if (name.endsWith('.pdf')) iconSrc = pdfIcon;
                                                else if (name.endsWith('.doc') || name.endsWith('.docx')) iconSrc = wordIcon;
                                                else if (name.endsWith('.xls') || name.endsWith('.xlsx')) iconSrc = excelIcon;
                                                if (iconSrc) {
                                                    return <img src={iconSrc} alt="file icon" className="h-6 w-6 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />;
                                                }
                                                return <File className={cn(
                                                    "h-4 w-4",
                                                    selectedFile === uploadedFile.file
                                                        ? "text-emerald-600"
                                                        : "text-slate-500"
                                                )} />;
                                            })()}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {uploadedFile.file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {formatFileSize(uploadedFile.file.size)}
                                                    </p>
                                                </div>

                                                {/* Status Icon */}
                                                <div className="flex items-center gap-1.5">
                                                    {uploadedFile.status === "success" && (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                    )}
                                                    {uploadedFile.status === "error" && (
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFile(uploadedFile.id);
                                                        }}
                                                        className="p-1 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove"
                                                    >
                                                        <X className="h-4 w-4 text-slate-400 hover:text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {uploadedFile.status === "uploading" && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                                        <span>Uploading...</span>
                                                        <span>{uploadedFile.progress}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                                                            style={{ width: `${uploadedFile.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Success Message */}
                                            {uploadedFile.status === "success" && (
                                                <p className="text-xs text-emerald-600 mt-1.5 font-medium">
                                                    ✓ Upload completed
                                                </p>
                                            )}

                                            {/* Error Message */}
                                            {uploadedFile.status === "error" && (
                                                <p className="text-xs text-red-600 mt-1.5">
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

                {/* Info Box */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2.5">
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Upload Guidelines</p>
                            <ul className="space-y-0.5 text-blue-700">
                                <li>• Upload main document and supporting files</li>
                                <li>• Files are version controlled and tracked</li>
                                <li>• Click on any file to preview</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
                        {/* Right Column: File Preview */}
                        <div className="h-full min-h-[600px]">
                                {(() => {
                                    const selected = uploadedFiles.find(f => f.file === selectedFile);
                                    if (!selected || selected.status !== 'success') {
                                        return (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm" style={{ height: "calc(100vh - 300px)" }}>
                                                {selected && selected.status === 'uploading' && 'Uploading...'}
                                                {selected && selected.status === 'error' && 'Upload failed'}
                                                {!selected && 'No file selected for preview'}
                                            </div>
                                        );
                                    }
                                    return <FilePreview file={selectedFile} />;
                                })()}
                        </div>
        </div>
    );
};
