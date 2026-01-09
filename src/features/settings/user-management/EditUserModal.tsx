import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";

type UserRole = "Admin" | "QA Manager" | "Document Owner" | "Reviewer" | "Approver" | "Viewer";
type UserStatus = "Active" | "Inactive" | "Pending";

interface User {
  id: string;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  businessUnit: string;
  department: string;
  status: UserStatus;
  lastLogin: string;
  createdDate: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editUser: User;
  setEditUser: React.Dispatch<React.SetStateAction<User>>;
  formErrors: { [key: string]: string };
  setFormErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  formDepartments: string[];
  businessUnitDepartments: { [key: string]: string[] };
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editUser,
  setEditUser,
  formErrors,
  setFormErrors,
  formDepartments,
  businessUnitDepartments,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit User</h2>
              <p className="text-sm text-slate-600 mt-0.5">Update user information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {/* Employee ID - Readonly */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Employee ID
              </label>
              <input
                type="text"
                value={editUser.employeeId}
                readOnly
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editUser.fullName}
                onChange={(e) => {
                  setEditUser({ ...editUser, fullName: e.target.value });
                  if (formErrors.fullName) {
                    setFormErrors({ ...formErrors, fullName: "" });
                  }
                }}
                placeholder="Enter full name"
                className={cn(
                  "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  formErrors.fullName ? "border-red-300 bg-red-50" : "border-slate-200"
                )}
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Username - Readonly */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={editUser.username}
                readOnly
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => {
                  setEditUser({ ...editUser, email: e.target.value });
                  if (formErrors.email) {
                    setFormErrors({ ...formErrors, email: "" });
                  }
                }}
                placeholder="email@example.com"
                className={cn(
                  "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  formErrors.email ? "border-red-300 bg-red-50" : "border-slate-200"
                )}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={editUser.phone}
                onChange={(e) => {
                  setEditUser({ ...editUser, phone: e.target.value });
                  if (formErrors.phone) {
                    setFormErrors({ ...formErrors, phone: "" });
                  }
                }}
                placeholder="+1-555-0123"
                className={cn(
                  "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                  formErrors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                )}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Two Column Grid for Business Unit and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Unit */}
              <div>
                <Select
                  label="Business Unit"
                  value={editUser.businessUnit}
                  onChange={(value) => {
                    setEditUser({ ...editUser, businessUnit: value, department: "" });
                    if (formErrors.businessUnit) {
                      setFormErrors({ ...formErrors, businessUnit: "" });
                    }
                  }}
                  options={Object.keys(businessUnitDepartments).map((bu) => ({
                    label: bu,
                    value: bu,
                  }))}
                  placeholder="Select business unit"
                />
                {formErrors.businessUnit && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.businessUnit}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <Select
                  label="Department"
                  value={editUser.department}
                  onChange={(value) => {
                    setEditUser({ ...editUser, department: value });
                    if (formErrors.department) {
                      setFormErrors({ ...formErrors, department: "" });
                    }
                  }}
                  options={formDepartments.map((dept) => ({ label: dept, value: dept }))}
                  placeholder="Select department"
                  disabled={!editUser.businessUnit}
                />
                {formErrors.department && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.department}</p>
                )}
              </div>
            </div>

            {/* Two Column Grid for Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <Select
                  label="Role"
                  value={editUser.role}
                  onChange={(value) => setEditUser({ ...editUser, role: value as UserRole })}
                  options={[
                    { label: "Admin", value: "Admin" },
                    { label: "QA Manager", value: "QA Manager" },
                    { label: "Document Owner", value: "Document Owner" },
                    { label: "Reviewer", value: "Reviewer" },
                    { label: "Approver", value: "Approver" },
                    { label: "Viewer", value: "Viewer" },
                  ]}
                />
              </div>

              {/* Status */}
              <div>
                <Select
                  label="Status"
                  value={editUser.status}
                  onChange={(value) => setEditUser({ ...editUser, status: value as UserStatus })}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Pending", value: "Pending" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={onSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
