
import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import FilePreviewLib from "reactjs-file-preview";
import filePlaceholder from "@/assets/images/image-file/file.png";
import { renderAsync } from "docx-preview";
import { ZoomIn, ZoomOut, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import "./docx-preview.css";


interface FilePreviewProps {
    file?: File | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [fileUrl, setFileUrl] = React.useState<string | null>(null);
    const docxContainerRef = React.useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = React.useState<number>(80);

    React.useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setFileUrl(null);
        }
    }, [file]);

    React.useEffect(() => {
        const isDocx = file?.name.toLowerCase().endsWith(".docx") || file?.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        
        if (file && isDocx && docxContainerRef.current) {
            docxContainerRef.current.innerHTML = "";
            renderAsync(file, docxContainerRef.current, undefined, {
                breakPages: true,
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: false,
                renderHeaders: true,
                renderFooters: true,
            }).catch((error) => {
                console.error("Error rendering docx:", error);
            });
        }
    }, [file]);

    if (!file) {
        return (
            <div className="w-full flex items-center justify-center h-full text-slate-400 text-sm" style={{ height: "calc(100vh - 300px)" }}>
                There is no file available for preview.
            </div>
        );
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDocx = file.name.toLowerCase().endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 10, 200));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 10, 20));
    };

    const handleResetZoom = () => {
        setZoomLevel(80);
    };

    if (isDocx) {
        return (
            <div className="w-full h-full border rounded-xl flex flex-col" style={{ height: "calc(100vh - 300px)" }}>
                {/* Toolbar */}
                <div className="flex items-center rounded-t-xl justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 20}
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
                    <div 
                        className="inline-block min-w-full"
                        style={{
                            width: `${(100 / zoomLevel) * 100}%`,
                        }}
                    >
                        <div
                            ref={docxContainerRef}
                            className="docx-preview-container transition-transform duration-200 origin-top-left"
                            style={{
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'top left',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (!isPdf) {
        return (
            <div className="w-full" style={{ height: "calc(100vh - 300px)" }}>
                <FilePreviewLib
                    preview={file}
                    placeHolderImage={filePlaceholder}
                    errorImage={filePlaceholder}
                />
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height: "calc(100vh - 300px)" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {fileUrl && (
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={SpecialZoomLevel.ActualSize}
                    />
                )}
            </Worker>
        </div>
    );
};
