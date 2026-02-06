import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Send,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button/Button';
import { ESignatureModal } from '@/components/ui/esignmodal/ESignatureModal';
import { useToast } from '@/components/ui/toast';
import { DocumentWorkflowLayout, DEFAULT_WORKFLOW_TABS } from "@/features/documents/shared/layouts";
import { DocumentTab } from "../revision-tabs/DocumentTab/DocumentTab";
import { GeneralTab, TrainingTab, SignaturesTab, AuditTab, type GeneralTabFormData } from "@/features/documents/shared/tabs";
import { DocumentType as DocType } from "@/types/documentTypes";
import { IconMessage2 } from "@tabler/icons-react";

// --- Types ---
type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Pending Training" | "Ready for Publishing" | "Effective" | "Obsoleted" | "Closed - Cancelled";
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

interface RevisionDetail {
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

interface RevisionApprovalViewProps {
    revisionId: string;
    onBack: () => void;
    currentUserId: string;
}

// Use shared FormData type from GeneralTab
type FormData = GeneralTabFormData;

// --- Helper Functions ---
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// --- Mock Data ---
const MOCK_REVISION: RevisionDetail = {
    id: "1",
    documentId: "SOP-QA-001",
    title: "Standard Operating Procedure for Quality Control Testing - Revision 3.0",
    type: "SOP",
    version: "3.0",
    status: "Pending Approval",
    effectiveDate: "2026-02-01",
    author: "John Smith",
    department: "Quality Assurance",
    created: "2026-01-05 10:30:00",
    description: "This revision updates the quality control testing procedures to comply with new regulatory requirements.",
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
        content: "The revision addresses all regulatory changes. Approved for final approval.",
    },
    {
        id: "2",
        author: "Reviewer 2",
        role: "Lab Manager",
        date: "2026-01-05 16:45:00",
        content: "All updates are documented clearly. Ready for approval.",
    },
];

// --- Main Component ---
export const RevisionApprovalView: React.FC<RevisionApprovalViewProps> = ({
    revisionId,
    onBack,
    currentUserId = "1",
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [revision, setRevision] = useState(MOCK_REVISION);
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [showESignModal, setShowESignModal] = useState(false);
    const [eSignAction, setESignAction] = useState<'approve' | 'reject'>('approve');
    
    // GeneralTab state
    const [formData, setFormData] = useState<FormData>({
        title: revision.title,
        type: revision.type as DocType,
        author: revision.author,
        coAuthors: [],
        businessUnit: revision.businessUnit,
        department: revision.department,
        knowledgeBase: revision.knowledgeBase,
        subType: revision.subType,
        periodicReviewCycle: revision.periodicReviewCycle,
        periodicReviewNotification: revision.periodicReviewNotification,
        language: revision.language,
        reviewDate: "",
        description: revision.description,
        isTemplate: revision.isTemplate,
    });

    // Determine if current user can approve (single approver)
    const approver = revision.approver;
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

            setRevision({
                ...revision,
                approver: updatedApprover,
                status: eSignAction === 'reject' ? "Pending Review" : "Approved",
            });

            setIsSubmitting(false);

            // Show success message and redirect Back
            const message = eSignAction === 'approve' 
                ? `Revision ${revision.documentId} v${revision.version} has been approved successfully.`
                : `Revision ${revision.documentId} v${revision.version} has been rejected.`;
            
            showToast({
                type: eSignAction === 'approve' ? 'success' : 'warning',
                title: eSignAction === 'approve' ? 'Approved' : 'Rejected',
                message: message,
                duration: 3000
            });

            // Redirect to Pending My Approval list after 1.5 seconds
            setTimeout(() => {
                navigate('/documents/revisions/pending-approval');
            }, 1500);
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
    const statusSteps: DocumentStatus[] = ["Draft", "Pending Review", "Pending Approval", "Pending Training", "Ready for Publishing", "Effective", "Obsoleted", "Closed - Cancelled"];

    // Breadcrumbs
    const breadcrumbs = [
        { label: "Dashboard", onClick: onBack },
        { label: "Document Control", onClick: onBack },
        { label: "Document Revisions", onClick: onBack },
        { label: "Revision Approval", isActive: true },
    ];

    return (
        <DocumentWorkflowLayout
            title="Revision Approval"
            breadcrumbs={breadcrumbs}
            onBack={onBack}
            documentId={`${revision.documentId} v${revision.version}`}
            documentStatus={revision.status}
            statusSteps={statusSteps}
            currentStatus={revision.status}
            tabs={DEFAULT_WORKFLOW_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            headerActions={
                canApprove ? (
                    <>
                        <Button
                            onClick={handleReject}
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            className="bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-sm active:scale-95"
                        >
                            <span className="text-xs sm:text-sm">Reject</span>
                        </Button>
                        <Button
                            onClick={handleApprove}
                            variant="default"
                            size="sm"
                            disabled={isSubmitting}
                        >
                            <span className="text-xs sm:text-sm">Complete Approve</span>
                        </Button>
                    </>
                ) : undefined
            }
        >
            {activeTab === "document" && (
                <div className="space-y-6">
                    {/* PDF Preview Section - Read Only */}
                    <DocumentTab mode="view" />

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
                                        className="flex-1 px-3 lg:px-4 py-2 lg:py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
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
            {activeTab === "general" && (
                <GeneralTab
                    formData={formData}
                    onFormChange={setFormData}
                />
            )}
            {activeTab === "training" && <TrainingTab isReadOnly />}
            {activeTab === "signatures" && <SignaturesTab />}
            {activeTab === "audit" && <AuditTab />}

            {/* E-Signature Modal */}
            <ESignatureModal
                isOpen={showESignModal}
                onClose={() => setShowESignModal(false)}
                onConfirm={handleESignConfirm}
                actionTitle={eSignAction === 'approve' ? 'Approve Revision' : 'Reject Revision'}
            />
        </DocumentWorkflowLayout>
    );
};
