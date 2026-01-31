import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { ParentDocument } from "./types";

interface CorrelatedDocumentsTabProps {
    parentDocument: ParentDocument | null;
    onParentDocumentChange: (parent: ParentDocument | null) => void;
}

// Mock data
const MOCK_CORRELATED_DOCUMENTS: ParentDocument[] = [
    {
        id: "1",
        documentNumber: "DOC-2024-005",
        created: "2024-01-05",
        openedBy: "Alice Brown",
        documentName: "Equipment Maintenance Schedule",
        state: "effective",
        documentType: "Schedule",
        department: "Maintenance",
        authorCoAuthor: "Alice Brown",
        effectiveDate: "2024-01-15",
        validUntil: "2025-01-15"
    },
    {
        id: "2",
        documentNumber: "DOC-2024-006",
        created: "2024-01-08",
        openedBy: "David Lee",
        documentName: "Calibration Records",
        state: "approved",
        documentType: "Record",
        department: "Quality Control",
        authorCoAuthor: "David Lee, Emily Chen",
        effectiveDate: "2024-02-01",
        validUntil: "2025-02-01"
    }
];

export const CorrelatedDocumentsTab: React.FC<CorrelatedDocumentsTabProps> = ({ 
    parentDocument,
    onParentDocumentChange 
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Use props data (parentDocument from parent state) - convert to array for table
    const documents = parentDocument ? [parentDocument] : [];

    // Filter documents based on search
    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return documents;

        const query = searchQuery.toLowerCase();
        return documents.filter(
            (doc) =>
                doc.documentNumber.toLowerCase().includes(query) ||
                doc.documentName.toLowerCase().includes(query) ||
                doc.openedBy.toLowerCase().includes(query) ||
                doc.department.toLowerCase().includes(query) ||
                doc.authorCoAuthor.toLowerCase().includes(query)
        );
    }, [searchQuery, documents]);

    // Pagination
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by document number, name, opened by, department, or author..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    No.
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Document Number
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Created
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Opened by
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Document Name
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    State
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Document Type
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Department
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Author/Co-Author
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Effective Date
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Valid Until
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {currentDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="py-12 text-center text-slate-500">
                                        <p className="text-sm">No correlated documents found</p>
                                    </td>
                                </tr>
                            ) : (
                                currentDocuments.map((doc, index) => (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap font-medium text-slate-900">
                                            {doc.documentNumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.created}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.openedBy}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.documentName}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <StatusBadge status={doc.state} />
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.documentType}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.department}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.authorCoAuthor}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.effectiveDate}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {doc.validUntil}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredDocuments.length > 0 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredDocuments.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1);
                        }}
                        showPageNumbers={false}
                    />
                )}
            </div>
        </div>
    );
};
