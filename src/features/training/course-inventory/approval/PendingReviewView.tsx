import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  FileText,
  ClipboardList,
  Info,
  Download,
} from "lucide-react";
import { IconInfoCircle, IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";
import { CourseApproval } from "../../types";

// --- Mock Data ---
const MOCK_APPROVALS: CourseApproval[] = [
  {
    id: "CA-001",
    courseId: "1",
    trainingId: "TRN-2026-001",
    courseTitle: "GMP Basic Principles",
    relatedDocument: "SOP-QA-001: Good Manufacturing Practices",
    relatedDocumentId: "DOC-001",
    trainingMethod: "Quiz (Paper-based/Manual)",
    submittedBy: "John Smith",
    submittedAt: "2026-02-10",
    department: "Quality Assurance",
    approvalStatus: "Pending Review",
    passScore: 80,
    questions: [
      {
        id: "q1",
        text: "What is the primary purpose of GMP?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "To increase production speed", isCorrect: false },
          { id: "b", text: "To ensure product quality and safety", isCorrect: true },
          { id: "c", text: "To reduce manufacturing costs", isCorrect: false },
          { id: "d", text: "To improve employee satisfaction", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Which document defines the standard operating procedures for cleanroom entry?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "SOP-QA-001", isCorrect: false },
          { id: "b", text: "SOP-CR-002", isCorrect: true },
          { id: "c", text: "SOP-PR-003", isCorrect: false },
          { id: "d", text: "SOP-IT-004", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "How often should GMP training be renewed?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "Every 6 months", isCorrect: false },
          { id: "b", text: "Every year", isCorrect: true },
          { id: "c", text: "Every 2 years", isCorrect: false },
          { id: "d", text: "Only once at onboarding", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "CA-002",
    courseId: "2",
    trainingId: "TRN-2026-006",
    courseTitle: "Cleanroom Qualification",
    relatedDocument: "SOP-CR-002: Cleanroom Operations",
    relatedDocumentId: "DOC-002",
    trainingMethod: "Read & Understood",
    submittedBy: "Sarah Johnson",
    submittedAt: "2026-02-12",
    department: "Production",
    approvalStatus: "Pending Review",
    passScore: 100,
    questions: [],
  },
  {
    id: "CA-003",
    courseId: "3",
    trainingId: "TRN-2026-007",
    courseTitle: "HPLC Operation Advanced",
    relatedDocument: "SOP-LAB-005: HPLC Standard Method",
    relatedDocumentId: "DOC-003",
    trainingMethod: "Quiz (Paper-based/Manual)",
    submittedBy: "Dr. Michael Chen",
    submittedAt: "2026-02-08",
    department: "QC Lab",
    approvalStatus: "Pending Review",
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
    id: "CA-004",
    courseId: "4",
    trainingId: "TRN-2026-008",
    courseTitle: "ISO 9001:2015 Requirements",
    relatedDocument: "SOP-QMS-010: Quality Management System",
    relatedDocumentId: "DOC-004",
    trainingMethod: "Quiz (Paper-based/Manual)",
    submittedBy: "Emma Wilson",
    submittedAt: "2026-02-15",
    department: "All Departments",
    approvalStatus: "Pending Review",
    passScore: 70,
    questions: [
      {
        id: "q1",
        text: "What is the risk-based thinking approach in ISO 9001:2015?",
        type: "multiple_choice",
        points: 10,
        options: [
          { id: "a", text: "Eliminating all risks completely", isCorrect: false },
          { id: "b", text: "Identifying and addressing risks that affect conformity", isCorrect: true },
          { id: "c", text: "Only documenting risks", isCorrect: false },
          { id: "d", text: "Avoiding change", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "CA-005",
    courseId: "5",
    trainingId: "TRN-2026-009",
    courseTitle: "SOP Review & Update Procedures",
    relatedDocument: "SOP-DC-003: Document Change Control",
    relatedDocumentId: "DOC-005",
    trainingMethod: "Read & Understood",
    submittedBy: "David Brown",
    submittedAt: "2026-02-05",
    department: "Documentation",
    approvalStatus: "Rejected",
    approvedBy: "QA Manager",
    approvedAt: "2026-02-06",
    rejectionReason: "Training content does not reflect latest SOP revision (Rev.5). Please update to align with SOP-DC-003 Rev.5 effective 01/28/2026.",
    passScore: 80,
    questions: [],
  },
];

const getMethodBadge = (method: "Read & Understood" | "Quiz (Paper-based/Manual)" | "Hands-on/OJT") => {
  return method === "Quiz (Paper-based/Manual)"
    ? "bg-purple-50 text-purple-700 border-purple-200"
    : method === "Hands-on/OJT"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-50 text-slate-700 border-slate-200";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- Constants ---
const METHOD_OPTIONS = [
  { label: "All Methods", value: "All" },
  { label: "Quiz (Paper-based/Manual)", value: "Quiz (Paper-based/Manual)" },
  { label: "Hands-on / OJT", value: "Hands-on/OJT" },
  { label: "Read & Understood", value: "Read & Understood" },
];

const INSTRUCTOR_OPTIONS = [
  { label: "All Instructors", value: "All" },
  { label: "John Smith", value: "John Smith" },
  { label: "Sarah Johnson", value: "Sarah Johnson" },
  { label: "Dr. Michael Chen", value: "Dr. Michael Chen" },
  { label: "Emma Wilson", value: "Emma Wilson" },
  { label: "David Brown", value: "David Brown" },
];

const DEPARTMENT_OPTIONS = [
  { label: "All Departments", value: "All" },
  { label: "Quality Assurance", value: "Quality Assurance" },
  { label: "Production", value: "Production" },
  { label: "QC Lab", value: "QC Lab" },
  { label: "Documentation", value: "Documentation" },
];

// --- Component ---
export const PendingReviewView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [instructorFilter, setInstructorFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered data
  const filteredData = useMemo(() => {
    return MOCK_APPROVALS.filter((item) => {
      const matchesSearch =
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trainingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedDocument.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = methodFilter === "All" || item.trainingMethod === methodFilter;
      const matchesInstructor = instructorFilter === "All" || item.submittedBy === instructorFilter;
      const matchesDepartment = departmentFilter === "All" || item.department === departmentFilter;
      
      let matchesDateFrom = true;
      let matchesDateTo = true;
      if (dateFrom) {
        matchesDateFrom = new Date(item.submittedAt) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDateTo = new Date(item.submittedAt) <= new Date(dateTo);
      }
      
      return matchesSearch && matchesMethod && matchesInstructor && matchesDepartment && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, methodFilter, instructorFilter, departmentFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetail = (approval: CourseApproval) => {
    navigate(`/training-management/pending-review/${approval.id}`);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Pending Review
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Pending Review</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export pending review")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 lg:gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-4">
            <label className="text-xs sm:text-xs font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title, ID..."
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Method Filter */}
          <div className="xl:col-span-4">
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

          {/* Instructor Filter */}
          <div className="xl:col-span-4">
            <Select
              label="Instructor"
              value={instructorFilter}
              onChange={(val) => {
                setInstructorFilter(val);
                setCurrentPage(1);
              }}
              options={INSTRUCTOR_OPTIONS}
            />
          </div>

          {/* Department Filter */}
          <div className="xl:col-span-4">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={(val) => {
                setDepartmentFilter(val);
                setCurrentPage(1);
              }}
              options={DEPARTMENT_OPTIONS}
            />
          </div>

          {/* Date From */}
          <div className="xl:col-span-4">
            <DateTimePicker
              label="From Date"
              value={dateFrom}
              onChange={(val) => {
                setDateFrom(val);
                setCurrentPage(1);
              }}
              placeholder="Select start date"
            />
          </div>

          {/* Date To */}
          <div className="xl:col-span-4">
            <DateTimePicker
              label="To Date"
              value={dateTo}
              onChange={(val) => {
                setDateTo(val);
                setCurrentPage(1);
              }}
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Training ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Course Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Related Document
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
                      title="No approvals found"
                      description="No course approvals match your current filters."
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
                          <span>{item.relatedDocument}</span>
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
                            <IconInfoCircle className="h-4 w-4 text-slate-600" />
                          </button>
                          <Button
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(item);
                            }}
                            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                          >
                            Review
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

        {/* Pagination */}
        {filteredData.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}
      </div>
    </div>
  );
};
