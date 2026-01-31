import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { ControlledCopy } from "./types";

// Mock data
const MOCK_CONTROLLED_COPIES: ControlledCopy[] = [
    {
        id: "1",
        controlledCopiesName: "Production Floor Copy",
        copyNumber: "CC-001",
        created: "2024-01-15",
        state: "effective",
        openedBy: "John Doe",
        validUntil: "2025-01-15",
        documentRevision: "Rev 2.0",
        documentNumber: "DOC-2024-001"
    },
    {
        id: "2",
        controlledCopiesName: "Quality Control Lab",
        copyNumber: "CC-002",
        created: "2024-01-20",
        state: "effective",
        openedBy: "Jane Smith",
        validUntil: "2025-01-20",
        documentRevision: "Rev 2.0",
        documentNumber: "DOC-2024-001"
    },
    {
        id: "3",
        controlledCopiesName: "Warehouse Archive",
        copyNumber: "CC-003",
        created: "2024-02-01",
        state: "approved",
        openedBy: "Bob Johnson",
        validUntil: "2025-02-01",
        documentRevision: "Rev 2.0",
        documentNumber: "DOC-2024-001"
    }
];

export const ControlledCopiesTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter controlled copies based on search
    const filteredCopies = useMemo(() => {
        if (!searchQuery.trim()) return MOCK_CONTROLLED_COPIES;

        const query = searchQuery.toLowerCase();
        return MOCK_CONTROLLED_COPIES.filter(
            (copy) =>
                copy.controlledCopiesName.toLowerCase().includes(query) ||
                copy.copyNumber.toLowerCase().includes(query) ||
                copy.openedBy.toLowerCase().includes(query) ||
                copy.documentNumber.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredCopies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCopies = filteredCopies.slice(startIndex, endIndex);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, copy number, opened by, or document number..."
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
                                    Controlled Copies Name
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Copy Number
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Created
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    State
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Opened by
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Valid Until
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Document Revision
                                </th>
                                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                    Document Number
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {currentCopies.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-slate-500">
                                        <p className="text-sm">No controlled copies found</p>
                                    </td>
                                </tr>
                            ) : (
                                currentCopies.map((copy, index) => (
                                    <tr
                                        key={copy.id}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap font-medium text-slate-900">
                                            {copy.controlledCopiesName}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.copyNumber}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.created}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                                            <StatusBadge status={copy.state} />
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.openedBy}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.validUntil}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.documentRevision}
                                        </td>
                                        <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                                            {copy.documentNumber}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCopies.length > 0 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredCopies.length}
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
