import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Archive, 
    Download,
    MoreVertical
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button/Button';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { cn } from '@/components/ui/utils';
import { ArchivedDocumentFilters } from './components/ArchivedDocumentFilters';
import { ArchivedDocument, RetentionFilter } from './types';
import { 
    calculateRetentionStatus, 
    getRetentionBadgeStyle, 
    formatRetentionPeriod,
    logAuditTrail
} from './utils';
import { IconInfoCircle, IconSmartHome } from '@tabler/icons-react';

// Mock Data
const MOCK_ARCHIVED_DOCS: ArchivedDocument[] = [
    {
        id: '1',
        code: 'QMS.0001.01',
        documentName: 'Quality Management System Procedure 1.0',
        version: '1.0',
        effectiveDate: '2023-01-15',
        archivedDate: '2024-06-20',
        archivedBy: 'Sarah Johnson',
        lastApprover: 'John Smith',
        retentionPeriod: 36,
        retentionExpiry: '2027-06-20',
        department: 'Quality Assurance',
        category: 'SOP',
        reason: 'Replaced by 2.0',
        replacedBy: 'QMS.0001.02',
        fileSize: '2.5 MB'
    },
    {
        id: '2',
        code: 'MFG.0045.01',
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
    {
        id: '5',
        code: 'SOP.0234.02',
        documentName: 'Cleaning and Sanitization Procedure',
        version: '2.0',
        effectiveDate: '2021-05-12',
        archivedDate: '2024-03-15',
        archivedBy: 'Robert Lee',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2028-03-15',
        department: 'Quality Assurance',
        category: 'SOP',
        reason: 'Updated to new cleaning standards',
        replacedBy: 'SOP.0234.03',
        fileSize: '1.2 MB'
    },
    {
        id: '6',
        code: 'SPEC-RAW-056',
        documentName: 'Raw Material Specification - API Grade A',
        version: '1.0',
        effectiveDate: '2020-09-08',
        archivedDate: '2023-11-25',
        archivedBy: 'Lisa Anderson',
        lastApprover: 'Michael Chen',
        retentionPeriod: 36,
        retentionExpiry: '2026-11-25',
        department: 'Quality Control',
        category: 'Specification',
        reason: 'Supplier changed',
        fileSize: '680 KB'
    },
    {
        id: '7',
        code: 'FORM-DEV-023',
        documentName: 'Deviation Investigation Report Form',
        version: '3.0',
        effectiveDate: '2019-07-14',
        archivedDate: '2023-08-10',
        archivedBy: 'David Wilson',
        lastApprover: 'John Smith',
        retentionPeriod: 60,
        retentionExpiry: '2028-08-10',
        department: 'Quality Assurance',
        category: 'Form',
        reason: 'Form redesigned for better usability',
        replacedBy: 'FORM-DEV-024',
        fileSize: '450 KB'
    },
    {
        id: '8',
        code: 'TRAIN-GMP-101',
        documentName: 'Good Manufacturing Practice Training Manual',
        version: '4.5',
        effectiveDate: '2018-03-22',
        archivedDate: '2022-12-05',
        archivedBy: 'Emily Brown',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 36,
        retentionExpiry: '2025-12-05',
        department: 'Training',
        category: 'Training Material',
        reason: 'Updated regulatory requirements',
        fileSize: '3.8 MB'
    },
    {
        id: '9',
        code: 'ENG-CAL-045',
        documentName: 'Equipment Calibration Schedule - Production Line 2',
        version: '2.3',
        effectiveDate: '2020-11-18',
        archivedDate: '2024-02-28',
        archivedBy: 'Thomas Anderson',
        lastApprover: 'Michael Chen',
        retentionPeriod: 24,
        retentionExpiry: '2026-02-28',
        department: 'Engineering',
        category: 'Schedule',
        reason: 'Production line upgraded',
        fileSize: '890 KB'
    },
    {
        id: '10',
        code: 'MBR-PROD-178',
        documentName: 'Master Batch Record - Product XYZ v2',
        version: '2.0',
        effectiveDate: '2019-06-30',
        archivedDate: '2023-09-15',
        archivedBy: 'Maria Garcia',
        lastApprover: 'John Smith',
        retentionPeriod: 72,
        retentionExpiry: '2029-09-15',
        department: 'Manufacturing',
        category: 'Batch Record',
        reason: 'Formulation change',
        replacedBy: 'MBR-PROD-179',
        fileSize: '5.2 MB'
    },
    {
        id: '11',
        code: 'AUDIT-INT-034',
        documentName: 'Internal Audit Checklist - GMP Compliance',
        version: '1.8',
        effectiveDate: '2021-02-10',
        archivedDate: '2024-05-20',
        archivedBy: 'Jennifer White',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2028-05-20',
        department: 'Quality Assurance',
        category: 'Checklist',
        reason: 'Updated audit criteria',
        fileSize: '720 KB'
    },
    {
        id: '12',
        code: 'RISK-ASSESS-089',
        documentName: 'Risk Assessment Template - Process Changes',
        version: '1.0',
        effectiveDate: '2020-04-15',
        archivedDate: '2023-10-12',
        archivedBy: 'Daniel Kim',
        lastApprover: 'Michael Chen',
        retentionPeriod: 36,
        retentionExpiry: '2026-10-12',
        department: 'Quality Management',
        category: 'Template',
        reason: 'Enhanced risk evaluation methodology',
        replacedBy: 'RISK-ASSESS-090',
        fileSize: '1.1 MB'
    },
    {
        id: '13',
        code: 'SAF-MSDS-234',
        documentName: 'Material Safety Data Sheet - Chemical Solvent A',
        version: '3.0',
        effectiveDate: '2018-08-25',
        archivedDate: '2022-11-18',
        archivedBy: 'Susan Miller',
        lastApprover: 'John Smith',
        retentionPeriod: 60,
        retentionExpiry: '2027-11-18',
        department: 'Safety & Compliance',
        category: 'MSDS',
        reason: 'Chemical no longer in use',
        fileSize: '580 KB'
    },
    {
        id: '14',
        code: 'PACK-SPEC-167',
        documentName: 'Packaging Specification - Blister Pack Type B',
        version: '2.5',
        effectiveDate: '2019-12-08',
        archivedDate: '2023-07-22',
        archivedBy: 'Kevin Brown',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 36,
        retentionExpiry: '2026-07-22',
        department: 'Packaging',
        category: 'Specification',
        reason: 'New packaging material approved',
        fileSize: '2.3 MB'
    },
    {
        id: '15',
        code: 'LAB-METHOD-456',
        documentName: 'Analytical Testing Method - HPLC Assay',
        version: '4.0',
        effectiveDate: '2017-10-30',
        archivedDate: '2022-06-14',
        archivedBy: 'Rachel Green',
        lastApprover: 'Michael Chen',
        retentionPeriod: 60,
        retentionExpiry: '2027-06-14',
        department: 'Quality Control',
        category: 'Test Method',
        reason: 'Method validation updated',
        replacedBy: 'LAB-METHOD-457',
        fileSize: '1.6 MB'
    },
    {
        id: '16',
        code: 'CHANGE-CTRL-089',
        documentName: 'Change Control Procedure v1',
        version: '1.0',
        effectiveDate: '2020-01-20',
        archivedDate: '2024-01-10',
        archivedBy: 'William Davis',
        lastApprover: 'John Smith',
        retentionPeriod: 48,
        retentionExpiry: '2028-01-10',
        department: 'Quality Management',
        category: 'SOP',
        reason: 'Process improvement',
        replacedBy: 'CHANGE-CTRL-090',
        fileSize: '1.9 MB'
    },
    {
        id: '17',
        code: 'ENV-MON-123',
        documentName: 'Environmental Monitoring Program - Cleanroom',
        version: '2.0',
        effectiveDate: '2019-05-14',
        archivedDate: '2023-09-30',
        archivedBy: 'Amanda Lopez',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 60,
        retentionExpiry: '2028-09-30',
        department: 'Quality Control',
        category: 'Program',
        reason: 'Updated monitoring requirements',
        fileSize: '3.1 MB'
    },
    {
        id: '18',
        code: 'STAB-PROT-234',
        documentName: 'Stability Testing Protocol - Long Term Study',
        version: '1.5',
        effectiveDate: '2018-07-22',
        archivedDate: '2023-02-18',
        archivedBy: 'Christopher Lee',
        lastApprover: 'Michael Chen',
        retentionPeriod: 72,
        retentionExpiry: '2029-02-18',
        department: 'Quality Control',
        category: 'Protocol',
        reason: 'Study completed',
        fileSize: '4.5 MB'
    },
    {
        id: '19',
        code: 'VENDOR-QUAL-067',
        documentName: 'Vendor Qualification Procedure',
        version: '3.0',
        effectiveDate: '2020-09-12',
        archivedDate: '2024-04-25',
        archivedBy: 'Patricia Wilson',
        lastApprover: 'John Smith',
        retentionPeriod: 36,
        retentionExpiry: '2027-04-25',
        department: 'Supply Chain',
        category: 'SOP',
        reason: 'Enhanced qualification criteria',
        replacedBy: 'VENDOR-QUAL-068',
        fileSize: '1.4 MB'
    },
    {
        id: '20',
        code: 'CAPA-PROC-045',
        documentName: 'CAPA Investigation and Closure Procedure',
        version: '2.3',
        effectiveDate: '2019-11-28',
        archivedDate: '2023-12-15',
        archivedBy: 'Charles Martinez',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2027-12-15',
        department: 'Quality Assurance',
        category: 'SOP',
        reason: 'Process streamlining',
        fileSize: '2.1 MB'
    },
    {
        id: '21',
        code: 'CLEAN-VAL-156',
        documentName: 'Cleaning Validation Protocol - Equipment Suite A',
        version: '1.0',
        effectiveDate: '2018-06-10',
        archivedDate: '2022-10-20',
        archivedBy: 'Michelle Taylor',
        lastApprover: 'Michael Chen',
        retentionPeriod: 60,
        retentionExpiry: '2027-10-20',
        department: 'Validation',
        category: 'Protocol',
        reason: 'Equipment suite decommissioned',
        fileSize: '3.7 MB'
    },
    {
        id: '22',
        code: 'COMP-INVEST-089',
        documentName: 'Complaint Investigation Work Instruction',
        version: '4.0',
        effectiveDate: '2017-12-05',
        archivedDate: '2022-08-15',
        archivedBy: 'Steven Anderson',
        lastApprover: 'John Smith',
        retentionPeriod: 60,
        retentionExpiry: '2027-08-15',
        department: 'Quality Assurance',
        category: 'Work Instruction',
        reason: 'Improved investigation workflow',
        replacedBy: 'COMP-INVEST-090',
        fileSize: '1.3 MB'
    },
    {
        id: '23',
        code: 'PROD-REL-123',
        documentName: 'Product Release Criteria Specification',
        version: '2.0',
        effectiveDate: '2020-03-18',
        archivedDate: '2024-01-28',
        archivedBy: 'Barbara Thompson',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2028-01-28',
        department: 'Quality Control',
        category: 'Specification',
        reason: 'Updated acceptance criteria',
        fileSize: '980 KB'
    },
    {
        id: '24',
        code: 'UTIL-QUAL-078',
        documentName: 'Utilities Qualification Report - Water System',
        version: '1.0',
        effectiveDate: '2019-08-14',
        archivedDate: '2023-11-05',
        archivedBy: 'Richard Garcia',
        lastApprover: 'Michael Chen',
        retentionPeriod: 60,
        retentionExpiry: '2028-11-05',
        department: 'Engineering',
        category: 'Report',
        reason: 'System requalification completed',
        fileSize: '6.8 MB'
    },
    {
        id: '25',
        code: 'RECALL-PROC-034',
        documentName: 'Product Recall Procedure',
        version: '1.5',
        effectiveDate: '2020-07-20',
        archivedDate: '2024-03-12',
        archivedBy: 'Nancy Rodriguez',
        lastApprover: 'John Smith',
        retentionPeriod: 36,
        retentionExpiry: '2027-03-12',
        department: 'Quality Assurance',
        category: 'SOP',
        reason: 'Regulatory requirement update',
        replacedBy: 'RECALL-PROC-035',
        fileSize: '1.7 MB'
    },
    {
        id: '26',
        code: 'DATA-INTEG-067',
        documentName: 'Data Integrity Management Procedure',
        version: '1.0',
        effectiveDate: '2021-01-08',
        archivedDate: '2024-06-15',
        archivedBy: 'Joseph Hernandez',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2028-06-15',
        department: 'IT & Quality',
        category: 'SOP',
        reason: 'Enhanced controls implemented',
        fileSize: '2.4 MB'
    },
    {
        id: '27',
        code: 'EQUIP-MAINT-234',
        documentName: 'Preventive Maintenance Schedule - Packaging Line',
        version: '3.0',
        effectiveDate: '2018-10-25',
        archivedDate: '2023-05-18',
        archivedBy: 'Linda Moore',
        lastApprover: 'Michael Chen',
        retentionPeriod: 36,
        retentionExpiry: '2026-05-18',
        department: 'Engineering',
        category: 'Schedule',
        reason: 'Equipment replaced',
        fileSize: '1.5 MB'
    },
    {
        id: '28',
        code: 'ANNUAL-REV-2021',
        documentName: 'Annual Product Quality Review 2021',
        version: '1.0',
        effectiveDate: '2022-02-15',
        archivedDate: '2023-01-30',
        archivedBy: 'Mark Jackson',
        lastApprover: 'John Smith',
        retentionPeriod: 60,
        retentionExpiry: '2028-01-30',
        department: 'Quality Assurance',
        category: 'Report',
        reason: 'Annual review archived',
        fileSize: '8.3 MB'
    },
    {
        id: '29',
        code: 'SUPP-AUDIT-156',
        documentName: 'Supplier Audit Checklist - API Manufacturers',
        version: '2.0',
        effectiveDate: '2019-04-12',
        archivedDate: '2023-08-25',
        archivedBy: 'Karen White',
        lastApprover: 'Sarah Johnson',
        retentionPeriod: 48,
        retentionExpiry: '2027-08-25',
        department: 'Supply Chain',
        category: 'Checklist',
        reason: 'Updated audit requirements',
        replacedBy: 'SUPP-AUDIT-157',
        fileSize: '890 KB'
    },
    {
        id: '30',
        code: 'MEDIA-FILL-089',
        documentName: 'Media Fill Validation Protocol - Aseptic Line 1',
        version: '1.0',
        effectiveDate: '2020-08-30',
        archivedDate: '2024-02-10',
        archivedBy: 'Brian Clark',
        lastApprover: 'Michael Chen',
        retentionPeriod: 60,
        retentionExpiry: '2029-02-10',
        department: 'Validation',
        category: 'Protocol',
        reason: 'Revalidation completed',
        fileSize: '4.9 MB'
    },
];

export const ArchivedDocumentsView: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [lastApproverFilter, setLastApproverFilter] = useState('all');
    const [retentionFilter, setRetentionFilter] = useState<RetentionFilter>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
        logAuditTrail(doc.id, doc.code, 'viewed', userRole);
        // Navigate to detail view with Obsoleted status
        navigate(`/documents/${doc.id}`, {
            state: {
                initialStatus: 'Obsoleted',
                fromArchive: true
            }
        });
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
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">Archived Documents</h1>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 whitespace-nowrap overflow-x-auto">
                        <IconSmartHome className="h-4 w-4" />
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="hidden sm:inline">Document Control</span>
                        <span className="sm:hidden">...</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-700 font-medium">Archived Documents</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <Button
                        onClick={() => {
                            console.log("Export triggered");
                            // TODO: Implement export functionality
                        }}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
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
                        <thead className="bg-slate-50 border-b-2 border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center whitespace-nowrap w-16">
                                    No.
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Document Code
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Document Name
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Version
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Archived Date
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Last Approver
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Retention Period
                                </th>
                                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                                    Retention Status
                                </th>
                                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                                            {new Date(doc.archivedDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.lastApprover}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {formatRetentionPeriod(doc.retentionPeriod)}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit",
                                                getRetentionBadgeStyle(retentionStatus.status)
                                            )}>
                                                {retentionStatus.message}
                                            </span>
                                        </td>
                                        <td 
                                            onClick={(e) => e.stopPropagation()}
                                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => handleDropdownToggle(doc.id, e)}
                                            >
                                                <MoreVertical className="h-4 w-4 text-slate-600" />
                                            </Button>
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
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredDocuments.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
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
                        className="fixed z-50 min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
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
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                            >
                                <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">View Detail</span>
                            </button>
                        </div>
                    </div>
                </>,
                window.document.body
            )}

        </div>
    );
};
