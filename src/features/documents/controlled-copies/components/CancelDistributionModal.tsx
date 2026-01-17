import React from "react";
import { AlertTriangle } from "lucide-react";
import { FormModal } from "@/components/ui/modal/FormModal";

interface CancelDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    cancellationReason: string;
    returnToStage: "Draft" | "Cancelled";
  };
  onFormDataChange: (data: { cancellationReason: string; returnToStage: "Draft" | "Cancelled" }) => void;
  errors?: {
    cancellationReason?: string;
  };
  onErrorChange?: (errors: { cancellationReason?: string }) => void;
}

export const CancelDistributionModal: React.FC<CancelDistributionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  onFormDataChange,
  errors = {},
  onErrorChange,
}) => {
  const handleReasonChange = (value: string) => {
    onFormDataChange({ ...formData, cancellationReason: value });
    if (onErrorChange) {
      onErrorChange({ ...errors, cancellationReason: undefined });
    }
  };

  const handleStageChange = (value: "Draft" | "Cancelled") => {
    onFormDataChange({ ...formData, returnToStage: value });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancel Distribution"
      description="This action will inhibit document issuance"
      confirmText="Confirm Cancellation"
      cancelText="Close"
      size="lg"
    >
      <div className="space-y-5">
        {/* Warning Banner */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Document status will be restored to selected stage and distribution will be cancelled.
          </p>
        </div>

        {/* Cancellation Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.cancellationReason}
            onChange={(e) => handleReasonChange(e.target.value)}
            placeholder="Describe the reason for cancellation..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors ${
              errors.cancellationReason
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-slate-300"
            }`}
          />
          {errors.cancellationReason && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
              {errors.cancellationReason}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">
            Minimum 10 characters ({formData.cancellationReason.length}/10)
          </p>
        </div>

        {/* Return to Stage */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2.5">
            Return to Stage <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400 ${
                formData.returnToStage === "Draft"
                  ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="returnToStage"
                value="Draft"
                checked={formData.returnToStage === "Draft"}
                onChange={(e) => handleStageChange(e.target.value as "Draft")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">Draft</span>
                <div
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.returnToStage === "Draft"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {formData.returnToStage === "Draft" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600">Return for editing</p>
            </label>

            <label
              className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400 ${
                formData.returnToStage === "Cancelled"
                  ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="returnToStage"
                value="Cancelled"
                checked={formData.returnToStage === "Cancelled"}
                onChange={(e) => handleStageChange(e.target.value as "Cancelled")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">Closed - Cancelled</span>
                <div
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.returnToStage === "Cancelled"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {formData.returnToStage === "Cancelled" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600">Permanently cancel</p>
            </label>
          </div>
        </div>
      </div>
    </FormModal>
  );
};
