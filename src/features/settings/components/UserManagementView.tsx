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
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ChevronDown,
  Shield,
  Mail,
  Phone,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { cn } from "@/components/ui/utils";

// --- Types ---

type UserRole = "Admin" | "QA Manager" | "Document Owner" | "Reviewer" | "Approver" | "Viewer";
type UserStatus = "Active" | "Inactive" | "Pending";

interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

interface User {
  id: string;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  createdDate: string;
}

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
    id: "1",
    employeeId: "EMP-2025-001",
    fullName: "Admin Hệ Thống 1",
    username: "adminhethong",
    email: "admin@zenithquality.com",
    phone: "0911263575",
    role: "Admin",
    department: "IT Department",
    status: "Active",
    lastLogin: "2025-12-31 14:30",
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    employeeId: "EMP-2025-002",
    fullName: "Dr. Amanda Smith",
    username: "a.smith",
    email: "a.smith@zenithquality.com",
    phone: "+1-555-0123",
    role: "QA Manager",
    department: "Quality Assurance",
    status: "Active",
    lastLogin: "2025-12-31 13:15",
    createdDate: "2024-02-20",
  },
  {
    id: "3",
    employeeId: "EMP-2025-003",
    fullName: "John Doe",
    username: "j.doe",
    email: "j.doe@zenithquality.com",
    phone: "+1-555-0124",
    role: "Document Owner",
    department: "Quality Assurance",
    status: "Active",
    lastLogin: "2025-12-30 16:45",
    createdDate: "2024-03-10",
  },
  {
    id: "4",
    employeeId: "EMP-2025-004",
    fullName: "Jane Wilson",
    username: "j.wilson",
    email: "j.wilson@zenithquality.com",
    phone: "+1-555-0125",
    role: "Reviewer",
    department: "Regulatory Affairs",
    status: "Active",
    lastLogin: "2025-12-31 10:20",
    createdDate: "2024-04-05",
  },
  {
    id: "5",
    employeeId: "EMP-2025-005",
    fullName: "Michael Brown",
    username: "m.brown",
    email: "m.brown@zenithquality.com",
    phone: "+1-555-0126",
    role: "Approver",
    department: "Quality Assurance",
    status: "Inactive",
    lastLogin: "2025-12-20 09:30",
    createdDate: "2024-05-12",
  },
  {
    id: "6",
    employeeId: "EMP-2025-006",
    fullName: "Sarah Johnson",
    username: "s.johnson",
    email: "s.johnson@zenithquality.com",
    phone: "+1-555-0127",
    role: "Viewer",
    department: "Production",
    status: "Active",
    lastLogin: "2025-12-31 12:00",
    createdDate: "2024-06-18",
  },
  {
    id: "7",
    employeeId: "EMP-2025-007",
    fullName: "Robert Taylor",
    username: "r.taylor",
    email: "r.taylor@zenithquality.com",
    phone: "+1-555-0128",
    role: "Document Owner",
    department: "R&D",
    status: "Pending",
    lastLogin: "Never",
    createdDate: "2025-12-30",
  },
];

const DEFAULT_COLUMNS: TableColumn[] = [
  { id: "no", label: "No.", visible: true, order: 0, locked: true },
  { id: "employeeId", label: "Employee ID", visible: true, order: 1, locked: true },
  { id: "fullName", label: "Full Name", visible: true, order: 2, locked: true },
  { id: "username", label: "Username", visible: true, order: 3 },
  { id: "email", label: "Email", visible: true, order: 4 },
  { id: "phone", label: "Phone", visible: true, order: 5 },
  { id: "role", label: "Role", visible: true, order: 6 },
  { id: "department", label: "Department", visible: true, order: 7 },
  { id: "status", label: "Status", visible: true, order: 8 },
  { id: "lastLogin", label: "Last Login", visible: true, order: 9 },
  { id: "createdDate", label: "Created Date", visible: false, order: 10 },
];

// --- Helper Functions ---

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Inactive":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case "Admin":
      return "bg-red-50 text-red-700 border-red-200";
    case "QA Manager":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Document Owner":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Reviewer":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Approver":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Viewer":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

// --- Main Component ---

export const UserManagementView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<TableColumn[]>([...DEFAULT_COLUMNS]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: "", userName: "" });
  const [statusModal, setStatusModal] = useState({ isOpen: false, userId: "", action: "" as "activate" | "deactivate" });

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
      const matchesDepartment = departmentFilter === "All" || user.department === departmentFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, roleFilter, statusFilter, departmentFilter]);

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

  // Unique departments
  const departments = useMemo(() => {
    const depts = new Set(MOCK_USERS.map((u) => u.department));
    return ["All", ...Array.from(depts)];
  }, []);

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
    console.log("Edit user:", user);
    setOpenDropdownId(null);
    // TODO: Open edit modal
  };

  const handleDelete = (user: User) => {
    setDeleteModal({ isOpen: true, userId: user.id, userName: user.fullName });
    setOpenDropdownId(null);
  };

  const handleStatusChange = (user: User, action: "activate" | "deactivate") => {
    setStatusModal({ isOpen: true, userId: user.id, action });
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    console.log("Delete user:", deleteModal.userId);
    setDeleteModal({ isOpen: false, userId: "", userName: "" });
    // TODO: Call API to delete user
  };

  const confirmStatusChange = () => {
    console.log(`${statusModal.action} user:`, statusModal.userId);
    setStatusModal({ isOpen: false, userId: "", action: "activate" });
    // TODO: Call API to change status
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
          onClick={() => console.log("Add new user")}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-4">
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
          <div className="xl:col-span-3">
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

          {/* Department Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={departments.map((dept) => ({ label: dept, value: dept }))}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className="py-3.5 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap text-left"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                          <Shield className="h-3.5 w-3.5" />
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
                        <span className="font-mono text-xs text-slate-600">{user.employeeId}</span>
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
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    const user = MOCK_USERS.find((u) => u.id === openDropdownId);
                    if (user) handleDelete(user);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
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
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
      />

      {/* Status Change Modal */}
      <AlertModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, userId: "", action: "activate" })}
        onConfirm={confirmStatusChange}
        type="warning"
        title={statusModal.action === "activate" ? "Activate User" : "Deactivate User"}
        message={`Are you sure you want to ${statusModal.action} this user?`}
      />
    </div>
  );
};
