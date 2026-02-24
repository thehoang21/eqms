import React from "react";
import { Upload, X, Paperclip, Check, RefreshCw } from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { MultiSelect } from "@/components/ui/select/MultiSelect";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { Input, Textarea } from "@/components/ui/form/ResponsiveForm";
import { RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { cn } from "@/components/ui/utils";
import { TrainingType, TrainingMethod, Recurrence } from "../../types";

// Option lists (shared between edit and readOnly modes)
const TRAINING_TYPE_OPTIONS = [
    { label: "GMP", value: "GMP" },
    { label: "Safety", value: "Safety" },
    { label: "Technical", value: "Technical" },
    { label: "Compliance", value: "Compliance" },
    { label: "SOP", value: "SOP" },
    { label: "Software", value: "Software" },
];

const TRAINING_METHOD_OPTIONS = [
    { label: "Read & Understood", value: "Read & Understood" },
    { label: "Quiz (Paper-based/Manual)", value: "Quiz (Paper-based/Manual)" },
    { label: "Hands-on / OJT", value: "Hands-on/OJT" },
];

const INSTRUCTOR_OPTIONS = [
    { label: "Dr. John Smith - Quality Manager", value: "john_smith" },
    { label: "Ms. Sarah Johnson - QA Lead", value: "sarah_johnson" },
    { label: "Mr. Michael Brown - Production Manager", value: "michael_brown" },
    { label: "Dr. Emily Davis - R&D Director", value: "emily_davis" },
    { label: "Mr. David Wilson - Compliance Officer", value: "david_wilson" },
];

const DEPARTMENT_OPTIONS = [
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
];

const USER_OPTIONS = [
    { label: "John Smith - Quality Manager", value: "john_smith" },
    { label: "Sarah Johnson - QA Lead", value: "sarah_johnson" },
    { label: "Michael Brown - Production Manager", value: "michael_brown" },
    { label: "Emily Davis - R&D Director", value: "emily_davis" },
    { label: "David Wilson - Compliance Officer", value: "david_wilson" },
    { label: "Lisa Anderson - QC Analyst", value: "lisa_anderson" },
    { label: "Robert Taylor - Production Supervisor", value: "robert_taylor" },
    { label: "Jennifer Martinez - QA Specialist", value: "jennifer_martinez" },
    { label: "William Garcia - Lab Technician", value: "william_garcia" },
    { label: "Mary Robinson - Regulatory Specialist", value: "mary_robinson" },
    { label: "James Lee - Warehouse Manager", value: "james_lee" },
    { label: "Patricia Clark - HR Manager", value: "patricia_clark" },
    { label: "Thomas White - IT Manager", value: "thomas_white" },
    { label: "Linda Harris - Finance Director", value: "linda_harris" },
    { label: "Charles Lewis - Safety Officer", value: "charles_lewis" },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/** Read-only display field */
const ReadOnlyField: React.FC<{ value: string | number | undefined | null; placeholder?: string }> = ({ value, placeholder }) => (
    <p className="text-sm text-slate-900 h-10 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-lg">
        {value || <span className="text-slate-400">{placeholder || "—"}</span>}
    </p>
);

interface BasicInfoTabProps {
    readOnly?: boolean;
    // Data props
    title: string;
    description: string;
    trainingType: TrainingType;
    trainingMethod: TrainingMethod;
    instructorType: "internal" | "external";
    instructor: string;
    scheduledDate: string;
    duration: number;
    location: string;
    capacity: number;
    distributionList: string[];
    recurrence: Recurrence;
    linkedDocumentId: string;
    linkedDocumentTitle: string;
    evidenceFiles: File[];
    // Setter props (optional — only needed when not readOnly)
    setTitle?: (v: string) => void;
    setDescription?: (v: string) => void;
    setTrainingType?: (v: TrainingType) => void;
    setTrainingMethod?: (v: TrainingMethod) => void;
    setInstructorType?: (v: "internal" | "external") => void;
    setInstructor?: (v: string) => void;
    setScheduledDate?: (v: string) => void;
    setDuration?: (v: number) => void;
    setLocation?: (v: string) => void;
    setCapacity?: (v: number) => void;
    setDistributionList?: (v: string[]) => void;
    setRecurrence?: (v: Recurrence) => void;
    setLinkedDocumentId?: (v: string) => void;
    setLinkedDocumentTitle?: (v: string) => void;
    setEvidenceFiles?: (v: File[]) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
    readOnly = false,
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
    const [distributionType, setDistributionType] = React.useState<"departments" | "users">("departments");

    // Resolve label from value for readOnly display
    const findLabel = (options: { label: string; value: string }[], value: string) =>
        options.find((o) => o.value === value)?.label || value;

    return (
        <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Course Name/ID {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={title} />
                        ) : (
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle?.(e.target.value)}
                                placeholder="e.g., GMP-TRN-001 or GMP Basic Training"
                                className="text-xs md:text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Description {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <p className="text-sm text-slate-900 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg leading-relaxed whitespace-pre-wrap min-h-[4rem]">
                                {description || <span className="text-slate-400">—</span>}
                            </p>
                        ) : (
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription?.(e.target.value)}
                                rows={3}
                                placeholder="Describe the training objectives and content..."
                            />
                        )}
                    </div>
                </div>

                {/* Training Type */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Training Type {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={findLabel(TRAINING_TYPE_OPTIONS, trainingType)} />
                        ) : (
                            <Select
                                value={trainingType}
                                onChange={setTrainingType!}
                                options={TRAINING_TYPE_OPTIONS}
                            />
                        )}
                    </div>
                </div>

                {/* Training Method */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Training Method {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={findLabel(TRAINING_METHOD_OPTIONS, trainingMethod)} />
                        ) : (
                            <Select
                                value={trainingMethod}
                                onChange={(v) => setTrainingMethod?.(v as TrainingMethod)}
                                options={TRAINING_METHOD_OPTIONS}
                            />
                        )}
                        <p className="text-xs text-slate-500">
                            {trainingMethod === "Read & Understood" && "Employee reads document then confirms with e-signature."}
                            {trainingMethod === "Quiz (Paper-based/Manual)" && "Employee completes a paper-based exam graded manually by trainer/admin."}
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
                                if (!readOnly) {
                                    setInstructorType?.(value as "internal" | "external");
                                    setInstructor?.("");
                                }
                            }}
                            options={[
                                { label: "Internal expert", value: "internal" },
                                { label: "External expert/consultant", value: "external" },
                            ]}
                            layout="horizontal"
                            required={!readOnly}
                        />

                        {instructorType === "internal" ? (
                            <div className={cn(readOnly && "pointer-events-none")}>
                                <Select
                                    value={instructor}
                                    onChange={setInstructor!}
                                    options={INSTRUCTOR_OPTIONS}
                                    placeholder="Select internal instructor..."
                                />
                            </div>
                        ) : (
                            <Input
                                type="text"
                                value={instructor}
                                onChange={(e) => !readOnly && setInstructor?.(e.target.value)}
                                placeholder="Enter external instructor name..."
                                readOnly={readOnly}
                                className="text-xs md:text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Scheduled Date */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Scheduled Date {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={scheduledDate ? formatDate(scheduledDate) : undefined} />
                        ) : (
                            <DateTimePicker
                                value={scheduledDate}
                                onChange={setScheduledDate!}
                                placeholder="Select date and time"
                            />
                        )}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Duration (hours) {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={duration ? `${duration} hours` : undefined} />
                        ) : (
                            <Input
                                type="number"
                                min={1}
                                value={duration}
                                onChange={(e) => setDuration?.(parseInt(e.target.value) || 1)}
                                className="text-xs md:text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Location {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={location} />
                        ) : (
                            <Input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation?.(e.target.value)}
                                placeholder="e.g., Training Room A"
                                className="text-xs md:text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Capacity */}
                <div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Capacity {!readOnly && <span className="text-red-500">*</span>}
                        </label>
                        {readOnly ? (
                            <ReadOnlyField value={capacity ? `${capacity} participants` : undefined} />
                        ) : (
                            <Input
                                type="number"
                                min={1}
                                value={capacity}
                                onChange={(e) => setCapacity?.(parseInt(e.target.value) || 1)}
                                className="text-xs md:text-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Distribution List */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-3">
                        <RadioGroup
                            label="Target Audience"
                            name="distributionType"
                            value={distributionType}
                            onChange={(value) => {
                                if (!readOnly) {
                                    setDistributionType(value as "departments" | "users");
                                    setDistributionList?.([]);
                                }
                            }}
                            options={[
                                { label: "By Department", value: "departments" },
                                { label: "By Individual Users", value: "users" },
                            ]}
                            layout="horizontal"
                        />

                        {readOnly && distributionList.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
                                <div className="space-y-1.5">
                                    {distributionList.map((item, idx) => (
                                        <div key={idx} className="text-sm text-slate-700 py-1">
                                            • {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : readOnly ? (
                            <p className="text-sm text-slate-400 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">No target audience selected</p>
                        ) : (
                            <>
                                {distributionType === "departments" ? (
                                    <MultiSelect
                                        value={distributionList}
                                        onChange={(selected) => setDistributionList?.(selected as string[])}
                                        options={DEPARTMENT_OPTIONS}
                                        placeholder="Select departments..."
                                        enableSearch
                                        maxVisibleTags={3}
                                    />
                                ) : (
                                    <MultiSelect
                                        value={distributionList}
                                        onChange={(selected) => setDistributionList?.(selected as string[])}
                                        options={USER_OPTIONS}
                                        placeholder="Select users..."
                                        enableSearch
                                        maxVisibleTags={3}
                                    />
                                )}

                                <p className="text-xs text-slate-500">
                                    {distributionType === "departments"
                                        ? "Select departments whose employees will be assigned this training. You can also set this later."
                                        : "Select individual users to assign this training. You can also set this later."}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Linked Document */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Linked Document {!readOnly && <span className="text-xs font-normal text-slate-400">(optional)</span>}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                type="text"
                                value={linkedDocumentId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => !readOnly && setLinkedDocumentId?.(e.target.value)}
                                placeholder="Document ID, e.g. SOP.0045.02"
                                readOnly={readOnly}
                                className="text-xs md:text-sm"
                            />
                            <Input
                                type="text"
                                value={linkedDocumentTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => !readOnly && setLinkedDocumentTitle?.(e.target.value)}
                                placeholder="Document title"
                                readOnly={readOnly}
                                className="text-xs md:text-sm"
                            />
                        </div>
                        {!readOnly && (
                            <p className="text-xs text-slate-500">Link the SOP or controlled document this training is based on.</p>
                        )}
                    </div>
                </div>

                {/* Recurrence */}
                <div className="md:col-span-2">
                    <div className="flex flex-col gap-3">
                        <Checkbox
                            id="recurrence-enabled"
                            label="Enable Periodic Retraining"
                            checked={recurrence.enabled}
                            onChange={(v) => !readOnly && setRecurrence?.({ ...recurrence, enabled: v })}
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
                                            !readOnly && setRecurrence?.({ ...recurrence, intervalMonths: parseInt(e.target.value) || 12 })
                                        }
                                        readOnly={readOnly}
                                        className="text-xs md:text-sm"
                                    />
                                </div>
                                <label className="text-sm text-slate-700">months</label>
                            </div>
                        )}
                        {recurrence.enabled && (
                            <p className="text-xs text-slate-500 ml-6">
                                When due, employee status will automatically change from <strong>Completed</strong> to <strong>Required</strong> and a notification will be sent.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
