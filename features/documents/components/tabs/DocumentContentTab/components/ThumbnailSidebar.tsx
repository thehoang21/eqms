import React from "react";

interface ThumbnailSidebarProps {
    isOpen: boolean;
    totalPages: number;
    currentPage: number;
    onGoToPage: (page: number) => void;
}

export const ThumbnailSidebar: React.FC<ThumbnailSidebarProps> = ({
    isOpen,
    totalPages,
    currentPage,
    onGoToPage
}) => {
    if (!isOpen) return null;

    return (
        <div className="w-48 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-2 space-y-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onGoToPage(page)}
                        className={`w-full aspect-[210/297] border-2 rounded overflow-hidden transition-all ${
                            currentPage === page
                                ? "border-emerald-600 shadow-md"
                                : "border-slate-200 hover:border-emerald-300"
                        }`}
                    >
                        <div className="w-full h-full bg-white flex items-center justify-center text-xs text-slate-400">
                            Page {page}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
