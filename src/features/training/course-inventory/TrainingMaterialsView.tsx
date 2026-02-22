import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { IconSmartHome, IconPlus } from "@tabler/icons-react";
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
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  usageCount: number;
  category: string;
}

interface MaterialFilters {
  searchQuery: string;
  typeFilter: string;
  categoryFilter: string;
}

// Mock Data
const MOCK_MATERIALS: TrainingMaterial[] = [
  {
    id: "1",
    materialId: "MAT-2026-001",
    title: "GMP Introduction Video",
    description: "Comprehensive overview of Good Manufacturing Practices",
    type: "Video",
    fileSize: "125 MB",
    uploadedBy: "Admin",
    uploadedAt: "2026-01-15",
    usageCount: 15,
    category: "GMP",
  },
  {
    id: "2",
    materialId: "MAT-2026-002",
    title: "Cleanroom Operations Manual",
    description: "Step-by-step guide for cleanroom operations and procedures",
    type: "PDF",
    fileSize: "4.5 MB",
    uploadedBy: "QA Manager",
    uploadedAt: "2026-01-10",
    usageCount: 22,
    category: "Technical",
  },
  {
    id: "3",
    materialId: "MAT-2026-003",
    title: "Equipment Handling Guide",
    description: "Visual guide for proper equipment handling and maintenance",
    type: "PDF",
    fileSize: "8.2 MB",
    uploadedBy: "Training Coordinator",
    uploadedAt: "2026-01-08",
    usageCount: 18,
    category: "Technical",
  },
  {
    id: "4",
    materialId: "MAT-2026-004",
    title: "Safety Protocol Infographic",
    description: "Key safety protocols illustrated for quick reference",
    type: "Image",
    fileSize: "2.1 MB",
    uploadedBy: "Safety Officer",
    uploadedAt: "2026-01-20",
    usageCount: 30,
    category: "Safety",
  },
  {
    id: "5",
    materialId: "MAT-2026-005",
    title: "ISO 9001 Training Video",
    description: "Understanding ISO 9001:2015 requirements and implementation",
    type: "Video",
    fileSize: "210 MB",
    uploadedBy: "QA Director",
    uploadedAt: "2026-01-12",
    usageCount: 12,
    category: "Compliance",
  },
];

export const TrainingMaterialsView: React.FC = () => {
  const navigate = useNavigate();
  
  // Filters
  const [filters, setFilters] = useState<MaterialFilters>({
    searchQuery: "",
    typeFilter: "All",
    categoryFilter: "All",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Options
  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Video", value: "Video" },
    { label: "PDF", value: "PDF" },
    { label: "Image", value: "Image" },
    { label: "Document", value: "Document" },
  ];

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    { label: "GMP", value: "GMP" },
    { label: "Technical", value: "Technical" },
    { label: "Safety", value: "Safety" },
    { label: "Compliance", value: "Compliance" },
    { label: "SOP", value: "SOP" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_MATERIALS.filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        material.materialId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesType = filters.typeFilter === "All" || material.type === filters.typeFilter;
      const matchesCategory = filters.categoryFilter === "All" || material.category === filters.categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [filters]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "PDF":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "Image":
        return <FileImage className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "Video":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "PDF":
        return "bg-red-50 text-red-700 border-red-200";
      case "Image":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Materials
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Course Inventory</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Training Materials</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Upload material")}
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Material
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or description..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Material Type */}
          <div className="xl:col-span-2">
            <Select
              label="Material Type"
              value={filters.typeFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, typeFilter: val }))
              }
              options={typeOptions}
            />
          </div>

          {/* Category */}
          <div className="xl:col-span-1">
            <Select
              label="Category"
              value={filters.categoryFilter}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, categoryFilter: val }))
              }
              options={categoryOptions}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Total Materials
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATERIALS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Videos</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATERIALS.filter((m) => m.type === "Video").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">PDFs</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATERIALS.filter((m) => m.type === "PDF").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileImage className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Images</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_MATERIALS.filter((m) => m.type === "Image").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[60px]">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Material ID
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  File Size
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Usage Count
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Uploaded By
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((material, index) => (
                <tr
                  key={material.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => console.log("View material:", material.id)}
                >
                  <td className="py-3.5 px-4 text-sm text-center whitespace-nowrap text-slate-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-medium text-slate-900">
                      {material.materialId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-start gap-2">
                      {getTypeIcon(material.type)}
                      <div>
                        <p className="font-medium text-slate-900">
                          {material.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {material.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      getTypeColor(material.type)
                    )}>
                      {material.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                      {material.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {material.fileSize}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="text-slate-900 font-medium">
                      {material.usageCount} courses
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {material.uploadedBy}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Action clicked");
                      }}
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

        {/* Pagination */}
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

        {/* Empty State */}
        {filteredData.length === 0 && (
          <TableEmptyState
            title="No Training Materials Found"
            description="We couldn't find any training materials matching your filters. Try adjusting your search criteria or clear filters."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({
                searchQuery: "",
                typeFilter: "All",
                categoryFilter: "All",
              });
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};
