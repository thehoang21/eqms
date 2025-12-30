import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button/Button';
import { ArchivedDocument } from '../types';

interface RestoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    document: ArchivedDocument | null;
    userRole: string;
}

export const RestoreModal: React.FC<RestoreModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    document,
    userRole
}) => {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setIsLoading(true);
        try {
            await onConfirm(reason.trim());
            setReason('');
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !document) return null;

    const canRestore = ['Admin', 'QA Manager', 'Quality Assurance'].includes(userRole);

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white rounded-xl shadow-xl w-full max-w-lg pointer-events-auto animate-in zoom-in-95 duration-200 border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <RotateCcw className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Restore Archived Document</h3>
                                <p className="text-xs text-slate-500 mt-0.5">This action will be logged in Audit Trail</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {!canRestore ? (
                        <div className="p-6">
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-900">Access Denied</p>
                                    <p className="text-sm text-red-700 mt-1">
                                        You don't have permission to restore archived documents. Only Admin and QA personnel can perform this action.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Button variant="outline" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Document Info */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500">Document Code</span>
                                        <span className="text-sm font-semibold text-slate-900">{document.code}</span>
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <span className="text-xs font-medium text-slate-500">Document Name</span>
                                        <span className="text-sm text-slate-900 text-right max-w-[60%]">{document.documentName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500">Version</span>
                                        <span className="text-sm text-slate-900">{document.version}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reason Input */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-900">
                                        <p className="font-medium">Important: Restoring archived documents</p>
                                        <p className="mt-1 text-amber-800">
                                            This action will make the document active again. Ensure this doesn't conflict with newer versions or current procedures.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Justification / Reason <span className="text-red-600">*</span>
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Provide a detailed reason for restoring this archived document..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        This reason will be permanently recorded in the Audit Trail.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={!reason.trim() || isLoading}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    {isLoading ? 'Restoring...' : 'Restore Document'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
