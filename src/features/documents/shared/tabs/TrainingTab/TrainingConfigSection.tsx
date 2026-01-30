import React from "react";
import { Settings, BookOpen, ClipboardCheck, HelpCircle } from "lucide-react";
import { TrainingConfig } from "./types";
import { cn } from '@/components/ui/utils';

interface TrainingConfigSectionProps {
    config: TrainingConfig;
    onUpdate: (updates: Partial<TrainingConfig>) => void;
}

export const TrainingConfigSection: React.FC<TrainingConfigSectionProps> = ({ config, onUpdate }) => {
    const isTestMode = config.trainingType === "test_certification";

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Training Configuration</h3>
                </div>
            </div>

            <div className="space-y-6">
                {/* Training Type Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Training Type</label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <button
                            onClick={() => onUpdate({ trainingType: "read_understand" })}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                                config.trainingType === "read_understand"
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-slate-200 bg-white hover:border-emerald-300"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg",
                                config.trainingType === "read_understand" ? "bg-emerald-100" : "bg-slate-100"
                            )}>
                                <BookOpen className={cn(
                                    "h-5 w-5",
                                    config.trainingType === "read_understand" ? "text-emerald-600" : "text-slate-500"
                                )} />
                            </div>
                            <div>
                                <div className={cn(
                                    "text-sm font-semibold",
                                    config.trainingType === "read_understand" ? "text-emerald-900" : "text-slate-900"
                                )}>
                                    Read & Understand
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">Document review without test</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onUpdate({ trainingType: "test_certification" })}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                                config.trainingType === "test_certification"
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-slate-200 bg-white hover:border-emerald-300"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg",
                                config.trainingType === "test_certification" ? "bg-emerald-100" : "bg-slate-100"
                            )}>
                                <ClipboardCheck className={cn(
                                    "h-5 w-5",
                                    config.trainingType === "test_certification" ? "text-emerald-600" : "text-slate-500"
                                )} />
                            </div>
                            <div>
                                <div className={cn(
                                    "text-sm font-semibold",
                                    config.trainingType === "test_certification" ? "text-emerald-900" : "text-slate-900"
                                )}>
                                    Test & Certification
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">Quiz with passing score</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Configuration Fields */}
                    {/* Configuration Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {isTestMode && (
                        <>
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
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Max Attempts</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={config.maxAttempts}
                                    onChange={(e) => onUpdate({ maxAttempts: parseInt(e.target.value) || 1 })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <div className="relative group inline-block">
                            <label className="text-sm font-medium text-slate-700 inline-flex items-center gap-1.5 cursor-help">
                                Training Period (Days)
                            </label>
                            {/* Tooltip */}
                            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-50 w-64 pointer-events-none">
                                Training Period duration after which the Document Revision will automatically progress to the Ready for Publishing status
                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                value={config.trainingPeriodDays}
                                onChange={(e) => onUpdate({ trainingPeriodDays: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
