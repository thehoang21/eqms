import React from "react";
import { X } from "lucide-react";

interface SearchBarProps {
    isOpen: boolean;
    searchQuery: string;
    searchInputRef: React.RefObject<HTMLInputElement>;
    onSearchQueryChange: (query: string) => void;
    onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    isOpen,
    searchQuery,
    searchInputRef,
    onSearchQueryChange,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 animate-in fade-in slide-in-from-top-2 duration-200 flex-shrink-0">
            <div className="flex items-center gap-2 max-w-md">
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder="Search in document..."
                    className="flex-1 px-3 py-2 border border-emerald-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-emerald-100 rounded-md transition-colors"
                >
                    <X className="h-4 w-4 text-emerald-600" />
                </button>
            </div>
        </div>
    );
};
