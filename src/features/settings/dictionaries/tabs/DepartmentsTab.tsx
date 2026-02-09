import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Building2,
  Power,
  PowerOff,
  X,
  Save,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";

// --- Types ---
type BusinessUnit = "Operation Unit" | "Quality Unit";

interface DepartmentItem {
  id: string;
  name: string;
  abbreviation: string;
  businessUnit: BusinessUnit;
  description?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

const MOCK_DEPARTMENTS: DepartmentItem[] = [
  {
    id: "1",
    name: "Human Resources & Administrator",
    abbreviation: "HRA",
    businessUnit: "Operation Unit",
    description: "Human resources management and administration",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-12-01",
  },
  {
    id: "2",
    name: "Mechanical and Electrical",
    abbreviation: "ME",
    businessUnit: "Operation Unit",
    description: "Mechanical and electrical engineering department",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-11-15",
  },
  {
    id: "3",
    name: "Logistics",
    abbreviation: "LOG",
    businessUnit: "Operation Unit",
    description: "Logistics and supply chain management",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-10-20",
  },
  {
    id: "4",
    name: "Technology Transfer",
    abbreviation: "TT",
    businessUnit: "Operation Unit",
    description: "Technology transfer and process optimization",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-09-10",
  },
  {
    id: "5",
    name: "Injection WS",
    abbreviation: "IWS",
    businessUnit: "Operation Unit",
    description: "Injection workshop operations",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-08-05",
  },
  {
    id: "6",
    name: "Quality Control",
    abbreviation: "QC",
    businessUnit: "Quality Unit",
    description: "Quality control and testing",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-12-15",
  },
  {
    id: "7",
    name: "Quality Assurance",
    abbreviation: "QA",
    businessUnit: "Quality Unit",
    description: "Quality assurance and compliance",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-11-20",
  },
  {
    id: "8",
    name: "Regulatory Affairs",
    abbreviation: "RA",
    businessUnit: "Quality Unit",
    description: "Regulatory compliance and submissions",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-10-25",
  },
];

export const DepartmentsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<
    "All" | BusinessUnit
  >("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DepartmentItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockData, setMockData] = useState<DepartmentItem[]>(MOCK_DEPARTMENTS);

  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement | null> }>(
    {},
  );

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      const matchesBusinessUnit =
        businessUnitFilter === "All" ||
        item.businessUnit === businessUnitFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && item.isActive) ||
        (statusFilter === "Inactive" && !item.isActive);
      return matchesSearch && matchesBusinessUnit && matchesStatus;
    });
  }, [mockData, searchQuery, businessUnitFilter, statusFilter]);

  const handleDropdownToggle = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 200,
      });
      setOpenDropdownId(id);
    }
  };

  const handleEdit = (item: DepartmentItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (item: DepartmentItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const handleToggleStatus = async (item: DepartmentItem) => {
    console.log("Toggle status:", item.id, !item.isActive);

    setMockData((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)),
    );

    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleted:", selectedItem?.id);
    setMockData((prev) => prev.filter((i) => i.id !== selectedItem?.id));
    setIsSubmitting(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 min-h-0">
      {/* Filter Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2 xl:col-span-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 sm:h-10 pl-10 pr-4 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Business Unit Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Business Unit"
              value={businessUnitFilter}
              onChange={(value) =>
                setBusinessUnitFilter(value as "All" | BusinessUnit)
              }
              options={[
                { label: "All Units", value: "All" },
                { label: "Operation Unit", value: "Operation Unit" },
                { label: "Quality Unit", value: "Quality Unit" },
              ]}
              placeholder="Filter by business unit"
            />
          </div>

          {/* Status Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as "All" | "Active" | "Inactive")
              }
              options={[
                { label: "All Status", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              placeholder="Filter by status"
            />
          </div>

          {/* Add Button */}
          <div className="xl:col-span-2">
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

      {/* Table Container */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                No.
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Abbreviation
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Business Unit
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Description
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Modified Date
              </th>
              <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-medium text-slate-900">
                      {item.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {item.abbreviation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border",
                        item.businessUnit === "Operation Unit"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200",
                      )}
                    >
                      {item.businessUnit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 max-w-md truncate">
                    {item.description || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    {item.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-600">
                    {item.modifiedDate}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-[5] whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      ref={getButtonRef(item.id)}
                      onClick={(e) => handleDropdownToggle(item.id, e)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                      <Building2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-base font-medium text-slate-900">
                      No departments found
                    </p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu */}
      {openDropdownId &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 animate-in fade-in duration-150"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(null);
              }}
              aria-hidden="true"
            />
            <div
              className="fixed z-50 min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const item = filteredItems.find(
                      (i) => i.id === openDropdownId,
                    )!;
                    handleEdit(item);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const item = filteredItems.find(
                      (i) => i.id === openDropdownId,
                    )!;
                    handleToggleStatus(item);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  {filteredItems.find((i) => i.id === openDropdownId)
                    ?.isActive ? (
                    <>
                      <PowerOff className="h-3.5 w-3.5" />
                      <span>Disable</span>
                    </>
                  ) : (
                    <>
                      <Power className="h-3.5 w-3.5" />
                      <span>Enable</span>
                    </>
                  )}
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const item = filteredItems.find(
                      (i) => i.id === openDropdownId,
                    )!;
                    handleDelete(item);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}

      {/* Add/Edit Modal */}
      <DepartmentModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        isEdit={showEditModal}
        onSave={(data) => {
          if (showEditModal && selectedItem) {
            setMockData((prev) =>
              prev.map((i) =>
                i.id === selectedItem.id
                  ? {
                      ...i,
                      ...data,
                      modifiedDate: new Date().toISOString().split("T")[0],
                    }
                  : i,
              ),
            );
          } else {
            const newItem: DepartmentItem = {
              id: String(mockData.length + 1),
              ...data,
              createdDate: new Date().toISOString().split("T")[0],
              modifiedDate: new Date().toISOString().split("T")[0],
            };
            setMockData((prev) => [...prev, newItem]);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        type="warning"
        title="Delete Department?"
        description={
          <div className="space-y-3">
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedItem?.name}</strong>?
            </p>
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800">
                <span className="font-semibold">⚠️ Warning:</span> This action
                cannot be undone.
              </p>
            </div>
          </div>
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isSubmitting}
        showCancel={true}
      />
    </div>
  );
};

// Department Add/Edit Modal Component
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DepartmentItem | null;
  isEdit: boolean;
  onSave: (data: {
    name: string;
    abbreviation: string;
    businessUnit: BusinessUnit;
    description: string;
    isActive: boolean;
  }) => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  item,
  isEdit,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    abbreviation: item?.abbreviation || "",
    businessUnit: (item?.businessUnit || "Operation Unit") as BusinessUnit,
    description: item?.description || "",
    isActive: item?.isActive ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        abbreviation: item.abbreviation,
        businessUnit: item.businessUnit,
        description: item.description || "",
        isActive: item.isActive,
      });
    } else {
      setFormData({
        name: "",
        abbreviation: "",
        businessUnit: "Operation Unit",
        description: "",
        isActive: true,
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Edit" : "Add New"} Department
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isSaving}
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter department name"
                required
                disabled={isSaving}
              />
            </div>

            {/* Abbreviation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Abbreviation<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    abbreviation: e.target.value.toUpperCase(),
                  })
                }
                maxLength={10}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., QA, PROD, R&D"
                required
                disabled={isSaving}
              />
              <p className="text-xs text-slate-500 mt-1">
                Short abbreviation for the department (max 10 characters)
              </p>
            </div>

            {/* Business Unit */}
            <div>
              <Select
                label="Business Unit"
                value={formData.businessUnit}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    businessUnit: value as BusinessUnit,
                  })
                }
                options={[
                  { label: "Operation Unit", value: "Operation Unit" },
                  { label: "Quality Unit", value: "Quality Unit" },
                ]}
                placeholder="Select business unit"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter description (optional)"
                disabled={isSaving}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                label="Active"
                disabled={isSaving}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body,
  );
};
