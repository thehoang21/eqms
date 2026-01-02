import React from 'react';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';

type DocumentType = "SOP" | "Policy" | "Form" | "Report" | "Specification" | "Protocol";
type DocumentStatus = "Draft" | "Pending Review" | "Pending Approval" | "Approved" | "Effective" | "Archive";

interface TableColumn {
    id: string;
    label: string;
    visible: boolean;
    order: number;
    locked?: boolean;
}

interface DocumentFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: DocumentStatus | "All";
    onStatusChange: (value: DocumentStatus | "All") => void;
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
    effectiveFromDate: string;
    onEffectiveFromDateChange: (value: string) => void;
    effectiveToDate: string;
    onEffectiveToDateChange: (value: string) => void;
    validFromDate: string;
    onValidFromDateChange: (value: string) => void;
    validToDate: string;
    onValidToDateChange: (value: string) => void;
    columns: TableColumn[];
    onColumnsChange: (columns: TableColumn[]) => void;
    ColumnCustomizerComponent: React.ComponentType<{
        columns: TableColumn[];
        onColumnsChange: (columns: TableColumn[]) => void;
    }>;
    showTypeFilter?: boolean;
    showDepartmentFilter?: boolean;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
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
    effectiveFromDate,
    onEffectiveFromDateChange,
    effectiveToDate,
    onEffectiveToDateChange,
    validFromDate,
    onValidFromDateChange,
    validToDate,
    onValidToDateChange,
    columns,
    onColumnsChange,
    ColumnCustomizerComponent,
    showTypeFilter = true,
    showDepartmentFilter = true,
}) => {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
                {/* Row 1: Search, Status, Type, Department */}

                {/* Search */}
                <div className="xl:col-span-4 w-full">
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-4.5 w-4.5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by document name, ID, author, department, opened by..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-3 h-11 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Display Columns */}
                <div className="xl:col-span-2 w-full">
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Display
                    </label>
                    <ColumnCustomizerComponent
                        columns={columns}
                        onColumnsChange={onColumnsChange}
                    />
                </div>

                {/* Type Filter */}
                {showTypeFilter && (
                    <div className="xl:col-span-3 w-full">
                        <Select
                            label="Document Type"
                            value={typeFilter}
                            onChange={(value) => onTypeChange(value as DocumentType | "All")}
                            options={[
                                { label: "All", value: "All" },
                                { label: "SOP", value: "SOP" },
                                { label: "Policy", value: "Policy" },
                                { label: "Form", value: "Form" },
                                { label: "Report", value: "Report" },
                                { label: "Specification", value: "Specification" },
                                { label: "Protocol", value: "Protocol" },
                            ]}
                            placeholder="Select type"
                            searchPlaceholder="Search type..."
                        />
                    </div>
                )}

                {/* Department Filter */}
                {showDepartmentFilter && (
                    <div className="xl:col-span-3 w-full">
                        <Select
                            label="Department"
                            value={departmentFilter}
                            onChange={(value) => onDepartmentChange(value)}
                            options={[
                                { label: "All", value: "All" },
                                { label: "Quality Assurance", value: "Quality Assurance" },
                                { label: "Quality Management", value: "Quality Management" },
                                { label: "Quality Control", value: "Quality Control" },
                                { label: "Production", value: "Production" },
                                { label: "Engineering", value: "Engineering" },
                                { label: "Human Resources", value: "Human Resources" },
                                { label: "Validation", value: "Validation" },
                            ]}
                            placeholder="Select department"
                            searchPlaceholder="Search department..."
                        />
                    </div>
                )}

                {/* Row 2: Status Filter */}

                {/* Status Filter */}
                <div className="xl:col-span-3 w-full">
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(value) => onStatusChange(value as DocumentStatus | "All")}
                        options={[
                            { label: "All", value: "All" },
                            { label: "Draft", value: "Draft" },
                            { label: "Pending Review", value: "Pending Review" },
                            { label: "Pending Approval", value: "Pending Approval" },
                            { label: "Approved", value: "Approved" },
                            { label: "Effective", value: "Effective" },
                            { label: "Archive", value: "Archive" },
                        ]}
                        placeholder="Select status"
                        searchPlaceholder="Search status..."
                    />
                </div>

                {/* Row 2: Author, Created From/To */}

                {/* Author Filter */}
                <div className="xl:col-span-3 w-full">
                    <Select
                        label="Author"
                        value={authorFilter}
                        onChange={(value) => onAuthorChange(value)}
                        options={[
                            { label: "All", value: "All" },
                            { label: "Dr. Sarah Johnson", value: "Dr. Sarah Johnson" },
                            { label: "Michael Chen", value: "Michael Chen" },
                            { label: "Emma Williams", value: "Emma Williams" },
                            { label: "John Davis", value: "John Davis" },
                            { label: "Dr. Lisa Park", value: "Dr. Lisa Park" },
                            { label: "Robert Taylor", value: "Robert Taylor" },
                            { label: "Amanda Martinez", value: "Amanda Martinez" },
                            { label: "David Brown", value: "David Brown" },
                            { label: "Jessica Lee", value: "Jessica Lee" },
                        ]}
                        placeholder="Select author"
                        searchPlaceholder="Search author..."
                    />
                </div>

                {/* Created Date - From */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Created From"
                        value={createdFromDate}
                        onChange={(dateStr) => onCreatedFromDateChange(dateStr)}
                        placeholder="Select start date"
                    />
                </div>

                {/* Created Date - To */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Created To"
                        value={createdToDate}
                        onChange={(dateStr) => onCreatedToDateChange(dateStr)}
                        placeholder="Select end date"
                    />
                </div>

                {/* Row 3: Effective From/To, Valid Until From/To */}

                {/* Effective Date - From */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Effective From"
                        value={effectiveFromDate}
                        onChange={(dateStr) => onEffectiveFromDateChange(dateStr)}
                        placeholder="Select start date"
                    />
                </div>

                {/* Effective Date - To */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Effective To"
                        value={effectiveToDate}
                        onChange={(dateStr) => onEffectiveToDateChange(dateStr)}
                        placeholder="Select end date"
                    />
                </div>

                {/* Valid Until - From */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Valid From"
                        value={validFromDate}
                        onChange={(dateStr) => onValidFromDateChange(dateStr)}
                        placeholder="Select start date"
                    />
                </div>

                {/* Valid Until - To */}
                <div className="xl:col-span-3 w-full">
                    <DateTimePicker
                        label="Valid To"
                        value={validToDate}
                        onChange={(dateStr) => onValidToDateChange(dateStr)}
                        placeholder="Select end date"
                    />
                </div>
            </div>
        </div>
    );
};
