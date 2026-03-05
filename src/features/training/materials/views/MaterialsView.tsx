import React, { useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.constants";
import {
  Search,
  FileText,
  Video,
  FileImage,
  Download,
  Edit,
  Upload,
  FolderOpen,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  FilePlusCorner,
  Link2,
  Send,
  MoreVertical,
} from "lucide-react";
import { MarkObsoleteModal, ObsoleteResult } from "../components/MarkObsoleteModal";
import { IconChecks, IconInfoCircle, IconEyeCheck } from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page/PageHeader";
import { trainingMaterials } from "@/components/ui/breadcrumb/breadcrumbs.config";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { StatusBadge, StatusType } from "@/components/ui/statusbadge/StatusBadge";
import { cn } from "@/components/ui/utils";
import { formatDateUS } from "@/utils/format";
import { MOCK_MATERIALS } from "../mockData";

interface TrainingMaterial {
  id: string;
  materialId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Image" | "Document";
  version: string;
  department: string;
  status: "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Obsoleted";
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

/* ─── Dashboard Stats Calculation ───────────────────────────────── */
const calcDashboardStats = (materials: TrainingMaterial[]) => {
  const totalMaterials = materials.length;
  const totalVideos = materials.filter((m) => m.type === "Video").length;
  const totalDocuments = materials.filter((m) => m.type === "PDF" || m.type === "Document").length;
  const totalImages = materials.filter((m) => m.type === "Image").length;
  const pendingReview = materials.filter((m) => m.status === "Pending Review").length;
  const pendingApproval = materials.filter((m) => m.status === "Pending Approval").length;
  const needsAction = pendingReview + pendingApproval;
  const obsoleted = materials.filter((m) => m.status === "Obsoleted").length;
  const totalUsage = materials.reduce((sum, m) => sum + m.usageCount, 0);
  const totalStorageBytes = materials.reduce((sum, m) => sum + m.fileSizeBytes, 0);
  const totalStorageGB = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(0);
  return { totalMaterials, totalVideos, totalDocuments, totalImages, pendingReview, pendingApproval, needsAction, obsoleted, totalUsage, totalStorageMB, totalStorageGB };
};

// ── Local Dropdown ────────────────────────────────────────────────
interface MaterialDropdownMenuProps {
  material: TrainingMaterial;
  effectiveStatus: TrainingMaterial["status"];
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
  navigate: ReturnType<typeof useNavigate>;
  onMarkObsolete: (id: string) => void;
}

const MaterialDropdownMenu: React.FC<MaterialDropdownMenuProps> = ({
  material,
  effectiveStatus,
  isOpen,
  onClose,
  position,
  navigate,
  onMarkObsolete,
}) => {
  if (!isOpen) return null;

  type MenuItem =
    | { isDivider: true }
    | { isDivider?: false; icon: React.ElementType; label: string; onClick: () => void; color?: string };

  const menuItems: MenuItem[] = [
    { icon: IconInfoCircle, label: "View Details",   onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_DETAIL(material.id)); onClose(); }, color: "text-slate-500" },
    ...(effectiveStatus === "Draft" ? [
      { icon: Edit,   label: "Edit Material",     onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_EDIT(material.id)); onClose(); },   color: "text-slate-500" } as MenuItem,
      { icon: Send,   label: "Submit for Review", onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_REVIEW(material.id)); onClose(); }, color: "text-slate-500" } as MenuItem,
    ] : []),
    ...(effectiveStatus === "Pending Review" ? [
      { icon: IconEyeCheck, label: "Review Material",  onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_REVIEW(material.id)); onClose(); },   color: "text-slate-500" } as MenuItem,
    ] : []),
    ...(effectiveStatus === "Pending Approval" ? [
      { icon: IconChecks,   label: "Approve Material", onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_APPROVAL(material.id)); onClose(); }, color: "text-slate-500" } as MenuItem,
    ] : []),
    ...(effectiveStatus === "Approved" ? [
      { icon: FilePlusCorner, label: "Upgrade Revision", onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_NEW_REVISION(material.id)); onClose(); }, color: "text-slate-500" } as MenuItem,
    ] : []),
    { icon: BarChart3, label: "Usage Report", onClick: () => { navigate(ROUTES.TRAINING.MATERIAL_USAGE_REPORT(material.id)); onClose(); }, color: "text-slate-500" },
    ...(effectiveStatus === "Approved" ? [
      { isDivider: true } as MenuItem,
      { icon: XCircle, label: "Mark as Obsoleted", onClick: () => { onMarkObsolete(material.id); onClose(); }, color: "text-slate-500" } as MenuItem,
    ] : []),
  ];

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-hidden="true"
      />
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: `${position.top}px`, left: `${position.left}px`, transform: position.showAbove ? "translateY(-100%)" : "none" }}
      >
        <div className="py-1">
          {menuItems.map((item, i) => {
            if ("isDivider" in item && item.isDivider) {
              return <div key={i} className="my-1 border-t border-slate-100" />;
            }
            const mi = item as Exclude<MenuItem, { isDivider: true }>;
            const Icon = mi.icon;
            return (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); mi.onClick(); }}
                className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors", mi.color)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{mi.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>,
    window.document.body
  );
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

  // Obsolete overrides (local state — persists for session)
  const [obsoleteOverrides, setObsoleteOverrides] = useState<Record<string, { replacedBy: string }>>({});

  // Mark Obsolete modal
  const [obsoleteModalOpen, setObsoleteModalOpen] = useState(false);
  const [obsoleteTargetId, setObsoleteTargetId] = useState<string | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement | null>>>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) { setOpenDropdownId(null); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 200; const menuWidth = 200; const safeMargin = 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldShowAbove = spaceBelow < menuHeight && rect.top > menuHeight;
    const top = shouldShowAbove ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - menuWidth;
    left = Math.max(safeMargin, Math.min(left, window.innerWidth - menuWidth - safeMargin));
    setDropdownPosition({ top, left, showAbove: shouldShowAbove });
    setOpenDropdownId(id);
  };

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
    { label: "Pending Review", value: "Pending Review" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "Approved", value: "Approved" },
    { label: "Obsoleted", value: "Obsoleted" },
  ];

  // Effective status helper
  const getEffectiveStatus = (m: TrainingMaterial) =>
    obsoleteOverrides[m.id] !== undefined ? "Obsoleted" as const : m.status;

  // Map material status to StatusBadge type
  const mapMaterialStatusToStatusType = (status: TrainingMaterial["status"]): StatusType => {
    switch (status) {
      case "Draft":
        return "draft";
      case "Pending Review":
        return "pendingReview";
      case "Pending Approval":
        return "pendingApproval";
      case "Approved":
        return "approved";
      case "Obsoleted":
        return "obsolete";
      default:
        return "draft";
    }
  };

  // Filtered & Paginated
  const filteredData = useMemo(() => {
    return MOCK_MATERIALS.filter((m) => {
      const effectiveStatus = obsoleteOverrides[m.id] !== undefined ? "Obsoleted" : m.status;
      const matchesSearch =
        m.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        m.materialId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || m.type === filters.typeFilter;
      const matchesDepartment = filters.departmentFilter === "All" || m.department === filters.departmentFilter;
      const matchesStatus = filters.statusFilter === "All" || effectiveStatus === filters.statusFilter;
      return matchesSearch && matchesType && matchesDepartment && matchesStatus;
    });
  }, [filters, obsoleteOverrides]);

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
    () => MOCK_MATERIALS.filter(
      (m) => m.status === "Pending Review" || m.status === "Pending Approval" || m.status === "Obsoleted"
    ).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
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



  const handleObsoleteConfirm = (result: ObsoleteResult) => {
    if (obsoleteTargetId) {
      setObsoleteOverrides((prev) => ({
        ...prev,
        [obsoleteTargetId]: { replacedBy: result.replacedByCode },
      }));
    }
    setObsoleteModalOpen(false);
    setObsoleteTargetId(null);
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <PageHeader
        title="Training Materials"
        breadcrumbItems={trainingMaterials()}
        actions={
          <>
            <Button
              onClick={() => console.log("Export materials")}
              variant="outline"
              size="sm"
              className="whitespace-nowrap gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.TRAINING.UPLOAD_MATERIAL)} size="sm" className="whitespace-nowrap gap-2">
              <Upload className="h-4 w-4" />
              Upload Material
            </Button>
          </>
        }
      />

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

        {/* Needs Action (Pending Review + Pending Approval) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-amber-600 font-medium">Needs Action</p>
              <p className="text-xl font-bold text-amber-700">{stats.needsAction}</p>
              <p className="text-xs text-slate-400 leading-tight">{stats.pendingReview}R · {stats.pendingApproval}A</p>
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
              <h3 className="text-sm font-semibold text-slate-900">Needs Action & Obsoleted</h3>
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
                    material.status === "Obsoleted" ? "bg-red-500" :
                    material.status === "Pending Approval" ? "bg-blue-500" :
                    "bg-amber-500"
                  )} />
                  <div className="flex-shrink-0">{getTypeIcon(material.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{material.title}</p>
                    <p className="text-xs text-slate-500">{material.materialId} · {material.version}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <StatusBadge status={mapMaterialStatusToStatusType(material.status)} />
                    <span className="text-xs text-slate-500 mt-0.5">{formatDateUS(material.uploadedAt)}</span>
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
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{type}</span>
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
            <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 transition-colors"
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
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-10 sm:w-16">No.</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Material ID</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Material Title</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">File Type</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">File Size</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Version</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Courses Using</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Last Updated</th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Uploaded By</th>
                <th className="sticky right-0 bg-slate-50 py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider z-[1] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((material, index) => (
                <tr
                  key={material.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(ROUTES.TRAINING.MATERIAL_DETAIL(material.id))}
                >
                  {/* No. */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  {/* Material ID */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="font-medium text-emerald-600">{material.materialId}</span>
                  </td>
                  {/* Material Title */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm">
                    <div>
                      <p className={cn("font-medium", getEffectiveStatus(material) === "Obsoleted" ? "text-slate-400 line-through" : "text-slate-900")}>{material.title}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{material.description}</p>
                      {obsoleteOverrides[material.id]?.replacedBy && (
                        <div className="flex items-center gap-1 mt-1">
                          <Link2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs text-emerald-700 font-medium">
                            Replaced by{" "}
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className="underline hover:text-emerald-800 transition-colors"
                            >
                              {obsoleteOverrides[material.id].replacedBy}
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  {/* File Type (Text with icon) */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {getTypeIcon(material.type)}
                      <span className="text-slate-700 font-medium">{material.type}</span>
                    </div>
                  </td>
                  {/* File Size */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap text-slate-700 font-medium">
                    {material.fileSize}
                  </td>
                  {/* Version */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap">
                    {material.version}
                  </td>
                  {/* Department */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="text-slate-700">{material.department}</span>
                  </td>
                  {/* Status */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                    <StatusBadge status={mapMaterialStatusToStatusType(getEffectiveStatus(material) as TrainingMaterial["status"])} />
                  </td>
                  {/* Courses Using */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-slate-700 font-medium">{material.usageCount}</span>
                    </div>
                  </td>
                  {/* Last Updated */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                    {formatDateUS(material.uploadedAt)}
                  </td>
                  {/* Uploaded By */}
                  <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm whitespace-nowrap text-slate-700">
                    {material.uploadedBy}
                  </td>
                  {/* Action */}
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      ref={getButtonRef(material.id)}
                      onClick={(e) => handleDropdownToggle(material.id, e)}
                      className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                    </button>
                    <MaterialDropdownMenu
                      material={material}
                      effectiveStatus={getEffectiveStatus(material)}
                      isOpen={openDropdownId === material.id}
                      onClose={() => setOpenDropdownId(null)}
                      position={dropdownPosition}
                      navigate={navigate}
                      onMarkObsolete={(id) => { setObsoleteTargetId(id); setObsoleteModalOpen(true); }}
                    />
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


      <MarkObsoleteModal
        isOpen={obsoleteModalOpen}
        material={(() => {
          const m = MOCK_MATERIALS.find((mat) => mat.id === obsoleteTargetId) ?? null;
          if (!m) return null;
          return {
            id: m.id,
            materialId: m.materialId,
            title: m.title,
            version: m.version,
            type: m.type,
            linkedCourses: m.linkedCourses,
          };
        })()}
        onClose={() => {
          setObsoleteModalOpen(false);
          setObsoleteTargetId(null);
        }}
        onConfirm={handleObsoleteConfirm}
      />
    </div>
  );
};
