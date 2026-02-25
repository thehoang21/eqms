import React, { useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Upload,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ZoomIn,
} from "lucide-react";
import { IconLayoutDashboard } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { AlertModal, AlertModalType } from "@/components/ui/modal/AlertModal";
import { ESignatureModal } from "@/components/ui/esignmodal";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { cn } from "@/components/ui/utils";
import { TrainingMethod } from "../../types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ResultRow {
  userId: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  businessUnit: string;
  examDate: string;
  score: number | null;
  evidenceImage: File | null;
  evidencePreview: string | null;
}

interface CourseInfo {
  id: string;
  trainingId: string;
  title: string;
  trainingMethod: TrainingMethod;
  passingGradeType: "pass_fail" | "score_10" | "percentage";
  passingScore: number;
  totalEnrolled: number;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_COURSE: CourseInfo = {
  id: "1",
  trainingId: "TRN-2026-001",
  title: "GMP Basic Principles",
  trainingMethod: "Quiz (Paper-based/Manual)",
  passingGradeType: "score_10",
  passingScore: 7,
  totalEnrolled: 20,
};

const generateMockRows = (count: number): ResultRow[] => {
  const names = [
    "Nguyen Van An", "Tran Thi Binh", "Le Van Cuong", "Pham Thi Dung",
    "Hoang Van Em", "Vo Thi Phuong", "Dang Van Gia", "Bui Thi Hanh",
    "Ngo Van Ich", "Trinh Thi Kim", "Do Van Lam", "Ly Thi Mai",
    "Truong Van Nam", "Huynh Thi Oanh", "Phan Van Phuc", "Duong Thi Quynh",
    "Cao Van Rang", "Ta Thi Son", "Mai Van Tuan", "Luu Thi Uyen",
    "Dinh Van Vinh", "Ha Thi Xuan", "Tong Van Yen", "Chu Thi Zen",
    "Lam Van Anh",
  ];
  const departments = ["QA", "QC Lab", "Production", "R&D", "Engineering", "Warehouse"];
  const jobTitles = ["QA Specialist", "Lab Technician", "Production Manager", "R&D Scientist", "Senior Engineer", "Warehouse Supervisor"];
  const businessUnits = ["Operation Unit", "Quality Unit"];
  return Array.from({ length: count }, (_, i) => ({
    userId: `EMP-${String(i + 1001).padStart(4, "0")}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(/ /g, '.')}@company.com`,
    jobTitle: jobTitles[i % jobTitles.length],
    department: departments[i % departments.length],
    businessUnit: businessUnits[i % businessUnits.length],
    examDate: "",
    score: null,
    evidenceImage: null,
    evidencePreview: null,
  }));
};

/* ------------------------------------------------------------------ */
/*  Image Preview Modal                                                */
/* ------------------------------------------------------------------ */

const ImagePreviewModal: React.FC<{
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={imageUrl}
          alt="Evidence preview"
          className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export const ResultEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const course = MOCK_COURSE; // In real app, fetch by courseId

  // Data
  const [rows, setRows] = useState<ResultRow[]>(() =>
    generateMockRows(course.totalEnrolled)
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "entered" | "not-entered">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Bulk Exam Date
  const [bulkExamDate, setBulkExamDate] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AlertModalType>("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // E-Signature
  const [isESignOpen, setIsESignOpen] = useState(false);

  // Image Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // File input refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ------ Computed ------ */
  const uniqueDepartments = useMemo(() => {
    const depts = Array.from(new Set(rows.map((r) => r.department))).sort();
    return depts;
  }, [rows]);

  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.userId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter === "entered") {
      filtered = filtered.filter((r) => r.score !== null);
    } else if (statusFilter === "not-entered") {
      filtered = filtered.filter((r) => r.score === null);
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((r) => r.department === departmentFilter);
    }

    return filtered;
  }, [rows, searchQuery, statusFilter, departmentFilter]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const resultsEntered = useMemo(
    () => rows.filter((r) => r.score !== null).length,
    [rows]
  );

  const progressPercent = Math.round(
    (resultsEntered / rows.length) * 100
  );

  /* ------ Status helpers ------ */
  const getScoreStatus = (row: ResultRow): "pass" | "fail" | "none" => {
    if (row.score === null) return "none";
    if (course.passingGradeType === "pass_fail") return row.score >= 1 ? "pass" : "fail";
    return row.score >= course.passingScore ? "pass" : "fail";
  };

  const getPassingLabel = () => {
    switch (course.passingGradeType) {
      case "pass_fail":
        return "Pass / Fail";
      case "score_10":
        return `≥ ${course.passingScore}/10`;
      case "percentage":
        return `≥ ${course.passingScore}%`;
    }
  };

  const getScoreMax = () => {
    switch (course.passingGradeType) {
      case "pass_fail": return 1;
      case "score_10": return 10;
      case "percentage": return 100;
    }
  };

  /* ------ Row helpers ------ */
  const hasValidationError = (row: ResultRow) => {
    // Red highlight if score entered but no evidence image
    return row.score !== null && !row.evidenceImage;
  };

  const updateRow = (userId: string, updates: Partial<ResultRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, ...updates } : r))
    );
  };

  const handleScoreChange = (userId: string, value: string) => {
    // Reset status filter to show all rows when entering scores
    if (statusFilter !== "all") {
      setStatusFilter("all");
    }

    if (value === "") {
      updateRow(userId, { score: null });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num)) {
      updateRow(userId, { score: Math.min(getScoreMax(), Math.max(0, num)) });
    }
  };

  const handleImageUpload = (userId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setModalType("error");
      setModalTitle("Invalid File");
      setModalDescription("Please upload an image file (JPG, PNG, etc.).");
      setModalAction(null);
      setIsModalOpen(true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setModalType("error");
      setModalTitle("File Too Large");
      setModalDescription("Image must be less than 10MB.");
      setModalAction(null);
      setIsModalOpen(true);
      return;
    }
    const preview = URL.createObjectURL(file);
    updateRow(userId, { evidenceImage: file, evidencePreview: preview });
  };

  const handleRemoveImage = (userId: string) => {
    const row = rows.find((r) => r.userId === userId);
    if (row?.evidencePreview) URL.revokeObjectURL(row.evidencePreview);
    updateRow(userId, { evidenceImage: null, evidencePreview: null });
  };

  const handlePreviewImage = (preview: string) => {
    setPreviewImage(preview);
    setIsPreviewOpen(true);
  };

  const handleApplyBulkExamDate = () => {
    if (!bulkExamDate) return;
    setRows((prev) =>
      prev.map((r) => ({ ...r, examDate: bulkExamDate }))
    );
  };

  /* ------ Save Draft ------ */
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API save call
      await new Promise((r) => setTimeout(r, 800));
      setIsLoading(false);
      setModalType("success");
      setModalTitle("Draft Saved");
      setModalDescription(
        `Your progress has been saved. ${resultsEntered} of ${rows.length} results recorded. You can continue entering results later.`
      );
      setModalAction(() => () => {
        navigate("/training-management/courses-list");
      });
      setIsModalOpen(true);
    } catch {
      setIsLoading(false);
      setModalType("error");
      setModalTitle("Save Failed");
      setModalDescription("An error occurred while saving. Please try again.");
      setModalAction(null);
      setIsModalOpen(true);
    }
  };

  /* ------ Submit ------ */
  const handleConfirmSubmit = () => {
    // Validate: all rows with scores must have images
    const invalidRows = rows.filter((r) => r.score !== null && !r.evidenceImage);
    if (invalidRows.length > 0) {
      setModalType("error");
      setModalTitle("Missing Evidence");
      setModalDescription(
        `${invalidRows.length} employee(s) have scores entered but no evidence image uploaded. Please upload evidence for all graded employees.`
      );
      setModalAction(null);
      setIsModalOpen(true);
      return;
    }

    if (resultsEntered === 0) {
      setModalType("warning");
      setModalTitle("No Results Entered");
      setModalDescription("You haven't entered any results yet. Please enter at least one result before submitting.");
      setModalAction(null);
      setIsModalOpen(true);
      return;
    }

    // Open e-signature modal directly
    setIsESignOpen(true);
  };

  const handleESignConfirm = async (_reason: string) => {
    setIsESignOpen(false);
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setIsLoading(false);
      setModalType("success");
      setModalTitle("Results Submitted");
      setModalDescription(`${resultsEntered} result(s) have been submitted and signed successfully.`);
      setModalAction(() => () => {
        navigate("/training-management/courses-list");
      });
      setIsModalOpen(true);
    } catch {
      setIsLoading(false);
      setModalType("error");
      setModalTitle("Submission Failed");
      setModalDescription("An error occurred. Please try again.");
      setModalAction(null);
      setIsModalOpen(true);
    }
  };

  /* ------ Render ------ */
  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
                Result Entry
              </h1>
              <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
                <IconLayoutDashboard className="h-4 w-4" />
                <span className="text-slate-400 mx-1">/</span>
                <span className="hidden sm:inline">Training Management</span>
                <span className="sm:hidden">...</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="hidden sm:inline">Courses List</span>
                <span className="sm:hidden">...</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-slate-700 font-medium">Result Entry</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Draft
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleConfirmSubmit}
            className="gap-2"
          >
            Complete
          </Button>
        </div>
      </div>

      {/* ===== Course Info Card ===== */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 font-medium">{course.trainingId}</p>
            <h2 className="text-base lg:text-lg font-semibold text-slate-900 mt-0.5">
              {course.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200">
              Quiz (Manual)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Passing: {getPassingLabel()}
            </span>
          </div>
        </div>

        {/* Progress Bar in Header */}
        <div className="pt-3 md:pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-2.5">
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Results: <span className="font-semibold">{resultsEntered}</span> / {rows.length}
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {rows.some(hasValidationError) && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Missing evidence</span>
                  <span className="xs:hidden">No evidence</span>
                </div>
              )}
              <span className="text-sm sm:text-base font-bold text-emerald-700">
                {progressPercent}%
              </span>
            </div>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== Filters & Bulk Actions ===== */}
      <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 lg:gap-4 items-end">
          {/* Search - xl:col-span-4 */}
          <div className="xl:col-span-4">
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by User ID, Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Status Filter - xl:col-span-2 */}
          <div className="xl:col-span-2">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val as typeof statusFilter);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "all" },
                { label: "Entered", value: "entered" },
                { label: "Not Entered", value: "not-entered" },
              ]}
            />
          </div>

          {/* Department Filter - xl:col-span-3 */}
          <div className="xl:col-span-3">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={(val) => {
                setDepartmentFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Departments", value: "all" },
                ...uniqueDepartments.map((dept) => ({ label: dept, value: dept })),
              ]}
            />
          </div>

          {/* Bulk Exam Date - xl:col-span-2 */}
          <div className="xl:col-span-2">
            <DateTimePicker
              label="Set Exam Date for All"
              value={bulkExamDate}
              onChange={setBulkExamDate}
              placeholder="Select date"
            />
          </div>

          {/* Apply Button - xl:col-span-1 */}
          <div className="xl:col-span-1">
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyBulkExamDate}
              disabled={!bulkExamDate}
              className="w-full"
            >
              <span className="hidden lg:inline">Apply</span>
              <span className="lg:hidden">Apply to All</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[60px]">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  User ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Employee Name
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Email
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                  Job Title
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Department
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Business Unit
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[180px]">
                  Exam Date
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[120px]">
                  {course.passingGradeType === "pass_fail" ? "Result" : "Score"}
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[100px]">
                  Status
                </th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[140px]">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedRows.map((row, index) => {
                const status = getScoreStatus(row);
                const hasError = hasValidationError(row);
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <tr
                    key={row.userId}
                    className={cn(
                      "transition-colors",
                      hasError && "bg-red-50/50"
                    )}
                  >
                    {/* No. */}
                    <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                      {rowNumber}
                    </td>

                    {/* User ID */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-mono text-slate-700">{row.userId}</span>
                    </td>

                    {/* Employee Name */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">{row.name}</span>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 hidden lg:table-cell">
                      {row.email}
                    </td>

                    {/* Job Title */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 hidden xl:table-cell">
                      {row.jobTitle}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600 hidden md:table-cell">
                      {row.department}
                    </td>

                    {/* Business Unit */}
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                      {row.businessUnit}
                    </td>

                    {/* Exam Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <DateTimePicker
                        value={row.examDate}
                        onChange={(val) => updateRow(row.userId, { examDate: val })}
                        placeholder="Select date"
                      />
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {course.passingGradeType === "pass_fail" ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              if (statusFilter !== "all") setStatusFilter("all");
                              updateRow(row.userId, { score: 1 });
                            }}
                            className={cn(
                              "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                              row.score === 1
                                ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                                : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                            aria-label="Pass"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (statusFilter !== "all") setStatusFilter("all");
                              updateRow(row.userId, { score: 0 });
                            }}
                            className={cn(
                              "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                              row.score === 0
                                ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                                : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            )}
                            aria-label="Fail"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          max={getScoreMax()}
                          step={course.passingGradeType === "score_10" ? 0.5 : 1}
                          value={row.score ?? ""}
                          onChange={(e) => handleScoreChange(row.userId, e.target.value)}
                          placeholder={course.passingGradeType === "score_10" ? "0-10" : "0-100"}
                          className={cn(
                            "w-full h-9 px-3 border rounded-lg text-sm text-center focus:outline-none focus:ring-1 transition-colors",
                            hasError
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                              : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                          )}
                        />
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {status === "none" ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : status === "pass" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="h-3 w-3" />
                          Fail
                        </span>
                      )}
                    </td>

                    {/* Evidence Image */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <input
                        ref={(el) => { fileInputRefs.current[row.userId] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(row.userId, file);
                          e.target.value = "";
                        }}
                      />
                      {row.evidencePreview ? (
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={() => handlePreviewImage(row.evidencePreview!)}
                            className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-400 transition-all group"
                            aria-label="Preview evidence"
                          >
                            <img
                              src={row.evidencePreview}
                              alt="Evidence"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                          <button
                            onClick={() => handleRemoveImage(row.userId)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Remove evidence"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRefs.current[row.userId]?.click()}
                          className={cn(
                            "mx-auto flex items-center gap-1.5 h-9 px-3 rounded-lg border-2 border-dashed transition-colors text-xs font-medium",
                            hasError
                              ? "border-red-300 text-red-500 hover:bg-red-50 bg-red-50/50"
                              : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                          )}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRows.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}
      </div>

      {/* ===== E-Signature Modal ===== */}
      <ESignatureModal
        isOpen={isESignOpen}
        onClose={() => setIsESignOpen(false)}
        onConfirm={handleESignConfirm}
        actionTitle={`Submit Results (${resultsEntered} / ${rows.length})`}
      />

      {/* ===== Image Preview Modal ===== */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImage}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewImage(null);
        }}
      />

      {/* ===== Alert Modal ===== */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isLoading) setIsModalOpen(false);
        }}
        onConfirm={
          modalAction
            ? () => {
                modalAction();
              }
            : undefined
        }
        type={modalType}
        title={modalTitle}
        description={modalDescription}
        isLoading={isLoading}
        confirmText={
          modalType === "success"
            ? "Done"
            : modalType === "confirm"
            ? "Confirm & Sign"
            : undefined
        }
      />
    </div>
  );
};
