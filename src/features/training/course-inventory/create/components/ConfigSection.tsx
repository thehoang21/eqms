import React from "react";
import { ClipboardCheck } from "lucide-react";
import { TrainingConfig } from "../../../types";
import { cn } from '@/components/ui/utils';

interface TrainingConfigSectionProps {
    config: TrainingConfig;
    onUpdate: (updates: Partial<TrainingConfig>) => void;
}

export const ConfigSection: React.FC<TrainingConfigSectionProps> = ({ config, onUpdate }) => {
    const isTestMode = config.trainingType === "test_certification";

    return (
            <div className="space-y-6">
                {/* Configuration Fields */}
                <div className="space-y-6">
                    {/* Numeric Fields Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
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
                                    className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};
