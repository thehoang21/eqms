import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, Search, User, X, ShieldCheck, Check, GripVertical, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import { IconListNumbers } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";

interface Reviewer {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    order: number;
}

interface ReviewersTabProps {
    onCountChange?: (count: number) => void;
    reviewers: Reviewer[];
    onReviewersChange: (reviewers: Reviewer[]) => void;
    reviewFlowType: ReviewFlowType;
    onReviewFlowTypeChange: (type: ReviewFlowType) => void;
}

type ReviewFlowType = 'sequential' | 'parallel';

// Mock Data for User Selection
const MOCK_USERS = [
    { id: '1', name: 'Nguyen Van A', role: 'QA Manager', department: 'Quality Assurance', email: 'a.nguyen@example.com' },
    { id: '2', name: 'Tran Thi B', role: 'Director', department: 'Board of Directors', email: 'b.tran@example.com' },
    { id: '3', name: 'Le Van C', role: 'Production Manager', department: 'Production', email: 'c.le@example.com' },
    { id: '4', name: 'Pham Thi D', role: 'Technical Lead', department: 'Technical', email: 'd.pham@example.com' },
    { id: '5', name: 'Hoang Van E', role: 'Quality Control', department: 'Quality Control', email: 'e.hoang@example.com' },
];

interface UserSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (users: typeof MOCK_USERS) => void;
    existingIds: string[];
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({ isOpen, onClose, onConfirm, existingIds }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setSelectedIds([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredUsers = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleUser = (userId: string) => {
        setSelectedIds(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSave = () => {
        const selectedUsers = MOCK_USERS.filter(u => selectedIds.includes(u.id));
        onConfirm(selectedUsers);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">Select Reviewers</h3>
                    <Button 
                        onClick={onClose}
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                
                <div className="p-3 md:p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {filteredUsers.length > 0 ? (
                        <div className="space-y-1">
                            {filteredUsers.map((user) => {
                                const isAlreadyAdded = existingIds.includes(user.id);
                                const isSelected = selectedIds.includes(user.id);
                                
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => !isAlreadyAdded && handleToggleUser(user.id)}
                                        disabled={isAlreadyAdded}
                                        className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group text-left border ${
                                            isSelected 
                                                ? "bg-emerald-50 border-emerald-200" 
                                                : isAlreadyAdded
                                                    ? "bg-slate-50 border-transparent opacity-60 cursor-not-allowed"
                                                    : "bg-white border-transparent hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                                            isSelected ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
                                        }`}>
                                            {isSelected ? <Check className="h-5 w-5" /> : user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-900 truncate">
                                                {user.name}
                                                {isAlreadyAdded && <span className="ml-2 text-xs text-slate-500 font-normal">(Already Added)</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 truncate">{user.role} • {user.department}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md">
                                                Selected
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No users found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={selectedIds.length === 0}
                        size="sm"
                    >
                        Add Selected ({selectedIds.length})
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const ReviewersTab: React.FC<ReviewersTabProps> = ({ 
    onCountChange,
    reviewers,
    onReviewersChange,
    reviewFlowType,
    onReviewFlowTypeChange
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        onCountChange?.(reviewers.length);
    }, [reviewers.length, onCountChange]);

    const handleAddReviewers = (users: typeof MOCK_USERS) => {
        const maxOrder = reviewers.length > 0 ? Math.max(...reviewers.map(r => r.order)) : 0;
        const newReviewers = users.map((user, idx) => ({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            department: user.department,
            order: maxOrder + idx + 1
        }));
        onReviewersChange([...reviewers, ...newReviewers]);
    };

    const removeReviewer = (id: string) => {
        const updatedReviewers = reviewers.filter(r => r.id !== id);
        // Reorder after removal
        const reordered = updatedReviewers.map((r, idx) => ({ ...r, order: idx + 1 }));
        onReviewersChange(reordered);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.4';
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
        }
        setDraggedIndex(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const reordered = [...reviewers];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(dropIndex, 0, draggedItem);

        // Update order numbers
        const updatedReviewers = reordered.map((r, idx) => ({ ...r, order: idx + 1 }));
        onReviewersChange(updatedReviewers);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Document Reviewers</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Select reviewers for this document</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Reviewer
                </Button>
            </div>

            {reviewers.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Review Flow Type</label>
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                            <Button
                                onClick={() => onReviewFlowTypeChange('parallel')}
                                variant={reviewFlowType === 'parallel' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Parallel</span>
                                </div>
                            </Button>
                            <Button
                                onClick={() => onReviewFlowTypeChange('sequential')}
                                variant={reviewFlowType === 'sequential' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    <IconListNumbers className="h-4 w-4" />
                                    <span>Sequential</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="text-xs text-slate-600 bg-white rounded-lg p-3 border border-slate-200">
                        {reviewFlowType === 'parallel' ? (
                            <>
                                <span className="font-semibold text-slate-900">Parallel Review:</span> All reviewers will receive notification at the same time and can review independently.
                            </>
                        ) : (
                            <>
                                <span className="font-semibold text-slate-900">Sequential Review:</span> Reviewers will be notified one after another. The next reviewer will only be notified after the previous reviewer approves. Drag to reorder.
                            </>
                        )}
                    </div>
                </div>
            )}

            {reviewers.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {reviewers
                        .sort((a, b) => a.order - b.order)
                        .map((reviewer, index) => (
                        <div 
                            key={reviewer.id} 
                            draggable={reviewFlowType === 'sequential'}
                            onDragStart={(e) => reviewFlowType === 'sequential' && handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => reviewFlowType === 'sequential' && handleDragOver(e)}
                            onDrop={(e) => reviewFlowType === 'sequential' && handleDrop(e, index)}
                            className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all ${
                                reviewFlowType === 'sequential' ? 'cursor-move' : ''
                            }`}
                        >
                            <div className="p-4 flex items-center gap-4">
                                {reviewFlowType === 'sequential' && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <GripVertical className="h-5 w-5 text-slate-400" />
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                )}
                                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                    {reviewer.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-medium text-slate-900 truncate">{reviewer.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" />
                                            {reviewer.role}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span>{reviewer.department}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{reviewer.email}</div>
                                </div>
                                <button
                                    onClick={() => removeReviewer(reviewer.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove reviewer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="group relative flex flex-col items-center justify-center py-12 px-4 bg-slate-50 hover:bg-slate-50/80 border-2 border-dashed border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all cursor-pointer"
                >
                    <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                        <Users className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">No Reviewers Selected</p>
                    <p className="text-xs text-slate-500 mt-1 text-center max-w-xs">
                        Add reviewers who will review this document. Click here to select users.
                    </p>
                </div>
            )}

            <UserSelectionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleAddReviewers}
                existingIds={reviewers.map(r => r.id)}
            />
        </div>
    );
};
