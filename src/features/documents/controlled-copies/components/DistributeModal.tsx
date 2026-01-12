import React, { useState } from "react";
import { X, User, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { ControlledCopy } from "../types";
import { ESignatureModal } from "@/components/ui/esignmodal/ESignatureModal";

interface DistributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  copies: ControlledCopy[];
  onConfirm: (distributionData: {
    recipientName: string;
    recipientDepartment: string;
    distributionDate: string;
    distributionNotes: string;
    eSignatureReason: string;
  }) => void;
  isLoading?: boolean;
}

export const DistributeModal: React.FC<DistributeModalProps> = ({
  isOpen,
  onClose,
  copies,
  onConfirm,
  isLoading = false,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [recipientDepartment, setRecipientDepartment] = useState("");
  const [distributionDate, setDistributionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [distributionNotes, setDistributionNotes] = useState("");
  const [showESignModal, setShowESignModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientDepartment.trim()) {
      alert("Please fill in recipient name and department");
      return;
    }
    setShowESignModal(true);
  };

  const handleESignConfirm = (reason: string) => {
    onConfirm({
      recipientName,
      recipientDepartment,
      distributionDate,
      distributionNotes,
      eSignatureReason: reason,
    });
    setShowESignModal(false);
    handleClose();
  };

  const handleClose = () => {
    setRecipientName("");
    setRecipientDepartment("");
    setDistributionDate(new Date().toISOString().split("T")[0]);
    setDistributionNotes("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Distribute Controlled Copies
                </h2>
                <p className="text-sm text-slate-600">
                  {copies.length} {copies.length === 1 ? "copy" : "copies"} selected
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Copies */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Copies to Distribute:
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {copies.map((copy) => (
                    <div
                      key={copy.id}
                      className="flex items-center gap-3 text-sm bg-white rounded-md px-3 py-2 border border-slate-200"
                    >
                      <span className="font-medium text-emerald-700">
                        {copy.controlNumber}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-700">{copy.documentId}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-600">
                        {copy.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  Recipient Information
                </h3>

                {/* Recipient Name */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient full name"
                    className="w-full h-11 px-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {/* Recipient Department */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Department/Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientDepartment}
                    onChange={(e) => setRecipientDepartment(e.target.value)}
                    placeholder="Enter department or location"
                    className="w-full h-11 px-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {/* Distribution Date */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Distribution Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={distributionDate}
                    onChange={(e) => setDistributionDate(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {/* Distribution Notes */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Distribution Notes
                  </label>
                  <textarea
                    value={distributionNotes}
                    onChange={(e) => setDistributionNotes(e.target.value)}
                    placeholder="Enter any additional notes about this distribution..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Electronic Signature Required</p>
                  <p className="text-blue-700">
                    You will be prompted to provide your electronic signature
                    to confirm this distribution action.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              onClick={handleClose}
              variant="outline"
              size="default"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="default"
              size="default"
              disabled={isLoading || !recipientName.trim() || !recipientDepartment.trim()}
            >
              {isLoading ? "Processing..." : "Proceed to E-Signature"}
            </Button>
          </div>
        </div>
      </div>

      {/* E-Signature Modal */}
      <ESignatureModal
        isOpen={showESignModal}
        onClose={() => setShowESignModal(false)}
        onConfirm={handleESignConfirm}
        actionTitle="Confirm Distribution of Controlled Copies"
      />
    </>
  );
};
