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
  Home,
  FileText,
  CheckCircle2,
  Link2,
  SquarePen,
} from "lucide-react";
import { Button } from '@/components/ui/button/Button';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { cn } from '@/components/ui/utils';
import { TemplateFilters } from "./TemplateFilters";
import { IconPlus, IconTemplate, IconFileExport, IconSmartHome } from "@tabler/icons-react";
import { CreateLinkModal } from "@/features/documents/shared/components";

// --- Types ---

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type TemplateStatus = "Draft" | "Active" | "Archived";

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
  position: { top: number; left: number; showAbove?: boolean };
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
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`,
          transform: position.showAbove ? 'translateY(-100%)' : 'none'
        }}
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [selectedTemplateForLink, setSelectedTemplateForLink] = useState<Template | null>(null);
  const buttonRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    
    // Menu dimensions (3 items * ~40px per item + padding)
    const menuHeight = 130;
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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Template Library
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Document Control</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Template Library</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => {
              console.log("Export triggered");
              // TODO: Implement export functionality
            }}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={onCreateTemplate}
            className="flex items-center gap-2 shadow-sm"
          >
            <IconPlus className="h-4 w-4" />
            New Template
          </Button>
        </div>
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
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">No.</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Template ID</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Template Name</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Document Type</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Version</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Created By</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Created Date</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Last Modified</th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Usage Count</th>
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">Action</th>
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
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{startIndex + index + 1}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-emerald-600">{template.templateId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">{template.templateName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{template.documentType}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{template.version}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap"><StatusBadge status={template.status} /></td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{template.createdBy}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{template.createdDate}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">{template.lastModified}</td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {template.usageCount}
                      </span>
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                    >
                      <button
                        ref={getButtonRef(template.id)}
                        onClick={(e) => handleDropdownToggle(template.id, e)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-12 text-center">
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
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTemplates.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
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
