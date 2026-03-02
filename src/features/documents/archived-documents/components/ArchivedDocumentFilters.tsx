import React from 'react';
import { Search, Calendar, User, Clock } from 'lucide-react';
import { Select } from '@/components/ui/select/Select';
import { DateRangePicker } from '@/components/ui/datetime-picker/DateRangePicker';
import { FilterCard } from '@/components/ui/card/FilterCard';
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
        <FilterCard>
            <FilterCard.Row>
                {/* Search Input */}
                <FilterCard.Item span={3} mdSpan={2}>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by code, document name..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 h-9 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </FilterCard.Item>

                {/* Archive Date Range */}
                <FilterCard.Item span={3}>
                    <DateRangePicker
                        label="Archived Date Range"
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                        placeholder="Select date range"
                    />
                </FilterCard.Item>

                {/* Last Approver Filter */}
                <FilterCard.Item span={3}>
                    <Select
                        label="Last Approver"
                        value={lastApproverFilter}
                        onChange={onLastApproverChange}
                        options={approverOptions}
                    />
                </FilterCard.Item>

                {/* Retention Status Filter */}
                <FilterCard.Item span={3}>
                    <Select
                        label="Retention Status"
                        value={retentionFilter}
                        onChange={onRetentionFilterChange}
                        options={retentionOptions}
                    />
                </FilterCard.Item>
            </FilterCard.Row>
        </FilterCard>
    );
};
