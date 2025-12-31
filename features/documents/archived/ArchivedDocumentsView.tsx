import React, { useState, useMemo } from 'react';
import { 
    Archive, 
    ChevronRight, 
    Eye, 
    RotateCcw, 
    Download,
    AlertTriangle,
    Clock,
    MoreVertical,
    Home
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/button/Button';
import { cn } from '../../../components/ui/utils';
import { ArchivedDocumentFilters } from './components/ArchivedDocumentFilters';
import { RestoreModal } from './components/RestoreModal';
import { PreviewModal } from './components/PreviewModal';
import { ArchivedDocument, RetentionFilter } from './types';
import { 
    calculateRetentionStatus, 
    getRetentionBadgeStyle, 
    formatRetentionPeriod,
    logAuditTrail,
    canUserRestore 
} from './utils';

// Mock Data
const MOCK_ARCHIVED_DOCS: ArchivedDocument[] = [
    {
        id: '1',
        code: 'QMS-SOP-001',
        documentName: 'Quality Management System Procedure v1.0',
        version: '1.0',
        effectiveDate: '2023-01-15',
        archivedDate: '2024-06-20',
        archivedBy: 'Sarah Johnson',
        lastApprover: 'John Smith',
        retentionPeriod: 36,
        retentionExpiry: '2027-06-20',
        department: 'Quality Assurance',
        category: 'SOP',
        reason: 'Replaced by v2.0',
        replacedBy: 'QMS-SOP-001-v2',
        fileSize: '2.5 MB'
    },
    {
        id: '2',
        code: 'MFG-WI-045',
        documentName: 'Manufacturing Process Work Instruction',
        version: '3.2',
        effectiveDate: '2022-08-10',
        archivedDate: '2024-01-15',
        archivedBy: 'Michael Chen',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 24,
        retentionExpiry: '2026-01-15',
        department: 'Manufacturing',
        category: 'Work Instruction',
        reason: 'Process optimization - replaced by v4.0',
        fileSize: '1.8 MB'
    },
    {
        id: '3',
        code: 'VAL-PRO-012',
        documentName: 'Equipment Validation Protocol',
        version: '2.1',
        effectiveDate: '2020-03-20',
        archivedDate: '2023-12-10',
        archivedBy: 'John Smith',
        lastApprover: 'Michael Chen',
        retentionPeriod: 60,
        retentionExpiry: '2028-12-10',
        department: 'Validation',
        category: 'Protocol',
        reason: 'Equipment decommissioned',
        fileSize: '4.2 MB'
    },
    {
        id: '4',
        code: 'QC-TEST-089',
        documentName: 'Quality Control Testing Method',
        version: '1.5',
        effectiveDate: '2019-11-05',
        archivedDate: '2023-01-20',
        archivedBy: 'Sarah Johnson',
        lastApprover: 'John Smith',
        retentionPeriod: 24,
        retentionExpiry: '2025-01-20',
        department: 'Quality Control',
        category: 'Test Method',
        reason: 'Method updated to comply with new regulations',
        fileSize: '950 KB'
    },
];

export const ArchivedDocumentsView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [lastApproverFilter, setLastApproverFilter] = useState('all');
    const [retentionFilter, setRetentionFilter] = useState<RetentionFilter>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDocument, setSelectedDocument] = useState<ArchivedDocument | null>(null);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock user role - in production, this would come from auth context
    const userRole = 'Admin'; // or 'QA Manager', 'Quality Assurance', 'User'

    const filteredDocuments = useMemo(() => {
        return MOCK_ARCHIVED_DOCS.filter(doc => {
            // Search filter
            if (searchQuery && !doc.code.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !doc.documentName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Last Approver filter
            if (lastApproverFilter !== 'all' && doc.lastApprover !== lastApproverFilter) {
                return false;
            }

            // Date range filter
            if (startDate && new Date(doc.archivedDate) < new Date(startDate)) {
                return false;
            }
            if (endDate && new Date(doc.archivedDate) > new Date(endDate)) {
                return false;
            }

            // Retention filter
            if (retentionFilter !== 'all') {
                const status = calculateRetentionStatus(doc.retentionExpiry);
                if (status.status !== retentionFilter) {
                    return false;
                }
            }

            return true;
        });
    }, [searchQuery, lastApproverFilter, retentionFilter, startDate, endDate]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    const handleView = (doc: ArchivedDocument) => {
        setSelectedDocument(doc);
        setIsPreviewModalOpen(true);
        logAuditTrail(doc.id, doc.code, 'viewed', userRole);
    };

    const handleRestore = (doc: ArchivedDocument) => {
        setSelectedDocument(doc);
        setIsRestoreModalOpen(true);
    };

    const handleRestoreConfirm = (reason: string) => {
        if (!selectedDocument) return;
        
        console.log('Restoring document:', selectedDocument.code, 'Reason:', reason);
        logAuditTrail(selectedDocument.id, selectedDocument.code, 'restored', userRole, reason);
        
        // In production, call API to restore the document
        alert(`Document ${selectedDocument.code} restored successfully!`);
    };

    const handleDownload = (doc: ArchivedDocument) => {
        console.log('Downloading:', doc.code);
        logAuditTrail(doc.id, doc.code, 'downloaded', userRole);
    };

    const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (openDropdownId === id) {
            setOpenDropdownId(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX - 180 + rect.width,
            });
            setOpenDropdownId(id);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Archived Documents</h1>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                            <span className="hidden sm:inline">Dashboard</span>
                            <Home className="h-3 w-3 sm:hidden" />
                            <ChevronRight className="h-3 w-3" />
                            <span className="hidden sm:inline">Document Control</span>
                            <span className="sm:hidden">...</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-slate-700 font-medium">Archived Documents</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg bg-white text-center flex items-center gap-2">
                        <div className="text-base text-slate-900">Total Archived:</div>
                        <div className="text-xl font-bold text-slate-900">{filteredDocuments.length}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <ArchivedDocumentFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                lastApproverFilter={lastApproverFilter}
                onLastApproverChange={setLastApproverFilter}
                retentionFilter={retentionFilter}
                onRetentionFilterChange={setRetentionFilter}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
            />

            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-center whitespace-nowrap w-16">
                                    No.
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Document Code
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Document Name
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Version
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Archived Date
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Last Approver
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Retention Period
                                </th>
                                <th className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider text-left whitespace-nowrap">
                                    Retention Status
                                </th>
                                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {paginatedDocuments.map((doc, index) => {
                                const retentionStatus = calculateRetentionStatus(doc.retentionExpiry);
                                const rowNumber = startIndex + index + 1;
                                return (
                                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center text-slate-600">
                                            {rowNumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <span className="font-medium text-slate-900">{doc.code}</span>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm">
                                            <div className="max-w-md">
                                                <p className="font-medium text-slate-900 truncate">{doc.documentName}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{doc.department}</p>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.version}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {new Date(doc.archivedDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.lastApprover}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-slate-400" />
                                                {formatRetentionPeriod(doc.retentionPeriod)}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit",
                                                    getRetentionBadgeStyle(retentionStatus.status)
                                                )}>
                                                    {retentionStatus.status === 'expired' && <AlertTriangle className="h-3 w-3" />}
                                                    {retentionStatus.status === 'expiring-soon' && <Clock className="h-3 w-3" />}
                                                    {retentionStatus.message}
                                                </span>
                                            </div>
                                        </td>
                                        <td 
                                            onClick={(e) => e.stopPropagation()}
                                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                                        >
                                            <button
                                                onClick={(e) => handleDropdownToggle(doc.id, e)}
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreVertical className="h-4 w-4 text-slate-600" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {paginatedDocuments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Archive className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-lg font-medium text-slate-600">No archived documents found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredDocuments.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
                        <div className="text-sm text-slate-600">
                            Showing <span className="font-medium text-slate-900">{startIndex + 1}-{Math.min(endIndex, filteredDocuments.length)}</span> of <span className="font-medium text-slate-900">{filteredDocuments.length}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={cn(
                                    'h-9 px-4 text-sm font-medium rounded-md transition-all border border-slate-200',
                                    currentPage === 1 ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
                                )}
                            >
                                Previous
                            </button>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={cn(
                                    'h-9 px-4 text-sm font-medium rounded-md transition-all border border-slate-200',
                                    currentPage === totalPages ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
                                )}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Dropdown Menu */}
            {openDropdownId && createPortal(
                <>
                    <div 
                        className="fixed inset-0 z-40 animate-in fade-in duration-150" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(null);
                        }}
                        aria-hidden="true"
                    />
                    <div 
                        className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                        style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                    >
                        <div className="py-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const doc = paginatedDocuments.find(d => d.id === openDropdownId);
                                    if (doc) handleView(doc);
                                    setOpenDropdownId(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                            >
                                <Eye className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">Preview</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const doc = paginatedDocuments.find(d => d.id === openDropdownId);
                                    if (doc) handleDownload(doc);
                                    setOpenDropdownId(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                            >
                                <Download className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">Download</span>
                            </button>
                            {canUserRestore(userRole) && (
                                <>
                                    <div className="h-px bg-slate-100 my-1" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const doc = paginatedDocuments.find(d => d.id === openDropdownId);
                                            if (doc) handleRestore(doc);
                                            setOpenDropdownId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 active:bg-amber-100 transition-colors"
                                    >
                                        <RotateCcw className="h-4 w-4 flex-shrink-0" />
                                        <span className="font-medium">Restore Document</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>,
                window.document.body
            )}

            {/* Modals */}
            <RestoreModal
                isOpen={isRestoreModalOpen}
                onClose={() => setIsRestoreModalOpen(false)}
                onConfirm={handleRestoreConfirm}
                document={selectedDocument}
                userRole={userRole}
            />

            <PreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                document={selectedDocument}
                onDownload={() => selectedDocument && handleDownload(selectedDocument)}
            />
        </div>
    );
};
