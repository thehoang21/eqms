import React, { useState, useEffect } from "react";
import { FileText, File as FileIcon, Image as ImageIcon, AlertCircle } from "lucide-react";

interface FilePreviewProps {
    file: File | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "text" | "unsupported">("unsupported");
    const [textContent, setTextContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            setPreviewType("unsupported");
            setTextContent("");
            return;
        }

        setIsLoading(true);

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        // Determine preview type
        if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            setPreviewType("pdf");
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsLoading(false);
        } else if (fileType.startsWith("image/")) {
            setPreviewType("image");
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsLoading(false);
        } else if (
            fileType === "text/plain" ||
            fileName.endsWith(".txt") ||
            fileName.endsWith(".md") ||
            fileName.endsWith(".json") ||
            fileName.endsWith(".xml")
        ) {
            setPreviewType("text");
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target?.result as string || "");
                setIsLoading(false);
            };
            reader.onerror = () => {
                setIsLoading(false);
            };
            reader.readAsText(file);
        } else {
            setPreviewType("unsupported");
            setIsLoading(false);
        }

        // Cleanup
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file]);

    if (!file) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <div className="text-center p-8">
                    <FileIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No file selected</p>
                    <p className="text-sm text-slate-400 mt-2">
                        Upload a file to see preview
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading preview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        {previewType === "pdf" && <FileText className="h-5 w-5 text-emerald-600" />}
                        {previewType === "image" && <ImageIcon className="h-5 w-5 text-emerald-600" />}
                        {previewType === "text" && <FileText className="h-5 w-5 text-emerald-600" />}
                        {previewType === "unsupported" && <FileIcon className="h-5 w-5 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {file.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {(file.size / 1024).toFixed(2)} KB • {file.type || "Unknown type"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-6">
                {previewType === "pdf" && previewUrl && (
                    <iframe
                        src={previewUrl}
                        className="w-full h-full min-h-[600px] border-0 rounded-lg"
                        title={file.name}
                    />
                )}

                {previewType === "image" && previewUrl && (
                    <div className="flex items-center justify-center h-full">
                        <img
                            src={previewUrl}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {previewType === "text" && (
                    <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                        <pre className="whitespace-pre-wrap text-slate-700">{textContent}</pre>
                    </div>
                )}

                {previewType === "unsupported" && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                Preview Not Available
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Preview is not supported for this file type.
                            </p>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-2">File Details:</p>
                                <div className="text-sm space-y-1 text-slate-700">
                                    <p><span className="font-medium">Name:</span> {file.name}</p>
                                    <p><span className="font-medium">Type:</span> {file.type || "Unknown"}</p>
                                    <p><span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                Supported preview formats: PDF, Images (JPG, PNG, GIF), Text files
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
