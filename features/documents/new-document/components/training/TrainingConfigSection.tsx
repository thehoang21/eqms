import React from "react";
import { Settings } from "lucide-react";
import { TrainingConfig } from "./types";

interface TrainingConfigSectionProps {
    config: TrainingConfig;
    onUpdate: (updates: Partial<TrainingConfig>) => void;
}

export const TrainingConfigSection: React.FC<TrainingConfigSectionProps> = ({ config, onUpdate }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                    <Settings className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Training Configuration</h3>
                    <p className="text-sm text-slate-500">Set up the requirements for completing this training.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Passing Score (Points)</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={config.passingScore}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) {
                                    onUpdate({ passingScore: 0 });
                                } else {
                                    const clampedValue = Math.max(0, Math.min(10, value));
                                    onUpdate({ passingScore: clampedValue });
                                }
                            }}
                            onBlur={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value) || value < 0) {
                                    onUpdate({ passingScore: 0 });
                                } else if (value > 10) {
                                    onUpdate({ passingScore: 10 });
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                        <span className="absolute right-3 top-2 text-slate-400 text-sm">pts</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Max Attempts</label>
                    <input
                        type="number"
                        min="1"
                        value={config.maxAttempts}
                        onChange={(e) => onUpdate({ maxAttempts: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Due Date (Days)</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            value={config.deadlineDays}
                            onChange={(e) => onUpdate({ deadlineDays: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                        <span className="absolute right-3 top-2 text-slate-400 text-sm">days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
