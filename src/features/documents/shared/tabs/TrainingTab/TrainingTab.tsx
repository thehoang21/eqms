import React, { useState } from "react";
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { MultiSelect } from '@/components/ui/select/MultiSelect';
import { Select } from '@/components/ui/select/Select';
import { Input } from '@/components/ui/form/ResponsiveForm';

interface TrainingConfig {
    isRequired: boolean;
    trainingPeriodDays: number;
    distributionList: string[];
    courseId: string;
}

export const TrainingTab: React.FC = () => {
    const [config, setConfig] = useState<TrainingConfig>({
        isRequired: false,
        trainingPeriodDays: 7,
        distributionList: [],
        courseId: ""
    });

    // Mock courses - in production, this would come from API
    const availableCourses = [
        { label: "GMP Basic Training", value: "course-1" },
        { label: "Safety & Environment Training", value: "course-2" },
        { label: "HPLC Operation Advanced", value: "course-3" },
        { label: "Cleanroom Behavior & Hygiene", value: "course-4" },
    ];

    return (
        <div className="space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between font-semibold text-slate-900">
                <Checkbox
                    id="requires-training"
                    label="Requires Training?"
                    checked={config.isRequired}
                    onChange={(checked) => setConfig({ ...config, isRequired: checked })}
                />
            </div>

            {config.isRequired && (
                <div className="space-y-4">
                    {/* Course Selection & Training Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Selection */}
                        <div>
                            <Select
                                label="Course"
                                value={config.courseId}
                                onChange={(value) => setConfig({ ...config, courseId: value as string })}
                                options={availableCourses}
                                placeholder="Select a training course..."
                            />
                        </div>

                        {/* Training Period */}
                        <div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Training Period (Days)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={config.trainingPeriodDays}
                                    onChange={(e) => setConfig({ ...config, trainingPeriodDays: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Distribution List */}
                    <div>
                        <MultiSelect
                            label="Distribution List"
                            value={config.distributionList}
                            onChange={(selected) => setConfig({ ...config, distributionList: selected as string[] })}
                            options={[
                                { label: "Quality Assurance (QA)", value: "qa" },
                                { label: "Quality Control (QC)", value: "qc" },
                                { label: "Production", value: "production" },
                                { label: "Research & Development (R&D)", value: "rnd" },
                                { label: "Regulatory Affairs", value: "regulatory" },
                                { label: "Warehouse", value: "warehouse" },
                                { label: "Maintenance", value: "maintenance" },
                                { label: "Engineering", value: "engineering" },
                                { label: "Human Resources (HR)", value: "hr" },
                                { label: "Finance & Accounting", value: "finance" },
                                { label: "Procurement", value: "procurement" },
                                { label: "Logistics", value: "logistics" },
                                { label: "IT Department", value: "it" },
                                { label: "Safety & Environment", value: "safety" },
                                { label: "Management", value: "management" },
                            ]}
                            placeholder="Select departments to distribute training..."
                            enableSearch
                            maxVisibleTags={3}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">
                            Select which departments will receive this training
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Export simplified type
export type { TrainingConfig };
