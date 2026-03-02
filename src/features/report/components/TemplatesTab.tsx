import { useState, useMemo } from 'react';
import { FileBarChart, Download, Filter, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';
import { DateRangePicker } from '@/components/ui/datetime-picker/DateRangePicker';
import { cn } from '@/components/ui/utils';
import type { ReportType, ReportFormat, ReportPeriod } from '../types';
import { REPORT_TEMPLATES, COMPLIANCE_TEMPLATES } from '../data';

/**
 * Custom hook managing the Templates & Compliance tabs.
 * Returns `filterElement` (renders inside the unified card) and `contentElement` (renders below).
 */
export function useTemplatesTab(mode: 'templates' | 'compliance') {
  const [reportType, setReportType] = useState<ReportType>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('PDF');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('Monthly');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTemplates = useMemo(() => {
    const templates = mode === 'compliance' ? COMPLIANCE_TEMPLATES : REPORT_TEMPLATES;
    if (reportType === 'All') return templates;
    return templates.filter((t) => t.type === reportType);
  }, [reportType, mode]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  // --- Filter section (inside the unified card) ---
  const filterElement = (
    <div className="p-4 lg:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        {/* Report Category */}
        <div className="xl:col-span-3">
          <Select
            label="Report Category"
            value={reportType}
            onChange={(value) => setReportType(value as ReportType)}
            options={
              mode === 'compliance'
                ? [{ label: 'All Compliance Reports', value: 'All' }]
                : [
                    { label: 'All Categories', value: 'All' },
                    { label: 'Document', value: 'Document' },
                    { label: 'Training', value: 'Training' },
                    { label: 'Deviation', value: 'Deviation' },
                    { label: 'CAPA', value: 'CAPA' },
                    { label: 'Change Control', value: 'Change Control' },
                    { label: 'Complaint', value: 'Complaint' },
                    { label: 'Audit', value: 'Audit' },
                  ]
            }
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
              { label: 'Custom Range', value: 'Custom' },
            ]}
          />
        </div>

        {/* Date range (only if Custom period) */}
        {reportPeriod === 'Custom' && (
          <div className="xl:col-span-3">
            <DateRangePicker
              label="Date Range"
              startDate={dateFrom}
              endDate={dateTo}
              onStartDateChange={setDateFrom}
              onEndDateChange={setDateTo}
              placeholder="Select date range"
            />
          </div>
        )}

        {/* Export Format */}
        <div className="xl:col-span-3">
          <Select
            label="Export Format"
            value={reportFormat}
            onChange={(value) => setReportFormat(value as ReportFormat)}
            options={[
              { label: 'PDF Document', value: 'PDF' },
              { label: 'Excel Spreadsheet', value: 'Excel' },
              { label: 'CSV Data File', value: 'CSV' },
            ]}
          />
        </div>
      </div>
    </div>
  );

  // --- Content section (below the unified card) ---
  const contentElement = (
    <>
      {/* Report Templates Grid */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {mode === 'compliance'
                ? 'Regulatory Compliance Reports'
                : 'Standard Report Templates'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'compliance'
                ? 'Pre-configured reports for EU-GMP, FDA, and other regulatory requirements'
                : 'Select a report template to generate insights from your QMS data'}
            </p>
          </div>
          <span className="text-sm text-slate-500">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
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
                      className={cn(
                        'h-5 w-5',
                        isSelected ? 'text-emerald-600' : 'text-slate-600'
                      )}
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
                    {template.regulatoryRef && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                        <ShieldAlert className="h-3 w-3" />
                        {template.regulatoryRef}
                      </div>
                    )}
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setReportType('All');
            setReportPeriod('Monthly');
            setSelectedTemplate('');
            setDateFrom('');
            setDateTo('');
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={!selectedTemplate || isGenerating}
          onClick={handleGenerateReport}
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </>
  );

  return { filterElement, contentElement };
}
