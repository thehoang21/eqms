import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { Revision } from "./types";

interface DocumentRevisionsTabProps {
    onCountChange?: (count: number) => void;
}

export const DocumentRevisionsTab: React.FC<DocumentRevisionsTabProps> = ({ onCountChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // TODO: API Integration - Replace with API call
    const [revisions, setRevisions] = useState<Revision[]>([
        {
            id: "1",
            revisionNumber: "R001",
            created: "2024-01-15",
            openedBy: "John Doe",
            revisionName: "Initial Release",
            state: "effective"
        },
        {
            id: "2",
            revisionNumber: "R002",
            created: "2024-02-20",
            openedBy: "Jane Smith",
            revisionName: "Updated Requirements Section 3.2",
            state: "approved"
        },
        {
            id: "3",
            revisionNumber: "R003",
            created: "2024-03-10",
            openedBy: "Mike Johnson",
            revisionName: "Major Revision - Document Restructure",
            state: "draft"
        },
        {
            id: "4",
            revisionNumber: "R004",
            created: "2024-03-15",
            openedBy: "Sarah Williams",
            revisionName: "Safety Guidelines Update",
            state: "pendingReview"
        },
        {
            id: "5",
            revisionNumber: "R005",
            created: "2024-03-20",
            openedBy: "David Brown",
            revisionName: "Quality Control Procedures",
            state: "approved"
        },
    ]);

    // Filter revisions based on search query
    const filteredRevisions = useMemo(() => {
        return revisions.filter((revision) =>
            revision.revisionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            revision.revisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            revision.openedBy.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [revisions, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredRevisions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRevisions = filteredRevisions.slice(startIndex, endIndex);

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Update counter when revisions change
    useEffect(() => {
        onCountChange?.(revisions.length);
    }, [revisions.length, onCountChange]);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by revision number, name, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-16">
                                    No.
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Revision Number
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Created
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Opened by
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Revision Name
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {currentRevisions.length > 0 ? (
                                currentRevisions.map((revision, index) => (
                                    <tr
                                        key={revision.id}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="py-3.5 px-4 text-sm text-slate-500 whitespace-nowrap">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <span className="font-medium text-slate-900">
                                                {revision.revisionNumber}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                                            {revision.created}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                                            {revision.openedBy}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm text-slate-900 whitespace-nowrap">
                                            {revision.revisionName}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <StatusBadge status={revision.state} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <p className="text-sm text-slate-500">
                                            {searchQuery
                                                ? "No revisions found matching your search."
                                                : "No revisions available."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredRevisions.length > 0 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredRevisions.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        showPageNumbers={false}
                    />
                )}
            </div>
        </div>
    );
};
