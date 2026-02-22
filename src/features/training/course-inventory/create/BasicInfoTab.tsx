import React from "react";
import { Select } from "@/components/ui/select/Select";
import { MultiSelect } from "@/components/ui/select/MultiSelect";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { Input, Textarea } from "@/components/ui/form/ResponsiveForm";
import { RadioGroup } from "@/components/ui/radio";
import { TrainingType } from "../../types";

interface BasicInfoTabProps {
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    trainingType: TrainingType;
    setTrainingType: (v: TrainingType) => void;
    instructorType: "internal" | "external";
    setInstructorType: (v: "internal" | "external") => void;
    instructor: string;
    setInstructor: (v: string) => void;
    scheduledDate: string;
    setScheduledDate: (v: string) => void;
    duration: number;
    setDuration: (v: number) => void;
    location: string;
    setLocation: (v: string) => void;
    capacity: number;
    setCapacity: (v: number) => void;
    distributionList: string[];
    setDistributionList: (v: string[]) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    trainingType,
    setTrainingType,
    instructorType,
    setInstructorType,
    instructor,
    setInstructor,
    scheduledDate,
    setScheduledDate,
    duration,
    setDuration,
    location,
    setLocation,
    capacity,
    setCapacity,
    distributionList,
    setDistributionList,
}) => {
    return (
        <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Training Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., GMP Basic Training"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Describe the training objectives and content..."
                        />
                    </div>
                </div>

                {/* Training Type */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Training Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={trainingType}
                            onChange={setTrainingType}
                            options={[
                                { label: "GMP", value: "GMP" },
                                { label: "Safety", value: "Safety" },
                                { label: "Technical", value: "Technical" },
                                { label: "Compliance", value: "Compliance" },
                                { label: "SOP", value: "SOP" },
                                { label: "Software", value: "Software" },
                            ]}
                        />
                    </div>
                </div>

                {/* Instructor */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-3">
                        <RadioGroup
                            label="Instructor"
                            name="instructorType"
                            value={instructorType}
                            onChange={(value) => {
                                setInstructorType(value as "internal" | "external");
                                setInstructor("");
                            }}
                            options={[
                                { label: "Internal expert", value: "internal" },
                                { label: "External expert/consultant", value: "external" },
                            ]}
                            layout="horizontal"
                            required
                        />

                        {/* Conditional rendering based on instructorType */}
                        {instructorType === "internal" ? (
                            <Select
                                value={instructor}
                                onChange={setInstructor}
                                options={[
                                    { label: "Dr. John Smith - Quality Manager", value: "john_smith" },
                                    { label: "Ms. Sarah Johnson - QA Lead", value: "sarah_johnson" },
                                    { label: "Mr. Michael Brown - Production Manager", value: "michael_brown" },
                                    { label: "Dr. Emily Davis - R&D Director", value: "emily_davis" },
                                    { label: "Mr. David Wilson - Compliance Officer", value: "david_wilson" },
                                ]}
                                placeholder="Select internal instructor..."
                            />
                        ) : (
                            <Input
                                type="text"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                placeholder="Enter external instructor name..."
                            />
                        )}
                    </div>
                </div>

                {/* Scheduled Date */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Scheduled Date <span className="text-red-500">*</span>
                        </label>
                        <DateTimePicker
                            value={scheduledDate}
                            onChange={setScheduledDate}
                            placeholder="Select date and time"
                        />
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Duration (hours) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Training Room A"
                        />
                    </div>
                </div>

                {/* Capacity */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Capacity <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                        />
                    </div>
                </div>

                {/* Distribution List */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Distribution List <span className="text-red-500">*</span>
                        </label>
                        <MultiSelect
                            value={distributionList}
                            onChange={(selected) => setDistributionList(selected as string[])}
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
            </div>
        </div>
    );
};
