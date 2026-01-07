import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import samplePdf from "@/assets/sample.pdf";

export const DocumentTab: React.FC = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="w-full" style={{ height: "calc(100vh - 300px)" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={samplePdf}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={SpecialZoomLevel.ActualSize}
                />
            </Worker>
        </div>
    );
};
