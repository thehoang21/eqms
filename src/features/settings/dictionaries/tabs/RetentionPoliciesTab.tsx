import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Archive,
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
interface RetentionPolicyItem {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

const MOCK_RETENTION_POLICIES: RetentionPolicyItem[] = [
  {
    id: "1",
    name: "7 Years + Current",
    description: "Retain for 7 years plus current year",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-12-15",
  },
  {
    id: "2",
    name: "Permanent",
    description: "Retain permanently",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-11-10",
  },
  {
    id: "3",
    name: "3 Years",
    description: "Retain for 3 years",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-09-20",
  },
  {
    id: "4",
    name: "5 Years + Current",
    description: "Retain for 5 years plus current year",
    isActive: true,
    createdDate: "2024-01-15",
    modifiedDate: "2025-08-15",
  },
  {
    id: "5",
    name: "1 Year",
    description: "Retain for 1 year only",
    isActive: false,
    createdDate: "2024-01-15",
    modifiedDate: "2025-07-10",
  },
];

export const RetentionPoliciesTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RetentionPolicyItem | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockData, setMockData] = useState<RetentionPolicyItem[]>(
    MOCK_RETENTION_POLICIES,
  );

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
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && item.isActive) ||
        (statusFilter === "Inactive" && !item.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [mockData, searchQuery, statusFilter]);

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

  const handleEdit = (item: RetentionPolicyItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (item: RetentionPolicyItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const handleToggleStatus = async (item: RetentionPolicyItem) => {
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search Input */}
          <div className="xl:col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search retention policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 sm:h-10 pl-10 pr-4 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="xl:col-span-4">
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
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-x-auto">
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
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="bg-slate-50 p-4 rounded-full mb-3">
                        <Archive className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">
                        No retention policies found
                      </p>
                      <p className="text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      <RetentionPolicyModal
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
            const newItem: RetentionPolicyItem = {
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
        title="Delete Retention Policy?"
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

// Retention Policy Add/Edit Modal Component
interface RetentionPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RetentionPolicyItem | null;
  isEdit: boolean;
  onSave: (data: {
    name: string;
    description: string;
    isActive: boolean;
  }) => void;
}

const RetentionPolicyModal: React.FC<RetentionPolicyModalProps> = ({
  isOpen,
  onClose,
  item,
  isEdit,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    isActive: item?.isActive ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || "",
        isActive: item.isActive,
      });
    } else {
      setFormData({
        name: "",
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
              {isEdit ? "Edit" : "Add New"} Retention Policy
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
                placeholder="Enter retention policy name"
                required
                disabled={isSaving}
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
