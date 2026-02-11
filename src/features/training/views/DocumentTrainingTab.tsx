import React, { useState, useRef, useCallback } from "react";
import { Upload, Trash2 } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { TrainingFile } from "../types";

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
    trainingFiles: TrainingFile[];
    setTrainingFiles: React.Dispatch<React.SetStateAction<TrainingFile[]>>;
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
];
const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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

export const DocumentTrainingTab: React.FC<DocumentTrainingTabProps> = ({
    trainingFiles,
    setTrainingFiles,
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = useCallback((files: FileList | File[]) => {
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
                    setTrainingFiles(prev =>
                        prev.map(f => f.id === tf.id ? { ...f, progress: 100, status: "success" } : f)
                    );
                } else {
                    setTrainingFiles(prev =>
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
        setTrainingFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="p-4 lg:p-6 space-y-4">
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
                    PDF, Word, PowerPoint, Images (max 50MB each)
                </p>
            </div>

            {/* File List */}
            {trainingFiles.length > 0 && (
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
            )}
        </div>
    );
};
