import React, { useState } from "react";
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
import { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from "../DocumentWorkflowLayout";
import {
    GeneralInformationTab,
    TrainingInformationTab,
    DocumentContentTab,
    SignaturesTab,
    AuditTrailTab,
} from "@/features/documents/detail-document/tabs";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";
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
    documentType: 'Document' | 'Revision'; // Distinguish Document vs Revision
    previousVersion?: string; // Only for Revision
    reviewFlowType: ReviewFlowType;
    reviewers: Reviewer[];
    currentReviewerIndex: number; // For sequential review
    // Extended fields for GeneralInformationTab
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
    currentUserId: string; // ID of the logged-in user
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
const MOCK_DOCUMENT: DocumentDetail = {
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
    documentType: 'Revision', // Set as Revision to enable compare
    previousVersion: 'v2.0', // Previous version for comparison
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
    // Extended fields
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
};

const MOCK_COMMENTS: Comment[] = [
    {
        id: "1",
        author: "John Smith",
        role: "QA Manager",
        date: "2026-01-05 14:30:00",
        content: "Please review Section 3.2 regarding temperature control procedures. I believe we need more specific guidelines.",
    },
];

export const DocumentReviewView: React.FC<DocumentReviewViewProps> = ({
    documentId,
    onBack,
    currentUserId = "1", // Mocked current user
}) => {
    const [document, setDocument] = useState(MOCK_DOCUMENT);
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(true);
    const [showESignModal, setShowESignModal] = useState(false);
    const [eSignAction, setESignAction] = useState<'approve' | 'reject'>('approve');

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
        { label: "My Tasks", onClick: onBack },
        { label: "Pending My Review", onClick: onBack },
        { label: document.documentId, isActive: true },
    ];

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
        >
            {activeTab === "document" && (
                        <div className="space-y-6">
                            {/* PDF Preview Section */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <DocumentContentTab
                                    documentStatus={document.status}
                                    documentName={document.title}
                                    documentNumber={document.documentId}
                                    documentVersion={document.version}
                                    userCanPrint={false}
                                    userCanDownload={false}
                                    userCanCopy={false}
                                    currentUser={currentReviewer?.name || "Current User"}
                                    previousVersion={document.documentType === 'Revision' ? document.previousVersion : undefined}
                                />
                            </div>

                            {/* Review Workflow Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                    onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">Review Workflow</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                            {document.reviewFlowType === 'sequential' ? (
                                <>
                                    <IconListNumbers className="h-4 w-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">Sequential Review</span>
                                </>
                            ) : (
                                <>
                                    <Users className="h-4 w-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">Parallel Review</span>
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
                    <div className="px-6 pb-6 space-y-3">
                    {document.reviewers.map((reviewer, index) => {
                        const isCurrentUserReviewer = reviewer.id === currentUserId;
                        const isActiveReviewer = document.reviewFlowType === 'sequential'
                            ? reviewer.order === document.currentReviewerIndex + 1
                            : reviewer.status === 'pending';

                        return (
                            <div
                                key={reviewer.id}
                                className={cn(
                                    "p-4 rounded-lg border transition-all",
                                    isCurrentUserReviewer && isActiveReviewer
                                        ? "bg-emerald-50 border-emerald-200"
                                        : "bg-white border-slate-200"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {document.reviewFlowType === 'sequential' && (
                                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold shrink-0">
                                                {reviewer.order}
                                            </div>
                                        )}
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                            {reviewer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-slate-900">{reviewer.name}</h4>
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

                                    <div className="flex items-center gap-3">
                                        {reviewer.reviewDate && (
                                            <span className="text-xs text-slate-500">
                                                {formatDate(reviewer.reviewDate)}
                                            </span>
                                        )}
                                        {reviewer.status === 'approved' && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="text-xs font-medium">Approved</span>
                                            </div>
                                        )}
                                        {reviewer.status === 'rejected' && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full">
                                                <XCircle className="h-4 w-4" />
                                                <span className="text-xs font-medium">Rejected</span>
                                            </div>
                                        )}
                                        {reviewer.status === 'pending' && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-xs font-medium">Pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>

            {/* Review Actions */}
            {canReview && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Review Action Required</h3>
                            <p className="text-sm text-slate-600">
                                Please review the document and provide your decision.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Button
                                onClick={handleReject}
                                variant="outline"
                                size="default"
                                disabled={isSubmitting}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                onClick={handleApprove}
                                variant="default"
                                size="default"
                                disabled={isSubmitting}
                            >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-600" />
                    Comments & Discussion
                </h3>

                {/* Comments List */}
                <div className="space-y-4 mb-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                    {comment.author.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-slate-900">{comment.author}</span>
                                        <span className="text-xs text-slate-500">•</span>
                                        <span className="text-xs text-slate-500">{comment.role}</span>
                                        <span className="text-xs text-slate-500">•</span>
                                        <span className="text-xs text-slate-500">{formatDate(comment.date)}</span>
                                    </div>
                                    <p className="text-sm text-slate-700">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm">No comments yet. Be the first to add a comment.</p>
                        </div>
                    )}
                </div>

                {/* Add Comment */}
                <div className="border-t border-slate-200 pt-4">
                    <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                            {currentReviewer?.name.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 flex gap-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 self-start"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                        </div>
                    )}
            {activeTab === "general" && <GeneralInformationTab document={document} isReadOnly={true} />}
            {activeTab === "training" && <TrainingInformationTab />}
            {activeTab === "signatures" && <SignaturesTab />}
            {activeTab === "audit" && <AuditTrailTab />}

            {/* E-Signature Modal */}
            <ESignatureModal
                isOpen={showESignModal}
                onClose={() => setShowESignModal(false)}
                onConfirm={handleESignConfirm}
                actionTitle={eSignAction === 'approve' ? 'Approve Document' : 'Reject Document'}
            />
        </DocumentWorkflowLayout>
    );
};
