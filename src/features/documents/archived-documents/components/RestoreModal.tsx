import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { FormModal } from '@/components/ui/modal/FormModal';
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

    const handleConfirm = () => {
        if (!reason.trim()) return;

        onConfirm(reason.trim());
        setReason('');
        onClose();
    };

    if (!document) return null;

    const canRestore = ['Admin', 'QA Manager', 'Quality Assurance'].includes(userRole);

    if (!canRestore) {
        return (
            <FormModal
                isOpen={isOpen}
                onClose={onClose}
                title="Restore Archived Document"
                description="Access Denied"
                confirmText="Close"
                showCancel={false}
                size="lg"
            >
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-900">Access Denied</p>
                        <p className="text-sm text-red-700 mt-1">
                            You don't have permission to restore archived documents. Only Admin and QA personnel can perform this action.
                        </p>
                    </div>
                </div>
            </FormModal>
        );
    }

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Restore Archived Document"
            description="This action will be logged in Audit Trail"
            confirmText={isLoading ? 'Restoring...' : 'Restore Document'}
            cancelText="Cancel"
            isLoading={isLoading}
            size="lg"
        >
            <div className="space-y-4">
                {/* Document Info */}
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
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

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                        <p className="font-medium">Important: Restoring archived documents</p>
                        <p className="mt-1 text-amber-800">
                            This action will make the document active again. Ensure this doesn't conflict with newer versions or current procedures.
                        </p>
                    </div>
                </div>

                {/* Reason Input */}
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
        </FormModal>
    );
};
