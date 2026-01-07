import React, { useState, useEffect, useRef } from "react";
import { FileText, File as FileIcon, Image as ImageIcon, AlertCircle, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./docx-preview.css";
import FilePreviewLib from "reactjs-file-preview";
import filePlaceholder from "@/assets/images/image-file/file.png";
import { renderAsync } from "docx-preview";
import { Button } from "@/components/ui/button/Button";

interface FilePreviewProps {
    file: File | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<"pdf" | "image" | "text" | "docx" | "unsupported">("unsupported");
    const docxContainerRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(80);
    const [textContent, setTextContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 10, 200));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 10, 50));
    };

    const handleResetZoom = () => {
        setZoomLevel(80);
    };

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            setPreviewType("unsupported");
            setTextContent("");
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        console.log("Processing file:", { fileName, fileType, size: file.size });

        // PDF - use iframe
        if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
            setPreviewType("pdf");
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsLoading(false);
        }
        // Word documents - use docx-preview
        else if (
            fileName.endsWith(".docx") ||
            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            setPreviewType("docx");
            setIsLoading(true);
            if (docxContainerRef.current) {
                docxContainerRef.current.innerHTML = "";
                renderAsync(file, docxContainerRef.current, undefined, {
                    breakPages: true,
                    inWrapper: true,
                    ignoreWidth: false,
                    ignoreHeight: false,
                    renderHeaders: true,
                    renderFooters: true,
                })
                    .then(() => setIsLoading(false))
                    .catch((error) => {
                        console.error("Error rendering docx:", error);
                        setError("Failed to render Word document");
                        setIsLoading(false);
                    });
            } else {
                setIsLoading(false);
            }
        }
        // Old .doc format - not supported
        else if (
            fileName.endsWith(".doc") ||
            fileType === "application/msword"
        ) {
            setPreviewType("unsupported");
            setIsLoading(false);
        }
        // Images
        else if (fileType.startsWith("image/")) {
            setPreviewType("image");
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsLoading(false);
        }
        // Text files
        else if (
            fileType === "text/plain" ||
            fileName.endsWith(".txt") ||
            fileName.endsWith(".md") ||
            fileName.endsWith(".json") ||
            fileName.endsWith(".xml") ||
            fileName.endsWith(".csv")
        ) {
            setPreviewType("text");
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target?.result as string || "");
                setIsLoading(false);
            };
            reader.onerror = () => {
                setError("Failed to read text file");
                setIsLoading(false);
            };
            reader.readAsText(file);
        }
        // Unsupported
        else {
            console.warn("Unsupported file type:", { fileName, fileType });
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
            <div className="flex-1 overflow-auto">
                {error && (
                    <div className="h-full flex items-center justify-center p-6">
                        <div className="text-center max-w-md">
                            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                Error Loading Preview
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {!error && previewType === "pdf" && previewUrl && (
                    <div className="h-full">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                            <Viewer fileUrl={previewUrl} defaultScale={SpecialZoomLevel.ActualSize} />
                        </Worker>
                    </div>
                )}

                {!error && previewType === "image" && previewUrl && (
                    <div className="flex items-center justify-center h-full p-6">
                        <img
                            src={previewUrl}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {!error && previewType === "text" && (
                    <div className="p-6">
                        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                            <pre className="whitespace-pre-wrap text-slate-700">{textContent}</pre>
                        </div>
                    </div>
                )}

                {!error && previewType === "docx" && (
                    <div className="w-full h-full border rounded-xl flex flex-col" style={{ height: "calc(100vh - 300px)" }}>
                {/* Toolbar */}
                <div className="flex items-center rounded-t-xl justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Word Document Preview</span>
                    </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 50}
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <div className="min-w-[70px] text-center">
                                    <span className="text-sm font-medium text-slate-700">{zoomLevel}%</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handleZoomIn}
                                    disabled={zoomLevel >= 200}
                                    title="Zoom In"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <div className="w-px h-6 bg-slate-300 mx-1" />
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handleResetZoom}
                                    title="Reset Zoom"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Document Content */}
                        <div className="flex-1 overflow-auto">
                            <div className="max-w-[850px] mx-auto">
                                <div
                                    ref={docxContainerRef}
                                    className="docx-preview-container transition-transform duration-200"
                                    style={{
                                        transform: `scale(${zoomLevel / 100})`,
                                        transformOrigin: 'top center',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {!error && previewType === "unsupported" && (
                    <div className="h-full flex items-center justify-center p-6">
                        <div className="text-center w-full">
                            <div className="w-full h-[calc(100vh-380px)]">
                                <FilePreviewLib
                                    preview={file}
                                    placeHolderImage={filePlaceholder}
                                    errorImage={filePlaceholder}
                                />
                            </div>
                            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-4 text-left mt-4 inline-block text-left">
                                <p className="font-semibold mb-2">Supported formats:</p>
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>PDF Documents (.pdf)</li>
                                    <li>Word Documents (.docx)</li>
                                    <li>Images (.jpg, .png, .gif, .webp, etc.)</li>
                                    <li>Text Files (.txt, .md, .json, .xml, .csv)</li>
                                </ul>
                                <p className="mt-3 text-slate-600">
                                    ⚠️ Old Word format (.doc) is not supported. Please use .docx format.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
