import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, FolderPlus } from 'lucide-react';
import { Button } from '../../../../components/ui/button/Button';
import { cn } from '../../../../components/ui/utils';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (folderName: string) => void;
    parentName?: string;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
    isOpen,
    onClose,
    onCreate,
    parentName
}) => {
    const [folderName, setFolderName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setFolderName('');
            // Focus input after a short delay to allow animation to start
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            onCreate(folderName.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto animate-in zoom-in-95 duration-200 border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <FolderPlus className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">New Folder</h3>
                                {parentName && (
                                    <p className="text-xs text-slate-500">in {parentName}</p>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="folderName" className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Folder Name
                                </label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="folderName"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    placeholder="e.g. Quality Procedures"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={!folderName.trim()}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                Create Folder
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        document.body
    );
};
