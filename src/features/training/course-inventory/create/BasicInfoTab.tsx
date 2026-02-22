import React, { useRef } from "react";
import { Upload, X, Paperclip } from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { MultiSelect } from "@/components/ui/select/MultiSelect";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { Input, Textarea } from "@/components/ui/form/ResponsiveForm";
import { RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { cn } from "@/components/ui/utils";
import { TrainingType, TrainingMethod, Recurrence } from "../../types";

interface BasicInfoTabProps {
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    trainingType: TrainingType;
    setTrainingType: (v: TrainingType) => void;
    trainingMethod: TrainingMethod;
    setTrainingMethod: (v: TrainingMethod) => void;
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
    recurrence: Recurrence;
    setRecurrence: (v: Recurrence) => void;
    linkedDocumentId: string;
    setLinkedDocumentId: (v: string) => void;
    linkedDocumentTitle: string;
    setLinkedDocumentTitle: (v: string) => void;
    evidenceFiles: File[];
    setEvidenceFiles: (v: File[]) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    trainingType,
    setTrainingType,
    trainingMethod,
    setTrainingMethod,
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
    recurrence,
    setRecurrence,
    linkedDocumentId,
    setLinkedDocumentId,
    linkedDocumentTitle,
    setLinkedDocumentTitle,
    evidenceFiles,
    setEvidenceFiles,
}) => {
    const evidenceInputRef = useRef<HTMLInputElement>(null);
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

                {/* Training Method */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Training Method <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={trainingMethod}
                            onChange={(v) => setTrainingMethod(v as TrainingMethod)}
                            options={[
                                { label: "Read & Understood", value: "Read & Understood" },
                                { label: "Theory Quiz", value: "Theory Quiz" },
                                { label: "Hands-on / OJT", value: "Hands-on/OJT" },
                            ]}
                        />
                        <p className="text-xs text-slate-500">
                            {trainingMethod === "Read & Understood" && "Employee reads document then confirms with e-signature."}
                            {trainingMethod === "Theory Quiz" && "Employee completes a multiple-choice quiz."}
                            {trainingMethod === "Hands-on/OJT" && "Trainer must sign off to confirm practical competency."}
                        </p>
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

                {/* Linked Document */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Linked Document <span className="text-xs font-normal text-slate-400">(optional)</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                type="text"
                                value={linkedDocumentId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedDocumentId(e.target.value)}
                                placeholder="Document ID, e.g. SOP.0045.02"
                            />
                            <Input
                                type="text"
                                value={linkedDocumentTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedDocumentTitle(e.target.value)}
                                placeholder="Document title"
                            />
                        </div>
                        <p className="text-xs text-slate-500">Link the SOP or controlled document this training is based on.</p>
                    </div>
                </div>

                {/* Recurrence */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-3">
                        <Checkbox
                            id="recurrence-enabled"
                            label="Enable Periodic Retraining"
                            checked={recurrence.enabled}
                            onChange={(v) => setRecurrence({ ...recurrence, enabled: v })}
                        />
                        {recurrence.enabled && (
                            <div className="flex items-center gap-3 ml-6">
                                <label className="text-sm text-slate-700 whitespace-nowrap">Retrain every</label>
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={recurrence.intervalMonths}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setRecurrence({ ...recurrence, intervalMonths: parseInt(e.target.value) || 12 })
                                        }
                                    />
                                </div>
                                <label className="text-sm text-slate-700">months</label>
                                <span className="text-xs text-slate-400">
                                    ({recurrence.intervalMonths === 12 ? "Annual" : recurrence.intervalMonths === 6 ? "Semi-annual" : recurrence.intervalMonths === 24 ? "Biennial" : `Every ${recurrence.intervalMonths} months`})
                                </span>
                            </div>
                        )}
                        {recurrence.enabled && (
                            <p className="text-xs text-slate-500 ml-6">
                                When due, employee status will automatically change from <strong>Completed</strong> to <strong>Required</strong> and a notification will be sent.
                            </p>
                        )}
                    </div>
                </div>

                {/* Evidence Upload */}
                {(trainingMethod === "Hands-on/OJT" || trainingMethod === "Read & Understood") && (
                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Evidence Upload <span className="text-xs font-normal text-slate-400">(attendance sheet, certificate, OJT record)</span>
                            </label>
                            <div
                                onClick={() => evidenceInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                            >
                                <Upload className="h-5 w-5 text-slate-400" />
                                <p className="text-sm text-slate-500">Click to upload or drag files here</p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10 MB each</p>
                            </div>
                            <input
                                ref={evidenceInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setEvidenceFiles([...evidenceFiles, ...Array.from(e.target.files)]);
                                    }
                                }}
                            />
                            {evidenceFiles.length > 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {evidenceFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                            <Paperclip className="h-4 w-4 text-slate-400 shrink-0" />
                                            <span className="text-sm text-slate-700 flex-1 truncate">{file.name}</span>
                                            <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setEvidenceFiles(evidenceFiles.filter((_, i) => i !== idx)); }}
                                                className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                            >
                                                <X className="h-3 w-3 text-slate-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
