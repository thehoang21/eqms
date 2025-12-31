import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    Folder, 
    FileText, 
    MoreVertical, 
    Download, 
    Pencil, 
    Trash2, 
    File, 
    FileImage, 
    FileSpreadsheet,
    Eye
} from 'lucide-react';
import { cn } from '../../../../components/ui/utils';
import { FileSystemItem as IFileSystemItem, ViewMode } from '../types';

interface FileSystemItemProps {
    item: IFileSystemItem;
    viewMode: ViewMode;
    onNavigate: (item: IFileSystemItem) => void;
    onRename: (item: IFileSystemItem) => void;
    onDelete: (item: IFileSystemItem) => void;
    onDownload: (item: IFileSystemItem) => void;
    onViewDetail: (item: IFileSystemItem) => void;
}

export const FileSystemItem: React.FC<FileSystemItemProps> = ({
    item,
    viewMode,
    onNavigate,
    onRename,
    onDelete,
    onDownload,
    onViewDetail
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openMenu(e);
    };

    const openMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.right + window.scrollX - 160, // Adjust for menu width
        });
        setIsMenuOpen(true);
    };

    const getIcon = () => {
        if (item.type === 'folder') {
            return <Folder className="h-full w-full text-emerald-500 fill-emerald-50" />;
        }
        
        switch (item.fileExtension?.toLowerCase()) {
            case 'pdf':
                return <FileText className="h-full w-full text-red-500" />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <FileSpreadsheet className="h-full w-full text-green-600" />;
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <FileImage className="h-full w-full text-blue-500" />;
            default:
                return <File className="h-full w-full text-slate-400" />;
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.type === 'folder') {
            onNavigate(item);
        } else {
            onViewDetail(item);
        }
    };

    // Grid View
    if (viewMode === 'grid') {
        return (
            <>
                <div 
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                    className="group relative flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-all cursor-pointer select-none"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10">
                            {getIcon()}
                        </div>
                        <button
                            onClick={openMenu}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-md transition-all"
                        >
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                        </button>
                    </div>
                    
                    <div className="mt-auto">
                        <h3 className="text-sm font-medium text-slate-900 truncate mb-1" title={item.name}>
                            {item.name}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.type === 'folder' ? `${item.itemCount} items` : item.size}</span>
                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                {renderMenu()}
            </>
        );
    }

    // List View
    return (
        <>
            <div 
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleContextMenu}
                className="group flex items-center gap-4 p-3 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer last:border-0 select-none"
            >
                <div className="h-8 w-8 flex-shrink-0">
                    {getIcon()}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                        {item.name}
                    </h3>
                </div>

                <div className="w-32 text-xs text-slate-500 hidden sm:block truncate">
                    {item.updatedBy}
                </div>

                <div className="w-32 text-xs text-slate-500 hidden sm:block">
                    {new Date(item.updatedAt).toLocaleDateString()}
                </div>

                <div className="w-24 text-xs text-slate-500 text-right hidden sm:block">
                    {item.type === 'file' ? item.size : '-'}
                </div>

                <div className="w-24 text-xs text-slate-500 text-right hidden sm:block">
                    {item.type === 'folder' ? `${item.itemCount} items` : '-'}
                </div>

                <div className="w-10 flex justify-end">
                    <button
                        onClick={openMenu}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 rounded-md transition-all"
                    >
                        <MoreVertical className="h-4 w-4 text-slate-500" />
                    </button>
                </div>
            </div>
            {renderMenu()}
        </>
    );

    function renderMenu() {
        if (!isMenuOpen) return null;

        return createPortal(
            <>
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                    }} 
                />
                <div 
                    className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); onViewDetail(item); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Eye className="h-4 w-4" /> View Detail
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRename(item); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Pencil className="h-4 w-4" /> Rename
                    </button>
                    {item.type === 'file' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDownload(item); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Download className="h-4 w-4" /> Download
                        </button>
                    )}
                    <div className="h-px bg-slate-100 my-1" />
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" /> Delete
                    </button>
                </div>
            </>,
            document.body
        );
    }
};
