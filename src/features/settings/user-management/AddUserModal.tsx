import React from "react";
import { createPortal } from "react-dom";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { cn } from "@/components/ui/utils";

type UserRole = "Admin" | "QA Manager" | "Document Owner" | "Reviewer" | "Approver" | "Viewer";
type UserStatus = "Active" | "Inactive" | "Pending";

interface NewUser {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessUnit: string;
  department: string;
  status: UserStatus;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newUser: NewUser;
  setNewUser: React.Dispatch<React.SetStateAction<NewUser>>;
  formErrors: { [key: string]: string };
  setFormErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  formDepartments: string[];
  businessUnitDepartments: { [key: string]: string[] };
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New User</h2>
              <p className="text-sm text-slate-600 mt-0.5">Fill in the information to create a new user account</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    NTP.
                  </span>
                  <input
                    type="text"
                    value={newUser.employeeId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setNewUser({ ...newUser, employeeId: value });
                      setFormErrors({ ...formErrors, employeeId: "" });
                    }}
                    placeholder="0008"
                    maxLength={4}
                    className={cn(
                      "w-full h-11 pl-[50px] pr-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium",
                      formErrors.employeeId ? "border-red-300 bg-red-50" : "border-slate-200"
                    )}
                  />
                </div>
                {formErrors.employeeId && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.employeeId}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => {
                    setNewUser({ ...newUser, fullName: e.target.value });
                    setFormErrors({ ...formErrors, fullName: "" });
                  }}
                  placeholder="Nguyễn Thế Hoàng"
                  className={cn(
                    "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors",
                    formErrors.fullName ? "border-red-300 bg-red-50" : "border-slate-200"
                  )}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser({ ...newUser, email: e.target.value });
                    setFormErrors({ ...formErrors, email: "" });
                  }}
                  placeholder="john.doe@company.com"
                  className={cn(
                    "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors",
                    formErrors.email ? "border-red-300 bg-red-50" : "border-slate-200"
                  )}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => {
                    setNewUser({ ...newUser, phone: e.target.value });
                    setFormErrors({ ...formErrors, phone: "" });
                  }}
                  placeholder="+1-555-0123"
                  className={cn(
                    "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors",
                    formErrors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Business Unit */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Business Unit <span className="text-red-500">*</span>
                </label>
                <Select
                  label=""
                  value={newUser.businessUnit}
                  onChange={(value) => {
                    setNewUser({ ...newUser, businessUnit: value, department: "" });
                    setFormErrors({ ...formErrors, businessUnit: "", department: "" });
                  }}
                  options={[
                    { label: "Select Business Unit", value: "" },
                    ...Object.keys(businessUnitDepartments).map(bu => ({ label: bu, value: bu }))
                  ]}
                />
                {formErrors.businessUnit && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.businessUnit}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select
                  label=""
                  value={newUser.department}
                  onChange={(value) => {
                    setNewUser({ ...newUser, department: value });
                    setFormErrors({ ...formErrors, department: "" });
                  }}
                  options={[
                    { label: newUser.businessUnit ? "Select Department" : "Select Business Unit first", value: "" },
                    ...formDepartments.map(dept => ({ label: dept, value: dept }))
                  ]}
                  disabled={!newUser.businessUnit}
                />
                {formErrors.department && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.department}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <Select
                  label="Role"
                  value={newUser.role}
                  onChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
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
                  value={newUser.status}
                  onChange={(value) => setNewUser({ ...newUser, status: value as UserStatus })}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Pending", value: "Pending" },
                  ]}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">User Account Information</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• A temporary password will be sent to the user's email</li>
                    <li>• User must change password on first login</li>
                    <li>• Role determines access permissions in the system</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onSubmit}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
