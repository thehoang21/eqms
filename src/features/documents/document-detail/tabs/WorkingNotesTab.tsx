import React, { useState } from "react";
import { FileText } from "lucide-react";

interface WorkingNotesTabProps {
  isReadOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const WorkingNotesTab: React.FC<WorkingNotesTabProps> = ({
  isReadOnly = false,
  value: externalValue,
  onChange: externalOnChange,
}) => {
  const [internalValue, setInternalValue] = useState("");

  const value = externalValue !== undefined ? externalValue : internalValue;
  const handleChange = (newValue: string) => {
    if (externalOnChange) {
      externalOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Working Notes Textarea */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Working Notes
        </label>
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your working notes here..."
          disabled={isReadOnly}
          rows={10}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-y disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
        />
        {!isReadOnly && (
          <p className="text-xs text-slate-500 mt-1.5">
            Use this space to document observations, notes, or any relevant information during the review process.
          </p>
        )}
      </div>
    </div>
  );
};
