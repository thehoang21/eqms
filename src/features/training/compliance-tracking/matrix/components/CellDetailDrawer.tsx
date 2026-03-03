import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import type { TrainingCell, EmployeeRow, SOPColumn } from "../../types";
import { CELL_CONFIG, DRAWER_STYLES, formatDate } from "../constants";

interface CellDetailDrawerProps {
  cell: TrainingCell;
  employee: EmployeeRow;
  sop: SOPColumn;
  onClose: () => void;
}

export const CellDetailDrawer: React.FC<CellDetailDrawerProps> = ({
  cell,
  employee,
  sop,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const cfg = CELL_CONFIG[cell.status];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center md:justify-end items-end md:items-stretch pointer-events-none">
      <style>{DRAWER_STYLES}</style>

      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto",
          isClosing ? "tm-backdrop-exit" : "tm-backdrop-enter"
        )}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "pointer-events-auto bg-white shadow-2xl flex flex-col relative",
          "w-full h-[85vh] rounded-t-2xl",
          "md:h-full md:w-[480px] md:rounded-t-none md:rounded-l-xl",
          isClosing ? "tm-drawer-exit" : "tm-drawer-enter"
        )}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1.5 w-12 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div
          className={cn(
            "px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0",
            cfg.bg
          )}
        >
          <div className="flex items-center gap-2">
            <cfg.Icon className={cn("h-4 w-4", cfg.iconColor)} />
            <span className="text-sm font-bold text-slate-800">{cfg.label}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30">
          {/* Employee card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium mb-0.5">Employee</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{employee.name}</p>
              <p className="text-xs text-slate-500 truncate">
                {employee.department} · {employee.jobTitle}
              </p>
            </div>
          </div>

          {/* SOP card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium mb-0.5">SOP / Document</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{sop.code}</p>
              <p className="text-xs text-slate-500 truncate">{sop.title}</p>
            </div>
          </div>

          {/* Training details */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Training Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Last Trained</p>
                <p className="text-sm font-semibold text-slate-700">
                  {formatDate(cell.lastTrainedDate)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Expiry Date</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    cell.status === "Overdue"
                      ? "text-red-600"
                      : cell.status === "ExpiringSoon"
                      ? "text-orange-600"
                      : "text-slate-700"
                  )}
                >
                  {formatDate(cell.expiryDate)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Score</p>
                <p className="text-sm font-semibold text-slate-700">
                  {cell.score != null ? `${cell.score}%` : "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5">Attempts</p>
                <p className="text-sm font-semibold text-slate-700">
                  {cell.attempts || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleClose}>
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
