import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  UserX,
  UserCheck,
  Home,
  KeyRound,
  Download,
} from "lucide-react";
import { IconKey, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { User, UserRole, UserStatus, TableColumn } from "./types";
import { BUSINESS_UNIT_DEPARTMENTS, DEFAULT_COLUMNS, getStatusColor, getRoleColor, USER_MANAGEMENT_ROUTES } from "./constants";
import { generatePassword } from "./utils";

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
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: "", userName: "" });
  const [statusModal, setStatusModal] = useState({ isOpen: false, userId: "", action: "" as "activate" | "deactivate" });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, userId: "", userName: "", password: "" });

  const itemsPerPage = 10;
  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
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

  const handleDropdownToggle = (userId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (openDropdownId === userId) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      
      // Menu dimensions
      const menuHeight = 200;
      const menuWidth = 180;
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
      setOpenDropdownId(userId);
    }
  };

  const handleEdit = (user: User) => {
    navigate(USER_MANAGEMENT_ROUTES.EDIT(user.id));
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

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-3 lg:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">User Management</h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <span className="hidden sm:inline">Dashboard</span>
            <Home className="h-3.5 w-3.5 sm:hidden" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Setting</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">User Management</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => {
              console.log("Export users data");
              showToast({
                type: "info",
                title: "Export",
                message: "User data export feature coming soon",
              });
            }}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => navigate(USER_MANAGEMENT_ROUTES.ADD)}
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, email..."
                className="w-full h-10 sm:h-11 pl-10 pr-4 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-20 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                          {user.email}
                        </div>
                      )}
                      {col.id === "phone" && (
                        <div className="flex items-center gap-2 text-slate-700">
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
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-10 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/80"
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
            {/* Menu */}
            <div
              className={cn(
                "fixed z-50 min-w-[180px] rounded-md border border-slate-200 bg-white shadow-xl",
                dropdownPosition.showAbove
                  ? "animate-in fade-in slide-in-from-bottom-2 duration-200"
                  : "animate-in fade-in slide-in-from-top-2 duration-200"
              )}
              style={{
                top: dropdownPosition.showAbove
                  ? `${dropdownPosition.top}px`
                  : `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none',
              }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleEdit(user);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <Edit className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Edit User</span>
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
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  {MOCK_USERS.find((u) => u.id === openDropdownId)?.status === "Active" ? (
                    <>
                      <UserX className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Deactivate</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Activate</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleResetPassword(user);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <KeyRound className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Reset Password</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleDelete(user);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <IconTrash className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Delete User</span>
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

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false, userId: "", userName: "", password: "" })}
        userName={resetPasswordModal.userName}
        password={resetPasswordModal.password}
        onRegeneratePassword={handleRegenerateResetPassword}
      />
    </div>
  );
};
