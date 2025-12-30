import React from 'react';
import { Search, Calendar, User, Clock } from 'lucide-react';
import { Select } from '../../../../components/ui/select/Select';
import { DateTimePicker } from '../../../../components/ui/datetime-picker/DateTimePicker';
import { RetentionFilter } from '../types';

interface ArchivedDocumentFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    lastApproverFilter: string;
    onLastApproverChange: (value: string) => void;
    retentionFilter: RetentionFilter;
    onRetentionFilterChange: (value: RetentionFilter) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
}

export const ArchivedDocumentFilters: React.FC<ArchivedDocumentFiltersProps> = ({
    searchQuery,
    onSearchChange,
    lastApproverFilter,
    onLastApproverChange,
    retentionFilter,
    onRetentionFilterChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
}) => {
    const approverOptions = [
        { label: 'All Approvers', value: 'all' },
        { label: 'John Smith', value: 'John Smith' },
        { label: 'Sarah Johnson', value: 'Sarah Johnson' },
        { label: 'Michael Chen', value: 'Michael Chen' },
    ];

    const retentionOptions = [
        { label: 'All Documents', value: 'all' },
        { label: 'Valid Retention', value: 'valid' },
        { label: 'Expiring Soon (≤30 days)', value: 'expiring-soon' },
        { label: 'Expired - Needs Destruction', value: 'expired' },
    ];

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
                {/* Search Input */}
                <div className="xl:col-span-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by code, document name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 h-11 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Archive Date Range - Start */}
                <div className="xl:col-span-2">
                    <DateTimePicker
                        label="Archived From"
                        value={startDate}
                        onChange={onStartDateChange}
                        placeholder="Select start date"
                    />
                </div>

                {/* Archive Date Range - End */}
                <div className="xl:col-span-2">
                    <DateTimePicker
                        label="Archived To"
                        value={endDate}
                        onChange={onEndDateChange}
                        placeholder="Select end date"
                    />
                </div>

                {/* Last Approver Filter */}
                <div className="xl:col-span-2">
                    <Select
                        label="Last Approver"
                        value={lastApproverFilter}
                        onChange={onLastApproverChange}
                        options={approverOptions}
                    />
                </div>

                {/* Retention Status Filter */}
                <div className="xl:col-span-2">
                    <Select
                        label="Retention Status"
                        value={retentionFilter}
                        onChange={onRetentionFilterChange}
                        options={retentionOptions}
                    />
                </div>
            </div>
        </div>
    );
};
