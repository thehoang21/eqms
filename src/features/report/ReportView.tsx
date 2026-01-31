import React, { useState, useMemo } from 'react';
import { FileBarChart, Download, Filter, Calendar, TrendingUp, Users, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';
import { cn } from '@/components/ui/utils';

type ReportType = 'Document' | 'Training' | 'Deviation' | 'CAPA' | 'Change Control' | 'All';
type ReportFormat = 'PDF' | 'Excel' | 'CSV';
type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';

interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'doc-status',
    name: 'Document Status Report',
    type: 'Document',
    description: 'Overview of all documents by status, type, and department',
    icon: FileText,
  },
  {
    id: 'doc-expiry',
    name: 'Document Expiry Report',
    type: 'Document',
    description: 'Documents approaching expiration or review date',
    icon: Calendar,
  },
  {
    id: 'training-completion',
    name: 'Training Completion Report',
    type: 'Training',
    description: 'Training completion status by user and course',
    icon: Users,
  },
  {
    id: 'deviation-summary',
    name: 'Deviation Summary Report',
    type: 'Deviation',
    description: 'Summary of deviations by severity, status, and root cause',
    icon: AlertTriangle,
  },
  {
    id: 'capa-effectiveness',
    name: 'CAPA Effectiveness Report',
    type: 'CAPA',
    description: 'CAPA implementation and effectiveness tracking',
    icon: TrendingUp,
  },
];

export const ReportView: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('PDF');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('Monthly');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredTemplates = useMemo(() => {
    if (reportType === 'All') return REPORT_TEMPLATES;
    return REPORT_TEMPLATES.filter((template) => template.type === reportType);
  }, [reportType]);

  const handleGenerateReport = () => {
    console.log('Generating report:', {
      template: selectedTemplate,
      format: reportFormat,
      period: reportPeriod,
      dateFrom,
      dateTo,
    });
    // TODO: Implement report generation logic
  };

  return (
    <div className="space-y-5 lg:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Report</h1>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <span>Dashboard</span>
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-slate-700 font-medium">Report</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
          {/* Report Type */}
          <div className="xl:col-span-3">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(value) => setReportType(value as ReportType)}
              options={[
                { label: 'All Types', value: 'All' },
                { label: 'Document', value: 'Document' },
                { label: 'Training', value: 'Training' },
                { label: 'Deviation', value: 'Deviation' },
                { label: 'CAPA', value: 'CAPA' },
                { label: 'Change Control', value: 'Change Control' },
              ]}
            />
          </div>

          {/* Report Period */}
          <div className="xl:col-span-3">
            <Select
              label="Report Period"
              value={reportPeriod}
              onChange={(value) => setReportPeriod(value as ReportPeriod)}
              options={[
                { label: 'Daily', value: 'Daily' },
                { label: 'Weekly', value: 'Weekly' },
                { label: 'Monthly', value: 'Monthly' },
                { label: 'Quarterly', value: 'Quarterly' },
                { label: 'Yearly', value: 'Yearly' },
                { label: 'Custom', value: 'Custom' },
              ]}
            />
          </div>

          {/* Date From (only if Custom period) */}
          {reportPeriod === 'Custom' && (
            <>
              <div className="xl:col-span-3">
                <DateTimePicker
                  label="From Date"
                  value={dateFrom}
                  onChange={setDateFrom}
                  placeholder="Select start date"
                />
              </div>

              <div className="xl:col-span-3">
                <DateTimePicker
                  label="To Date"
                  value={dateTo}
                  onChange={setDateTo}
                  placeholder="Select end date"
                />
              </div>
            </>
          )}

          {/* Report Format */}
          <div className={cn('xl:col-span-3', reportPeriod !== 'Custom' && 'xl:col-start-10')}>
            <Select
              label="Export Format"
              value={reportFormat}
              onChange={(value) => setReportFormat(value as ReportFormat)}
              options={[
                { label: 'PDF', value: 'PDF' },
                { label: 'Excel', value: 'Excel' },
                { label: 'CSV', value: 'CSV' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Report Templates</h2>
          <span className="text-sm text-slate-500">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  'flex flex-col gap-3 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                      isSelected ? 'bg-emerald-100' : 'bg-slate-100'
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5', isSelected ? 'text-emerald-600' : 'text-slate-600')}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-medium mb-1',
                        isSelected ? 'text-emerald-900' : 'text-slate-900'
                      )}
                    >
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No report templates found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="default">
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
        <Button
          variant="default"
          size="default"
          disabled={!selectedTemplate}
          onClick={handleGenerateReport}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  );
};
