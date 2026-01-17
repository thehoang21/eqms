import React from "react";
import { Select } from "@/components/ui/select/Select";
import { FormModal } from "@/components/ui/modal/FormModal";
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
  
  // Hàm xử lý chung để giảm lặp code (DRY)
  const handleInputChange = (field: keyof User, value: string) => {
    setEditUser((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onSubmit}
      title="Edit User"
      description="Update user information"
      confirmText="Save Changes"
      cancelText="Cancel"
      size="2xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={editUser.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editUser.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
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
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+84..."
              className={cn(
                "w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                formErrors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
              )}
            />
          </div>
        </div>

        {/* Business Unit and Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Select
              label="Business Unit"
              value={editUser.businessUnit}
              onChange={(value) => {
                setEditUser({ ...editUser, businessUnit: value, department: "" });
                if (formErrors.businessUnit) setFormErrors({ ...formErrors, businessUnit: "" });
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

          <div>
            <Select
              label="Department"
              value={editUser.department}
              onChange={(value) => handleInputChange("department", value)}
              options={formDepartments.map((dept) => ({ label: dept, value: dept }))}
              placeholder="Select department"
              disabled={!editUser.businessUnit}
            />
            {formErrors.department && (
              <p className="text-xs text-red-600 mt-1">{formErrors.department}</p>
            )}
          </div>
        </div>

        {/* Role and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Role"
            value={editUser.role}
            onChange={(value) => handleInputChange("role", value)}
            options={[
              { label: "Admin", value: "Admin" },
              { label: "QA Manager", value: "QA Manager" },
              { label: "Document Owner", value: "Document Owner" },
              { label: "Reviewer", value: "Reviewer" },
              { label: "Approver", value: "Approver" },
              { label: "Viewer", value: "Viewer" },
            ]}
          />

          <Select
            label="Status"
            value={editUser.status}
            onChange={(value) => handleInputChange("status", value)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
              { label: "Pending", value: "Pending" },
            ]}
          />
        </div>
      </div>
    </FormModal>
  );
};