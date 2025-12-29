import React from 'react';
import { FileText, AlertTriangle, CheckSquare, Clock } from 'lucide-react';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* tiêu đề */}
      <div>
        {/* get tên người dùng */}
         <h1 className="text-2xl font-bold tracking-tight text-slate-900">
             Welcome back, User!
         </h1>
         <p className="text-slate-500 mt-1 text-sm md:text-base">
             Here's a summary of your quality management activities.
         </p>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Pending Tasks", value: "12", icon: CheckSquare, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Docs for Review", value: "5", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
            { title: "Open Deviations", value: "2", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { title: "Avg Cycle Time", value: "3.2 Days", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((card, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow cursor-default">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">{card.value}</h3>
              </div>
              <div className={`h-10 w-10 md:h-12 md:w-12 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          ))}
      </div>

      {/* Quick Action Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">My Qualification Status</h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">GMP Annual Refresher</span>
                     <span className="text-emerald-600 font-bold">95%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[95%]"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">SOP-QA-001 Read & Understood</span>
                     <span className="text-amber-600 font-bold">Pending</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 w-[0%]"></div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="rounded-xl border border-slate-200 bg-blue-900 text-white shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-lg font-bold mb-2">System Notice</h3>
               <p className="text-blue-100 text-sm">Scheduled maintenance window for validation upgrade.</p>
            </div>
            <div className="mt-4 relative z-10">
               <p className="text-xs text-blue-300 uppercase font-semibold">Next Window</p>
               <p className="font-mono text-lg">Oct 28, 02:00 UTC</p>
            </div>
            {/* Decor */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-blue-800 rounded-full opacity-50 blur-2xl"></div>
         </div>
      </div>
    </div>
  );
};