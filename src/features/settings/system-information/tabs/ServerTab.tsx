import React from "react";
import { Server, Cpu, HardDrive, Clock } from "lucide-react";
import type { ServerInfo } from "../types";

interface ServerTabProps {
  data: ServerInfo;
}

export const ServerTab: React.FC<ServerTabProps> = ({ data }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Server Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Server className="h-4 w-4 text-slate-600" />
          Server Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Operating System
            </label>
            <input
              type="text"
              value={data.os}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Node.js Version
            </label>
            <input
              type="text"
              value={data.nodeVersion}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              System Uptime
            </label>
            <input
              type="text"
              value={data.uptime}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* CPU Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-slate-600" />
          CPU Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              CPU Model
            </label>
            <input
              type="text"
              value={data.cpuModel}
              disabled
              className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              CPU Cores
            </label>
            <div className="flex items-center h-11 px-3.5 border border-slate-200 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700 font-semibold">{data.cpuCores}</span>
              <span className="ml-2 text-sm text-slate-500">cores</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-slate-600" />
          Memory Information
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Total Memory
              </label>
              <p className="text-lg font-semibold text-slate-900">{data.memoryTotal}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Used Memory
              </label>
              <p className="text-lg font-semibold text-slate-900">{data.memoryUsed}</p>
            </div>
          </div>
          
          {/* Memory Usage Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-600">
                Memory Usage
              </label>
              <span className="text-xs font-semibold text-slate-700">
                {data.memoryUsagePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  data.memoryUsagePercent >= 80
                    ? "bg-red-600"
                    : data.memoryUsagePercent >= 60
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                }`}
                style={{ width: `${data.memoryUsagePercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {data.memoryUsagePercent >= 80 && "⚠️ High memory usage detected"}
              {data.memoryUsagePercent >= 60 && data.memoryUsagePercent < 80 && "⚠️ Moderate memory usage"}
              {data.memoryUsagePercent < 60 && "✓ Memory usage is normal"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
