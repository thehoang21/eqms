import { useState, useRef, useEffect } from "react";
import { PrintRequest } from "../types";

export const useDocumentViewer = () => {
    const [scale, setScale] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages] = useState<number>(12);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isThumbnailOpen, setIsThumbnailOpen] = useState<boolean>(false);
    const [isOutlineOpen, setIsOutlineOpen] = useState<boolean>(false);
    const [isSignatureOpen, setIsSignatureOpen] = useState<boolean>(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
    const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);
    const [printRequest, setPrintRequest] = useState<PrintRequest>({ reason: "", copies: 1 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Zoom controls
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    // Pagination controls
    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handleGoToPage = (page: number) => {
        setCurrentPage(page);
    };

    // Search toggle
    const handleSearchToggle = () => {
        setIsSearchOpen(prev => !prev);
        if (!isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    // Fullscreen toggle
    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    return {
        // State
        scale,
        currentPage,
        totalPages,
        isSearchOpen,
        searchQuery,
        isFullscreen,
        isThumbnailOpen,
        isOutlineOpen,
        isSignatureOpen,
        isPrintModalOpen,
        isComparisonMode,
        printRequest,
        
        // Refs
        containerRef,
        searchInputRef,
        
        // Setters
        setSearchQuery,
        setIsThumbnailOpen,
        setIsOutlineOpen,
        setIsSignatureOpen,
        setIsPrintModalOpen,
        setIsComparisonMode,
        setPrintRequest,
        setIsSearchOpen,
        
        // Handlers
        handleZoomIn,
        handleZoomOut,
        handlePrevPage,
        handleNextPage,
        handleGoToPage,
        handleSearchToggle,
        handleFullscreen,
    };
};
