import React from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type TemplateStatus = "Draft" | "Active" | "Archived";

interface TableColumn {
    id: string;
    label: string;
    visible: boolean;
    order: number;
    locked?: boolean;
}

interface TemplateFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: TemplateStatus | "All";
    onStatusChange: (value: TemplateStatus | "All") => void;
    typeFilter: DocumentType | "All";
    onTypeChange: (value: DocumentType | "All") => void;
    departmentFilter: string;
    onDepartmentChange: (value: string) => void;
    authorFilter: string;
    onAuthorChange: (value: string) => void;
    createdFromDate: string;
    onCreatedFromDateChange: (value: string) => void;
    createdToDate: string;
    onCreatedToDateChange: (value: string) => void;

}

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    typeFilter,
    onTypeChange,
    departmentFilter,
    onDepartmentChange,
    authorFilter,
    onAuthorChange,
    createdFromDate,
    onCreatedFromDateChange,
    createdToDate,
    onCreatedToDateChange,
}) => {
    const statusOptions = [
        { label: "All Statuses", value: "All" },
        { label: "Draft", value: "Draft" },
        { label: "Active", value: "Active" },
        { label: "Archived", value: "Archived" },
    ];

    const typeOptions = [
        { label: "All Types", value: "All" },
        { label: "SOP", value: "SOP" },
        { label: "Policy", value: "Policy" },
        { label: "Form", value: "Form" },
        { label: "Report", value: "Report" },
        { label: "Specification", value: "Specification" },
        { label: "Protocol", value: "Protocol" },
    ];

    const departmentOptions = [
        { label: "All Departments", value: "All" },
        { label: "Quality Assurance", value: "Quality Assurance" },
        { label: "Quality Control", value: "Quality Control" },
        { label: "Human Resources", value: "Human Resources" },
        { label: "Validation", value: "Validation" },
        { label: "Production", value: "Production" },
        { label: "Engineering", value: "Engineering" },
    ];

    const authorOptions = [
        { label: "All Authors", value: "All" },
        { label: "Dr. Sarah Johnson", value: "Dr. Sarah Johnson" },
        { label: "John Smith", value: "John Smith" },
        { label: "Emily Davis", value: "Emily Davis" },
        { label: "Michael Brown", value: "Michael Brown" },
    ];

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
                {/* Search Input */}
                <div className="xl:col-span-3">
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, author..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="xl:col-span-3">
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(value) => onStatusChange(value as TemplateStatus | "All")}
                        options={statusOptions}
                        placeholder="Select Status"
                    />
                </div>

                {/* Type Filter */}
                <div className="xl:col-span-3">
                    <Select
                        label="Document Type"
                        value={typeFilter}
                        onChange={(value) => onTypeChange(value as DocumentType | "All")}
                        options={typeOptions}
                        placeholder="Select Type"
                    />
                </div>

                {/* Department Filter */}
                <div className="xl:col-span-3">
                    <Select
                        label="Department"
                        value={departmentFilter}
                        onChange={onDepartmentChange}
                        options={departmentOptions}
                        placeholder="Select Department"
                    />
                </div>

                {/* Author Filter */}
                <div className="xl:col-span-4">
                    <Select
                        label="Author"
                        value={authorFilter}
                        onChange={onAuthorChange}
                        options={authorOptions}
                        placeholder="Select Author"
                    />
                </div>

                {/* Created From Date */}
                <div className="xl:col-span-4">
                    <DateTimePicker
                        label="Created From"
                        value={createdFromDate}
                        onChange={onCreatedFromDateChange}
                        placeholder="Select start date"
                    />
                </div>

                {/* Created To Date */}
                <div className="xl:col-span-4">
                    <DateTimePicker
                        label="Created To"
                        value={createdToDate}
                        onChange={onCreatedToDateChange}
                        placeholder="Select end date"
                    />
                </div>
            </div>
        </div>
    );
};
