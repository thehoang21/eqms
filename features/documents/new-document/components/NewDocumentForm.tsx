import React from "react";
import { Calendar, User } from "lucide-react";
import { Select } from "../../../../components/ui/select/Select";
import { Checkbox } from "../../../../components/ui/checkbox/Checkbox";

interface NewDocumentFormProps {
    formData: {
        title: string;
        type: string;
        author: string;
        businessUnit: string;
        department: string;
        knowledgeBase: string;
        subType: string;
        periodicReviewCycle: number;
        periodicReviewNotification: number;
        language: string;
        description: string;
        isTemplate: boolean;
    };
    onChange: (data: any) => void;
}

export const NewDocumentForm: React.FC<NewDocumentFormProps> = ({
    formData,
    onChange,
}) => {
    const handleChange = (field: string, value: any) => {
        onChange({
            ...formData,
            [field]: value,
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                {/* Document Name */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Document Name
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Enter document name"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Document Type */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Document Type
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex-1">
                        <Select
                            value={formData.type}
                            onChange={(value) => handleChange("type", value)}
                            options={[
                                { label: "SOP", value: "SOP" },
                                { label: "Policy", value: "Policy" },
                                { label: "Form", value: "Form" },
                                { label: "Report", value: "Report" },
                                { label: "Specification", value: "Specification" },
                                { label: "Protocol", value: "Protocol" }
                            ]}
                            enableSearch={false}
                        />
                    </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Author
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => handleChange("author", e.target.value)}
                            placeholder="Enter author name"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <button className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                            <User className="h-4 w-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Business Unit */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Business Unit
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.businessUnit}
                            onChange={(e) => handleChange("businessUnit", e.target.value)}
                            placeholder="Enter business unit"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <button className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                            <User className="h-4 w-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Department
                    </label>
                    <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                        placeholder="Enter department"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Knowledge Base */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Knowledge Base
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.knowledgeBase}
                            onChange={(e) => handleChange("knowledgeBase", e.target.value)}
                            placeholder="Enter knowledge base"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <button className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                            <User className="h-4 w-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Sub-Type */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Sub-Type
                    </label>
                    <div className="flex-1">
                        <Select
                            value={formData.subType}
                            onChange={(value) => handleChange("subType", value)}
                            options={[
                                { label: "-- None --", value: "-- None --" }
                            ]}
                            enableSearch={false}
                        />
                    </div>
                </div>

                {/* Periodic Review Cycle */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Periodic Review Cycle (Months)
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.periodicReviewCycle}
                        onChange={(e) => handleChange("periodicReviewCycle", parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Periodic Review Notification */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Periodic Review Notification (Days)
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.periodicReviewNotification}
                        onChange={(e) => handleChange("periodicReviewNotification", parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                {/* Language */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Language
                    </label>
                    <div className="flex-1">
                        <Select
                            value={formData.language}
                            onChange={(value) => handleChange("language", value)}
                            options={[
                                { label: "English", value: "English" },
                                { label: "Vietnamese", value: "Vietnamese" }
                            ]}
                            enableSearch={false}
                        />
                    </div>
                </div>

                {/* Is Template */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0">
                        Is Template?
                    </label>
                    <div className="flex-1">
                        <Checkbox
                            id="isTemplate"
                            checked={formData.isTemplate}
                            onChange={(checked) => handleChange("isTemplate", checked)}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex gap-4">
                    <label className="text-sm font-medium text-slate-700 text-left w-56 flex-shrink-0 pt-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Enter document description"
                        rows={4}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    />
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Document Creation Information</p>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Document will be created with <strong>Draft</strong> status</li>
                            <li>• Document Number will be auto-generated upon saving</li>
                            <li>• Effective Date will be set when document is approved</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
