import React from "react";
import { ShieldCheck, XCircle, AlertTriangle, CalendarClock } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type { MatrixKPI } from "../../types";

interface KPICardsProps {
  kpis: MatrixKPI;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const complianceColor =
    kpis.complianceRate >= 80
      ? { bg: "bg-emerald-100", icon: "text-emerald-600", text: "text-emerald-600" }
      : kpis.complianceRate >= 60
      ? { bg: "bg-amber-100",   icon: "text-amber-600",   text: "text-amber-600"   }
      : { bg: "bg-red-100",     icon: "text-red-600",     text: "text-red-600"     };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
      {/* Compliance Rate */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", complianceColor.bg)}>
            <ShieldCheck className={cn("h-5 w-5", complianceColor.icon)} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">Compliance Rate</p>
            <p className={cn("text-2xl font-bold", complianceColor.text)}>
              {kpis.complianceRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Total Overdue */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">Total Overdue</p>
            <p className="text-2xl font-bold text-red-600">{kpis.totalOverdue}</p>
          </div>
        </div>
      </div>

      {/* Expiring Soon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-600">{kpis.expiringSoon}</p>
          </div>
        </div>
      </div>

      {/* Next Audit */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <CalendarClock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">Next Audit</p>
            <p className="text-2xl font-bold text-blue-600">
              {kpis.daysUntilNextAudit}{" "}
              <span className="text-sm font-medium text-slate-400">days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
