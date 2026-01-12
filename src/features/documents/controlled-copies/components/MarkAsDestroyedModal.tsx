import React, { useState } from "react";
import { AlertTriangle, Upload, Calendar, User, FileText, Trash2, X } from "lucide-react";
import { FormModal } from "@/components/ui/modal/FormModal";
import { Button } from "@/components/ui/button/Button";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { ControlledCopy } from "../types";

interface DestructionFormData {
  destructionDate: string;
  destructionMethod: string;
  destructedBy: string;
  destructionSupervisor: string;
  evidenceFile: File | null;
  evidencePreview: string | null;
}

interface MarkAsDestroyedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DestructionFormData, reason: string) => void;
  controlledCopy: ControlledCopy;
}

export const MarkAsDestroyedModal: React.FC<MarkAsDestroyedModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  controlledCopy,
}) => {
  const today = new Date().toISOString().split("T")[0];
  
  const [formData, setFormData] = useState<DestructionFormData>({
    destructionDate: today,
    destructionMethod: "",
    destructedBy: "",
    destructionSupervisor: "",
    evidenceFile: null,
    evidencePreview: null,
  });

  const [isESignModalOpen, setIsESignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof DestructionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, evidenceFile: "File size must be less than 10MB" }));
        return;
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            evidenceFile: file,
            evidencePreview: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({
          ...prev,
          evidenceFile: file,
          evidencePreview: null,
        }));
      }
      
      if (errors.evidenceFile) {
        setErrors((prev) => ({ ...prev, evidenceFile: "" }));
      }
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      evidenceFile: null,
      evidencePreview: null,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.destructionDate) {
      newErrors.destructionDate = "Destruction date is required";
    }
    if (!formData.destructionMethod.trim()) {
      newErrors.destructionMethod = "Destruction method is required";
    }
    if (!formData.destructedBy.trim()) {
      newErrors.destructedBy = "Executor name is required";
    }
    if (!formData.destructionSupervisor.trim()) {
      newErrors.destructionSupervisor = "Supervisor name is required";
    }
    if (!formData.evidenceFile) {
      newErrors.evidenceFile = "Evidence photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsESignModalOpen(true);
    }
  };

  const handleESignConfirm = async (reason: string) => {
    setIsLoading(true);
    try {
      await onConfirm(formData, reason);
      setIsESignModalOpen(false);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      destructionDate: today,
      destructionMethod: "",
      destructedBy: "",
      destructionSupervisor: "",
      evidenceFile: null,
      evidencePreview: null,
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Mark Controlled Copy as Destroyed"
        description={
          <div className="space-y-3 mt-5">
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-900 font-semibold mb-1">
                Irreversible Action
                </p>
                <p className="text-xs text-red-800 leading-relaxed">
                  This action cannot be undone. Once marked as destroyed, this controlled copy will be permanently removed from active inventory and cannot be recovered.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-slate-700">Control Number:</span>
                  <span className="ml-1 text-slate-900 font-semibold">{controlledCopy.controlNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Copy:</span>
                  <span className="ml-1 text-slate-900">
                    {controlledCopy.copyNumber} of {controlledCopy.totalCopies}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-slate-700">Document:</span>
                  <span className="ml-1 text-slate-900">{controlledCopy.documentId} - {controlledCopy.documentTitle}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-slate-700">Location:</span>
                  <span className="ml-1 text-slate-900">{controlledCopy.location}</span>
                </div>
              </div>
            </div>
          </div>
        }
        size="2xl"
        showCancel={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2">
          {/* Left Column - Destruction Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
              <Calendar className="h-4 w-4 text-slate-600" />
              Destruction Information
            </h3>

            {/* Destruction Date */}
            <div>
              <DateTimePicker
                label="Destruction Date"
                value={formData.destructionDate}
                onChange={(value) => handleInputChange("destructionDate", value)}
                placeholder="Select date"
              />
              {errors.destructionDate && (
                <p className="text-xs text-red-600 mt-1">{errors.destructionDate}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Default: Today's date
              </p>
            </div>

            {/* Destruction Method */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Destruction Method <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destructionMethod}
                onChange={(e) => handleInputChange("destructionMethod", e.target.value)}
                placeholder="e.g., Paper shredding, Incineration, etc."
                className={`w-full h-11 px-4 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.destructionMethod
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                }`}
              />
              {errors.destructionMethod && (
                <p className="text-xs text-red-600 mt-1">{errors.destructionMethod}</p>
              )}
            </div>

            {/* Executor */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Executor (Person Performing) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.destructedBy}
                  onChange={(e) => handleInputChange("destructedBy", e.target.value)}
                  placeholder="Enter executor name"
                  className={`w-full h-11 pl-10 pr-4 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.destructedBy
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                />
              </div>
              {errors.destructedBy && (
                <p className="text-xs text-red-600 mt-1">{errors.destructedBy}</p>
              )}
            </div>

            {/* Supervisor */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Supervisor (Witness) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.destructionSupervisor}
                  onChange={(e) => handleInputChange("destructionSupervisor", e.target.value)}
                  placeholder="Enter supervisor name"
                  className={`w-full h-11 pl-10 pr-4 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.destructionSupervisor
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                />
              </div>
              {errors.destructionSupervisor && (
                <p className="text-xs text-red-600 mt-1">{errors.destructionSupervisor}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Required for compliance: 2-person verification
              </p>
            </div>
          </div>

          {/* Right Column - Evidence Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
              <FileText className="h-4 w-4 text-slate-600" />
              Destruction Evidence
            </h3>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Evidence Photo <span className="text-red-500">*</span>
              </label>
              
              {!formData.evidenceFile ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.evidenceFile
                        ? "border-red-300 bg-red-50 hover:bg-red-100"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`h-10 w-10 mb-3 ${errors.evidenceFile ? "text-red-400" : "text-slate-400"}`} />
                      <p className="mb-2 text-sm text-slate-600 font-medium">
                        Click to upload evidence photo
                      </p>
                      <p className="text-xs text-slate-500">
                        JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg border-2 border-slate-200 overflow-hidden">
                  {formData.evidencePreview ? (
                    <img
                      src={formData.evidencePreview}
                      alt="Evidence preview"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2">
                    <p className="text-xs text-white font-medium truncate">
                      {formData.evidenceFile.name}
                    </p>
                    <p className="text-xs text-slate-300">
                      {(formData.evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
              
              {errors.evidenceFile && (
                <p className="text-xs text-red-600 mt-1">{errors.evidenceFile}</p>
              )}
            </div>

            {/* Evidence Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-blue-900 mb-2">
                Photo Requirements:
              </h4>
              <ul className="space-y-1 text-xs text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Clear photo of shredded/destroyed document pieces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Or signed destruction record form with timestamp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Control number must be visible if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Photo taken immediately after destruction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-4">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            Submit & Sign
          </Button>
        </div>
      </FormModal>

      {/* E-Signature Modal */}
      <ESignatureModal
        isOpen={isESignModalOpen}
        onClose={() => setIsESignModalOpen(false)}
        onConfirm={handleESignConfirm}
        actionTitle="Confirm Controlled Copy Destruction"
      />
    </>
  );
};
