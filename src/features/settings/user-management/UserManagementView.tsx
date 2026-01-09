import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  ChevronRight,
  Mail,
  Phone,
  Home,
  Key,
  KeyRound,
} from "lucide-react";
import { IconKey, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { AddUserModal } from "./AddUserModal";
import { CredentialsModal } from "./CredentialsModal";
import { EditUserModal } from "./EditUserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { User, UserRole, UserStatus, TableColumn, NewUser } from "./types";
import { BUSINESS_UNIT_DEPARTMENTS, DEFAULT_COLUMNS, getStatusColor, getRoleColor } from "./constants";
import { removeAccents, generateUsername, generatePassword, getNextEmployeeId } from "./utils";

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
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
  },
  {
    id: "2",
    employeeId: "NTP.0002",
    fullName: "Dr. Amanda Smith",
    username: "a.smith",
    email: "a.smith@zenithquality.com",
    phone: "+1-555-0123",
    role: "QA Manager",
    businessUnit: "Quality",
    department: "Quality Assurance",
    status: "Active",
    lastLogin: "2025-12-31 13:15",
    createdDate: "2024-02-20",
  },
  {
    id: "3",
    employeeId: "NTP.0003",
    fullName: "John Doe",
    username: "j.doe",
    email: "j.doe@zenithquality.com",
    phone: "+1-555-0124",
    role: "Document Owner",
    businessUnit: "Quality",
    department: "Quality Assurance",
    status: "Active",
    lastLogin: "2025-12-30 16:45",
    createdDate: "2024-03-10",
  },
  {
    id: "4",
    employeeId: "NTP.0004",
    fullName: "Jane Wilson",
    username: "j.wilson",
    email: "j.wilson@zenithquality.com",
    phone: "+1-555-0125",
    role: "Reviewer",
    businessUnit: "Quality",
    department: "Regulatory Affairs",
    status: "Active",
    lastLogin: "2025-12-31 10:20",
    createdDate: "2024-04-05",
  },
  {
    id: "5",
    employeeId: "NTP.0005",
    fullName: "Michael Brown",
    username: "m.brown",
    email: "m.brown@zenithquality.com",
    phone: "+1-555-0126",
    role: "Approver",
    businessUnit: "Quality",
    department: "Quality Assurance",
    status: "Inactive",
    lastLogin: "2025-12-20 09:30",
    createdDate: "2024-05-12",
  },
  {
    id: "6",
    employeeId: "NTP.0006",
    fullName: "Sarah Johnson",
    username: "s.johnson",
    email: "s.johnson@zenithquality.com",
    phone: "+1-555-0127",
    role: "Viewer",
    businessUnit: "Operations",
    department: "Production",
    status: "Active",
    lastLogin: "2025-12-31 12:00",
    createdDate: "2024-06-18",
  },
  {
    id: "7",
    employeeId: "NTP.0007",
    fullName: "Robert Taylor",
    username: "r.taylor",
    email: "r.taylor@zenithquality.com",
    phone: "+1-555-0128",
    role: "Document Owner",
    businessUnit: "Research",
    department: "R&D",
    status: "Pending",
    lastLogin: "Never",
    createdDate: "2025-12-30",
  },
];

// --- Main Component ---

export const UserManagementView: React.FC = () => {
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: "", userName: "" });
  const [statusModal, setStatusModal] = useState({ isOpen: false, userId: "", action: "" as "activate" | "deactivate" });
  const [addUserModal, setAddUserModal] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState({ isOpen: false, employeeId: "", username: "", password: "" });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, userId: "", userName: "", password: "" });
  const [editUserModal, setEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState<User>({
    id: "",
    employeeId: "",
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "Viewer",
    businessUnit: "",
    department: "",
    status: "Active",
    lastLogin: "",
    createdDate: "",
  });
  const [newUser, setNewUser] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    role: "Viewer" as UserRole,
    businessUnit: "",
    department: "",
    status: "Active" as UserStatus,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const itemsPerPage = 10;
  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Handle password regeneration
  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setCredentialsModal({ ...credentialsModal, password: newPassword });
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      const matchesBusinessUnit = businessUnitFilter === "All" || user.businessUnit === businessUnitFilter;
      const matchesDepartment = departmentFilter === "All" || user.department === departmentFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesBusinessUnit && matchesDepartment;
    });
  }, [searchQuery, roleFilter, statusFilter, businessUnitFilter, departmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible).sort((a, b) => a.order - b.order),
    [columns]
  );

  // Get available departments based on business unit filter
  const availableDepartments = useMemo(() => {
    if (businessUnitFilter === "All") {
      const depts = new Set(MOCK_USERS.map((u) => u.department));
      return ["All", ...Array.from(depts)];
    }
    return ["All", ...(BUSINESS_UNIT_DEPARTMENTS[businessUnitFilter] || [])];
  }, [businessUnitFilter]);

  // Get available departments for Add User form
  const formDepartments = useMemo(() => {
    if (!newUser.businessUnit) {
      return [];
    }
    return BUSINESS_UNIT_DEPARTMENTS[newUser.businessUnit] || [];
  }, [newUser.businessUnit]);

  // Get available departments for Edit User form
  const editFormDepartments = useMemo(() => {
    if (!editUser.businessUnit) {
      return [];
    }
    return BUSINESS_UNIT_DEPARTMENTS[editUser.businessUnit] || [];
  }, [editUser.businessUnit]);

  const handleDropdownToggle = (userId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === userId) {
      setOpenDropdownId(null);
      return;
    }
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 200,
    });
    setOpenDropdownId(userId);
  };

  const handleEdit = (user: User) => {
    setEditUser({ ...user });
    setFormErrors({});
    setEditUserModal(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (user: User) => {
    setDeleteModal({ isOpen: true, userId: user.id, userName: user.fullName });
    setOpenDropdownId(null);
  };

  const handleStatusChange = (user: User, action: "activate" | "deactivate") => {
    setStatusModal({ isOpen: true, userId: user.id, action });
    setOpenDropdownId(null);
  };

  const handleResetPassword = (user: User) => {
    const newPassword = generatePassword();
    setResetPasswordModal({ isOpen: true, userId: user.id, userName: user.fullName, password: newPassword });
    setOpenDropdownId(null);
  };

  const handleRegenerateResetPassword = () => {
    const newPassword = generatePassword();
    setResetPasswordModal({ ...resetPasswordModal, password: newPassword });
  };

  const confirmDelete = () => {
    console.log("Delete user:", deleteModal.userId);
    // TODO: Call API to delete user
    // API call would be: await deleteUser(deleteModal.userId);
    
    showToast({
      type: "success",
      title: "User Deleted",
      message: `${deleteModal.userName} has been successfully deleted`,
    });
    
    setDeleteModal({ isOpen: false, userId: "", userName: "" });
  };

  const confirmStatusChange = () => {
    console.log(`${statusModal.action} user:`, statusModal.userId);
    // TODO: Call API to change status
    // API call would be: await updateUserStatus(statusModal.userId, statusModal.action);
    
    const actionText = statusModal.action === "activate" ? "activated" : "deactivated";
    const user = MOCK_USERS.find(u => u.id === statusModal.userId);
    
    showToast({
      type: "success",
      title: `User ${statusModal.action === "activate" ? "Activated" : "Deactivated"}`,
      message: `${user?.fullName || "User"} has been ${actionText}`,
    });
    
    setStatusModal({ isOpen: false, userId: "", action: "activate" });
  };

  const handleAddUser = () => {
    // Auto-generate next employee ID
    const nextId = getNextEmployeeId(MOCK_USERS);
    
    setNewUser({
      employeeId: nextId,
      fullName: "",
      email: "",
      phone: "",
      role: "Viewer",
      businessUnit: "",
      department: "",
      status: "Active",
    });
    setFormErrors({});
    setAddUserModal(true);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!newUser.employeeId.trim()) {
      errors.employeeId = "Employee ID is required";
    } else if (!/^\d{4}$/.test(newUser.employeeId)) {
      errors.employeeId = "Employee ID must be 4 digits";
    } else if (MOCK_USERS.some(u => u.employeeId === `NTP.${newUser.employeeId}`)) {
      errors.employeeId = "Employee ID already exists";
    }

    if (!newUser.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Invalid email format";
    } else if (MOCK_USERS.some(u => u.email === newUser.email)) {
      errors.email = "Email already exists";
    }

    if (!newUser.businessUnit.trim()) {
      errors.businessUnit = "Business unit is required";
    }

    if (!newUser.department.trim()) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!editUser.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!editUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
      errors.email = "Invalid email format";
    } else if (MOCK_USERS.some(u => u.email === editUser.email && u.id !== editUser.id)) {
      errors.email = "Email already exists";
    }

    if (!editUser.businessUnit.trim()) {
      errors.businessUnit = "Business unit is required";
    }

    if (!editUser.department.trim()) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitNewUser = () => {
    if (!validateForm()) {
      return;
    }

    // Generate username and password
    const existingUsernames = MOCK_USERS.map(u => u.username);
    const generatedUsername = generateUsername(newUser.fullName, existingUsernames);
    const generatedPassword = generatePassword();

    const newUserData: User = {
      id: `${MOCK_USERS.length + 1}`,
      ...newUser,
      employeeId: `NTP.${newUser.employeeId}`,
      username: generatedUsername,
      lastLogin: "Never",
      createdDate: new Date().toISOString().split('T')[0],
    };

    console.log("Creating new user:", newUserData);
    console.log("Generated credentials:", { username: generatedUsername, password: generatedPassword });
    // TODO: Call API to create user with password
    // MOCK_USERS.push(newUserData); // This would work for local testing

    setAddUserModal(false);
    setCredentialsModal({ isOpen: true, employeeId: `NTP.${newUser.employeeId}`, username: generatedUsername, password: generatedPassword });
    
    // Reset form - keep next ID ready
    const maxId = MOCK_USERS.reduce((max, user) => {
      const numPart = parseInt(user.employeeId.split('.')[1] || '0');
      return Math.max(max, numPart);
    }, 0);
    const nextId = (maxId + 1).toString().padStart(4, '0');
    
    setNewUser({
      employeeId: nextId,
      fullName: "",
      email: "",
      phone: "",
      role: "Viewer",
      businessUnit: "",
      department: "",
      status: "Active",
    });
    setFormErrors({});
  };

  const handleSubmitEditUser = () => {
    if (!validateEditForm()) {
      return;
    }

    console.log("Updating user:", editUser);
    // TODO: Call API to update user
    // API call would be: await updateUser(editUser.id, editUser);
    
    showToast({
      type: "success",
      title: "User Updated",
      message: `${editUser.fullName}'s information has been updated`,
    });

    setEditUserModal(false);
    setFormErrors({});
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-4 w-4 sm:hidden" />
            <ChevronRight className="h-4 w-4" />
            <span className="hidden sm:inline">Setting</span>
            <span className="sm:hidden">...</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700 font-medium">User Management</span>
          </div>
        </div>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleAddUser}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, email..."
                className="w-full h-11 pl-10 pr-4 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="xl:col-span-2">
            <Select
              label="Role"
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as UserRole | "All")}
              options={[
                { label: "All Roles", value: "All" },
                { label: "Admin", value: "Admin" },
                { label: "QA Manager", value: "QA Manager" },
                { label: "Document Owner", value: "Document Owner" },
                { label: "Reviewer", value: "Reviewer" },
                { label: "Approver", value: "Approver" },
                { label: "Viewer", value: "Viewer" },
              ]}
            />
          </div>

          {/* Status Filter */}
          <div className="xl:col-span-2">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as UserStatus | "All")}
              options={[
                { label: "All Status", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </div>

          {/* Business Unit Filter */}
          <div className="xl:col-span-2">
            <Select
              label="Business Unit"
              value={businessUnitFilter}
              onChange={(value) => {
                setBusinessUnitFilter(value);
                setDepartmentFilter("All"); // Reset department when business unit changes
              }}
              options={[
                { label: "All Units", value: "All" },
                ...Object.keys(BUSINESS_UNIT_DEPARTMENTS).map(bu => ({ label: bu, value: bu }))
              ]}
            />
          </div>

          {/* Department Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={availableDepartments.map((dept) => ({ label: dept, value: dept }))}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="py-3.5 px-4 text-sm whitespace-nowrap">
                      {col.id === "no" && (
                        <span className="font-medium text-slate-900">{startIndex + index + 1}</span>
                      )}
                      {col.id === "status" && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            getStatusColor(user.status)
                          )}
                        >
                          {user.status}
                        </span>
                      )}
                      {col.id === "role" && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            getRoleColor(user.role)
                          )}
                        >
                          {user.role}
                        </span>
                      )}
                      {col.id === "email" && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {user.email}
                        </div>
                      )}
                      {col.id === "phone" && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                      {col.id === "fullName" && (
                        <span className="font-medium text-slate-900">{user.fullName}</span>
                      )}
                      {col.id === "employeeId" && (
                        <span className="font-medium text-emerald-600">{user.employeeId}</span>
                      )}
                      {!["status", "role", "email", "phone", "fullName", "employeeId", "no"].includes(col.id) && (
                        <span className="text-slate-700">{user[col.id as keyof User]}</span>
                      )}
                    </td>
                  ))}
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      ref={getButtonRef(user.id)}
                      onClick={(e) => handleDropdownToggle(user.id, e)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>
              Showing <span className="font-medium text-slate-900">{filteredUsers.length === 0 ? 0 : startIndex + 1}</span> to{" "}
              <span className="font-medium text-slate-900">{Math.min(endIndex, filteredUsers.length)}</span> of{" "}
              <span className="font-medium text-slate-900">{filteredUsers.length}</span> results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {openDropdownId &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 animate-in fade-in duration-150"
              onClick={() => setOpenDropdownId(null)}
              aria-hidden="true"
            />
            <div
              className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleEdit(user);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit className="h-4 w-4 text-slate-500" />
                  <span>Edit User</span>
                </button>
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user && user.status === "Active") {
                      handleStatusChange(user, "deactivate");
                    } else if (user) {
                      handleStatusChange(user, "activate");
                    }
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {MOCK_USERS.find((u) => u.id === openDropdownId)?.status === "Active" ? (
                    <>
                      <UserX className="h-4 w-4 text-slate-500" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 text-slate-500" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleResetPassword(user);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <KeyRound className="h-4 w-4 text-slate-500" />
                  <span>Reset Password</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleDelete(user);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <IconTrash className="h-4 w-4" />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: "", userName: "" })}
        onConfirm={confirmDelete}
        type="error"
        title="Delete User"
        description={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
      />

      {/* Status Change Modal */}
      <AlertModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, userId: "", action: "activate" })}
        onConfirm={confirmStatusChange}
        type="warning"
        title={statusModal.action === "activate" ? "Activate User" : "Deactivate User"}
        description={`Are you sure you want to ${statusModal.action} this user?`}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={addUserModal}
        onClose={() => setAddUserModal(false)}
        onSubmit={handleSubmitNewUser}
        newUser={newUser}
        setNewUser={setNewUser}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        formDepartments={formDepartments}
        businessUnitDepartments={BUSINESS_UNIT_DEPARTMENTS}
      />

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false, employeeId: "", username: "", password: "" })}
        employeeId={credentialsModal.employeeId}
        username={credentialsModal.username}
        password={credentialsModal.password}
        onRegeneratePassword={handleRegeneratePassword}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, userId: "", userName: "", password: "" })}
        userName={resetPasswordModal.userName}
        password={resetPasswordModal.password}
        onRegeneratePassword={handleRegenerateResetPassword}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editUserModal}
        onClose={() => {
          setEditUserModal(false);
          setFormErrors({});
        }}
        onSubmit={handleSubmitEditUser}
        editUser={editUser}
        setEditUser={setEditUser}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        formDepartments={editFormDepartments}
        businessUnitDepartments={BUSINESS_UNIT_DEPARTMENTS}
      />
    </div>
  );
};
