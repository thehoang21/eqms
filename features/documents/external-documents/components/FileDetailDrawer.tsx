import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  User,
  Calendar,
  Folder,
  Tag,
  Info,
  Shield,
  Clock,
  HardDrive,
  FileType
} from "lucide-react";
import { Button } from "../../../../components/ui/button/Button";
import { cn } from "../../../../components/ui/utils";
import { FileSystemItem } from "../types";

interface FileDetailDrawerProps {
  item: FileSystemItem | null;
  onClose: () => void;
}

export const FileDetailDrawer: React.FC<FileDetailDrawerProps> = ({ item, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  // Body Scroll Lock & Escape key listener
  useEffect(() => {
    if (!item) return;

    // Lock scroll
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Unlock scroll
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [item]);

  if (!item) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center md:justify-end items-end md:items-stretch pointer-events-none">
      {/* Animation Styles */}
      <style>{`
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        @keyframes slideInBottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
        }
        @keyframes slideOutBottom {
            from { transform: translateY(0); }
            to { transform: translateY(100%); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .drawer-enter {
            animation-duration: 0.3s;
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            animation-fill-mode: forwards;
        }
        .drawer-exit {
            animation-duration: 0.3s;
            animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            animation-fill-mode: forwards;
        }
        
        @media (min-width: 768px) {
            .drawer-enter { animation-name: slideInRight; }
            .drawer-exit { animation-name: slideOutRight; }
        }
        @media (max-width: 767px) {
            .drawer-enter { animation-name: slideInBottom; }
            .drawer-exit { animation-name: slideOutBottom; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />

      {/* Drawer Content */}
      <div
        className={cn(
          "pointer-events-auto w-full md:w-[450px] bg-white shadow-2xl flex flex-col h-[85vh] md:h-full rounded-t-2xl md:rounded-none md:rounded-l-2xl border-t md:border-t-0 md:border-l border-slate-200",
          isClosing ? "drawer-exit" : "drawer-enter"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Details</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Preview Section */}
          <div className="p-8 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
            <div className="h-24 w-24 mb-4 shadow-sm rounded-xl bg-white p-4 flex items-center justify-center">
              {item.type === 'folder' ? (
                <Folder className="h-full w-full text-emerald-500 fill-emerald-50" />
              ) : (
                <FileText className="h-full w-full text-slate-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-900 text-center break-all px-4">
              {item.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 capitalize">
                    {item.type}
                </span>
                {item.fileExtension && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 uppercase">
                        {item.fileExtension}
                    </span>
                )}
            </div>
          </div>

          {/* Details List */}
          <div className="p-6 space-y-8">
            {/* General Info */}
            <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Info className="h-3 w-3" /> General Information
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <User className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Owner</p>
                            <p className="text-sm font-medium text-slate-900">{item.updatedBy}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Last Modified</p>
                            <p className="text-sm font-medium text-slate-900">{new Date(item.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {item.createdAt && (
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase">Created Date</p>
                                <p className="text-sm font-medium text-slate-900">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {item.type === 'file' && (
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <HardDrive className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase">File Size</p>
                                <p className="text-sm font-medium text-slate-900">{item.size}</p>
                            </div>
                        </div>
                    )}

                    {item.type === 'folder' && (
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <Folder className="h-5 w-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase">Contents</p>
                                <p className="text-sm font-medium text-slate-900">{item.itemCount} items</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Metadata */}
            <section className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileType className="h-3 w-3" /> Metadata
                </h4>
                
                <div className="space-y-4">
                    {item.version && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Version</span>
                            <span className="text-sm font-medium text-slate-900">v{item.version}</span>
                        </div>
                    )}
                    
                    {item.tags && item.tags.length > 0 && (
                        <div className="py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600 block mb-2">Tags</span>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                        <Tag className="h-3 w-3" /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {item.description && (
                        <div className="py-2">
                            <span className="text-sm text-slate-600 block mb-1">Description</span>
                            <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {item.description}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Permissions */}
            {item.permissions && (
                <section className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="h-3 w-3" /> Permissions
                    </h4>
                    <div className="flex gap-2">
                        {item.permissions.includes('read') && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">Read</span>
                        )}
                        {item.permissions.includes('write') && (
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-200">Write</span>
                        )}
                        {item.permissions.includes('delete') && (
                            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded border border-red-200">Delete</span>
                        )}
                    </div>
                </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
            <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClose}
            >
                Close
            </Button>
            <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => console.log('Open', item)}
            >
                Open
            </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
