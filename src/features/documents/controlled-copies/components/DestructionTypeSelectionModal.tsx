import React, { useState } from "react";
import { AlertTriangle, ImageOff } from "lucide-react";
import { FormModal } from "@/components/ui/modal/FormModal";

interface DestructionTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: "Lost" | "Damaged") => void;
}

export const DestructionTypeSelectionModal: React.FC<
  DestructionTypeSelectionModalProps
> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState<"Lost" | "Damaged" | null>(null);

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm(selectedType);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Select Report Type"
      description="Please select the appropriate report type for this controlled copy:"
      confirmText="Continue"
      cancelText="Cancel"
      size="lg"
      showCancel={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option: Damaged */}
        <label
          className={`flex flex-col gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === "Damaged"
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="destructionType"
              value="Damaged"
              checked={selectedType === "Damaged"}
              onChange={() => setSelectedType("Damaged")}
              className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-semibold text-slate-900">
                Damaged
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-7">
            The controlled copy is damaged and needs to be destroyed.
            <span className="block mt-1.5 text-xs font-medium text-emerald-700">
              ✓ Evidence photos required
            </span>
          </p>
        </label>

        {/* Option: Lost */}
        <label
          className={`flex flex-col gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === "Lost"
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="destructionType"
              value="Lost"
              checked={selectedType === "Lost"}
              onChange={() => setSelectedType("Lost")}
              className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <ImageOff className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-semibold text-slate-900">
                Lost
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed pl-7">
            The controlled copy cannot be located and is considered lost.
            <span className="block mt-1.5 text-xs font-medium text-slate-500">
              ○ No evidence photos required
            </span>
          </p>
        </label>
      </div>
    </FormModal>
  );
};
