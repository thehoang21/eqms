import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  FileText,
  ShieldCheck,
  Info,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { CourseApproval } from "../../types";

// --- Mock Data: Pending Approval queue ---
const MOCK_PENDING_APPROVAL: CourseApproval[] = [
  {
    id: "CA-003",
    courseId: "3",
    trainingId: "TRN-2026-007",
    courseTitle: "HPLC Operation Advanced",
    relatedSOP: "SOP-LAB-005: HPLC Standard Method",
    sopDocumentId: "DOC-003",
    trainingMethod: "Quiz",
    submittedBy: "Dr. Michael Chen",
    submittedAt: "2026-02-08",
    department: "QC Lab",
    approvalStatus: "Pending Approval",
    approvedBy: undefined,
    approvedAt: undefined,
    passScore: 85,
    questions: [
      {
        id: "q1",
        text: "What is the recommended mobile phase flow rate for analytical HPLC?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "0.1 mL/min", isCorrect: false },
          { id: "b", text: "1.0 mL/min", isCorrect: true },
          { id: "c", text: "5.0 mL/min", isCorrect: false },
          { id: "d", text: "10.0 mL/min", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which detector is most commonly used for UV-absorbing compounds?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "DAD/PDA detector", isCorrect: true },
          { id: "b", text: "Refractive Index detector", isCorrect: false },
          { id: "c", text: "Fluorescence detector", isCorrect: false },
          { id: "d", text: "Conductivity detector", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "CA-006",
    courseId: "6",
    trainingId: "TRN-2026-011",
    courseTitle: "ISO 14001 Environmental Management",
    relatedSOP: "SOP-ENV-001: Environmental Management System",
    sopDocumentId: "DOC-006",
    trainingMethod: "Read & Understood",
    submittedBy: "Kevin Tran",
    submittedAt: "2026-02-18",
    department: "HSE",
    approvalStatus: "Pending Approval",
    passScore: 100,
    questions: [],
  },
  {
    id: "CA-008",
    courseId: "8",
    trainingId: "TRN-2026-013",
    courseTitle: "Deviation & Non-Conformance Handling",
    relatedSOP: "SOP-QA-007: Deviation Management",
    sopDocumentId: "DOC-008",
    trainingMethod: "Quiz",
    submittedBy: "Alice Pham",
    submittedAt: "2026-02-19",
    department: "Quality Assurance",
    approvalStatus: "Pending Approval",
    passScore: 80,
    questions: [
      {
        id: "q1",
        text: "What is the first step when a deviation is detected?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "Document and notify QA immediately", isCorrect: true },
          { id: "b", text: "Continue production", isCorrect: false },
          { id: "c", text: "Correct the deviation without reporting", isCorrect: false },
          { id: "d", text: "Wait for the next shift", isCorrect: false },
        ],
      },
    ],
  },
];

const getMethodBadge = (method: "Read & Understood" | "Quiz") =>
  method === "Quiz"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-purple-50 text-purple-700 border-purple-200";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const METHOD_OPTIONS = [
  { label: "All Methods", value: "All" },
  { label: "Quiz", value: "Quiz" },
  { label: "Read & Understood", value: "Read & Understood" },
];

export const PendingApprovalView: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return MOCK_PENDING_APPROVAL.filter((item) => {
      const matchesSearch =
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trainingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedSOP.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = methodFilter === "All" || item.trainingMethod === methodFilter;
      return matchesSearch && matchesMethod;
    });
  }, [searchQuery, methodFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (item: CourseApproval) => {
    navigate(`/training-management/pending-approval/${item.id}`);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Pending Approval
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              {MOCK_PENDING_APPROVAL.length} Awaiting
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Pending Approval</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          <div className="xl:col-span-9">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by course title, training ID, SOP, or submitter..."
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <Select
              label="Training Method"
              value={methodFilter}
              onChange={(val) => {
                setMethodFilter(val);
                setCurrentPage(1);
              }}
              options={METHOD_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Training ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course Title
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Related SOP
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Method
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Submitted By
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Submitted Date
                </th>
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-20 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <TableEmptyState
                      title="No courses pending approval"
                      description="All courses have been approved or no courses match your filters."
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleViewDetail(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-sm text-slate-500 whitespace-nowrap">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-mono text-slate-600">{item.trainingId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-slate-900">{item.courseTitle}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="max-w-[200px] truncate">{item.relatedSOP}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap hidden lg:table-cell">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            getMethodBadge(item.trainingMethod)
                          )}
                        >
                          {item.trainingMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden lg:table-cell">
                        {item.submittedBy}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden md:table-cell">
                        {formatDate(item.submittedAt)}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-10 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(item);
                            }}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors sm:hidden"
                            aria-label="View details"
                          >
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <Button
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(item);
                            }}
                            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showPageNumbers={true}
            showItemsPerPageSelector={true}
          />
        )}
      </div>
    </div>
  );
};
