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
} from "lucide-react";
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button/Button';
import { ESignatureModal } from '@/components/ui/esignmodal/ESignatureModal';
import { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from "@/features/documents/shared/layouts";
import {
    GeneralInformationTab,
    TrainingInformationTab,
    DocumentTab,
    SignaturesTab,
    AuditTrailTab,
} from "@/features/documents/document-detail/tabs";
import { IconMessage2 } from "@tabler/icons-react";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Pending Training" | "Ready for Publishing" | "Published" | "Effective" | "Archive";
type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type TabType = "document" | "general" | "training" | "signatures" | "audit";

interface Approver {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    status: ApprovalStatus;
    approvalDate?: string;
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
    approver: Approver; // Only ONE approver
    // Extended fields
    validUntil: string;
    openedBy: string;
    owner: string;
    reviewers: string[];
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

interface DocumentApprovalViewProps {
    documentId: string;
    onBack: () => void;
    currentUserId: string;
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
    status: "Pending Approval",
    effectiveDate: "2026-02-01",
    author: "John Smith",
    department: "Quality Assurance",
    created: "2026-01-05 10:30:00",
    description: "This SOP outlines the procedures for quality control testing of pharmaceutical products.",
    documentType: 'Revision',
    previousVersion: '2.0',
    approver: {
        id: "1",
        name: "Nguyen Van A",
        role: "Department Head",
        email: "a.nguyen@example.com",
        department: "Quality Assurance",
        status: "pending",
    },
    validUntil: "2027-02-01",
    openedBy: "System Admin",
    owner: "John Smith",
    reviewers: ["Nguyen Van A", "Tran Thi B"],
    lastModified: "2026-01-05 10:30:00",
    lastModifiedBy: "John Smith",
    isTemplate: false,
    businessUnit: "Manufacturing",
    knowledgeBase: "Quality Management",
    subType: "Testing",
    periodicReviewCycle: 12,
    periodicReviewNotification: 30,
    language: "English",
};

const MOCK_COMMENTS: Comment[] = [
    {
        id: "1",
        author: "Reviewer 1",
        role: "QA Specialist",
        date: "2026-01-05 14:30:00",
        content: "The testing procedures are well documented. Approved.",
    },
    {
        id: "2",
        author: "Reviewer 2",
        role: "Lab Manager",
        date: "2026-01-05 16:45:00",
        content: "All requirements are met. Ready for approval.",
    },
];

// --- Main Component ---
export const DocumentApprovalView: React.FC<DocumentApprovalViewProps> = ({
    documentId,
    onBack,
    currentUserId = "1",
}) => {
    const [document, setDocument] = useState(MOCK_DOCUMENT);
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("document");
    const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(true);
    const [showESignModal, setShowESignModal] = useState(false);
    const [eSignAction, setESignAction] = useState<'approve' | 'reject'>('approve');

    // Determine if current user can approve (single approver)
    const approver = document.approver;
    const canApprove = approver.id === currentUserId && approver.status === 'pending';

    const handleApprove = () => {
        if (!approver) return;
        setESignAction('approve');
        setShowESignModal(true);
    };

    const handleReject = () => {
        if (!approver) return;
        setESignAction('reject');
        setShowESignModal(true);
    };

    const handleESignConfirm = (reason: string) => {
        if (!approver) return;

        setIsSubmitting(true);
        setShowESignModal(false);

        // Simulate API call
        setTimeout(() => {
            const newStatus = eSignAction === 'approve' ? 'approved' : 'rejected';
            const updatedApprover = {
                ...approver,
                status: newStatus as ApprovalStatus,
                approvalDate: new Date().toISOString(),
                comments: reason
            };

            setDocument({
                ...document,
                approver: updatedApprover,
                status: eSignAction === 'reject' ? "Pending Review" : "Approved",
            });

            setIsSubmitting(false);
        }, 1000);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: approver?.name || "Current User",
            role: approver?.role || "Approver",
            date: new Date().toISOString(),
            content: newComment,
        };

        setComments([...comments, comment]);
        setNewComment("");
    };

    // Status workflow steps
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Approved", "Pending Training", "Ready for Publishing", "Published", "Effective", "Archive"];

    // Breadcrumbs
    const breadcrumbs = [
        { label: "Dashboard", onClick: onBack },
        { label: "My Tasks", onClick: onBack },
        { label: "Pending My Approval", onClick: onBack },
        { label: document.documentId, isActive: true },
    ];

    return (
        <DocumentWorkflowLayout
            title="Document Approval"
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
                        <DocumentTab />
                    </div>

                    {/* Approval Workflow Info */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
                            className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                <h3 className="text-base lg:text-lg font-bold text-slate-900">Approval Workflow</h3>
                                <div className="inline-flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-blue-50 border border-blue-200 rounded-lg w-fit">
                                    <User className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-600" />
                                    <span className="text-xs lg:text-sm font-medium text-blue-700">Single Approver</span>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 text-slate-400 transition-transform duration-300 ease-in-out shrink-0",
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
                            <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                                {(() => {
                                    const isCurrentApprover = approver.id === currentUserId;
                                    const isApproved = approver.status === 'approved';
                                    const isRejected = approver.status === 'rejected';

                                    return (
                                        <div
                                            className={cn(
                                                "p-3 lg:p-4 rounded-lg border transition-all",
                                                isCurrentApprover && approver.status === 'pending'
                                                    ? "bg-emerald-50 border-emerald-200"
                                                    : "bg-white border-slate-200"
                                            )}
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                                        {approver.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-medium text-sm lg:text-base text-slate-900 truncate">{approver.name}</h4>
                                                            {isCurrentApprover && (
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded shrink-0">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 lg:gap-2 text-xs text-slate-500 flex-wrap">
                                                            <span className="truncate">{approver.role}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                                            <span className="truncate">{approver.department}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap lg:shrink-0">
                                                    {isApproved && (
                                                        <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                            <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-emerald-600" />
                                                            <span className="text-xs lg:text-sm font-medium text-emerald-700">Approved</span>
                                                        </div>
                                                    )}
                                                    {isRejected && (
                                                        <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-red-50 border border-red-200 rounded-lg">
                                                            <XCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-red-600" />
                                                            <span className="text-xs lg:text-sm font-medium text-red-700">Rejected</span>
                                                        </div>
                                                    )}
                                                    {approver.status === 'pending' && (
                                                        <div className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                                                            <span className="text-xs lg:text-sm font-medium text-amber-700">Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Approval Actions */}
                    {canApprove && (
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 shadow-sm p-4 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-4">
                                <div className="flex-1">
                                    <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1">Your Approval Action Required</h3>
                                </div>
                                <div className="flex items-center gap-2 lg:gap-3 lg:shrink-0">
                                    <Button
                                        onClick={handleReject}
                                        variant="outline"
                                        size="sm"
                                        disabled={isSubmitting}
                                        className="flex-1 lg:flex-initial border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        <ThumbsDown className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                                        <span className="text-xs lg:text-sm">Reject</span>
                                    </Button>
                                    <Button
                                        onClick={handleApprove}
                                        variant="default"
                                        size="sm"
                                        disabled={isSubmitting}
                                        className="flex-1 lg:flex-initial"
                                    >
                                        <ThumbsUp className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                                        <span className="text-xs lg:text-sm">Approve</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-6">
                        <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3 lg:mb-4 flex items-center gap-2">
                            <IconMessage2 className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600" />
                            Comments & Discussion
                        </h3>

                        {/* Comments List */}
                        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-slate-50 rounded-lg">
                                        <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                            {comment.author.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 lg:gap-2 mb-1 flex-wrap">
                                                <span className="font-medium text-sm lg:text-base text-slate-900 truncate">{comment.author}</span>
                                                <span className="text-xs text-slate-500 shrink-0">•</span>
                                                <span className="text-xs text-slate-500 truncate">{comment.role}</span>
                                                <span className="text-xs text-slate-500 shrink-0">•</span>
                                                <span className="text-xs text-slate-500 shrink-0">{formatDate(comment.date)}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 break-words">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 lg:py-8 text-slate-500">
                                    <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 text-slate-300" />
                                    <p className="text-sm">No comments yet. Be the first to add a comment.</p>
                                </div>
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                    {approver?.name.charAt(0) || "U"}
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        rows={3}
                                        className="flex-1 px-3 lg:px-4 py-2 lg:py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 sm:self-start shrink-0"
                                    >
                                        <Send className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                        <span className="text-sm sm:hidden">Send Comment</span>
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
