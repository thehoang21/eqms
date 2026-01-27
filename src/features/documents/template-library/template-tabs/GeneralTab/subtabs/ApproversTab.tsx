import React, { useState, useEffect } from "react";
import { CheckCircle, Plus, Trash2, Search, User, X, ShieldCheck } from "lucide-react";
import { createPortal } from "react-dom";

interface Approver {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
}

interface ApproversTabProps {
    onCountChange?: (count: number) => void;
    isModalOpen?: boolean;
    onModalClose?: () => void;
}

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
    onSelect: (user: typeof MOCK_USERS[0]) => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");

    if (!isOpen) return null;

    const filteredUsers = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Add Approver</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        onSelect(user);
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group text-left"
                                >
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-900 truncate">{user.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{user.role} • {user.department}</div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded-md shadow-sm">Select</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No users found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export const ApproversTab: React.FC<ApproversTabProps> = ({ onCountChange }) => {
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        onCountChange?.(approvers.length);
    }, [approvers.length, onCountChange]);

    const handleSelectUser = (user: typeof MOCK_USERS[0]) => {
        const newApprover: Approver = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            department: user.department
        };
        // Since only 1 approver is allowed, we replace the existing one or add if empty
        setApprovers([newApprover]);
    };

    const removeApprover = () => {
        setApprovers([]);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Document Approver</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Select the final approver for this document</p>
                </div>
                {approvers.length === 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add Approver
                    </button>
                )}
            </div>

            {approvers.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold shrink-0 ring-4 ring-emerald-50">
                            {approvers[0].name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-slate-900 truncate">{approvers[0].name}</h4>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Approver
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    {approvers[0].role}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{approvers[0].department}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{approvers[0].email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                Change
                            </button>
                            <button
                                onClick={removeApprover}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove approver"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="group relative flex flex-col items-center justify-center py-12 px-4 bg-slate-50 hover:bg-slate-50/80 border-2 border-dashed border-slate-200 hover:border-emerald-500/50 rounded-xl transition-all cursor-pointer"
                >
                    <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                        <User className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">No Approver Selected</p>
                    <p className="text-xs text-slate-500 mt-1 text-center max-w-xs">
                        This document requires a final approver. Click here to select a user from the list.
                    </p>
                </div>
            )}

            <UserSelectionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSelect={handleSelectUser}
            />
        </div>
    );
};
