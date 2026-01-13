import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Eye,
  Download,
  History,
  Plus,
  Copy,
  Edit,
  Trash2,
  GripVertical,
  Home,
  FileText,
  CheckCircle2,
  Link2,
  SquarePen,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { cn } from '@/components/ui/utils';
import { TemplateFilters } from "./TemplateFilters";
import { IconPlus, IconTemplate } from "@tabler/icons-react";
import { CreateLinkModal } from "../CreateLinkModal";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type TemplateStatus = "Draft" | "Active" | "Archived";

interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

interface Template {
  id: string;
  templateId: string;
  templateName: string;
  documentType: DocumentType;
  version: string;
  status: TemplateStatus;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  department: string;
  description?: string;
  usageCount: number;
}

// --- Mock Data ---
const MOCK_TEMPLATES: Template[] = [
  {
    id: "1",
    templateId: "TMPL-SOP-001",
    templateName: "Standard Operating Procedure Template",
    documentType: "SOP",
    version: "2.0",
    status: "Active",
    createdBy: "Dr. Sarah Johnson",
    createdDate: "2023-01-15",
    lastModified: "2023-06-20",
    department: "Quality Assurance",
    description: "Standard template for creating SOPs",
    usageCount: 45,
  },
  {
    id: "2",
    templateId: "TMPL-POL-001",
    templateName: "Policy Document Template",
    documentType: "Policy",
    version: "1.5",
    status: "Active",
    createdBy: "John Smith",
    createdDate: "2023-02-10",
    lastModified: "2023-08-15",
    department: "Human Resources",
    description: "Template for creating company policies",
    usageCount: 28,
  },
  {
    id: "3",
    templateId: "TMPL-FORM-001",
    templateName: "Inspection Form Template",
    documentType: "Form",
    version: "1.0",
    status: "Active",
    createdBy: "Emily Davis",
    createdDate: "2023-03-05",
    lastModified: "2023-07-10",
    department: "Quality Control",
    description: "Template for creating inspection forms",
    usageCount: 62,
  },
  {
    id: "4",
    templateId: "TMPL-RPT-001",
    templateName: "Validation Report Template",
    documentType: "Report",
    version: "1.8",
    status: "Active",
    createdBy: "Michael Brown",
    createdDate: "2023-04-12",
    lastModified: "2023-09-25",
    department: "Validation",
    description: "Template for validation reports",
    usageCount: 18,
  },
  {
    id: "5",
    templateId: "TMPL-SPEC-001",
    templateName: "Product Specification Template",
    documentType: "Specification",
    version: "2.2",
    status: "Active",
    createdBy: "Dr. Sarah Johnson",
    createdDate: "2023-05-20",
    lastModified: "2023-10-05",
    department: "Quality Assurance",
    description: "Template for product specifications",
    usageCount: 35,
  },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: TemplateStatus }) => {
  const styles = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Archived: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      {status}
    </span>
  );
};

const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onAction: (action: string) => void;
}> = ({ isOpen, onClose, position, onAction }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: position.top, left: position.left }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('view');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Template</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('edit');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <SquarePen className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Edit Template</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('createLink');
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <Link2 className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Create Shareable Link</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const ColumnCustomizer: React.FC<{
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}> = ({ columns, onColumnsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const reorderableColumns = useMemo(() => 
    [...columns].sort((a, b) => a.order - b.order)
  , [columns]);

  const toggleVisibility = (id: string) => {
    if (columns.find(c => c.id === id)?.locked) return;
    
    const newColumns = columns.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColumns = [...reorderableColumns];
    const draggedItem = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(index, 0, draggedItem);

    const updatedColumns = newColumns.map((col, idx) => ({
      ...col,
      order: idx
    }));

    onColumnsChange(updatedColumns);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const resetToDefault = () => {
    const defaultColumns: TableColumn[] = [
      { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
      { id: 'templateId', label: 'Template ID', visible: true, order: 1 },
      { id: 'templateName', label: 'Template Name', visible: true, order: 2 },
      { id: 'documentType', label: 'Document Type', visible: true, order: 3 },
      { id: 'version', label: 'Version', visible: true, order: 4 },
      { id: 'status', label: 'Status', visible: true, order: 5 },
      { id: 'createdBy', label: 'Created By', visible: true, order: 6 },
      { id: 'createdDate', label: 'Created Date', visible: true, order: 7 },
      { id: 'lastModified', label: 'Last Modified', visible: true, order: 8 },
      { id: 'usageCount', label: 'Usage Count', visible: true, order: 9 },
      { id: 'action', label: 'Action', visible: true, order: 10, locked: true },
    ];
    onColumnsChange(defaultColumns);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 h-11 border rounded-md bg-white text-sm transition-all",
          isOpen 
            ? "border-emerald-500 ring-2 ring-emerald-500" 
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <span className="text-slate-700 font-medium">Customize Columns</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 top-full mt-2 z-50 w-full bg-white rounded-lg border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Customize Columns</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scroll to View, Drag to reorder</p>
          </div>

          <div className="p-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {reorderableColumns.map((column, index) => (
              <div
                key={column.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md border border-transparent transition-all cursor-move group',
                  draggedIndex === index
                    ? 'bg-blue-50 border-blue-200 opacity-50'
                    : 'hover:bg-slate-50'
                )}
              >
                <Checkbox
                  id={`column-${column.id}`}
                  checked={column.visible}
                  onChange={() => toggleVisibility(column.id)}
                  className="flex-shrink-0"
                />
                
                <span className={cn(
                  "text-sm font-medium flex-1",
                  column.visible ? "text-slate-700" : "text-slate-400"
                )}>
                  {column.label}
                </span>

                <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="px-3 py-2 rounded-b-lg border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

interface TemplateLibraryViewProps {
  onViewTemplate?: (templateId: string) => void;
  onCreateTemplate?: () => void;
}

export const TemplateLibraryView: React.FC<TemplateLibraryViewProps> = ({ 
  onViewTemplate,
  onCreateTemplate 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [authorFilter, setAuthorFilter] = useState<string>("All");
  const [createdFromDate, setCreatedFromDate] = useState<string>("");
  const [createdToDate, setCreatedToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedTemplateForLink, setSelectedTemplateForLink] = useState<Template | null>(null);
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'no', label: 'No.', visible: true, order: 0, locked: true },
    { id: 'templateId', label: 'Template ID', visible: true, order: 1 },
    { id: 'templateName', label: 'Template Name', visible: true, order: 2 },
    { id: 'documentType', label: 'Document Type', visible: true, order: 3 },
    { id: 'version', label: 'Version', visible: true, order: 4 },
    { id: 'status', label: 'Status', visible: true, order: 5 },
    { id: 'createdBy', label: 'Created By', visible: true, order: 6 },
    { id: 'createdDate', label: 'Created Date', visible: true, order: 7 },
    { id: 'lastModified', label: 'Last Modified', visible: true, order: 8 },
    { id: 'usageCount', label: 'Usage Count', visible: true, order: 9 },
    { id: 'action', label: 'Action', visible: true, order: 10, locked: true },
  ]);
  const buttonRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  const itemsPerPage = 10;

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      const matchesSearch =
        template.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.templateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || template.status === statusFilter;
      const matchesType = typeFilter === "All" || template.documentType === typeFilter;
      const matchesDepartment = departmentFilter === "All" || template.department === departmentFilter;
      const matchesAuthor = authorFilter === "All" || template.createdBy === authorFilter;

      const matchesCreatedFrom = !createdFromDate || new Date(template.createdDate) >= new Date(createdFromDate);
      const matchesCreatedTo = !createdToDate || new Date(template.createdDate) <= new Date(createdToDate);

      return matchesSearch && matchesStatus && matchesType && matchesDepartment && 
             matchesAuthor && matchesCreatedFrom && matchesCreatedTo;
    });
  }, [searchQuery, statusFilter, typeFilter, departmentFilter, authorFilter,
      createdFromDate, createdToDate]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const handleDropdownToggle = (
    templateId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openDropdownId === templateId) {
      setOpenDropdownId(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 200,
    });
    setOpenDropdownId(templateId);
  };

  const getButtonRef = (templateId: string) => {
    if (!buttonRefs.current[templateId]) {
      buttonRefs.current[templateId] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[templateId];
  };

  const handleCreateLink = (template: Template) => {
    setSelectedTemplateForLink(template);
    setIsCreateLinkModalOpen(true);
  };

  const handleDropdownAction = (action: string, templateId: string) => {
    const template = MOCK_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    switch (action) {
      case 'view':
        onViewTemplate?.(templateId);
        break;
      case 'createLink':
        handleCreateLink(template);
        break;
      default:
        console.log(`Action ${action} on template ${templateId}`);
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Template Library
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4" />
            <span className="hidden sm:inline">Document Control</span>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700 font-medium">Template Library</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onCreateTemplate}
          className="flex items-center gap-2 shadow-sm"
        >
          <IconPlus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <TemplateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        authorFilter={authorFilter}
        onAuthorChange={setAuthorFilter}
        createdFromDate={createdFromDate}
        onCreatedFromDateChange={setCreatedFromDate}
        createdToDate={createdToDate}
        onCreatedToDateChange={setCreatedToDate}
      />

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {columns.sort((a, b) => a.order - b.order).map((column) => {
                  if (!column.visible) return null;
                  
                  if (column.id === 'action') {
                    return (
                      <th 
                        key={column.id}
                        className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]"
                        style={{ width: '60px' }}
                      >
                        {column.label}
                      </th>
                    );
                  }

                  return (
                    <th
                      key={column.id}
                      className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {currentTemplates.length > 0 ? (
                currentTemplates.map((template, index) => (
                  <tr
                    key={template.id}
                    onClick={() => onViewTemplate?.(template.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {columns.sort((a, b) => a.order - b.order).map((column) => {
                      if (!column.visible) return null;

                      if (column.id === 'action') {
                        return (
                          <td
                            key={column.id}
                            onClick={(e) => e.stopPropagation()}
                            className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                          >
                            <button
                              ref={getButtonRef(template.id)}
                              onClick={(e) => handleDropdownToggle(template.id, e)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4 text-slate-600" />
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td key={column.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                          {column.id === 'no' && startIndex + index + 1}
                          {column.id === 'templateId' && (
                            <span className="font-medium text-emerald-600">{template.templateId}</span>
                          )}
                          {column.id === 'templateName' && (
                            <span className="font-medium text-slate-900">{template.templateName}</span>
                          )}
                          {column.id === 'documentType' && template.documentType}
                          {column.id === 'version' && template.version}
                          {column.id === 'status' && <StatusBadge status={template.status} />}
                          {column.id === 'createdBy' && template.createdBy}
                          {column.id === 'createdDate' && template.createdDate}
                          {column.id === 'lastModified' && template.lastModified}
                          {column.id === 'usageCount' && (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                              {template.usageCount}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.filter(c => c.visible).length} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">No templates found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-slate-900">{Math.min(endIndex, filteredTemplates.length)}</span> of{" "}
            <span className="font-medium text-slate-900">{filteredTemplates.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Portal */}
      <DropdownMenu
        isOpen={!!openDropdownId}
        onClose={() => setOpenDropdownId(null)}
        position={dropdownPosition}
        onAction={(action) => {
          if (openDropdownId) {
            handleDropdownAction(action, openDropdownId);
          }
        }}
      />

      {/* Create Shareable Link Modal */}
      {selectedTemplateForLink && (
        <CreateLinkModal
          isOpen={isCreateLinkModalOpen}
          onClose={() => {
            setIsCreateLinkModalOpen(false);
            setSelectedTemplateForLink(null);
          }}
          documentId={selectedTemplateForLink.templateId}
          documentTitle={selectedTemplateForLink.templateName}
        />
      )}
    </div>
  );
};
