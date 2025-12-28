import React from "react";
import {
  FileText,
  AlertTriangle,
  Shield,
  GraduationCap,
} from "lucide-react";
import { Priority, TaskStatus, ModuleType } from "./types";

export const getPriorityColor = (p: Priority) => {
  switch (p) {
    case "Critical":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "High":
      return "bg-red-50 text-red-700 border-red-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export const getStatusBadgeStyle = (s: TaskStatus) => {
  switch (s) {
    case "Pending":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "In-Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Reviewing":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

export const getModuleIcon = (m: ModuleType) => {
  switch (m) {
    case "Document":
      return <FileText className="h-3.5 w-3.5" />;
    case "Deviation":
      return <AlertTriangle className="h-3.5 w-3.5" />;
    case "CAPA":
      return <Shield className="h-3.5 w-3.5" />;
    case "Training":
      return <GraduationCap className="h-3.5 w-3.5" />;
  }
};

export const getModuleBadgeStyle = (m: ModuleType) => {
  switch (m) {
    case "Document":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Deviation":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "CAPA":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Training":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
};

export const isOverdue = (dateString: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateString < today;
};

export const daysUntil = (dateString: string) => {
  const due = new Date(dateString);
  const today = new Date();
  // Normalize to midnight to avoid partial-day rounding issues
  const dueMid = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  ).getTime();
  const todayMid = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  return Math.ceil((dueMid - todayMid) / (1000 * 60 * 60 * 24));
};
