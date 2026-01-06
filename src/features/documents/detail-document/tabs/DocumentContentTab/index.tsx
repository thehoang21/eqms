import React from "react";
import { FileText, GitCompare } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { DocumentContentTabProps } from "../DocumentContentTab/types";
import { useDocumentViewer } from "../DocumentContentTab/hooks/useDocumentViewer";
import { Toolbar } from "../DocumentContentTab/components/Toolbar";
import { SearchBar } from "../DocumentContentTab/components/SearchBar";
import { ThumbnailSidebar } from "../DocumentContentTab/components/ThumbnailSidebar";
import { OutlineSidebar } from "../DocumentContentTab/components/OutlineSidebar";
import { SignatureSidebar } from "../DocumentContentTab/components/SignatureSidebar";
import { PrintModal } from "../DocumentContentTab/components/PrintModal";
import { PDFViewer } from "../DocumentContentTab/components/PDFViewer";

// Mock data for outlines
const outlines = [
    { id: 1, title: "1. MỤC ĐÍCH (PURPOSE)", page: 1 },
    { id: 2, title: "2. PHẠM VI ÁP DỤNG (SCOPE)", page: 2 },
    { id: 3, title: "3. TRÁCH NHIỆM (RESPONSIBILITIES)", page: 3 },
    { id: 4, title: "4. QUY TRÌNH THỰC HIỆN (PROCEDURE)", page: 4 },
    { id: 5, title: "4.1 Tạo tài liệu mới", page: 4 },
    { id: 6, title: "4.2 Quy trình phê duyệt", page: 5 },
    { id: 7, title: "5. KIỂM SOÁT BẢN GHI", page: 7 },
    { id: 8, title: "6. PHỤC LỤC (APPENDIX)", page: 10 }
];

// Mock data for signatures
const signatures = [
    {
        name: "John Doe",
        role: "Document Author",
        action: "Created",
        timestamp: "2025-12-15 10:30:00",
        signatureId: "SIG-001-2025"
    },
    {
        name: "Jane Smith",
        role: "QA Manager",
        action: "Reviewed",
        timestamp: "2025-12-18 14:45:00",
        signatureId: "SIG-002-2025"
    },
    {
        name: "Robert Johnson",
        role: "Director",
        action: "Approved",
        timestamp: "2025-12-20 09:15:00",
        signatureId: "SIG-003-2025"
    }
];

export const DocumentContentTab: React.FC<DocumentContentTabProps> = ({
    documentStatus = "Draft",
    documentName = "Standard Operating Procedure for Quality Control Testing",
    documentNumber = "SOP-QA-001",
    documentVersion = "2.0",
    userCanPrint = true,
    userCanDownload = false,
    userCanCopy = false,
    currentUser = "Shani Rosenblit",
    previousVersion = "1.0"
}) => {
    const {
        scale,
        currentPage,
        totalPages,
        isSearchOpen,
        searchQuery,
        isThumbnailOpen,
        isOutlineOpen,
        isSignatureOpen,
        isPrintModalOpen,
        isComparisonMode,
        printRequest,
        containerRef,
        searchInputRef,
        setSearchQuery,
        setIsThumbnailOpen,
        setIsOutlineOpen,
        setIsSignatureOpen,
        setIsPrintModalOpen,
        setIsComparisonMode,
        setPrintRequest,
        setIsSearchOpen,
        handleZoomIn,
        handleZoomOut,
        handlePrevPage,
        handleNextPage,
        handleGoToPage,
        handleSearchToggle,
        handleFullscreen,
    } = useDocumentViewer();

    // Print handler
    const handlePrintRequest = () => {
        setIsPrintModalOpen(true);
    };

    const handleConfirmPrint = () => {
        if (printRequest.reason.trim() && printRequest.copies > 0) {
            console.log("Printing controlled copy:", {
                reason: printRequest.reason,
                copies: printRequest.copies,
                user: currentUser,
                documentNumber,
                timestamp: new Date().toISOString()
            });
            for (let i = 1; i <= printRequest.copies; i++) {
                console.log(`Copy No. ${String(i).padStart(2, '0')} - Serial: ${documentNumber}-COPY-${Date.now()}-${i}`);
            }
            window.print();
            setIsPrintModalOpen(false);
            setPrintRequest({ reason: "", copies: 1 });
        }
    };

    // Download handler
    const handleDownload = () => {
        if (userCanDownload) {
            console.log("Downloading document...");
        }
    };

    // Toggle comparison mode
    const handleToggleComparison = () => {
        setIsComparisonMode(prev => !prev);
    };

    const canPrint = documentStatus === "Effective" && userCanPrint;

    return (
        <div
            ref={containerRef}
            className="flex flex-col h-full bg-slate-50 overflow-hidden"
            onCopy={(e) => !userCanCopy && e.preventDefault()}
            onContextMenu={(e) => !userCanCopy && e.preventDefault()}
        >
            {/* Document Info Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0 px-4 py-3 lg:py-2 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between lg:justify-start gap-2 lg:gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{documentNumber}</span>
                        <span className="text-xs text-slate-500">v{documentVersion}</span>
                    </div>
                    <div className={`px-3 lg:px-4 py-1 rounded-lg text-xs lg:text-sm font-medium ${
                        documentStatus === "Effective"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : documentStatus === "Draft"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                        {documentStatus}
                    </div>
                </div>
                <div className="flex-1 lg:flex lg:justify-center">
                    <span className="text-xs lg:text-sm font-semibold text-slate-800 line-clamp-2 lg:line-clamp-1">{documentName}</span>
                </div>
                <div className="flex items-center gap-2">
                    {previousVersion && (
                        <button
                            onClick={handleToggleComparison}
                            className={cn(
                                "flex items-center justify-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 shadow-sm border w-full lg:w-auto",
                                isComparisonMode
                                    ? "bg-emerald-600 border-emerald-700 text-white shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-1"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 shadow-sm"
                            )}
                            title="Compare with previous version"
                        >
                            <GitCompare className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-300",
                                isComparisonMode ? "rotate-180 text-white" : "text-emerald-600"
                            )} />
                            <span className="hidden sm:inline">Compare {previousVersion}</span>
                            <span className="sm:hidden">v{previousVersion}</span>
                            {isComparisonMode && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <Toolbar
                scale={scale}
                currentPage={currentPage}
                totalPages={totalPages}
                isThumbnailOpen={isThumbnailOpen}
                isOutlineOpen={isOutlineOpen}
                isSearchOpen={isSearchOpen}
                isSignatureOpen={isSignatureOpen}
                canPrint={canPrint}
                userCanDownload={userCanDownload}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onSearchToggle={handleSearchToggle}
                onPrintRequest={handlePrintRequest}
                onDownload={handleDownload}
                onFullscreen={handleFullscreen}
                onToggleThumbnail={() => setIsThumbnailOpen(prev => !prev)}
                onToggleOutline={() => setIsOutlineOpen(prev => !prev)}
                onToggleSignature={() => setIsSignatureOpen(prev => !prev)}
            />

            {/* Search Bar */}
            <SearchBar
                isOpen={isSearchOpen}
                searchQuery={searchQuery}
                searchInputRef={searchInputRef}
                onSearchQueryChange={setSearchQuery}
                onClose={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Thumbnail Sidebar */}
                <ThumbnailSidebar
                    isOpen={isThumbnailOpen}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onGoToPage={handleGoToPage}
                />

                {/* Outline Sidebar */}
                <OutlineSidebar
                    isOpen={isOutlineOpen}
                    outlines={outlines}
                    onGoToPage={handleGoToPage}
                />

                {/* PDF Viewer */}
                <PDFViewer
                    scale={scale}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isComparisonMode={isComparisonMode}
                    documentStatus={documentStatus}
                    documentNumber={documentNumber}
                    documentVersion={documentVersion}
                    documentName={documentName}
                    previousVersion={previousVersion}
                    currentUser={currentUser}
                    userCanCopy={userCanCopy}
                />

                {/* Signature Sidebar */}
                <SignatureSidebar
                    isOpen={isSignatureOpen}
                    signatures={signatures}
                />
            </div>

            {/* Print Request Modal */}
            <PrintModal
                isOpen={isPrintModalOpen}
                printRequest={printRequest}
                documentNumber={documentNumber}
                currentUser={currentUser}
                onPrintRequestChange={setPrintRequest}
                onClose={() => {
                    setIsPrintModalOpen(false);
                    setPrintRequest({ reason: "", copies: 1 });
                }}
                onConfirm={handleConfirmPrint}
            />
        </div>
    );
};
