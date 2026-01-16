import React, { useState, useMemo } from "react";
import { 
  ChevronRight, Home, Plus, Save, Search, Shield, AlertCircle, Users, Lock, CheckCircle2,
  FileText, GraduationCap, AlertTriangle, GitPullRequest, Repeat, History, Settings, Eye,
  FilePlus, Edit3, Trash2, CheckCircle, Archive, Download, UserPlus, XCircle, ChevronDown, ChevronUp, Filter,
  ShieldAlert, Truck, Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/components/ui/utils";
import { Role, PermissionGroup } from "./types";
import { MOCK_ROLES, PERMISSION_GROUPS, getActionColor, isALCOAPlusRequired } from "./constants";
import { IconX } from "@tabler/icons-react";
import { RoleFormModal } from "./RoleFormModal";

export const RolePermissionView: React.FC = () => {
  const { showToast } = useToast();
  
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(MOCK_ROLES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(PERMISSION_GROUPS.map(g => g.id)));
  const [permissionSearch, setPermissionSearch] = useState("");
  const [actionFilters, setActionFilters] = useState<Set<string>>(new Set());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formRoleId, setFormRoleId] = useState<string>("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBaseRoleId, setFormBaseRoleId] = useState<string | "">("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({ name: "" });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string>("");
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isRoleSwitchConfirmOpen, setIsRoleSwitchConfirmOpen] = useState(false);
  const [pendingRoleId, setPendingRoleId] = useState<string>("");

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId),
    [roles, selectedRoleId]
  );

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, searchQuery]);

  const handleRoleSelect = (roleId: string) => {
    if (hasUnsavedChanges) {
      setPendingRoleId(roleId);
      setIsRoleSwitchConfirmOpen(true);
      return;
    }
    setSelectedRoleId(roleId);
    const role = roles.find(r => r.id === roleId);
    setOriginalPermissions(role?.permissions || []);
  };

  const confirmRoleSwitch = () => {
    setHasUnsavedChanges(false);
    setSelectedRoleId(pendingRoleId);
    const role = roles.find(r => r.id === pendingRoleId);
    setOriginalPermissions(role?.permissions || []);
    setIsRoleSwitchConfirmOpen(false);
    setPendingRoleId("");
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return;

    const updatedRoles = roles.map((role) => {
      if (role.id === selectedRoleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const newPermissions = hasPermission
          ? role.permissions.filter((p) => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);
    setHasUnsavedChanges(true);
  };

  const handleSelectAll = (group: PermissionGroup, checked: boolean) => {
    if (!selectedRole) return;

    const groupPermissionIds = group.permissions.map(p => p.id);
    const updatedRoles = roles.map((role) => {
      if (role.id === selectedRoleId) {
        let newPermissions = [...role.permissions];
        
        if (checked) {
          // Add all permissions from group
          groupPermissionIds.forEach(id => {
            if (!newPermissions.includes(id)) {
              newPermissions.push(id);
            }
          });
        } else {
          // Remove all permissions from group
          newPermissions = newPermissions.filter(p => !groupPermissionIds.includes(p));
        }
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    if (!selectedRole) return;

    console.log("Saving permissions for role:", selectedRole.name);
    console.log("Permissions:", selectedRole.permissions);
    
    // TODO: Call API to save permissions
    // API call would be: await updateRolePermissions(selectedRole.id, selectedRole.permissions);
    
    showToast({
      type: "success",
      title: "Permissions Saved",
      message: `Permissions for ${selectedRole.name} have been updated`,
    });

    setHasUnsavedChanges(false);
    setOriginalPermissions(selectedRole.permissions);
  };

  const handleDiscardChanges = () => {
    if (!selectedRole) return;

    const updatedRoles = roles.map((role) => {
      if (role.id === selectedRoleId) {
        return { ...role, permissions: originalPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);
    setHasUnsavedChanges(false);
    
    showToast({
      type: "info",
      title: "Changes Discarded",
      message: "Permissions have been reset to the last saved state",
    });
  };

  const getGroupPermissionCount = (group: PermissionGroup) => {
    if (!selectedRole) return { selected: 0, total: group.permissions.length };
    
    const selected = group.permissions.filter(p => 
      selectedRole.permissions.includes(p.id)
    ).length;
    
    return { selected, total: group.permissions.length };
  };

  const getTotalPermissionCount = () => {
    if (!selectedRole) return { selected: 0, total: 0 };
    
    const total = PERMISSION_GROUPS.reduce((sum, g) => sum + g.permissions.length, 0);
    return { selected: selectedRole.permissions.length, total };
  };

  const permissionCount = getTotalPermissionCount();

  const getModuleIcon = (moduleId: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      documents: FileText,
      training: GraduationCap,
      capa: AlertTriangle,
      change_control: GitPullRequest,
      deviations: Repeat,
      audit_trail: History,
      user_management: Users,
      settings: Settings,
      risk_management: ShieldAlert,
      supplier_quality: Truck,
      equipment: Wrench,
    };
    return iconMap[moduleId] || Shield;
  };

  const getActionIcon = (action: string): React.ComponentType<any> => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      view: Eye,
      create: FilePlus,
      edit: Edit3,
      delete: Trash2,
      approve: CheckCircle,
      review: CheckCircle2,
      archive: Archive,
      export: Download,
      assign: UserPlus,
      close: XCircle,
    };
    return iconMap[action] || Eye;
  };

  const ACTIONS = [
    "view",
    "create",
    "edit",
    "delete",
    "approve",
    "review",
    "archive",
    "export",
    "assign",
    "close",
  ];
  const toggleActionFilter = (action: string) => {
    setActionFilters(prev => {
      const next = new Set(prev);
      if (next.has(action)) next.delete(action); else next.add(action);
      return next;
    });
  };

  const clearPermissionFilters = () => {
    setPermissionSearch("");
    setActionFilters(new Set());
  };

  const expandAll = () => setExpandedGroups(new Set(PERMISSION_GROUPS.map(g => g.id)));
  const collapseAll = () => setExpandedGroups(new Set());
  const areAllExpanded = expandedGroups.size === PERMISSION_GROUPS.length;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId); else next.add(groupId);
      return next;
    });
  };

  const openCreateModal = () => {
    setFormMode("create");
    setFormRoleId("");
    setFormName("");
    setFormDescription("");
    setFormBaseRoleId("");
    setFormIsActive(true);
    setFormErrors({ name: "" });
    setIsFormModalOpen(true);
  };

  const validateFormName = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Role name is required";
    }
    if (trimmed.length < 3) {
      return "Role name must be at least 3 characters";
    }
    // Skip duplicate check for edit mode with same name
    const isDuplicate = roles.some(r => {
      if (formMode === "edit" && r.id === formRoleId) return false;
      return r.name.toLowerCase() === trimmed.toLowerCase();
    });
    if (isDuplicate) {
      return "A role with this name already exists";
    }
    return "";
  };

  const handleFormNameChange = (value: string) => {
    setFormName(value);
    const error = validateFormName(value);
    setFormErrors({ name: error });
  };

  const createRoleColorPalette = [
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-slate-50 text-slate-700 border-slate-200",
    "bg-red-50 text-red-700 border-red-200",
  ];

  const handleFormSubmit = () => {
    const nameError = validateFormName(formName);
    
    if (nameError) {
      setFormErrors({ name: nameError });
      return;
    }

    const trimmed = formName.trim();
    const date = new Date().toISOString().slice(0, 10);

    if (formMode === "create") {
      const newId = String(Date.now());
      const baseRole = roles.find(r => r.id === formBaseRoleId);
      const permissions = baseRole ? [...baseRole.permissions] : [];
      const color = createRoleColorPalette[roles.length % createRoleColorPalette.length];

      const newRole: Role = {
        id: newId,
        name: trimmed,
        description: formDescription.trim(),
        type: "custom",
        isActive: formIsActive,
        userCount: 0,
        color,
        createdDate: date,
        modifiedDate: date,
        permissions,
      };

      setRoles(prev => [newRole, ...prev]);
      setSelectedRoleId(newId);
      setIsFormModalOpen(false);
      showToast({ type: "success", title: "Role created", message: `${trimmed} has been added` });
    } else {
      // Edit mode
      const baseRole = roles.find(r => r.id === formBaseRoleId);
      const currentRole = roles.find(r => r.id === formRoleId);
      
      setRoles(prev => prev.map(r => r.id === formRoleId ? {
        ...r,
        name: trimmed,
        description: formDescription.trim(),
        isActive: formIsActive,
        modifiedDate: date,
        // Update permissions if base role changed
        permissions: formBaseRoleId && baseRole ? [...baseRole.permissions] : r.permissions,
      } : r));

      setIsFormModalOpen(false);
      showToast({ type: "success", title: "Role updated", message: `${trimmed} has been saved` });
    }
  };

  const openEditModal = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    setFormMode("edit");
    setFormRoleId(role.id);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormBaseRoleId("");
    setFormIsActive(role.isActive);
    setFormErrors({ name: "" });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    if (role.type === "system") {
      showToast({ type: "error", title: "Protected role", message: "System roles cannot be deleted" });
      return;
    }
    setDeleteRoleId(roleId);
    setIsDeleteOpen(true);
  };

  const handleDeleteRole = () => {
    const role = roles.find(r => r.id === deleteRoleId);
    if (!role) { setIsDeleteOpen(false); return; }
    if (role.type === "system") {
      setIsDeleteOpen(false);
      showToast({ type: "error", title: "Protected role", message: "System roles cannot be deleted" });
      return;
    }

    const updated = roles.filter(r => r.id !== deleteRoleId);
    setRoles(updated);
    if (selectedRoleId === deleteRoleId) {
      setSelectedRoleId(updated[0]?.id || "");
    }
    setIsDeleteOpen(false);
    showToast({ type: "success", title: "Role deleted", message: `${role.name} has been removed` });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Role & Permissions</h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
            <Home className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Role & Permissions</span>
          </div>
        </div>
        <Button size="sm" className="whitespace-nowrap gap-2" onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          New Role
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Panel - Role List */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles..."
                  className="w-full h-10 pl-10 pr-4 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Role List */}
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={cn(
                    "w-full p-4 border-b border-slate-100 transition-all cursor-pointer group",
                    "hover:bg-slate-50 active:bg-slate-100",
                    selectedRoleId === role.id
                      ? "bg-emerald-50/80 border-l-4 border-l-emerald-600"
                      : "border-l-4 border-l-transparent"
                  )}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className={cn(
                      "font-semibold text-sm leading-tight flex-1",
                      selectedRoleId === role.id ? "text-emerald-900" : "text-slate-900"
                    )}>
                      {role.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                        role.type === "custom"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      )}>
                        {role.type === "system" ? "System" : "Custom"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Stats & Actions Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-medium">{role.userCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" />
                        <span className="font-medium">{role.permissions.length}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => openEditModal(role.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-200 transition-colors"
                        aria-label="Edit role"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-600" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(role.id)}
                        disabled={role.type === "system"}
                        className={cn(
                          "inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors",
                          role.type === "system"
                            ? "cursor-not-allowed opacity-30"
                            : "hover:bg-red-50"
                        )}
                        aria-label="Delete role"
                        title={role.type === "system" ? "System role cannot be deleted" : "Delete role"}
                      >
                        <Trash2 className={cn(
                          "h-3.5 w-3.5",
                          role.type === "system" ? "text-slate-300" : "text-red-600"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

                {/* Right Panel - Permission Matrix */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedRole?.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{selectedRole?.description || "Manage permissions and access levels for this role"}</p>
              </div>
              <div className="flex items-center gap-3 md:shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDiscardConfirmOpen(true)}
                  disabled={!hasUnsavedChanges}
                  className="text-slate-600 hover:text-slate-900 flex-1 md:flex-none"
                >
                  Discard
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsSaveConfirmOpen(true)}
                  disabled={!hasUnsavedChanges}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px] gap-2 flex-1 md:flex-none"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-4 shrink-0">
               <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    placeholder="Search permissions..."
                    className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
               </div>
               <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={areAllExpanded ? collapseAll : expandAll} 
                  className="h-9 px-3 text-xs md:text-sm bg-white min-w-[115px]"
               >
                  {areAllExpanded ? (
                     <>
                        <ChevronUp className="h-3.5 w-3.5 mr-1.5" /> Collapse All
                     </>
                  ) : (
                     <>
                        <ChevronDown className="h-3.5 w-3.5 mr-1.5" /> Expand All
                     </>
                  )}
               </Button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
              <div className="min-h-full">
                {PERMISSION_GROUPS.map((group) => {
                  const visiblePermissions = group.permissions.filter((permission) => {
                        const matchesSearch =
                          !permissionSearch ||
                          permission.label.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                          permission.description.toLowerCase().includes(permissionSearch.toLowerCase());
                        const matchesAction = actionFilters.size === 0 || actionFilters.has(permission.action);
                        return matchesSearch && matchesAction;
                  });

                  if (visiblePermissions.length === 0) return null;

                  const groupCount = getGroupPermissionCount(group);
                  const isAllSelected = groupCount.selected === groupCount.total;
                  const isExpanded = expandedGroups.has(group.id);
                  const ModuleIcon = getModuleIcon(group.id);

                  return (
                    <div key={group.id} className="border-b border-slate-100 last:border-0 border-l-[3px] border-l-transparent hover:border-l-emerald-500 transition-all">
                      {/* Group Header */}
                      <div 
                         onClick={() => toggleGroup(group.id)}
                         className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors select-none group/header"
                      >
                         <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex items-center justify-center h-10 w-10 rounded-lg transition-colors border",
                                isAllSelected 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                  : "bg-white text-slate-500 border-slate-200 group-hover/header:border-emerald-200 group-hover/header:text-emerald-600"
                            )}>
                               <ModuleIcon className="h-5 w-5" />
                            </div>
                            <div>
                               <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                  {group.name}
                                  {isAllSelected && !isExpanded && (
                                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                       All Enabled
                                     </span>
                                  )}
                               </h3>
                               <p className="text-xs text-slate-500 mt-0.5">{group.permissions.length} permissions available</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors" onClick={(e) => e.stopPropagation()}>
                               <span className="text-xs font-medium text-slate-600">Enable All</span>
                               <Checkbox
                                  id={`group-${group.id}`}
                                  checked={isAllSelected}
                                  onChange={(checked) => handleSelectAll(group, checked)}
                                />
                            </div>
                            {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                         </div>
                      </div>

                      {/* Permissions List */}
                      {isExpanded && (
                        <div className="bg-slate-50/50">
                           {visiblePermissions.map((permission) => {
                              const isChecked = selectedRole?.permissions.includes(permission.id) || false;
                              return (
                                <div key={permission.id} className="flex items-center justify-between px-6 py-3 pl-[4.5rem] hover:bg-slate-50 transition-colors border-t border-slate-100 first:border-0 group/item">
                                   <div className="flex-1 pr-6 cursor-pointer select-none" onClick={() => handlePermissionToggle(permission.id)}>
                                      <div className="flex items-center gap-2">
                                          <span className={cn("text-sm font-medium transition-colors", isChecked ? "text-slate-900" : "text-slate-600 group-hover/item:text-slate-900")}>
                                             {permission.label}
                                          </span>
                                          {isALCOAPlusRequired(permission.id) && (
                                             <div title="Audit Trail Required" className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                 <Lock className="h-3 w-3" />
                                                 <span>Audit</span>
                                             </div>
                                          )}
                                      </div>
                                   </div>
                                   <div className="flex items-center">
                                      <Checkbox 
                                         id={permission.id}
                                         checked={isChecked}
                                         onChange={() => handlePermissionToggle(permission.id)}
                                      />
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Form Modal (Create/Edit) */}
      <RoleFormModal
        mode={formMode}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onConfirm={handleFormSubmit}
        roles={roles}
        name={formName}
        description={formDescription}
        baseRoleId={formBaseRoleId}
        isActive={formIsActive}
        errors={formErrors}
        onNameChange={handleFormNameChange}
        onDescriptionChange={setFormDescription}
        onBaseRoleIdChange={setFormBaseRoleId}
        onIsActiveChange={setFormIsActive}
      />

      {/* Delete Role Confirm */}
      <AlertModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteRole}
        type="warning"
        title="Delete Role"
        confirmText="Delete"
        showCancel
        description={(
          <div className="text-sm text-slate-600">
            Are you sure you want to delete this role? This action cannot be undone.
          </div>
        )}
      />

      {/* Discard Changes Confirm */}
      <AlertModal
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={() => {
          handleDiscardChanges();
          setIsDiscardConfirmOpen(false);
        }}
        type="warning"
        title="Discard Changes"
        confirmText="Discard"
        showCancel
        description={(
          <div className="text-sm text-slate-600">
            Are you sure you want to discard all pending changes? This action cannot be undone.
          </div>
        )}
      />

      {/* Save Changes Confirm */}
      <AlertModal
        isOpen={isSaveConfirmOpen}
        onClose={() => setIsSaveConfirmOpen(false)}
        onConfirm={() => {
          handleSaveChanges();
          setIsSaveConfirmOpen(false);
        }}
        type="info"
        title="Save Changes"
        confirmText="Save Changes"
        showCancel
        description={(
          <div className="text-sm text-slate-600">
            Are you sure you want to save the changes made to <strong>{selectedRole?.name}</strong>?
          </div>
        )}
      />

      {/* Role Switch with Unsaved Changes Confirm */}
      <AlertModal
        isOpen={isRoleSwitchConfirmOpen}
        onClose={() => {
          setIsRoleSwitchConfirmOpen(false);
          setPendingRoleId("");
        }}
        onConfirm={confirmRoleSwitch}
        type="warning"
        title="Unsaved Changes"
        confirmText="Switch Role"
        showCancel
        description={(
          <div className="text-sm text-slate-600">
            You have unsaved changes. Switching to another role will discard all pending changes. Are you sure you want to continue?
          </div>
        )}
      />
    </div>
  );
};
