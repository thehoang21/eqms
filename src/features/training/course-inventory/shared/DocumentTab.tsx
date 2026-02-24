import React, { useState, useRef, useCallback } from "react";
import { Upload, Trash2, FileText, Film, Presentation, Eye, Download } from "lucide-react";
import { Textarea } from "@/components/ui/form/ResponsiveForm";
import { cn } from "@/components/ui/utils";
import { TrainingFile } from "../../types";

import pdfIcon from "@/assets/images/image-file/pdf.png";
import docIcon from "@/assets/images/image-file/doc.png";
import docxIcon from "@/assets/images/image-file/docx.png";
import pptIcon from "@/assets/images/image-file/ppt.png";
import pptxIcon from "@/assets/images/image-file/pptx.png";
import jpgIcon from "@/assets/images/image-file/jpg.png";
import jpegIcon from "@/assets/images/image-file/jpeg.png";
import pngIcon from "@/assets/images/image-file/png.png";
import fileIcon from "@/assets/images/image-file/file.png";

interface DocumentTrainingTabProps {
    readOnly?: boolean;
    trainingFiles: TrainingFile[];
    setTrainingFiles?: React.Dispatch<React.SetStateAction<TrainingFile[]>>;
    instruction: string;
    setInstruction?: (v: string) => void;
}

const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];
const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const FILE_ICON_MAP: Record<string, string> = {
    pdf: pdfIcon,
    doc: docIcon,
    docx: docxIcon,
    ppt: pptIcon,
    pptx: pptxIcon,
    jpg: jpgIcon,
    jpeg: jpegIcon,
    png: pngIcon,
};

const getFileIconSrc = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return FILE_ICON_MAP[ext] || fileIcon;
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DocumentTab: React.FC<DocumentTrainingTabProps> = ({
    readOnly = false,
    trainingFiles,
    setTrainingFiles,
    instruction,
    setInstruction,
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = useCallback((files: FileList | File[]) => {
        if (!setTrainingFiles) return;
        const validFiles = Array.from(files).filter(file => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                alert(`"${file.name}" is not a supported file type.`);
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                alert(`"${file.name}" exceeds the 50MB size limit.`);
                return false;
            }
            return true;
        });

        const newFiles: TrainingFile[] = validFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: "uploading" as const,
        }));

        setTrainingFiles(prev => [...prev, ...newFiles]);

        // Simulate upload progress
        newFiles.forEach(tf => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30 + 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTrainingFiles!(prev =>
                        prev.map(f => f.id === tf.id ? { ...f, progress: 100, status: "success" } : f)
                    );
                } else {
                    setTrainingFiles!(prev =>
                        prev.map(f => f.id === tf.id ? { ...f, progress: Math.round(progress) } : f)
                    );
                }
            }, 200);
        });
    }, [setTrainingFiles]);

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            e.target.value = "";
        }
    };

    const removeFile = (id: string) => {
        setTrainingFiles?.(prev => prev.filter(f => f.id !== id));
    };

    // ─── Read-Only Mode ────────────────────────────────────────────
    if (readOnly) {
        return (
            <div className="p-4 lg:p-6 space-y-6">
                {/* Training Files */}
                <div className="space-y-4">
                    {trainingFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Upload className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-sm font-medium text-slate-900">No training materials uploaded</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Training documents will appear here once uploaded.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-700">
                                    {trainingFiles.length} file{trainingFiles.length > 1 ? "s" : ""} uploaded
                                </p>
                            </div>
                            <div className="space-y-2">
                                {trainingFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                    >
                                        <img
                                            src={getFileIconSrc(file.name)}
                                            alt=""
                                            className="h-10 w-10 object-contain"
                                            onError={(e) => { (e.target as HTMLImageElement).src = fileIcon; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-200 transition-colors"
                                                title="Preview"
                                            >
                                                <Eye className="h-4 w-4 text-slate-600" />
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-200 transition-colors"
                                                title="Download"
                                            >
                                                <Download className="h-4 w-4 text-slate-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Instruction (read-only) */}
                {instruction && (
                    <div className="border-t border-slate-200 pt-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Instruction
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{instruction}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ─── Edit Mode ─────────────────────────────────────────────────

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Section Header */}
            <div>
                <h3 className="text-base font-semibold text-slate-900">Upload Training Materials</h3>
                <p className="text-sm text-slate-500 mt-1">Upload SOP documents (PDF), presentation slides, or training videos for this course.</p>
            </div>
            {/* Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                    isDragOver
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />
                <Upload className={cn(
                    "h-8 w-8 mb-3 transition-colors",
                    isDragOver ? "text-emerald-500" : "text-slate-400"
                )} />
                <p className="text-sm font-medium text-slate-700">
                    {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    PDF, Word, PowerPoint, Videos (max 100MB each)
                </p>
            </div>

            {/* File List */}
            {trainingFiles.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Uploaded Files ({trainingFiles.length})</h4>
                    <div className="space-y-2">
                    {trainingFiles.map(file => (
                        <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:bg-slate-100 transition-colors"
                        >
                            {/* File Icon */}
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                <img
                                    src={getFileIconSrc(file.name)}
                                    alt="file icon"
                                    className="h-7 w-7 object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                                    {file.status === "uploading" && (
                                        <span className="text-xs text-emerald-600 font-medium">{file.progress}%</span>
                                    )}
                                    {file.status === "success" && (
                                        <span className="text-xs text-emerald-600 font-medium">Uploaded</span>
                                    )}
                                    {file.status === "error" && (
                                        <span className="text-xs text-red-600 font-medium">Failed</span>
                                    )}
                                </div>
                                {/* Progress Bar */}
                                {file.status === "uploading" && (
                                    <div className="w-full h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                            style={{ width: `${file.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(file.id);
                                }}
                                className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove file"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    </div>
                </div>
            )}

            {/* Instruction / Notes */}
            <div className="border-t border-slate-200 pt-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Instruction
                    </label>
                    <Textarea
                        value={instruction}
                        onChange={(e) => setInstruction?.(e.target.value)}
                        rows={4}
                        placeholder="e.g., Focus on Chapter 3 – Cleaning Validation Procedures. Pay special attention to Appendix B for equipment handling."
                    />
                    <p className="text-xs text-slate-500">Provide notes to help employees focus on specific sections or key points in the training materials.</p>
                </div>
            </div>
        </div>
    );
};
