import React from "react";
import { ExternalLink } from "lucide-react";
import { WatermarkOverlay } from "./WatermarkOverlay";

interface PDFViewerProps {
    scale: number;
    currentPage: number;
    totalPages: number;
    isComparisonMode: boolean;
    documentStatus: string;
    documentNumber: string;
    documentVersion: string;
    documentName: string;
    previousVersion?: string;
    currentUser: string;
    userCanCopy: boolean;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
    scale,
    currentPage,
    totalPages,
    isComparisonMode,
    documentStatus,
    documentNumber,
    documentVersion,
    documentName,
    previousVersion,
    currentUser,
    userCanCopy
}) => {
    return (
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
            <WatermarkOverlay
                documentStatus={documentStatus}
                currentUser={currentUser}
                documentNumber={documentNumber}
                documentVersion={documentVersion}
                userCanCopy={userCanCopy}
            />

            {/* PDF Content Container */}
            <div className="flex items-start justify-center p-8 min-h-full gap-4">
                {/* Current Version */}
                <div
                    className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                        width: isComparisonMode ? "180mm" : "210mm",
                        minHeight: "297mm"
                    }}
                >
                    <div className="p-12 space-y-6">
                        {isComparisonMode && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 px-3 py-2 mb-4">
                                <span className="text-xs font-semibold text-blue-900">Current Version v{documentVersion}</span>
                            </div>
                        )}
                        <div className="text-center border-b-2 border-slate-200 pb-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Standard Operating Procedure
                            </h1>
                            <div className="text-sm text-slate-600 space-y-1">
                                <p className="font-semibold">Document Number: {documentNumber}</p>
                                <p>Version {documentVersion} | Effective Date: 2025-12-21</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    1. MỤC ĐÍCH (PURPOSE)
                                </h2>
                                <p className="text-slate-700 leading-relaxed">
                                    Quy trình này quy định các bước để thực hiện kiểm soát tài liệu
                                    trong hệ thống quản lý chất lượng tuân thủ theo tiêu chuẩn EU-GMP
                                    và ISO 9001:2015. Mục đích chính là đảm bảo tất cả các tài liệu
                                    được kiểm soát chặt chẽ, phiên bản luôn chính xác, và chỉ những
                                    người được ủy quyền mới có quyền truy cập.
                                </p>
                                {isComparisonMode && (
                                    <div className="mt-2 bg-green-50 border-l-2 border-green-500 pl-3 py-1 text-xs text-green-800">
                                        + Added new compliance requirement for access control
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    2. PHẠM VI ÁP DỤNG (SCOPE)
                                </h2>
                                <p className="text-slate-700 leading-relaxed">
                                    Quy trình này áp dụng cho tất cả các tài liệu trong hệ thống QMS,
                                    bao gồm: SOP, Work Instruction, Form, Template, và các tài liệu
                                    kỹ thuật khác. Tất cả các bộ phận từ QA, QC, Production, đến
                                    Engineering đều phải tuân thủ.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    3. TRÁCH NHIỆM (RESPONSIBILITIES)
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-slate-700">
                                    <li>
                                        <span className="font-semibold">Document Owner:</span> Chịu trách
                                        nhiệm nội dung, tính chính xác và cập nhật tài liệu.
                                    </li>
                                    <li>
                                        <span className="font-semibold">QA Manager:</span> Phê duyệt và
                                        giám sát việc tuân thủ quy trình.
                                    </li>
                                    <li>
                                        <span className="font-semibold">Document Controller:</span> Quản
                                        lý phân phối và kiểm soát phiên bản.
                                    </li>
                                </ul>
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-slate-700">
                                    <ExternalLink className="h-3 w-3 inline mr-1 text-blue-600" />
                                    Related documents:
                                    <button className="text-emerald-600 hover:underline ml-1 font-medium">FR-QA-001</button>,
                                    <button className="text-emerald-600 hover:underline ml-1 font-medium">SOP-QA-002</button>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    4. QUY TRÌNH THỰC HIỆN (PROCEDURE)
                                </h2>
                                <div className="space-y-3 text-slate-700">
                                    <div>
                                        <h3 className="font-semibold mb-1">4.1 Tạo tài liệu mới</h3>
                                        <p className="leading-relaxed">
                                            Sử dụng template được phê duyệt, điền đầy đủ thông tin metadata,
                                            và gửi yêu cầu đến người phê duyệt có thẩm quyền.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">4.2 Quy trình phê duyệt</h3>
                                        <p className="leading-relaxed">
                                            Tài liệu phải trải qua các bước: Review → Approval → Effective.
                                            Mỗi bước cần chữ ký điện tử và ghi nhận audit trail.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
                                <p>Page {currentPage} of {totalPages}</p>
                                <p className="mt-1">This is a controlled document. Any printed copy is uncontrolled.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Version - Side by side comparison */}
                {isComparisonMode && previousVersion && (
                    <div
                        className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top center",
                            width: "180mm",
                            minHeight: "297mm"
                        }}
                    >
                        <div className="p-12 space-y-6 opacity-80">
                            <div className="bg-slate-50 border-l-4 border-slate-600 px-3 py-2 mb-4">
                                <span className="text-xs font-semibold text-slate-900">Previous Version v{previousVersion}</span>
                            </div>
                            <div className="text-center border-b-2 border-slate-200 pb-6">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    Standard Operating Procedure
                                </h1>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p className="font-semibold">Document Number: {documentNumber}</p>
                                    <p>Version {previousVersion} | Effective Date: 2025-11-01</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                                        1. MỤC ĐÍCH (PURPOSE)
                                    </h2>
                                    <p className="text-slate-700 leading-relaxed">
                                        Quy trình này quy định các bước để thực hiện kiểm soát tài liệu
                                        trong hệ thống quản lý chất lượng tuân thủ theo tiêu chuẩn EU-GMP
                                        và ISO 9001:2015. Mục đích chính là đảm bảo tất cả các tài liệu
                                        được kiểm soát chặt chẽ và phiên bản luôn chính xác.
                                    </p>
                                    <div className="mt-2 bg-red-50 border-l-2 border-red-500 pl-3 py-1 text-xs text-red-800">
                                        - Missing access control requirement
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
