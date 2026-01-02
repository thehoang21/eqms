import React from "react";
import {
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Printer,
    Maximize,
    Grip,
    List,
    Download,
    UserRoundPenIcon
} from "lucide-react";

interface ToolbarProps {
    scale: number;
    currentPage: number;
    totalPages: number;
    isThumbnailOpen: boolean;
    isOutlineOpen: boolean;
    isSearchOpen: boolean;
    isSignatureOpen: boolean;
    canPrint: boolean;
    userCanDownload: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onPrevPage: () => void;
    onNextPage: () => void;
    onSearchToggle: () => void;
    onPrintRequest: () => void;
    onDownload: () => void;
    onFullscreen: () => void;
    onToggleThumbnail: () => void;
    onToggleOutline: () => void;
    onToggleSignature: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    scale,
    currentPage,
    totalPages,
    isThumbnailOpen,
    isOutlineOpen,
    isSearchOpen,
    isSignatureOpen,
    canPrint,
    userCanDownload,
    onZoomIn,
    onZoomOut,
    onPrevPage,
    onNextPage,
    onSearchToggle,
    onPrintRequest,
    onDownload,
    onFullscreen,
    onToggleThumbnail,
    onToggleOutline,
    onToggleSignature
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-30">
            {/* Left Group: Navigation & Zoom Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleThumbnail}
                    className={`p-2 rounded-md transition-colors ${isThumbnailOpen ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 text-slate-600"
                        }`}
                    title="Thumbnails"
                >
                    <Grip className="h-4 w-4" />
                </button>
                <button
                    onClick={onToggleOutline}
                    className={`p-2 rounded-md transition-colors ${isOutlineOpen ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 text-slate-600"
                        }`}
                    title="Outlines"
                >
                    <List className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                    onClick={onZoomOut}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={scale <= 0.5}
                    title="Zoom Out"
                >
                    <ZoomOut className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-700 min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={onZoomIn}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={scale >= 3}
                    title="Zoom In"
                >
                    <ZoomIn className="h-4 w-4 text-slate-600" />
                </button>
            </div>

            {/* Center Group: Pagination */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrevPage}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage <= 1}
                    title="Previous Page"
                >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-700 min-w-[80px] text-center">
                    Page {currentPage} / {totalPages}
                </span>
                <button
                    onClick={onNextPage}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage >= totalPages}
                    title="Next Page"
                >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
            </div>

            {/* Right Group: Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onSearchToggle}
                    className={`p-2 rounded-md transition-colors ${isSearchOpen ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 text-slate-600"
                        }`}
                    title="Search Content"
                >
                    <Search className="h-4 w-4" />
                </button>

                <button
                    onClick={onToggleSignature}
                    className={`p-2 rounded-md transition-colors ${isSignatureOpen ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 text-slate-600"
                        }`}
                    title="View Signatures"
                >
                    <UserRoundPenIcon className="h-4 w-4" />
                </button>

                {userCanDownload && (
                    <button
                        onClick={onDownload}
                        className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
                        title="Download Document"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                )}

                {canPrint && (
                    <button
                        onClick={onPrintRequest}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Print Controlled Copy"
                    >
                        <Printer className="h-4 w-4" />
                        <span className="hidden md:inline">Print Controlled</span>
                    </button>
                )}

                <button
                    onClick={onFullscreen}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
                    title="Fullscreen"
                >
                    <Maximize className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
