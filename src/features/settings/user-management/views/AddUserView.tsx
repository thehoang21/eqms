import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { CredentialsModal } from "../components/CredentialsModal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { NewUser } from "../types";
import { BUSINESS_UNIT_DEPARTMENTS, USER_MANAGEMENT_ROUTES } from "../constants";
import { removeAccents, generateUsername, generatePassword } from "../utils";
import { IconSmartHome } from "@tabler/icons-react";

export const AddUserView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [newUser, setNewUser] = useState<NewUser>({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    role: "Viewer",
    businessUnit: "",
    department: "",
    status: "Active",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({ username: "", password: "" });

  const formDepartments = useMemo(() => {
    return newUser.businessUnit ? BUSINESS_UNIT_DEPARTMENTS[newUser.businessUnit] || [] : [];
  }, [newUser.businessUnit]);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!newUser.employeeId) {
      errors.employeeId = "Employee ID is required";
    } else if (newUser.employeeId.length !== 4) {
      errors.employeeId = "Employee ID must be 4 digits";
    }

    if (!newUser.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Invalid email format";
    }

    if (!newUser.businessUnit) {
      errors.businessUnit = "Business Unit is required";
    }

    if (!newUser.department) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedCredentials((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast({ type: "error", message: "Please fix all errors before submitting" });
      return;
    }

    const username = generateUsername(newUser.fullName, []);
    const password = generatePassword();
    
    setGeneratedCredentials({ username, password });
    setShowCredentialsModal(true);

    console.log("Creating user:", { ...newUser, username });
    
    showToast({ type: "success", message: `User ${newUser.fullName} created successfully` });
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate("/settings/user-management");
  };

  const handleCredentialsClose = () => {
    setShowCredentialsModal(false);
    navigate("/settings/user-management");
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              Add New User
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-slate-700 transition-colors hidden sm:inline"
              >
                Dashboard
              </button>
              <IconSmartHome className="h-4 w-4 sm:hidden" />
              <span className="text-slate-400 mx-1">/</span>
              <span className="hidden md:inline">Settings</span>
              <span className="md:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <button
                onClick={() => navigate(USER_MANAGEMENT_ROUTES.LIST)}
                className="hidden md:inline hover:text-slate-700 transition-colors"
              >
                User Management
              </button>
              <span className="md:hidden">...</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-slate-700 font-medium">Add User</span>
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
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              size="sm"
              className="whitespace-nowrap gap-2 self-start md:self-auto"
            >
              <Save className="h-4 w-4" />
              Create User
            </Button>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                    ...Object.keys(BUSINESS_UNIT_DEPARTMENTS).map(bu => ({ label: bu, value: bu }))
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
                  onChange={(value) => setNewUser({ ...newUser, role: value as any })}
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
                  onChange={(value) => setNewUser({ ...newUser, status: value as any })}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Pending", value: "Pending" },
                  ]}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-blue-800">
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
        </div>
      </div>

      {/* Modals */}
      <AlertModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        type="warning"
        title="Cancel User Creation?"
        description="Are you sure you want to cancel? All entered information will be lost."
        confirmText="Yes, Cancel"
        cancelText="No, Continue"
        showCancel={true}
      />

      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={handleCredentialsClose}
        employeeId={newUser.employeeId}
        username={generatedCredentials.username}
        password={generatedCredentials.password}
        onRegeneratePassword={handleRegeneratePassword}
      />
    </div>
  );
};
