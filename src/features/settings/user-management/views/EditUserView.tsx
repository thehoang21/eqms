import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { User } from "../types";
import { BUSINESS_UNIT_DEPARTMENTS, USER_MANAGEMENT_ROUTES } from "../constants";
import { IconSmartHome } from "@tabler/icons-react";

// Mock data - in real app, fetch by userId from API
const MOCK_USER: User = {
  id: "1",
  employeeId: "NTP.0001",
  fullName: "Admin Hệ Thống 1",
  username: "adminhethong",
  email: "admin@zenithquality.com",
  phone: "0911263575",
  role: "Admin",
  businessUnit: "Corporate",
  department: "IT Department",
  status: "Active",
  lastLogin: "2025-12-31 14:30",
  createdDate: "2024-01-15",
};

export const EditUserView: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { showToast } = useToast();

  // In real app: const user = fetchUserById(userId);
  const [editUser, setEditUser] = useState<User>(MOCK_USER);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formDepartments = useMemo(() => {
    return editUser.businessUnit ? BUSINESS_UNIT_DEPARTMENTS[editUser.businessUnit] || [] : [];
  }, [editUser.businessUnit]);

  const handleInputChange = (field: keyof User, value: string) => {
    setEditUser((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!editUser.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    if (!editUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
      errors.email = "Invalid email format";
    }

    if (!editUser.businessUnit) {
      errors.businessUnit = "Business Unit is required";
    }

    if (!editUser.department) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast({ type: "error", message: "Please fix all errors before saving" });
      return;
    }

    console.log("Updating user:", editUser);
    showToast({ type: "success", message: `User ${editUser.fullName} updated successfully` });
    navigate(USER_MANAGEMENT_ROUTES.LIST);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate(USER_MANAGEMENT_ROUTES.LIST);
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Edit User
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
              <IconSmartHome className="h-4 w-4" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden md:inline">Settings</span>
              <span className="md:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <button
                onClick={() => navigate(USER_MANAGEMENT_ROUTES.LIST)}
                className="hover:text-slate-700 transition-colors"
              >
                User Management
              </button>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">{editUser.employeeId}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="whitespace-nowrap gap-2 self-start md:self-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              size="sm"
              className="whitespace-nowrap gap-2 self-start md:self-auto"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
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
                  className="w-full h-11 px-4 border border-slate-200 rounded-md text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
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
                  className="w-full h-11 px-4 border border-slate-200 rounded-md text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
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
                  "w-full h-11 px-4 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
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
                    "w-full h-11 px-4 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
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
                    "w-full h-11 px-4 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
                    formErrors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                )}
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
                  options={Object.keys(BUSINESS_UNIT_DEPARTMENTS).map((bu) => ({
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
        </div>
      </div>

      {/* Modals */}
      <AlertModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        type="warning"
        title="Cancel Changes?"
        description="Are you sure you want to cancel? All unsaved changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="No, Continue Editing"
        showCancel={true}
      />
    </div>
  );
};
