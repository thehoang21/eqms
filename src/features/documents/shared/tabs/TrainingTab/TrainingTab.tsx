import React, { useState } from "react";
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { MultiSelect } from '@/components/ui/select/MultiSelect';
import { Select } from '@/components/ui/select/Select';
import { Input, Textarea } from '@/components/ui/form/ResponsiveForm';
import { cn } from '@/components/ui/utils';

interface TrainingConfig {
    isRequired: boolean;
    trainingPeriodDays: number;
    distributionList: string[];
    courseId: string;
    skipReason: string;
    skipReasonDetail: string;
}

interface TrainingTabProps {
    isReadOnly?: boolean;
    data?: Partial<TrainingConfig>;
    validationError?: {
        skipReason?: boolean;
        skipReasonDetail?: boolean;
    };
}

// Predefined reasons for skipping training
const SKIP_REASONS = [
    { 
        label: "Correction of typos/formatting only", 
        value: "typo_formatting" 
    },
    { 
        label: "Administrative update (No change in procedure)", 
        value: "admin_update" 
    },
    { 
        label: "Urgent issuance for safety/quality incident", 
        value: "urgent_safety" 
    },
    { 
        label: "External regulation update (No impact on operations)", 
        value: "regulation_update" 
    },
    { 
        label: "Others (Specify reason)", 
        value: "others" 
    },
];

export const TrainingTab: React.FC<TrainingTabProps> = ({ 
    isReadOnly = false,
    data,
    validationError 
}) => {
    const [config, setConfig] = useState<TrainingConfig>({
        isRequired: data?.isRequired ?? false,
        trainingPeriodDays: data?.trainingPeriodDays ?? 7,
        distributionList: data?.distributionList ?? [],
        courseId: data?.courseId ?? "",
        skipReason: data?.skipReason ?? "",
        skipReasonDetail: data?.skipReasonDetail ?? ""
    });

    // Mock courses - in production, this would come from API
    const availableCourses = [
        { label: "GMP Basic Training", value: "course-1" },
        { label: "Safety & Environment Training", value: "course-2" },
        { label: "HPLC Operation Advanced", value: "course-3" },
        { label: "Cleanroom Behavior & Hygiene", value: "course-4" },
    ];

    const handleCheckboxChange = (checked: boolean) => {
        setConfig({ 
            ...config, 
            isRequired: checked,
            // Reset skip reason when enabling training
            skipReason: checked ? "" : config.skipReason,
            skipReasonDetail: checked ? "" : config.skipReasonDetail
        });
    };

    const handleSkipReasonChange = (value: string) => {
        setConfig({ 
            ...config, 
            skipReason: value,
            // Clear detail if not "others"
            skipReasonDetail: value !== "others" ? "" : config.skipReasonDetail
        });
    };

    return (
        <div className="space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between font-semibold text-slate-900">
                <Checkbox
                    id="requires-training"
                    label="Requires Training?"
                    checked={config.isRequired}
                    onChange={handleCheckboxChange}
                    disabled={isReadOnly}
                />
            </div>

            {/* Training Required: Show course selection */}
            {config.isRequired && (
                <div className="space-y-4">
                    {/* Course Selection & Training Period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Selection */}
                        <div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Course Name/ID {!isReadOnly && <span className="text-red-500">*</span>}
                                </label>
                                <Select
                                    value={config.courseId}
                                    onChange={(value) => setConfig({ ...config, courseId: value as string })}
                                    options={availableCourses}
                                    placeholder="Select a training course..."
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        {/* Training Period */}
                        <div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Training Period (Days) {!isReadOnly && <span className="text-red-500">*</span>}
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={config.trainingPeriodDays}
                                    disabled={isReadOnly}
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
                            disabled={isReadOnly}
                            maxVisibleTags={3}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">
                            Select which departments will receive this training
                        </p>
                    </div>
                </div>
            )}

            {/* Training NOT Required: Show reason for skipping */}
            {!config.isRequired && (
                <div className="space-y-4">
                    {/* Reason Dropdown */}
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Reason for skipping training {!isReadOnly && <span className="text-red-500">*</span>}
                            </label>
                            <div className={cn(isReadOnly && "pointer-events-none")}>
                                <Select
                                    value={config.skipReason}
                                    onChange={handleSkipReasonChange}
                                    options={SKIP_REASONS}
                                    placeholder="Select a reason..."
                                />
                            </div>
                        </div>
                        {validationError?.skipReason && !config.skipReason && (
                            <p className="text-xs text-red-600 mt-1.5 font-medium">
                                Please select a reason for skipping training
                            </p>
                        )}
                    </div>

                    {/* Detail textarea when "Others" is selected */}
                    {config.skipReason === "others" && (
                        <div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Specify reason {!isReadOnly && <span className="text-red-500">*</span>}
                                </label>
                                {isReadOnly ? (
                                    <p className={cn(
                                        "text-sm px-3 py-2.5 bg-slate-50 border rounded-lg leading-relaxed whitespace-pre-wrap min-h-[4rem]",
                                        validationError?.skipReasonDetail && !config.skipReasonDetail 
                                            ? "border-red-300 bg-red-50" 
                                            : "border-slate-200"
                                    )}>
                                        {config.skipReasonDetail || <span className="text-slate-400">—</span>}
                                    </p>
                                ) : (
                                    <Textarea
                                        value={config.skipReasonDetail}
                                        onChange={(e) => setConfig({ ...config, skipReasonDetail: e.target.value })}
                                        rows={3}
                                        placeholder="Please provide detailed reason for skipping training..."
                                        className={cn(
                                            validationError?.skipReasonDetail && !config.skipReasonDetail.trim() &&
                                            "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                                        )}
                                    />
                                )}
                            </div>
                            {validationError?.skipReasonDetail && !config.skipReasonDetail.trim() && (
                                <p className="text-xs text-red-600 mt-1.5 font-medium">
                                    Please specify the reason in detail
                                </p>
                            )}
                        </div>
                    )}

                    {!isReadOnly && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800 leading-relaxed">
                                <strong>Note:</strong> If training is not required, you must provide a valid reason. This will be recorded in the document history for audit purposes.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Validation helper function for parent component
export const validateTrainingTab = (config: TrainingConfig): { isValid: boolean; errors: { skipReason?: boolean; skipReasonDetail?: boolean } } => {
    const errors: { skipReason?: boolean; skipReasonDetail?: boolean } = {};
    
    if (!config.isRequired) {
        // If training not required, must have skip reason
        if (!config.skipReason) {
            errors.skipReason = true;
        }
        // If skip reason is "others", must have detail
        if (config.skipReason === "others" && !config.skipReasonDetail.trim()) {
            errors.skipReasonDetail = true;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Export types
export type { TrainingConfig };
