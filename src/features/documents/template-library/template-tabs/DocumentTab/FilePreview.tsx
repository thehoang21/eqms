
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";


interface FilePreviewProps {
    file?: File | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [fileUrl, setFileUrl] = React.useState<string | null>(null);

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

    if (!file) {
        return (
            <div className="w-full flex items-center justify-center h-full text-slate-400 text-sm" style={{ height: "calc(100vh - 300px)" }}>
                There is no file available for preview.
            </div>
        );
    }

    // Only support PDF preview for now
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
        return (
            <div className="w-full flex flex-col items-center justify-center h-full text-slate-500 text-center" style={{ height: "calc(100vh - 300px)" }}>
                <span className="text-lg font-semibold mb-2">Previewing this file is not supported.</span>
                <span className="text-sm">Only PDF file preview is supported.<br/>Please download the file to view its content.</span>
                {fileUrl && (
                    <a
                        href={fileUrl}
                        download={file.name}
                        className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm"
                    >
                        Download
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height: "calc(100vh - 300px)" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {fileUrl && (
                    <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                )}
            </Worker>
        </div>
    );
};
