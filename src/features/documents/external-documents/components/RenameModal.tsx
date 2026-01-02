import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (newName: string) => void;
    currentName: string;
    itemType: 'file' | 'folder';
}

export const RenameModal: React.FC<RenameModalProps> = ({
    isOpen,
    onClose,
    onRename,
    currentName,
    itemType,
}) => {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // For files, pre-select the name without extension
            if (itemType === 'file' && currentName.includes('.')) {
                const lastDotIndex = currentName.lastIndexOf('.');
                const nameWithoutExt = currentName.substring(0, lastDotIndex);
                setNewName(currentName);
                
                // Select name without extension after a short delay
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.setSelectionRange(0, lastDotIndex);
                        inputRef.current.focus();
                    }
                }, 100);
            } else {
                setNewName(currentName);
                setTimeout(() => {
                    inputRef.current?.select();
                    inputRef.current?.focus();
                }, 100);
            }
            setError('');
        }
    }, [isOpen, currentName, itemType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedName = newName.trim();
        
        if (!trimmedName) {
            setError('Name cannot be empty');
            return;
        }

        if (trimmedName === currentName) {
            onClose();
            return;
        }

        // Basic validation
        const invalidChars = /[<>:"/\\|?*]/g;
        if (invalidChars.test(trimmedName)) {
            setError('Name contains invalid characters: < > : " / \\ | ? *');
            return;
        }

        onRename(trimmedName);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Pencil className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Rename {itemType === 'folder' ? 'Folder' : 'File'}
                            </h2>
                            <p className="text-xs text-slate-500">Enter a new name</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {itemType === 'folder' ? 'Folder Name' : 'File Name'}
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setError('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    onClose();
                                }
                            }}
                            className="w-full px-4 py-2 h-11 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Enter ${itemType} name...`}
                        />
                        {error && (
                            <p className="text-xs text-red-600 mt-1.5">{error}</p>
                        )}
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                        <p className="font-medium text-slate-700 mb-1">Note:</p>
                        <p>The following characters are not allowed: &lt; &gt; : " / \ | ? *</p>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 rounded-b-xl">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSubmit}
                    >
                        Rename
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
