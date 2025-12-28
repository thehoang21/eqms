import React from "react";
import { PrintRequest } from "../types";

interface PrintModalProps {
    isOpen: boolean;
    printRequest: PrintRequest;
    documentNumber: string;
    currentUser: string;
    onPrintRequestChange: (request: PrintRequest) => void;
    onClose: () => void;
    onConfirm: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
    isOpen,
    printRequest,
    documentNumber,
    currentUser,
    onPrintRequestChange,
    onClose,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Controlled Print Request</h2>
                <p className="text-sm text-slate-600">
                    This print will be tracked and audited. Please provide the following information:
                </p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Reason for Printing
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            value={printRequest.reason}
                            onChange={(e) => onPrintRequestChange({ ...printRequest, reason: e.target.value })}
                            placeholder="e.g., Training session, Equipment calibration, etc."
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Number of Copies
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={printRequest.copies}
                            onChange={(e) => onPrintRequestChange({ ...printRequest, copies: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-800">
                        ⚠ Each copy will be assigned a unique serial number for tracking and control purposes.
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!printRequest.reason.trim()}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
                    >
                        Confirm & Print
                    </button>
                </div>
            </div>
        </div>
    );
};
