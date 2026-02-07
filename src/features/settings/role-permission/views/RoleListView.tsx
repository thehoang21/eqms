import React, { useState, useMemo, useRef, createRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical, Users, Lock } from "lucide-react";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { IconSmartHome } from "@tabler/icons-react";
import { Role } from "../types";
import { MOCK_ROLES, PERMISSION_GROUPS } from "../constants";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number; showAbove?: boolean };
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  position,
  onView,
  onEdit,
  onDelete,
  canDelete,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: IconEye,
      label: "View Role",
      onClick: onView,
      color: "text-slate-500",
    },
    {
      icon: IconEdit,
      label: "Edit Role",
      onClick: onEdit,
      color: "text-slate-500",
    },
    {
      icon: IconTrash,
      label: "Delete Role",
      onClick: onDelete,
      color: canDelete ? "text-red-600" : "text-slate-300",
      disabled: !canDelete,
    },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: position.showAbove ? 'translateY(-100%)' : 'none'
        }}
      >
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.disabled) {
                    item.onClick();
                    onClose();
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  item.color
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>,
    window.document.body
  );
};

export const RoleListView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  
  // Calculate total permissions
  const totalPermissions = useMemo(
    () => PERMISSION_GROUPS.reduce((sum, group) => sum + group.permissions.length, 0),
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string>("");

  const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement | null> }>({});

  const getButtonRef = (id: string) => {
    if (!buttonRefs.current[id]) {
      buttonRefs.current[id] = createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[id];
  };

  // Filtered data
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        searchQuery === "" ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [roles, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // Handlers
  const handleViewRole = (id: string) => {
    navigate(`/settings/role-permission/${id}`);
  };

  const handleEditRole = (id: string) => {
    navigate(`/settings/role-permission/${id}/edit`);
  };

  const handleNewRole = () => {
    navigate("/settings/role-permission/new");
  };

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    // Menu dimensions (estimate max)
    const menuHeight = 200;
    const menuWidth = 200;
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
    setOpenDropdownId(id);
  };

  const openDeleteModal = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;
    if (role.type === "system") {
      showToast({
        type: "error",
        title: "Protected role",
        message: "System roles cannot be deleted",
      });
      return;
    }
    setDeleteRoleId(roleId);
    setIsDeleteOpen(true);
  };

  const handleDeleteRole = () => {
    const role = roles.find((r) => r.id === deleteRoleId);
    if (!role) {
      setIsDeleteOpen(false);
      return;
    }
    if (role.type === "system") {
      setIsDeleteOpen(false);
      showToast({
        type: "error",
        title: "Protected role",
        message: "System roles cannot be deleted",
      });
      return;
    }

    const updated = roles.filter((r) => r.id !== deleteRoleId);
    setRoles(updated);
    setIsDeleteOpen(false);
    showToast({
      type: "success",
      title: "Role deleted",
      message: `${role.name} has been removed`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Role & Permissions
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Role & Permissions</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button size="sm" className="whitespace-nowrap gap-2" onClick={handleNewRole}>
            <Plus className="h-4 w-4" />
            New Role
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-6 w-full">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by role name, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 h-10 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        {paginatedRoles.length > 0 ? (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      No.
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Role Name
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Description
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Users
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Permissions
                    </th>
                    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedRoles.map((role, index) => (
                    <tr
                      key={role.id}
                      onClick={() => handleViewRole(role.id)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className="font-medium text-emerald-600">{role.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-700 max-w-md">
                        <span className="line-clamp-2">{role.description}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            role.type === "custom"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          )}
                        >
                          {role.type === "system" ? "System" : "Custom"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">{role.userCount}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">
                            {role.permissions.length}
                            <span className="text-slate-400 mx-0.5">/</span>
                            {totalPermissions}
                          </span>
                        </div>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          ref={getButtonRef(role.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(role.id, e);
                          }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                          aria-label="More actions"
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
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredRoles.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        ) : (
          <TableEmptyState
            title="No roles found"
            description="Try adjusting your search criteria"
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {openDropdownId && (
        <DropdownMenu
          isOpen={!!openDropdownId}
          onClose={() => setOpenDropdownId(null)}
          position={dropdownPosition}
          onView={() => handleViewRole(openDropdownId)}
          onEdit={() => handleEditRole(openDropdownId)}
          onDelete={() => openDeleteModal(openDropdownId)}
          canDelete={roles.find((r) => r.id === openDropdownId)?.type !== "system"}
        />
      )}

      {/* Delete Role Confirm */}
      <AlertModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteRole}
        type="warning"
        title="Delete Role"
        confirmText="Delete"
        showCancel
        description={
          <div className="text-sm text-slate-600">
            Are you sure you want to delete this role? This action cannot be undone.
          </div>
        }
      />
    </div>
  );
};
