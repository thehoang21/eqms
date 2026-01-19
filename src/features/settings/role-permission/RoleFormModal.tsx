import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Select } from "@/components/ui/select/Select";
import { FormModal } from "@/components/ui/modal/FormModal";
import { cn } from "@/components/ui/utils";
import { Role } from "./types";

interface RoleFormModalProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roles: Role[];
  name: string;
  description: string;
  baseRoleId: string | "";
  isActive: boolean;
  errors: { name: string };
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBaseRoleIdChange: (value: string) => void;
  onIsActiveChange: (checked: boolean) => void;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  mode,
  isOpen,
  onClose,
  onConfirm,
  roles,
  name,
  description,
  baseRoleId,
  isActive,
  errors,
  onNameChange,
  onDescriptionChange,
  onBaseRoleIdChange,
  onIsActiveChange,
}) => {
  const isCreateMode = mode === "create";
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isCreateMode ? "Create New Role" : "Edit Role"}
      confirmText={isCreateMode ? "Create Role" : "Save Changes"}
      size="xl"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Role name <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Document Owner (Dept A)"
            className={cn(
              "w-full h-11 px-3 text-sm border rounded-md focus:outline-none focus:ring-2 placeholder:text-slate-400",
              errors.name
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30"
                : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
            )}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              {errors.name}
            </p>
          )}
          {!errors.name && name.trim() && (
            <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
              Role name is valid
            </p>
          )}
        </div>
        <div className="pt-1">
          <Checkbox
            id={`${mode}-active`}
            checked={isActive}
            onChange={(checked) => onIsActiveChange(!!checked)}
            label="Active"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Short description of this role"
            className="w-full min-h-[96px] px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
          />
        </div>
        <div>
          <Select
            label="Copy permissions from"
            value={baseRoleId}
            onChange={(val: string) => onBaseRoleIdChange(val)}
            options={[
              { label: "None (start from scratch)", value: "" },
              ...roles.map(r => ({ label: r.name, value: r.id }))
            ]}
            placeholder="Select a role"
            maxVisibleRows={4}
          />
        </div>
        <div className="text-xs text-slate-500">
          Note: {isCreateMode ? "New roles are created as" : "This role is"} <span className="font-medium text-slate-700">custom</span>. You can adjust permissions after {isCreateMode ? "creation" : "saving"}.
        </div>
      </div>
    </FormModal>
  );
};
