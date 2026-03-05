/**
 * Status utilities — centralised colour mappings for all status strings
 * used across the QMS application.
 *
 * Two helper functions are provided:
 *
 * 1. `getStatusColorClass(status)` → Tailwind CSS classes for **inline badge**
 *    rendering (e.g. `<span className={getStatusColorClass(item.status)}>`)
 *
 * 2. `getDocumentTypeColorClass(type)` → Tailwind CSS classes for document
 *    type badges (SOP / Policy / Form / …)
 *
 * Adding a new status:
 *   - Extend the union type in the feature's `types.ts`
 *   - Add a matching `case` in the relevant switch below
 *   - Keep colours consistent with the palette defined in copilot-instructions
 */

// ─── Common Status Color Classes ─────────────────────────────────────────────

/**
 * Returns a Tailwind class string (bg + text + border) for a given status.
 * Covers document, training/course, user, and general statuses.
 *
 * Intended for **inline badge** `<span>` elements:
 * ```tsx
 * <span className={cn(
 *   "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
 *   getStatusColorClass(item.status)
 * )}>
 *   {item.status}
 * </span>
 * ```
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    // ── Document / Revision workflow ──────────────────────────────
    case "Draft":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Pending Approval":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Pending Training":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Ready for Publishing":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "Published":
      return "bg-teal-50 text-teal-700 border-teal-200";

    case "Approved":
    case "Effective":
    case "Active":
    case "Qualified":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Archived":
    case "Archive":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "Obsoleted":
    case "Obsolete":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "Rejected":
    case "Closed - Cancelled":
    case "Disqualified":
      return "bg-red-50 text-red-700 border-red-200";

    // ── User management ───────────────────────────────────────────
    case "Pending":
    case "Under Evaluation":
    case "Conditionally Approved":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Inactive":
    case "Suspended":
      return "bg-slate-100 text-slate-500 border-slate-200";

    case "Blocked":
      return "bg-red-50 text-red-700 border-red-200";

    // ── Equipment ─────────────────────────────────────────────────
    case "Operational":
    case "Calibrated":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Under Maintenance":
    case "Due for Calibration":
    case "Audit Scheduled":
    case "In Progress":
    case "inProgress":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Decommissioned":
    case "Out of Service":
      return "bg-rose-50 text-rose-700 border-rose-200";

    // ── Risk / CAPA / Change Control ──────────────────────────────
    case "Open":
    case "Identified":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Under Review":
    case "In Analysis":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Mitigated":
    case "Closed":
    case "Completed":
    case "Resolved":
    case "Implemented":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Overdue":
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200";

    case "Accepted":
    case "Reviewed":
      return "bg-teal-50 text-teal-700 border-teal-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

// ─── Document Type Color Classes ─────────────────────────────────────────────

/**
 * Returns Tailwind class string for document type badges.
 *
 * ```tsx
 * <span className={cn(
 *   "inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border",
 *   getDocumentTypeColorClass(document.type)
 * )}>
 *   {document.type}
 * </span>
 * ```
 */
export function getDocumentTypeColorClass(type: string): string {
  switch (type) {
    case "SOP":           return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Policy":        return "bg-purple-50 text-purple-700 border-purple-200";
    case "Form":          return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Report":        return "bg-orange-50 text-orange-700 border-orange-200";
    case "Specification": return "bg-pink-50 text-pink-700 border-pink-200";
    case "Protocol":      return "bg-teal-50 text-teal-700 border-teal-200";
    case "Work Instruction":
    case "WI":            return "bg-sky-50 text-sky-700 border-sky-200";
    default:              return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

// ─── Priority Color Classes ───────────────────────────────────────────────────

/**
 * Returns Tailwind class string for priority badges.
 *
 * ```tsx
 * <span className={cn(
 *   "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
 *   getPriorityColorClass(item.priority)
 * )}>
 *   {item.priority}
 * </span>
 * ```
 */
export function getPriorityColorClass(priority: string): string {
  switch (priority) {
    case "Critical": return "bg-red-100 text-red-800 border-red-300";
    case "High":     return "bg-orange-50 text-orange-700 border-orange-200";
    case "Medium":   return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:         return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
