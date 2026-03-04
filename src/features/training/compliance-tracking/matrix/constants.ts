import { Hourglass, type LucideIcon } from "lucide-react";
import {
  IconAlertTriangle,
  IconCheck,
  IconHourglassEmpty,
  IconMinus,
  IconX,
} from "@tabler/icons-react";
import type { CellStatus } from "../types";

// ─── Cell status display config ───────────────────────────────────────────────
export const CELL_CONFIG: Record<
  CellStatus,
  {
    bg: string;
    hoverBg: string;
    Icon: LucideIcon;
    iconColor: string;
    label: string;
    border: string;
  }
> = {
  Qualified:    { bg: "bg-emerald-100", hoverBg: "hover:bg-emerald-200", Icon: IconCheck,          iconColor: "text-emerald-600", label: "Qualified",     border: "border-emerald-300" },
  Pending:      { bg: "bg-amber-100",   hoverBg: "hover:bg-amber-200",   Icon: Hourglass, iconColor: "text-amber-600",   label: "Pending",       border: "border-amber-300"  },
  Overdue:      { bg: "bg-red-100",     hoverBg: "hover:bg-red-200",     Icon: IconX,              iconColor: "text-red-600",     label: "Overdue",       border: "border-red-300"    },
  ExpiringSoon: { bg: "bg-orange-100",  hoverBg: "hover:bg-orange-200",  Icon: IconAlertTriangle,  iconColor: "text-orange-600",  label: "Expiring Soon", border: "border-orange-300" },
  NotRequired:  { bg: "bg-slate-50",    hoverBg: "hover:bg-slate-100",   Icon: IconMinus,          iconColor: "text-slate-400",   label: "Not Required",  border: "border-slate-200"  },
};

// ─── Shared drawer animation styles ──────────────────────────────────────────
export const DRAWER_STYLES = `
  @keyframes tmSlideInRight  { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes tmSlideInBottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes tmSlideOutRight  { from { transform: translateX(0); } to { transform: translateX(100%); } }
  @keyframes tmSlideOutBottom { from { transform: translateY(0); } to { transform: translateY(100%); } }
  @keyframes tmFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tmFadeOut { from { opacity: 1; } to { opacity: 0; } }
  .tm-drawer-enter { animation-duration: 0.3s; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); animation-fill-mode: forwards; }
  .tm-drawer-exit  { animation-duration: 0.3s; animation-timing-function: cubic-bezier(0.4, 0, 1, 1);   animation-fill-mode: forwards; }
  @media (max-width: 767px) {
    .tm-drawer-enter { animation-name: tmSlideInBottom; }
    .tm-drawer-exit  { animation-name: tmSlideOutBottom; }
  }
  @media (min-width: 768px) {
    .tm-drawer-enter { animation-name: tmSlideInRight; }
    .tm-drawer-exit  { animation-name: tmSlideOutRight; }
  }
  .tm-backdrop-enter { animation: tmFadeIn  0.3s ease-out forwards; }
  .tm-backdrop-exit  { animation: tmFadeOut 0.3s ease-in  forwards; }
`;

// ─── Utility ──────────────────────────────────────────────────────────────────
export const formatDate = (d: string | null): string => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
