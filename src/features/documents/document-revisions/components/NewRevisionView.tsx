import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ChevronRight, 
    X, 
    Home, 
    FileText, 
    AlertCircle,
    Info,
    ArrowRight,
    Save
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { AlertModal } from '@/components/ui/modal/AlertModal';

// --- Types ---
interface LinkedDocument {
    id: string;
    code: string;
    name: string;
    type: "Form" | "Annex" | "Template" | "Reference";
    currentVersion: string;
    nextVersion: string;
    status: "Active" | "Draft" | "Obsolete";
}

interface SourceDocument {
    code: string;
    name: string;
    version: string;
    type: string;
    effectiveDate: string;
    owner: string;
}

// --- Mock Data ---
const MOCK_SOURCE_DOCUMENT: SourceDocument = {
    code: "SOP-QA-001",
    name: "Standard Operating Procedure for Quality Control Testing",
    version: "v1.0",
    type: "SOP",
    effectiveDate: "2025-01-15",
    owner: "Dr. Sarah Johnson"
};

const MOCK_LINKED_DOCUMENTS: LinkedDocument[] = [
    {
        id: "1",
        code: "FORM-QA-001-A",
        name: "Quality Control Test Record Form",
        type: "Form",
        currentVersion: "v1.0",
        nextVersion: "v2.0",
        status: "Active"
    },
    {
        id: "2",
        code: "ANNEX-QA-001-B",
        name: "Calibration Certificate Template",
        type: "Annex",
        currentVersion: "v1.2",
        nextVersion: "v2.0",
        status: "Active"
    },
    {
        id: "3",
        code: "FORM-QA-001-C",
        name: "Non-Conformance Report",
        type: "Form",
        currentVersion: "v1.5",
        nextVersion: "v2.0",
        status: "Active"
    },
    {
        id: "4",
        code: "ANNEX-QA-001-D",
        name: "Equipment Maintenance Log",
        type: "Annex",
        currentVersion: "v1.0",
        nextVersion: "v2.0",
        status: "Active"
    },
    {
        id: "5",
        code: "REF-QA-001-E",
        name: "Reference Standards Documentation",
        type: "Reference",
        currentVersion: "v1.1",
        nextVersion: "v2.0",
        status: "Active"
    }
];

export const NewRevisionView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any;
    
    // Get sourceDocId from URL query params
    const searchParams = new URLSearchParams(location.search);
    const sourceDocId = searchParams.get('sourceDocId');
    
    // TODO: Fetch source document data based on sourceDocId
    // For now, using MOCK_SOURCE_DOCUMENT
    useEffect(() => {
        if (sourceDocId) {
            console.log('Creating revision for document:', sourceDocId);
            // TODO: Fetch document details and linked documents from API
        }
    }, [sourceDocId]);
    
    // State for impact decisions
    const [impactDecisions, setImpactDecisions] = useState<{ [key: string]: boolean }>(
        MOCK_LINKED_DOCUMENTS.reduce((acc, doc) => {
            acc[doc.id] = false; // false = Keep current, true = Upgrade
            return acc;
        }, {} as { [key: string]: boolean })
    );
    
    const [reasonForChange, setReasonForChange] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Restore state from navigation (when coming back from Workspace)
    useEffect(() => {
        if (state?.impactDecisions) {
            setImpactDecisions(state.impactDecisions);
        }
        if (state?.reasonForChange) {
            setReasonForChange(state.reasonForChange);
        }
    }, []);

    const handleBack = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false);
        navigate("/documents/all");
    };

    const handleToggleDecision = (docId: string) => {
        setImpactDecisions(prev => ({
            ...prev,
            [docId]: !prev[docId]
        }));
    };

    const handleSubmit = () => {
        // Validate reason for change
        if (!reasonForChange.trim() || reasonForChange.length < 50) {
            setShowError(true);
            return;
        }

        // Navigate to workspace with all the data
        navigate("/documents/revisions/workspace", {
            state: {
                sourceDocument: MOCK_SOURCE_DOCUMENT,
                impactDecisions,
                linkedDocuments: MOCK_LINKED_DOCUMENTS,
                reasonForChange
            }
        });
    };

    const handleSaveDraft = () => {
        // Show confirmation modal
        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        setIsSaving(true);
        
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Implement actual save logic
        console.log("Save draft:", {
            sourceDocument: MOCK_SOURCE_DOCUMENT,
            impactDecisions,
            reasonForChange
        });
        
        setIsSaving(false);
        setShowSaveModal(false);
        
        // Navigate back to All Revisions
        navigate("/documents/revisions/all");
    };

    // Count upgrades
    const upgradeCount = Object.values(impactDecisions).filter(v => v).length;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                            New Revision - Impact Analysis [{MOCK_SOURCE_DOCUMENT.code}]
                        </h1>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <button className="hover:text-slate-700 transition-colors hidden sm:inline">Dashboard</button>
                            <Home className="h-4 w-4 sm:hidden" />
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                            >
                                Document Control
                            </button>
                            <span className="sm:hidden">...</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={() => navigate("/documents/all")}
                                className="hover:text-slate-700 transition-colors hidden sm:inline"
                            >
                                All Documents
                            </button>
                            <span className="sm:hidden">...</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700 font-medium">Impact Analysis</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" onClick={() => setShowCancelModal(true)} className="border-red-600 text-red-600 hover:bg-red-50 shadow-sm gap-1.5">
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveDraft} className="flex items-center gap-1.5 md:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 touch-manipulation">
                            <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            Save Draft
                        </Button>
                    </div>
                </div>
            </div>

            {/* Source Document Info */}
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-900 mb-1">
                            Source Document
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Document Code</p>
                                <p className="text-sm font-semibold text-slate-900">{MOCK_SOURCE_DOCUMENT.code}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Document Name</p>
                                <p className="text-sm font-medium text-slate-700">{MOCK_SOURCE_DOCUMENT.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Current Version</p>
                                <p className="text-sm font-semibold text-emerald-600">{MOCK_SOURCE_DOCUMENT.version}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Next Version</p>
                                <p className="text-sm font-semibold text-blue-600">v2.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Linked Documents Impact Analysis
                    </h3>
                    <p className="text-sm text-blue-700">
                        Review all linked documents (Forms, Annexes, References) and decide whether to keep the current version 
                        or upgrade to the new revision. Documents marked for upgrade will be highlighted below.
                    </p>
                </div>
            </div>

            {/* Impact Analysis Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Linked Documents ({MOCK_LINKED_DOCUMENTS.length})
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {upgradeCount} document(s) selected for upgrade
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <span className="text-slate-600">Legend:</span>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100">
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                <span className="text-xs text-slate-700">Keep Current</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-xs text-emerald-700">Upgrade</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                                    No.
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Document Code
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Document Name
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Current Version
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Next Version
                                </th>
                                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Decision
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_LINKED_DOCUMENTS.map((doc, index) => {
                                const isUpgrade = impactDecisions[doc.id];
                                return (
                                    <tr 
                                        key={doc.id}
                                        className={cn(
                                            "transition-all duration-200",
                                            isUpgrade 
                                                ? "bg-emerald-50/50 hover:bg-emerald-50" 
                                                : "hover:bg-slate-50"
                                        )}
                                    >
                                        <td className="py-3.5 px-4 text-sm text-slate-700">
                                            {index + 1}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm font-medium text-slate-900">
                                            {doc.code}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm text-slate-700">
                                            {doc.name}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                                doc.type === "Form" && "bg-blue-50 text-blue-700 border-blue-200",
                                                doc.type === "Annex" && "bg-purple-50 text-purple-700 border-purple-200",
                                                doc.type === "Reference" && "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm font-medium text-slate-700">
                                            {doc.currentVersion}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm">
                                            {isUpgrade ? (
                                                <span className="font-semibold text-blue-600">
                                                    {doc.nextVersion}
                                                </span>
                                            ) : (
                                                <span className="font-medium text-slate-700">
                                                    {doc.currentVersion}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <span className={cn(
                                                    "text-xs font-medium transition-colors",
                                                    isUpgrade ? "text-slate-400" : "text-slate-700"
                                                )}>
                                                    Keep
                                                </span>
                                                <button
                                                    onClick={() => handleToggleDecision(doc.id)}
                                                    className={cn(
                                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                                                        isUpgrade ? "bg-emerald-500" : "bg-slate-300"
                                                    )}
                                                    role="switch"
                                                    aria-checked={isUpgrade}
                                                >
                                                    <span
                                                        className={cn(
                                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                                                            isUpgrade ? "translate-x-6" : "translate-x-1"
                                                        )}
                                                    />
                                                </button>
                                                <span className={cn(
                                                    "text-xs font-medium transition-colors",
                                                    isUpgrade ? "text-emerald-700" : "text-slate-400"
                                                )}>
                                                    Upgrade
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reason for Change */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Reason for Change <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-slate-500 mb-3">
                            Provide a detailed explanation for creating this revision and the impact on linked documents.
                        </p>
                    </div>
                </div>
                <textarea
                    value={reasonForChange}
                    onChange={(e) => {
                        setReasonForChange(e.target.value);
                        setShowError(false);
                    }}
                    placeholder="e.g., Updated testing procedures to comply with new regulatory requirements. Forms FORM-QA-001-A and FORM-QA-001-C require updates to reflect new data fields..."
                    className={cn(
                        "w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none",
                        showError && (reasonForChange.length < 50)
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                    )}
                    rows={6}
                    maxLength={2000}
                />
                {showError && (reasonForChange.length < 50) && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {!reasonForChange.trim() 
                            ? "Reason for change is required before submitting"
                            : `Minimum 50 characters required (${reasonForChange.length}/50)`
                        }
                    </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className={cn(
                        "text-xs",
                        reasonForChange.length < 50 ? "text-amber-600 font-medium" : "text-slate-500"
                    )}>
                        {reasonForChange.length} / 2000 characters
                    </p>
                    <p className={cn(
                        "text-xs",
                        reasonForChange.length < 50 ? "text-amber-600 font-medium" : "text-emerald-600"
                    )}>
                        {reasonForChange.length >= 50 ? "✓ Minimum met" : "Minimum 50 characters required"}
                    </p>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">
                            Impact Analysis Summary
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600">Total Linked Documents:</span>
                                <span className="font-semibold text-slate-900">{MOCK_LINKED_DOCUMENTS.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600">To be Upgraded:</span>
                                <span className="font-semibold text-emerald-600">{upgradeCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600">Keep Current:</span>
                                <span className="font-semibold text-slate-600">
                                    {MOCK_LINKED_DOCUMENTS.length - upgradeCount}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={handleSubmit}
                        disabled={!reasonForChange.trim() || reasonForChange.length < 50}
                        className="shadow-sm whitespace-nowrap"
                    >
                        Continue to Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Save Draft Confirmation Modal */}
            <AlertModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={handleConfirmSave}
                type="confirm"
                title="Save Draft?"
                description={
                    <div className="space-y-3">
                        <p>Are you sure you want to save the current Impact Analysis as draft?</p>
                        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                            <p><span className="font-semibold">Source Document:</span> {MOCK_SOURCE_DOCUMENT.code}</p>
                            <p><span className="font-semibold">Documents to Upgrade:</span> {upgradeCount} of {MOCK_LINKED_DOCUMENTS.length}</p>
                            {reasonForChange && (
                                <p><span className="font-semibold">Reason Length:</span> {reasonForChange.length} characters</p>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">You can continue editing this draft later from the All Revisions screen.</p>
                    </div>
                }
                confirmText="Save Draft"
                cancelText="Cancel"
                isLoading={isSaving}
                showCancel={true}
            />

            {/* Cancel Confirmation Modal */}
            <AlertModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                type="warning"
                title="Cancel Impact Analysis?"
                description={
                    <div className="space-y-3">
                        <p>Are you sure you want to cancel the current Impact Analysis?</p>
                        <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                            <p className="text-amber-800">⚠️ <span className="font-semibold">Warning:</span> All unsaved changes will be lost.</p>
                            {upgradeCount > 0 && (
                                <p><span className="font-semibold">Pending Decisions:</span> {upgradeCount} document(s) marked for upgrade</p>
                            )}
                            {reasonForChange && (
                                <p><span className="font-semibold">Draft Reason:</span> {reasonForChange.length} characters written</p>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">You will be redirected back to the All Documents screen.</p>
                    </div>
                }
                confirmText="Yes, Cancel"
                cancelText="No, Stay"
                showCancel={true}
            />
        </div>
    );
};
