import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Video,
  FileImage,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Upload,
  FolderOpen,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FileStack,
  CheckCircle,
  XCircle,
  FilePlusCorner,
} from "lucide-react";
import { IconLayoutDashboard, IconPlus, IconChecks } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { cn } from "@/components/ui/utils";

interface TrainingMaterial {
  id: string;
  materialId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Image" | "Document";
  version: string;
  department: string;
  status: "Draft" | "Pending" | "Approved" | "Obsolete";
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  fileSizeBytes: number;
  usageCount: number;
  linkedCourses: string[];
}

interface MaterialFilters {
  searchQuery: string;
  typeFilter: string;
  departmentFilter: string;
  statusFilter: string;
}

// Mock Data — expanded for dashboard
const MOCK_MATERIALS: TrainingMaterial[] = [
  {
    id: "1", materialId: "TM-VID-001", title: "GMP Introduction Video", description: "Comprehensive overview of Good Manufacturing Practices",
    type: "Video", version: "2.1", department: "Quality Assurance", status: "Approved", uploadedAt: "2026-02-15", uploadedBy: "John Doe",
    fileSize: "125 MB", fileSizeBytes: 131072000, usageCount: 15,
    linkedCourses: ["TRN-2026-001", "TRN-2026-004", "TRN-2026-008"],
  },
  {
    id: "2", materialId: "TM-PDF-002", title: "Cleanroom Operations Manual", description: "Step-by-step guide for cleanroom operations and procedures",
    type: "PDF", version: "3.0", department: "Production", status: "Approved", uploadedAt: "2026-02-10", uploadedBy: "Jane Smith",
    fileSize: "4.5 MB", fileSizeBytes: 4718592, usageCount: 22,
    linkedCourses: ["TRN-2026-002", "TRN-2026-005"],
  },
  {
    id: "3", materialId: "TM-PDF-003", title: "Equipment Handling Guide", description: "Visual guide for proper equipment handling and maintenance",
    type: "PDF", version: "1.5", department: "Engineering", status: "Pending", uploadedAt: "2026-02-08", uploadedBy: "Mike Johnson",
    fileSize: "8.2 MB", fileSizeBytes: 8597504, usageCount: 18,
    linkedCourses: ["TRN-2026-003"],
  },
  {
    id: "4", materialId: "TM-IMG-004", title: "Safety Protocol Infographic", description: "Key safety protocols illustrated for quick reference",
    type: "Image", version: "1.0", department: "HSE", status: "Approved", uploadedAt: "2026-02-20", uploadedBy: "Sarah Williams",
    fileSize: "2.1 MB", fileSizeBytes: 2202009, usageCount: 30,
    linkedCourses: ["TRN-2026-001", "TRN-2026-005", "TRN-2026-007", "TRN-2026-009", "TRN-2026-012"],
  },
  {
    id: "5", materialId: "TM-VID-005", title: "ISO 9001 Training Video", description: "Understanding ISO 9001:2015 requirements and implementation",
    type: "Video", version: "4.2", department: "Quality Assurance", status: "Draft", uploadedAt: "2026-02-12", uploadedBy: "Robert Brown",
    fileSize: "210 MB", fileSizeBytes: 220200960, usageCount: 12,
    linkedCourses: ["TRN-2026-006"],
  },
  {
    id: "6", materialId: "TM-DOC-006", title: "SOP Template Pack", description: "Standard Operating Procedure templates for documentation",
    type: "Document", version: "2.0", department: "Quality Control", status: "Approved", uploadedAt: "2026-02-01", uploadedBy: "Emily Davis",
    fileSize: "1.0 MB", fileSizeBytes: 1048576, usageCount: 8,
    linkedCourses: ["TRN-2026-010"],
  },
  {
    id: "7", materialId: "TM-PDF-007", title: "Chemical Handling Procedures", description: "Safe practices for chemical storage, handling, and disposal",
    type: "PDF", version: "1.2", department: "HSE", status: "Obsolete", uploadedAt: "2026-01-28", uploadedBy: "David Miller",
    fileSize: "3.0 MB", fileSizeBytes: 3145728, usageCount: 25,
    linkedCourses: ["TRN-2026-005", "TRN-2026-011", "TRN-2026-013"],
  },
  {
    id: "8", materialId: "TM-DOC-008", title: "HPLC Training Slides", description: "HPLC instrumentation, calibration, and operational procedures",
    type: "Document", version: "2.3", department: "Quality Control", status: "Approved", uploadedAt: "2026-01-28", uploadedBy: "Lisa Anderson",
    fileSize: "15 MB", fileSizeBytes: 15728640, usageCount: 6,
    linkedCourses: ["TRN-2026-014"],
  },
  {
    id: "9", materialId: "TM-VID-009", title: "Deviation Investigation Training", description: "How to investigate and document process deviations",
    type: "Video", version: "1.0", department: "Quality Assurance", status: "Approved", uploadedAt: "2026-02-10", uploadedBy: "Michael Chen",
    fileSize: "180 MB", fileSizeBytes: 188743680, usageCount: 10,
    linkedCourses: ["TRN-2026-002", "TRN-2026-006"],
  },
  {
    id: "10", materialId: "TM-PDF-010", title: "Personal Protective Equipment Guide", description: "Selection, usage, and maintenance of PPE",
    type: "PDF", version: "3.1", department: "HSE", status: "Approved", uploadedAt: "2026-02-15", uploadedBy: "Patricia Wilson",
    fileSize: "5.8 MB", fileSizeBytes: 6082355, usageCount: 20,
    linkedCourses: ["TRN-2026-001", "TRN-2026-007", "TRN-2026-009"],
  },
  {
    id: "11", materialId: "TM-DOC-011", title: "Batch Record Review Checklist", description: "Comprehensive checklist for batch record review process",
    type: "Document", version: "1.8", department: "Quality Assurance", status: "Pending", uploadedAt: "2026-02-20", uploadedBy: "James Taylor",
    fileSize: "0.8 MB", fileSizeBytes: 838860, usageCount: 14,
    linkedCourses: ["TRN-2026-004", "TRN-2026-008"],
  },
  {
    id: "12", materialId: "TM-PDF-012", title: "Water System Qualification", description: "Procedures for water system IQ, OQ, and PQ",
    type: "PDF", version: "2.0", department: "Engineering", status: "Draft", uploadedAt: "2026-02-25", uploadedBy: "Jennifer Lee",
    fileSize: "12 MB", fileSizeBytes: 12582912, usageCount: 4,
    linkedCourses: ["TRN-2026-015"],
  },
];

/* ─── Dashboard Stats Calculation ───────────────────────────────── */
const calcDashboardStats = (materials: TrainingMaterial[]) => {
  const totalMaterials = materials.length;
  const totalVideos = materials.filter((m) => m.type === "Video").length;
  const totalDocuments = materials.filter((m) => m.type === "PDF" || m.type === "Document").length;
  const totalImages = materials.filter((m) => m.type === "Image").length;
  const pending = materials.filter((m) => m.status === "Pending").length;
  const obsolete = materials.filter((m) => m.status === "Obsolete").length;
  const totalUsage = materials.reduce((sum, m) => sum + m.usageCount, 0);
  const totalStorageBytes = materials.reduce((sum, m) => sum + m.fileSizeBytes, 0);
  const totalStorageGB = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(0);
  return { totalMaterials, totalVideos, totalDocuments, totalImages, pending, obsolete, totalUsage, totalStorageMB, totalStorageGB };
};

export const MaterialsView: React.FC = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => calcDashboardStats(MOCK_MATERIALS), []);

  // Filters
  const [filters, setFilters] = useState<MaterialFilters>({
    searchQuery: "",
    typeFilter: "All",
    departmentFilter: "All",
    statusFilter: "All",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Action Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Video", value: "Video" },
    { label: "PDF", value: "PDF" },
    { label: "Image", value: "Image" },
    { label: "Document", value: "Document" },
  ];

  const departmentOptions = [
    { label: "All Departments", value: "All" },
    { label: "Quality Assurance", value: "Quality Assurance" },
    { label: "Quality Control", value: "Quality Control" },
    { label: "Production", value: "Production" },
    { label: "Engineering", value: "Engineering" },
    { label: "HSE", value: "HSE" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Draft", value: "Draft" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Obsolete", value: "Obsolete" },
  ];

  // Filtered & Paginated
  const filteredData = useMemo(() => {
    return MOCK_MATERIALS.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        m.materialId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || m.type === filters.typeFilter;
      const matchesDepartment = filters.departmentFilter === "All" || m.department === filters.departmentFilter;
      const matchesStatus = filters.statusFilter === "All" || m.status === filters.statusFilter;
      return matchesSearch && matchesType && matchesDepartment && matchesStatus;
    });
  }, [filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Sort materials by usage count for "Most Used"
  const topUsedMaterials = useMemo(
    () => [...MOCK_MATERIALS].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5),
    []
  );

  // Pending/Obsolete materials
  const pendingObsoleteMaterials = useMemo(
    () => MOCK_MATERIALS.filter((m) => m.status === "Pending" || m.status === "Obsolete")
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
    []
  );

  // Type distribution for mini chart
  const typeDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    MOCK_MATERIALS.forEach((m) => { dist[m.type] = (dist[m.type] || 0) + 1; });
    return Object.entries(dist).map(([type, count]) => ({ type, count, pct: Math.round((count / MOCK_MATERIALS.length) * 100) }));
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video": return <Video className="h-4 w-4 text-purple-600" />;
      case "PDF": return <FileText className="h-4 w-4 text-red-600" />;
      case "Image": return <FileImage className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Video": return "bg-purple-50 text-purple-700 border-purple-200";
      case "PDF": return "bg-red-50 text-red-700 border-red-200";
      case "Image": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case "Video": return "bg-purple-500";
      case "PDF": return "bg-red-500";
      case "Image": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Obsolete":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Menu dimensions (varies by content, estimate max)
      const menuHeight = 280;
      const menuWidth = 200;
      const safeMargin = 8;
      
      // Check available space
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Show above if not enough space below AND there's more space above
      const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
      
      // Calculate vertical position
      let top: number;
      if (shouldShowAbove) {
        top = rect.top + window.scrollY - 4;
      } else {
        top = rect.bottom + window.scrollY + 4;
      }
      
      // Calculate horizontal position with safe margins
      const viewportWidth = window.innerWidth;
      let left = rect.right + window.scrollX - menuWidth;
      
      // Ensure menu doesn't overflow right edge
      if (left + menuWidth > viewportWidth - safeMargin) {
        left = viewportWidth - menuWidth - safeMargin + window.scrollX;
      }
      
      // Ensure menu doesn't overflow left edge
      if (left < safeMargin + window.scrollX) {
        left = safeMargin + window.scrollX;
      }
      
      setDropdownPosition({ top, left, showAbove: shouldShowAbove });
      setOpenDropdownId(id);
    }
  };

  const handlePreview = (id: string) => {
    console.log("Preview material:", id);
    setOpenDropdownId(null);
  };

  const handleEdit = (id: string) => {
    console.log("Edit material:", id);
    setOpenDropdownId(null);
  };

  const handleNewRevision = (id: string) => {
    console.log("Create new revision:", id);
    setOpenDropdownId(null);
  };

  const handleUsageReport = (id: string) => {
    console.log("View usage report:", id);
    setOpenDropdownId(null);
  };

  const handleApprove = (id: string) => {
    console.log("Approve material:", id);
    setOpenDropdownId(null);
  };

  const handleObsolete = (id: string) => {
    console.log("Mark as obsolete:", id);
    setOpenDropdownId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Materials
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconLayoutDashboard className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Training Materials</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export materials")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate("/training-management/training-materials/upload")} size="sm" className="whitespace-nowrap gap-2">
            <Upload className="h-4 w-4" />
            Upload Material
          </Button>
        </div>
      </div>

      {/* ─── Dashboard Stats Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {/* Total Materials */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Total Materials</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalMaterials}</p>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Videos</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalVideos}</p>
            </div>
          </div>
        </div>

        {/* Documents (PDF + Document) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Documents</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileImage className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Images</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalImages}</p>
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-amber-700">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Total Storage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 font-medium">Total Storage</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalStorageMB} <span className="text-xs font-medium text-slate-500">MB</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Dashboard Panels (Most Used + Expiring + Type Distribution) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5">
        {/* Most Used Materials */}
        <div className="xl:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-900">Most Used Materials</h3>
            </div>
            <span className="text-xs text-slate-500">Top 5 by course usage</span>
          </div>
          <div className="divide-y divide-slate-100">
            {topUsedMaterials.map((material, idx) => (
              <div key={material.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                <span className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  idx === 0 ? "bg-amber-100 text-amber-700" :
                  idx === 1 ? "bg-slate-200 text-slate-700" :
                  idx === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-slate-100 text-slate-500"
                )}>
                  {idx + 1}
                </span>
                <div className="flex-shrink-0">{getTypeIcon(material.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{material.title}</p>
                  <p className="text-xs text-slate-500">{material.materialId}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-sm font-bold text-emerald-600">{material.usageCount}</span>
                  <span className="text-xs text-slate-500">courses</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending & Obsolete Materials */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-900">Pending & Obsolete</h3>
            </div>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
              pendingObsoleteMaterials.length > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            )}>
              {pendingObsoleteMaterials.length} item{pendingObsoleteMaterials.length !== 1 ? "s" : ""}
            </span>
          </div>
          {pendingObsoleteMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-900">All materials approved</p>
              <p className="text-xs text-slate-500 mt-1">No materials pending review or marked obsolete.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingObsoleteMaterials.map((material) => (
                <div key={material.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className={cn(
                    "flex-shrink-0 w-2 h-2 rounded-full",
                    material.status === "Obsolete" ? "bg-red-500" : "bg-amber-500"
                  )} />
                  <div className="flex-shrink-0">{getTypeIcon(material.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{material.title}</p>
                    <p className="text-xs text-slate-500">{material.materialId} · {material.version}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                      getStatusBadge(material.status)
                    )}>
                      {material.status}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">{formatDate(material.uploadedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type Distribution */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-900">Type Distribution</h3>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {typeDistribution.map(({ type, count, pct }) => (
              <div key={type} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="text-sm font-medium text-slate-700">{type}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{count} <span className="text-xs font-normal text-slate-500">({pct}%)</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", getTypeBgColor(type))} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}

            {/* Category breakdown */}
            <div className="pt-3 mt-1 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">By Department</p>
              <div className="flex flex-wrap gap-1.5">
                {departmentOptions.filter((d) => d.value !== "All").map((dept) => {
                  const count = MOCK_MATERIALS.filter((m) => m.department === dept.value).length;
                  return count > 0 ? (
                    <span key={dept.value} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {dept.label}
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0 rounded-full text-xs font-bold">{count}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filters ────────────────────────────────────────────── */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Type */}
          <div className="xl:col-span-3">
            <Select
              label="Material Type"
              value={filters.typeFilter}
              onChange={(val) => setFilters((prev) => ({ ...prev, typeFilter: val }))}
              options={typeOptions}
            />
          </div>

          {/* Department */}
          <div className="xl:col-span-3">
            <Select
              label="Department"
              value={filters.departmentFilter}
              onChange={(val) => setFilters((prev) => ({ ...prev, departmentFilter: val }))}
              options={departmentOptions}
            />
          </div>

          {/* Status */}
          <div className="xl:col-span-3">
            <Select
              label="Status"
              value={filters.statusFilter}
              onChange={(val) => setFilters((prev) => ({ ...prev, statusFilter: val }))}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      {/* ─── Materials Table ────────────────────────────────────── */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-16">No.</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Material ID</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Material Title</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">File Type</th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">File Size</th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Version</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Courses Using</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Uploaded By</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((material, index) => (
                <tr
                  key={material.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/training-management/training-materials/${material.id}`)}
                >
                  {/* No. */}
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  {/* Material ID */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-medium text-emerald-700">{material.materialId}</span>
                  </td>
                  {/* Material Title */}
                  <td className="py-3.5 px-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{material.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{material.description}</p>
                    </div>
                  </td>
                  {/* File Type (Text with icon) */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(material.type)}
                      <span className="text-slate-700 font-medium">{material.type}</span>
                    </div>
                  </td>
                  {/* File Size */}
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-700 font-medium">
                    {material.fileSize}
                  </td>
                  {/* Version */}
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                      {material.version}
                    </span>
                  </td>
                  {/* Department */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="text-slate-700">{material.department}</span>
                  </td>
                  {/* Status */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-center">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusBadge(material.status))}>
                      {material.status}
                    </span>
                  </td>
                  {/* Courses Using */}
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-slate-700 font-medium">{material.usageCount}</span>
                    </div>
                  </td>
                  {/* Last Updated */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {formatDate(material.uploadedAt)}
                  </td>
                  {/* Uploaded By */}
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {material.uploadedBy}
                  </td>
                  {/* Action */}
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      onClick={(e) => handleDropdownToggle(material.id, e)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemCount={true}
          />
        )}

        {filteredData.length === 0 && (
          <TableEmptyState
            title="No Training Materials Found"
            description="We couldn't find any training materials matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({ searchQuery: "", typeFilter: "All", departmentFilter: "All", statusFilter: "All" });
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Action Dropdown Portal */}
      {openDropdownId && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
            }}
            aria-hidden="true"
          />
          {/* Menu */}
          <div
            className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none'
            }}
          >
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <Eye className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Preview</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <Edit className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Edit Material</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewRevision(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <FilePlusCorner className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">New Revision</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUsageReport(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Usage Report</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <IconChecks className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Approve</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleObsolete(openDropdownId);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
              >
                <XCircle className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Mark as Obsolete</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
