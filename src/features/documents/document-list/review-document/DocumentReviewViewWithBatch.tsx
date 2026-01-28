import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Send,
    CheckCircle,
    XCircle,
    ChevronDown,
    Users,
    Clock,
} from "lucide-react";
import { IconListNumbers } from '@tabler/icons-react';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button/Button';
import { ESignatureModal } from '@/components/ui/esignmodal/ESignatureModal';
import { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from "@/features/documents/shared/layouts";
import { useBatchNavigation, BatchDocument } from "@/features/documents/hooks";
import {
    GeneralInformationTab,
    TrainingInformationTab,
    DocumentTab,
    SignaturesTab,
    AuditTrailTab,
} from "@/features/documents/document-detail/tabs";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";
type ReviewFlowType = 'sequential' | 'parallel';
type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'completed';
type TabType = "document" | "general" | "training" | "signatures" | "audit";

interface Reviewer {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    order: number;
    status: ReviewStatus;
    reviewDate?: string;
    comments?: string;
}

interface DocumentDetail {
    id: string;
    documentId: string;
    title: string;
    type: DocumentType;
    version: string;
    status: DocumentStatus;
    effectiveDate: string;
    author: string;
    department: string;
    created: string;
    description: string;
    documentType: 'Document' | 'Revision';
    previousVersion?: string;
    reviewFlowType: ReviewFlowType;
    reviewers: Reviewer[];
    currentReviewerIndex: number;
    validUntil: string;
    openedBy: string;
    owner: string;
    approvers: string[];
    lastModified: string;
    lastModifiedBy: string;
    isTemplate: boolean;
    businessUnit: string;
    knowledgeBase: string;
    subType: string;
    periodicReviewCycle: number;
    periodicReviewNotification: number;
    language: string;
}

interface Comment {
    id: string;
    author: string;
    role: string;
    date: string;
    content: string;
}

interface DocumentReviewViewProps {
    documentId: string;
    onBack: () => void;
    currentUserId: string;
    // Batch props (optional)
    batchDocuments?: BatchDocument[];
    enableBatchMode?: boolean;
}

// --- Helper Functions ---
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// --- Mock Data ---
const MOCK_BATCH_DOCUMENTS: BatchDocument[] = [
    {
        id: "1",
        documentId: "SOP-QA-001",
        title: "Standard Operating Procedure for Quality Control Testing",
        status: "Pending Review",
        isCompleted: false,
    },
    {
        id: "2",
        documentId: "SOP-QA-002",
        title: "Quality Assurance Documentation Standards",
        status: "Pending Review",
        isCompleted: false,
    },
    {
        id: "3",
        documentId: "SOP-QA-003",
        title: "Environmental Monitoring Procedures",
        status: "Pending Review",
        isCompleted: false,
    },
    {
        id: "4",
        documentId: "SOP-QA-004",
        title: "Calibration and Maintenance of Equipment",
        status: "Pending Review",
        isCompleted: false,
    },
    {
        id: "5",
        documentId: "SOP-QA-005",
        title: "Deviation Management Procedures",
        status: "Pending Review",
        isCompleted: false,
    },
];

// Mock documents data - keyed by documentId for batch testing
const MOCK_DOCUMENTS_DATA: Record<string, DocumentDetail> = {
    "SOP-QA-001": {
        id: "1",
        documentId: "SOP-QA-001",
        title: "Standard Operating Procedure for Quality Control Testing",
        type: "SOP",
        version: "1.0",
        status: "Pending Review",
        effectiveDate: "2026-02-01",
        author: "John Smith",
        department: "Quality Assurance",
        created: "2026-01-05 10:30:00",
        description: "This SOP outlines the procedures for quality control testing of pharmaceutical products.",
        documentType: 'Revision',
        previousVersion: '2.0',
        reviewFlowType: "sequential",
        reviewers: [
            {
                id: "1",
                name: "Nguyen Van A",
                role: "QA Manager",
                email: "a.nguyen@example.com",
                department: "Quality Assurance",
                order: 1,
                status: "pending",
            },
            {
                id: "2",
                name: "Tran Thi B",
                role: "Director",
                email: "b.tran@example.com",
                department: "Board of Directors",
                order: 2,
                status: "pending",
            },
            {
                id: "3",
                name: "Le Van C",
                role: "Production Manager",
                email: "c.le@example.com",
                department: "Production",
                order: 3,
                status: "pending",
            },
        ],
        currentReviewerIndex: 0,
        validUntil: "2028-02-01",
        openedBy: "Nguyen Van A",
        owner: "John Smith",
        approvers: ["David Miller", "Jennifer Davis"],
        lastModified: "2026-01-05",
        lastModifiedBy: "John Smith",
        isTemplate: false,
        businessUnit: "Operation Unit",
        knowledgeBase: "Quality Assurance",
        subType: "-- None --",
        periodicReviewCycle: 24,
        periodicReviewNotification: 14,
        language: "English",
    },
    "SOP-QA-002": {
        id: "2",
        documentId: "SOP-QA-002",
        title: "Quality Assurance Documentation Standards",
        type: "SOP",
        version: "2.0",
        status: "Pending Review",
        effectiveDate: "2026-02-05",
        author: "Jane Doe",
        department: "Quality Assurance",
        created: "2026-01-06 09:15:00",
        description: "Standards for maintaining QA documentation in compliance with regulatory requirements including 21 CFR Part 11 and EU GMP Annex 11.",
        documentType: 'Document',
        reviewFlowType: "sequential",
        reviewers: [
            {
                id: "1",
                name: "Nguyen Van A",
                role: "QA Manager",
                email: "a.nguyen@example.com",
                department: "Quality Assurance",
                order: 1,
                status: "pending",
            },
            {
                id: "2",
                name: "Tran Thi B",
                role: "Director",
                email: "b.tran@example.com",
                department: "Board of Directors",
                order: 2,
                status: "pending",
            },
            {
                id: "3",
                name: "Le Van C",
                role: "Production Manager",
                email: "c.le@example.com",
                department: "Production",
                order: 3,
                status: "pending",
            },
        ],
        currentReviewerIndex: 0,
        validUntil: "2028-02-05",
        openedBy: "Nguyen Van A",
        owner: "Jane Doe",
        approvers: ["Sarah Wilson", "Mark Johnson"],
        lastModified: "2026-01-06",
        lastModifiedBy: "Jane Doe",
        isTemplate: false,
        businessUnit: "Operation Unit",
        knowledgeBase: "Quality Assurance",
        subType: "Documentation",
        periodicReviewCycle: 24,
        periodicReviewNotification: 14,
        language: "English",
    },
    "SOP-QA-003": {
        id: "3",
        documentId: "SOP-QA-003",
        title: "Environmental Monitoring Procedures",
        type: "SOP",
        version: "1.5",
        status: "Pending Review",
        effectiveDate: "2026-02-10",
        author: "Robert Lee",
        department: "Quality Assurance",
        created: "2026-01-07 14:45:00",
        description: "Procedures for environmental monitoring in controlled manufacturing areas including cleanroom classifications and microbial sampling.",
        documentType: 'Revision',
        previousVersion: '1.4',
        reviewFlowType: "sequential",
        reviewers: [
            {
                id: "1",
                name: "Nguyen Van A",
                role: "QA Manager",
                email: "a.nguyen@example.com",
                department: "Quality Assurance",
                order: 1,
                status: "pending",
            },
            {
                id: "2",
                name: "Tran Thi B",
                role: "Director",
                email: "b.tran@example.com",
                department: "Board of Directors",
                order: 2,
                status: "pending",
            },
            {
                id: "3",
                name: "Le Van C",
                role: "Production Manager",
                email: "c.le@example.com",
                department: "Production",
                order: 3,
                status: "pending",
            },
        ],
        currentReviewerIndex: 0,
        validUntil: "2028-02-10",
        openedBy: "Nguyen Van A",
        owner: "Robert Lee",
        approvers: ["Dr. Lisa Park", "Michael Brown"],
        lastModified: "2026-01-07",
        lastModifiedBy: "Robert Lee",
        isTemplate: false,
        businessUnit: "Operation Unit",
        knowledgeBase: "Quality Assurance",
        subType: "Environmental Control",
        periodicReviewCycle: 12,
        periodicReviewNotification: 7,
        language: "English",
    },
    "SOP-QA-004": {
        id: "4",
        documentId: "SOP-QA-004",
        title: "Calibration and Maintenance of Equipment",
        type: "SOP",
        version: "3.0",
        status: "Pending Review",
        effectiveDate: "2026-02-15",
        author: "Emily Chen",
        department: "Quality Assurance",
        created: "2026-01-08 11:20:00",
        description: "Guidelines for calibration and preventive maintenance of laboratory equipment to ensure accuracy and reliability of test results.",
        documentType: 'Revision',
        previousVersion: '2.9',
        reviewFlowType: "sequential",
        reviewers: [
            {
                id: "1",
                name: "Nguyen Van A",
                role: "QA Manager",
                email: "a.nguyen@example.com",
                department: "Quality Assurance",
                order: 1,
                status: "pending",
            },
            {
                id: "2",
                name: "Tran Thi B",
                role: "Director",
                email: "b.tran@example.com",
                department: "Board of Directors",
                order: 2,
                status: "pending",
            },
            {
                id: "3",
                name: "Le Van C",
                role: "Production Manager",
                email: "c.le@example.com",
                department: "Production",
                order: 3,
                status: "pending",
            },
        ],
        currentReviewerIndex: 0,
        validUntil: "2028-02-15",
        openedBy: "Nguyen Van A",
        owner: "Emily Chen",
        approvers: ["David Taylor", "Amanda White"],
        lastModified: "2026-01-08",
        lastModifiedBy: "Emily Chen",
        isTemplate: false,
        businessUnit: "Operation Unit",
        knowledgeBase: "Quality Assurance",
        subType: "Equipment Management",
        periodicReviewCycle: 24,
        periodicReviewNotification: 14,
        language: "English",
    },
    "SOP-QA-005": {
        id: "5",
        documentId: "SOP-QA-005",
        title: "Deviation Management Procedures",
        type: "SOP",
        version: "1.0",
        status: "Pending Review",
        effectiveDate: "2026-02-20",
        author: "David Park",
        department: "Quality Assurance",
        created: "2026-01-09 16:30:00",
        description: "Procedures for identifying, investigating, and resolving deviations from SOPs including CAPA implementation and effectiveness checks.",
        documentType: 'Document',
        reviewFlowType: "sequential",
        reviewers: [
            {
                id: "1",
                name: "Nguyen Van A",
                role: "QA Manager",
                email: "a.nguyen@example.com",
                department: "Quality Assurance",
                order: 1,
                status: "pending",
            },
            {
                id: "2",
                name: "Tran Thi B",
                role: "Director",
                email: "b.tran@example.com",
                department: "Board of Directors",
                order: 2,
                status: "pending",
            },
            {
                id: "3",
                name: "Le Van C",
                role: "Production Manager",
                email: "c.le@example.com",
                department: "Production",
                order: 3,
                status: "pending",
            },
        ],
        currentReviewerIndex: 0,
        validUntil: "2028-02-20",
        openedBy: "Nguyen Van A",
        owner: "David Park",
        approvers: ["Jessica Lee", "Thomas Anderson"],
        lastModified: "2026-01-09",
        lastModifiedBy: "David Park",
        isTemplate: false,
        businessUnit: "Operation Unit",
        knowledgeBase: "Quality Assurance",
        subType: "Deviation Control",
        periodicReviewCycle: 24,
        periodicReviewNotification: 14,
        language: "English",
    },
};

const MOCK_COMMENTS_DATA: Record<string, Comment[]> = {
    "SOP-QA-001": [
        {
            id: "1",
            author: "John Smith",
            role: "QA Manager",
            date: "2026-01-05 14:30:00",
            content: "Please review Section 3.2 regarding temperature control procedures. I believe we need more specific guidelines.",
        },
    ],
    "SOP-QA-002": [
        {
            id: "1",
            author: "Jane Doe",
            role: "Documentation Specialist",
            date: "2026-01-06 10:00:00",
            content: "Added references to 21 CFR Part 11 compliance requirements in Section 2.3.",
        },
        {
            id: "2",
            author: "Nguyen Van A",
            role: "QA Manager",
            date: "2026-01-06 15:20:00",
            content: "Please clarify the electronic signature requirements in the appendix.",
        },
    ],
    "SOP-QA-003": [
        {
            id: "1",
            author: "Robert Lee",
            role: "Environmental Specialist",
            date: "2026-01-07 15:30:00",
            content: "Updated microbial sampling frequency based on latest WHO guidelines.",
        },
    ],
    "SOP-QA-004": [
        {
            id: "1",
            author: "Emily Chen",
            role: "Calibration Engineer",
            date: "2026-01-08 12:00:00",
            content: "Added new calibration schedule for HPLC systems in Section 4.1.",
        },
        {
            id: "2",
            author: "Tran Thi B",
            role: "Director",
            date: "2026-01-08 16:45:00",
            content: "Please include cost estimates for external calibration services.",
        },
    ],
    "SOP-QA-005": [
        {
            id: "1",
            author: "David Park",
            role: "QA Specialist",
            date: "2026-01-09 17:00:00",
            content: "This procedure aligns with our new CAPA management system implementation.",
        },
    ],
};

export const DocumentReviewViewWithBatch: React.FC<DocumentReviewViewProps> = ({
    documentId,
    onBack,
    currentUserId = "1",
    batchDocuments = [],
    enableBatchMode = false,
}) => {
    const navigate = useNavigate();
    
    // Load document based on documentId from route or fallback to first mock
    const initialDocument = MOCK_DOCUMENTS_DATA[documentId] || MOCK_DOCUMENTS_DATA["SOP-QA-001"];
    const initialComments = MOCK_COMMENTS_DATA[documentId] || [];
    
    const [document, setDocument] = useState(initialDocument);
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(true);
    const [showESignModal, setShowESignModal] = useState(false);
    const [eSignAction, setESignAction] = useState<'approve' | 'reject'>('approve');

    // Batch navigation hook
    const {
        currentIndex,
        totalDocuments,
        isLastDocument,
        isNavigating,
        batchDocuments: batchDocs,
        handleNavigate,
        handleFinishBatch,
        autoNavigateToNext,
        markDocumentCompleted,
    } = useBatchNavigation({
        batchDocuments: enableBatchMode ? (batchDocuments.length > 0 ? batchDocuments : MOCK_BATCH_DOCUMENTS) : [],
        currentDocumentId: documentId,
        onNavigateToDocument: useCallback((docId: string) => {
            // Load new document data
            const newDoc = MOCK_DOCUMENTS_DATA[docId];
            const newComments = MOCK_COMMENTS_DATA[docId] || [];
            if (newDoc) {
                setDocument(newDoc);
                setComments(newComments);
                setNewComment("");
                setActiveTab("document");
            }
            // Navigate to the new document
            navigate(`/documents/review/${docId}`);
        }, [navigate]),
        onFinishBatch: useCallback(() => {
            console.log("Hoàn thành tất cả tài liệu trong lô!");
            navigate('/dashboard');
        }, [navigate]),
    });

    // Determine if current user can review
    const currentReviewer = document.reviewers.find(r => r.id === currentUserId);
    const canReview = currentReviewer && currentReviewer.status === 'pending' && (
        document.reviewFlowType === 'parallel' ||
        (document.reviewFlowType === 'sequential' && currentReviewer.order === document.currentReviewerIndex + 1)
    );

    const handleApprove = () => {
        if (!currentReviewer) return;
        setESignAction('approve');
        setShowESignModal(true);
    };

    const handleReject = () => {
        if (!currentReviewer) return;
        setESignAction('reject');
        setShowESignModal(true);
    };

    const handleESignConfirm = (reason: string) => {
        if (!currentReviewer) return;
        
        setIsSubmitting(true);
        setShowESignModal(false);
        
        // Simulate API call
        setTimeout(() => {
            const newStatus = eSignAction === 'approve' ? 'approved' : 'rejected';
            const updatedReviewers = document.reviewers.map(r =>
                r.id === currentUserId
                    ? { ...r, status: newStatus as ReviewStatus, reviewDate: new Date().toISOString(), comments: reason }
                    : r
            );

            let nextIndex = document.currentReviewerIndex;
            if (document.reviewFlowType === 'sequential' && eSignAction === 'approve') {
                nextIndex = document.currentReviewerIndex + 1;
            }

            setDocument({
                ...document,
                reviewers: updatedReviewers,
                currentReviewerIndex: nextIndex,
                status: eSignAction === 'reject' ? "Draft" : document.status,
            });

            setIsSubmitting(false);

            // Show success message
            const successMessage = eSignAction === 'approve' 
                ? "Phê duyệt thành công!" 
                : "Từ chối thành công!";

            // Auto-navigate if batch mode enabled
            if (enableBatchMode && batchDocs.length > 0) {
                if (isLastDocument) {
                    // Last document
                    console.log(successMessage + " - Đây là tài liệu cuối cùng trong lô.");
                    markDocumentCompleted(documentId);
                } else {
                    // Not last document - auto navigate
                    console.log(successMessage + " - Đang tải tài liệu tiếp theo...");
                    markDocumentCompleted(documentId);
                    autoNavigateToNext();
                }
            } else {
                // No batch mode
                console.log(successMessage);
            }
        }, 1000);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: currentReviewer?.name || "Current User",
            role: currentReviewer?.role || "Reviewer",
            date: new Date().toISOString(),
            content: newComment,
        };

        setComments([...comments, comment]);
        setNewComment("");
    };

    // Status workflow steps
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Effective", "Archive"];

    // Breadcrumbs
    const breadcrumbs = [
        { label: "Dashboard", onClick: onBack },
        { label: "Document Control", onClick: onBack },
        { label: "Pending My Review", onClick: onBack },
        { label: document.documentId, isActive: true },
    ];

    // Prepare batch info for layout
    const batchInfo = enableBatchMode && batchDocs.length > 0 ? {
        currentIndex,
        totalDocuments,
        documents: batchDocs,
        onNavigate: handleNavigate,
        onFinishBatch: handleFinishBatch,
    } : undefined;

    return (
        <DocumentWorkflowLayout
            title="Document Review"
            breadcrumbs={breadcrumbs}
            onBack={onBack}
            documentId={document.documentId}
            documentStatus={document.status}
            statusSteps={statusSteps}
            currentStatus={document.status}
            tabs={DEFAULT_WORKFLOW_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            batchInfo={batchInfo}
        >
            {activeTab === "document" && (
                <div className="space-y-6">
                    {/* PDF Preview Section */}
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                           <DocumentTab />
                                       </div>

                    {/* Review Workflow Info */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
                            className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                <h3 className="text-base lg:text-lg font-bold text-slate-900">Review Workflow</h3>
                                <div className="inline-flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-slate-50 border border-slate-200 rounded-lg w-fit">
                                    {document.reviewFlowType === 'sequential' ? (
                                        <>
                                            <IconListNumbers className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-600" />
                                            <span className="text-xs lg:text-sm font-medium text-slate-700">Sequential Review</span>
                                        </>
                                    ) : (
                                        <>
                                            <Users className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-600" />
                                            <span className="text-xs lg:text-sm font-medium text-slate-700">Parallel Review</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 text-slate-400 transition-transform duration-300 ease-in-out",
                                    isWorkflowExpanded && "transform rotate-180"
                                )}
                            />
                        </button>

                        <div
                            className={cn(
                                "transition-all duration-300 ease-in-out overflow-hidden",
                                isWorkflowExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-3">
                                {document.reviewers.map((reviewer) => {
                                    const isCurrentUserReviewer = reviewer.id === currentUserId;
                                    const isActiveReviewer = document.reviewFlowType === 'sequential'
                                        ? reviewer.order === document.currentReviewerIndex + 1
                                        : reviewer.status === 'pending';

                                    return (
                                        <div
                                            key={reviewer.id}
                                            className={cn(
                                                "p-3 lg:p-4 rounded-lg border transition-all",
                                                isCurrentUserReviewer && isActiveReviewer
                                                    ? "bg-emerald-50 border-emerald-200"
                                                    : "bg-white border-slate-200"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    {document.reviewFlowType === 'sequential' && (
                                                        <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                            {reviewer.order}
                                                        </div>
                                                    )}
                                                    <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                                        {reviewer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium text-sm lg:text-base text-slate-900">{reviewer.name}</h4>
                                                            {isCurrentUserReviewer && (
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <span>{reviewer.role}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span>{reviewer.department}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 lg:gap-3">
                                                    {reviewer.reviewDate && (
                                                        <span className="text-xs text-slate-500 hidden lg:inline">
                                                            {formatDate(reviewer.reviewDate)}
                                                        </span>
                                                    )}
                                                    {reviewer.status === 'approved' && (
                                                        <div className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                                                            <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                                            <span className="text-xs font-medium">Approved</span>
                                                        </div>
                                                    )}
                                                    {reviewer.status === 'rejected' && (
                                                        <div className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-red-50 text-red-700 rounded-full">
                                                            <XCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                                            <span className="text-xs font-medium">Rejected</span>
                                                        </div>
                                                    )}
                                                    {reviewer.status === 'pending' && (
                                                        <div className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-amber-50 text-amber-700 rounded-full">
                                                            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                                            <span className="text-xs font-medium">Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Show date on narrow screens */}
                                            {reviewer.reviewDate && (
                                                <div className="mt-2 text-xs text-slate-500 lg:hidden">
                                                    {formatDate(reviewer.reviewDate)}
                                                </div>
                                            )}

                                            {reviewer.comments && (
                                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-sm text-slate-600">{reviewer.comments}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 lg:p-6 border-b border-slate-200">
                            <div className="flex items-center gap-2 lg:gap-3">
                                <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600" />
                                <h3 className="text-base lg:text-lg font-bold text-slate-900">Comments</h3>
                                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                                    {comments.length}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 lg:gap-4">
                                    <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0">
                                        {comment.author.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 lg:gap-2 mb-1">
                                            <span className="font-medium text-sm lg:text-base text-slate-900">{comment.author}</span>
                                            <span className="text-xs text-slate-500">{comment.role}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-xs text-slate-500">{formatDate(comment.date)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{comment.content}</p>
                                    </div>
                                </div>
                            ))}

                            {canReview && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                            {currentReviewer?.name.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="flex-1 min-h-[80px] px-3 lg:px-4 py-2 lg:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                            />
                                            <Button
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                variant="outline"
                                                size="sm"
                                                className="self-end"
                                            >
                                                <Send className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {canReview && (
                        <div className="flex items-center justify-end gap-2 lg:gap-4 pt-4">
                            <Button
                                onClick={handleReject}
                                variant="outline"
                                size="sm"
                                disabled={isSubmitting || isNavigating}
                                className="flex-1 lg:flex-initial border-red-200 text-red-700 hover:bg-red-50"
                            >
                                <ThumbsDown className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                                <span className="text-xs lg:text-sm">Reject</span>
                            </Button>
                            <Button
                                onClick={handleApprove}
                                variant="default"
                                size="sm"
                                disabled={isSubmitting || isNavigating}
                                className="flex-1 lg:flex-initial gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <ThumbsUp className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                Approve
                                {enableBatchMode && !isLastDocument && (
                                    <span className="ml-1 text-xs opacity-75">& Next</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "general" && (
                <GeneralInformationTab
                    document={{
                        documentId: document.documentId,
                        title: document.title,
                        type: document.type,
                        created: document.created,
                        openedBy: document.openedBy,
                        author: document.author,
                        isTemplate: document.isTemplate,
                        businessUnit: document.businessUnit,
                        department: document.department,
                        knowledgeBase: document.knowledgeBase,
                        subType: document.subType,
                        periodicReviewCycle: document.periodicReviewCycle,
                        periodicReviewNotification: document.periodicReviewNotification,
                        effectiveDate: document.effectiveDate,
                        validUntil: document.validUntil,
                        language: document.language,
                        description: document.description,
                    }}
                    isReadOnly={false}
                />
            )}

            {activeTab === "training" && <TrainingInformationTab />}
            {activeTab === "signatures" && <SignaturesTab />}
            {activeTab === "audit" && <AuditTrailTab />}

            {/* E-Signature Modal */}
            <ESignatureModal
                isOpen={showESignModal}
                onClose={() => setShowESignModal(false)}
                onConfirm={handleESignConfirm}
                actionTitle={eSignAction === 'approve' ? "Approve Document" : "Reject Document"}
            />
        </DocumentWorkflowLayout>
    );
};
