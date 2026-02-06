import React, { useState, useMemo } from 'react';
import {
  FileBarChart,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Settings,
  History,
  Eye,
  BarChart3,
  FileX,
  BookOpen,
  ShieldAlert,
  ClipboardCheck,
  GitBranch,
  MessageSquareWarning,
  Play,
  Pause,
  Trash2,
  Edit,
  MoreVertical,
  Search,
  RefreshCw,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button/Button';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { cn } from '@/components/ui/utils';
import { IconSmartHome } from '@tabler/icons-react';

// --- Types ---
type ReportType = 'Document' | 'Training' | 'Deviation' | 'CAPA' | 'Change Control' | 'Complaint' | 'Audit' | 'Compliance' | 'All';
type ReportFormat = 'PDF' | 'Excel' | 'CSV';
type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
type TabView = 'templates' | 'history' | 'scheduled' | 'compliance';
type ReportStatus = 'Completed' | 'In Progress' | 'Failed';
type ScheduleStatus = 'Active' | 'Paused' | 'Expired';

interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  regulatoryRef?: string;
}

interface ReportHistory {
  id: string;
  reportName: string;
  type: ReportType;
  format: ReportFormat;
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: ReportStatus;
  fileSize: string;
}

interface ScheduledReport {
  id: string;
  reportName: string;
  type: ReportType;
  schedule: string;
  nextRun: string;
  recipients: string[];
  status: ScheduleStatus;
  lastRun: string;
}

// --- Report Templates ---
const REPORT_TEMPLATES: ReportTemplate[] = [
  // Document Reports
  {
    id: 'doc-status',
    name: 'Document Status Report',
    type: 'Document',
    description: 'Overview of all documents by status, type, and department. Tracks document lifecycle.',
    icon: FileText,
  },
  {
    id: 'doc-expiry',
    name: 'Document Expiry Report',
    type: 'Document',
    description: 'Documents approaching expiration or review date. Critical for compliance.',
    icon: Calendar,
    regulatoryRef: 'EU-GMP Chapter 4',
  },
  {
    id: 'doc-version-control',
    name: 'Document Version Control Report',
    type: 'Document',
    description: 'Tracks all document revisions, changes, and version history.',
    icon: GitBranch,
  },
  
  // Training Reports
  {
    id: 'training-completion',
    name: 'Training Completion Report',
    type: 'Training',
    description: 'Training completion status by user and course. Shows compliance percentage.',
    icon: Users,
    regulatoryRef: 'EU-GMP Chapter 2',
  },
  {
    id: 'training-overdue',
    name: 'Training Overdue Report',
    type: 'Training',
    description: 'List of overdue training assignments by user and department.',
    icon: Clock,
  },
  {
    id: 'training-effectiveness',
    name: 'Training Effectiveness Report',
    type: 'Training',
    description: 'Measures training effectiveness through assessments and performance metrics.',
    icon: TrendingUp,
  },

  // Deviation Reports
  {
    id: 'deviation-summary',
    name: 'Deviation Summary Report',
    type: 'Deviation',
    description: 'Summary of deviations by severity, status, and root cause. Includes trending.',
    icon: AlertTriangle,
    regulatoryRef: 'EU-GMP Chapter 8',
  },
  {
    id: 'deviation-rca',
    name: 'Root Cause Analysis Report',
    type: 'Deviation',
    description: 'Detailed root cause analysis for deviations with CAPA linkage.',
    icon: BarChart3,
  },
  {
    id: 'deviation-closure',
    name: 'Deviation Closure Time Report',
    type: 'Deviation',
    description: 'Tracks time to close deviations. Identifies bottlenecks in investigation.',
    icon: Clock,
  },

  // CAPA Reports
  {
    id: 'capa-effectiveness',
    name: 'CAPA Effectiveness Report',
    type: 'CAPA',
    description: 'CAPA implementation and effectiveness tracking. Verifies corrective actions work.',
    icon: CheckCircle2,
    regulatoryRef: 'FDA 21 CFR 820.100',
  },
  {
    id: 'capa-aging',
    name: 'CAPA Aging Report',
    type: 'CAPA',
    description: 'Lists CAPAs that are overdue or approaching deadline.',
    icon: Clock,
  },
  {
    id: 'capa-trending',
    name: 'CAPA Trending Report',
    type: 'CAPA',
    description: 'Identifies recurring issues and CAPA patterns over time.',
    icon: TrendingUp,
  },

  // Change Control Reports
  {
    id: 'change-summary',
    name: 'Change Control Summary',
    type: 'Change Control',
    description: 'Overview of all changes by type, status, and impact assessment.',
    icon: RefreshCw,
  },
  {
    id: 'change-impact',
    name: 'Change Impact Assessment Report',
    type: 'Change Control',
    description: 'Detailed impact assessment for approved changes on systems and processes.',
    icon: ShieldAlert,
  },

  // Complaint Reports
  {
    id: 'complaint-trend',
    name: 'Complaint Trend Analysis',
    type: 'Complaint',
    description: 'Analyzes complaint trends by product, category, and severity.',
    icon: MessageSquareWarning,
    regulatoryRef: 'EU-GMP Chapter 8',
  },

  // Audit Reports
  {
    id: 'audit-trail',
    name: 'Audit Trail Report',
    type: 'Audit',
    description: 'Complete audit trail of system activities by user, module, and time range.',
    icon: History,
    regulatoryRef: 'FDA 21 CFR Part 11',
  },
  {
    id: 'user-activity',
    name: 'User Activity Report',
    type: 'Audit',
    description: 'Tracks user login/logout, actions performed, and access patterns.',
    icon: Users,
  },
];

// --- Compliance Report Templates ---
const COMPLIANCE_TEMPLATES: ReportTemplate[] = [
  {
    id: 'comp-annex11',
    name: 'EU-GMP Annex 11 Compliance Report',
    type: 'Compliance',
    description: 'Comprehensive compliance report for computerized systems per EU-GMP Annex 11.',
    icon: ShieldAlert,
    regulatoryRef: 'EU-GMP Annex 11',
  },
  {
    id: 'comp-21cfr11',
    name: 'FDA 21 CFR Part 11 Compliance Report',
    type: 'Compliance',
    description: 'Electronic records and electronic signatures compliance report.',
    icon: ClipboardCheck,
    regulatoryRef: 'FDA 21 CFR Part 11',
  },
  {
    id: 'comp-data-integrity',
    name: 'Data Integrity Report (ALCOA+)',
    type: 'Compliance',
    description: 'Evaluates data integrity controls: Attributable, Legible, Contemporaneous, Original, Accurate.',
    icon: ClipboardCheck,
    regulatoryRef: 'MHRA GXP Guidance',
  },
  {
    id: 'comp-batch-release',
    name: 'Batch Release Report',
    type: 'Compliance',
    description: 'Quality review of batch records for product release authorization.',
    icon: FileText,
    regulatoryRef: 'EU-GMP Chapter 6',
  },
  {
    id: 'comp-quality-review',
    name: 'Quality Review Report',
    type: 'Compliance',
    description: 'Periodic quality review of documented procedures and compliance.',
    icon: BookOpen,
    regulatoryRef: 'EU-GMP Chapter 1',
  },
  {
    id: 'comp-apqr',
    name: 'Annual Product Quality Review (APQR)',
    type: 'Compliance',
    description: 'Annual review of product quality including trends, deviations, changes, and CAPAs.',
    icon: BarChart3,
    regulatoryRef: 'EU-GMP Chapter 1 (1.10)',
  },
];

// --- Mock Report History ---
const MOCK_REPORT_HISTORY: ReportHistory[] = [
  {
    id: '1',
    reportName: 'Document Status Report - Q4 2025',
    type: 'Document',
    format: 'PDF',
    generatedDate: '2026-01-28 14:35',
    generatedBy: 'John Smith',
    period: 'Q4 2025 (Oct-Dec)',
    status: 'Completed',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    reportName: 'Training Completion Report - December 2025',
    type: 'Training',
    format: 'Excel',
    generatedDate: '2026-01-15 09:20',
    generatedBy: 'Sarah Johnson',
    period: 'December 2025',
    status: 'Completed',
    fileSize: '856 KB',
  },
  {
    id: '3',
    reportName: 'CAPA Effectiveness Report - 2025',
    type: 'CAPA',
    format: 'PDF',
    generatedDate: '2026-01-10 16:45',
    generatedBy: 'Michael Chen',
    period: 'Full Year 2025',
    status: 'Completed',
    fileSize: '3.1 MB',
  },
  {
    id: '4',
    reportName: 'Deviation Summary Report - Q4 2025',
    type: 'Deviation',
    format: 'PDF',
    generatedDate: '2026-01-05 11:10',
    generatedBy: 'Emma Wilson',
    period: 'Q4 2025 (Oct-Dec)',
    status: 'Completed',
    fileSize: '1.8 MB',
  },
  {
    id: '5',
    reportName: 'Audit Trail Report - January 2026',
    type: 'Audit',
    format: 'CSV',
    generatedDate: '2026-01-30 08:00',
    generatedBy: 'System Admin',
    period: 'January 1-30, 2026',
    status: 'In Progress',
    fileSize: '-',
  },
  {
    id: '6',
    reportName: 'EU-GMP Annex 11 Compliance Report',
    type: 'Compliance',
    format: 'PDF',
    generatedDate: '2026-01-02 10:00',
    generatedBy: 'QA Director',
    period: 'Full Year 2025',
    status: 'Completed',
    fileSize: '4.2 MB',
  },
  {
    id: '7',
    reportName: 'Change Control Summary - 2025',
    type: 'Change Control',
    format: 'Excel',
    generatedDate: '2025-12-28 15:30',
    generatedBy: 'Change Coordinator',
    period: 'Full Year 2025',
    status: 'Completed',
    fileSize: '1.2 MB',
  },
];

// --- Mock Scheduled Reports ---
const MOCK_SCHEDULED_REPORTS: ScheduledReport[] = [
  {
    id: '1',
    reportName: 'Document Expiry Report',
    type: 'Document',
    schedule: 'Weekly - Monday 9:00 AM',
    nextRun: '2026-02-03 09:00',
    recipients: ['qa-team@company.com', 'quality-manager@company.com'],
    status: 'Active',
    lastRun: '2026-01-27 09:00',
  },
  {
    id: '2',
    reportName: 'Training Overdue Report',
    type: 'Training',
    schedule: 'Daily - 8:00 AM',
    nextRun: '2026-02-01 08:00',
    recipients: ['training-dept@company.com', 'hr@company.com'],
    status: 'Active',
    lastRun: '2026-01-31 08:00',
  },
  {
    id: '3',
    reportName: 'CAPA Aging Report',
    type: 'CAPA',
    schedule: 'Bi-weekly - Friday 10:00 AM',
    nextRun: '2026-02-07 10:00',
    recipients: ['capa-team@company.com'],
    status: 'Active',
    lastRun: '2026-01-24 10:00',
  },
  {
    id: '4',
    reportName: 'Monthly Quality Metrics',
    type: 'Compliance',
    schedule: 'Monthly - 1st day 7:00 AM',
    nextRun: '2026-03-01 07:00',
    recipients: ['senior-management@company.com', 'quality-dept@company.com'],
    status: 'Active',
    lastRun: '2026-01-01 07:00',
  },
  {
    id: '5',
    reportName: 'Deviation Summary Report',
    type: 'Deviation',
    schedule: 'Quarterly - 1st Monday 9:00 AM',
    nextRun: '2026-04-07 09:00',
    recipients: ['quality-manager@company.com'],
    status: 'Paused',
    lastRun: '2025-10-07 09:00',
  },
];

export const ReportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('templates');
  const [reportType, setReportType] = useState<ReportType>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('PDF');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('Monthly');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // History filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState<ReportType | 'All'>('All');
  const [historyStatus, setHistoryStatus] = useState<ReportStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const filteredTemplates = useMemo(() => {
    const templates = activeTab === 'compliance' ? COMPLIANCE_TEMPLATES : REPORT_TEMPLATES;
    if (reportType === 'All') return templates;
    return templates.filter((template) => template.type === reportType);
  }, [reportType, activeTab]);

  const filteredHistory = useMemo(() => {
    return MOCK_REPORT_HISTORY.filter((report) => {
      const matchesSearch = report.reportName.toLowerCase().includes(historySearch.toLowerCase());
      const matchesType = historyType === 'All' || report.type === historyType;
      const matchesStatus = historyStatus === 'All' || report.status === historyStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [historySearch, historyType, historyStatus]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Generating report:', {
      template: selectedTemplate,
      format: reportFormat,
      period: reportPeriod,
      dateFrom,
      dateTo,
    });
    setIsGenerating(false);
    // TODO: Implement actual report generation logic
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
    // TODO: Implement download logic
  };

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 200,
      });
      setOpenDropdownId(id);
    }
  };

  const handleScheduleAction = (id: string, action: 'pause' | 'resume' | 'delete' | 'edit') => {
    console.log(`Schedule action ${action} for:`, id);
    setOpenDropdownId(null);
    // TODO: Implement schedule actions
  };

  const getTypeColor = (type: ReportType) => {
    const colors: Record<string, string> = {
      Document: 'bg-blue-50 text-blue-700 border-blue-200',
      Training: 'bg-purple-50 text-purple-700 border-purple-200',
      Deviation: 'bg-red-50 text-red-700 border-red-200',
      CAPA: 'bg-amber-50 text-amber-700 border-amber-200',
      'Change Control': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      Complaint: 'bg-orange-50 text-orange-700 border-orange-200',
      Audit: 'bg-slate-50 text-slate-700 border-slate-200',
      Compliance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return colors[type] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-5 lg:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <IconSmartHome className="h-4 w-4" />
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-slate-700 font-medium">Reports</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'templates' as TabView, label: 'Report Templates', icon: FileBarChart },
            { id: 'compliance' as TabView, label: 'Compliance Reports', icon: ShieldAlert },
            { id: 'history' as TabView, label: 'Report History', icon: History },
            { id: 'scheduled' as TabView, label: 'Scheduled Reports', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedTemplate('');
                  setReportType('All');
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates & Compliance Tabs */}
      {(activeTab === 'templates' || activeTab === 'compliance') && (
        <>
          {/* Filters */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
              {/* Report Type */}
              <div className="xl:col-span-3">
                <Select
                  label="Report Category"
                  value={reportType}
                  onChange={(value) => setReportType(value as ReportType)}
                  options={
                    activeTab === 'compliance'
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
                    { label: 'PDF Document', value: 'PDF' },
                    { label: 'Excel Spreadsheet', value: 'Excel' },
                    { label: 'CSV Data File', value: 'CSV' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Report Templates Grid */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeTab === 'compliance' ? 'Regulatory Compliance Reports' : 'Standard Report Templates'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTab === 'compliance'
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
              size="default"
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
              size="default"
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
      )}

      {/* Report History Tab */}
      {activeTab === 'history' && (
        <>
          {/* History Filters */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
              <div className="xl:col-span-6">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Search Reports
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by report name..."
                    className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="xl:col-span-3">
                <Select
                  label="Report Type"
                  value={historyType}
                  onChange={(value) => setHistoryType(value as ReportType | 'All')}
                  options={[
                    { label: 'All Types', value: 'All' },
                    { label: 'Document', value: 'Document' },
                    { label: 'Training', value: 'Training' },
                    { label: 'Deviation', value: 'Deviation' },
                    { label: 'CAPA', value: 'CAPA' },
                    { label: 'Change Control', value: 'Change Control' },
                    { label: 'Audit', value: 'Audit' },
                    { label: 'Compliance', value: 'Compliance' },
                  ]}
                />
              </div>

              <div className="xl:col-span-3">
                <Select
                  label="Status"
                  value={historyStatus}
                  onChange={(value) => setHistoryStatus(value as ReportStatus | 'All')}
                  options={[
                    { label: 'All Status', value: 'All' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Failed', value: 'Failed' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Report Name
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Format
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Generated Date
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Generated By
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Period
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      File Size
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedHistory.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No reports found</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedHistory.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                          <div className="font-medium text-slate-900">{report.reportName}</div>
                        </td>
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            getTypeColor(report.type)
                          )}>
                            {report.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                          {report.format}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                          {report.generatedDate}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                          {report.generatedBy}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                          {report.period}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                          {report.fileSize}
                        </td>
                        <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                              report.status === 'Completed' &&
                                'bg-emerald-50 text-emerald-700 border-emerald-200',
                              report.status === 'In Progress' &&
                                'bg-blue-50 text-blue-700 border-blue-200',
                              report.status === 'Failed' && 'bg-red-50 text-red-700 border-red-200'
                            )}
                          >
                            {report.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {report.status === 'In Progress' && <Clock className="h-3.5 w-3.5" />}
                            {report.status === 'Failed' && <FileX className="h-3.5 w-3.5" />}
                            {report.status}
                          </span>
                        </td>
                        <td 
                          onClick={(e) => e.stopPropagation()}
                          className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                        >
                          {report.status === 'Completed' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDownloadReport(report.id)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Download"
                              >
                                <Download className="h-4 w-4 text-slate-600" />
                              </button>
                              <button
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Preview"
                              >
                                <Eye className="h-4 w-4 text-slate-600" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredHistory.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredHistory.length}
                itemsPerPage={itemsPerPage}
                showItemsPerPageSelector={false}
              />
            )}
          </div>
        </>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Automated Report Schedules</h2>
              <p className="text-sm text-slate-500 mt-1">
                Configure automatic report generation and distribution
              </p>
            </div>
            <Button variant="default" size="default">
              <Settings className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>

          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Report Name
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Schedule
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Next Run
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Last Run
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Recipients
                    </th>
                    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {MOCK_SCHEDULED_REPORTS.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <div className="font-medium text-slate-900">{schedule.reportName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                          getTypeColor(schedule.type)
                        )}>
                          {schedule.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {schedule.schedule}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {schedule.nextRun}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        {schedule.lastRun}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {schedule.recipients.length} recipient{schedule.recipients.length > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            schedule.status === 'Active' &&
                              'bg-emerald-50 text-emerald-700 border-emerald-200',
                            schedule.status === 'Paused' &&
                              'bg-amber-50 text-amber-700 border-amber-200',
                            schedule.status === 'Expired' && 'bg-slate-50 text-slate-700 border-slate-200'
                          )}
                        >
                          {schedule.status === 'Active' && <Play className="h-3 w-3" />}
                          {schedule.status === 'Paused' && <Pause className="h-3 w-3" />}
                          {schedule.status}
                        </span>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                      >
                        <button
                          onClick={(e) => handleDropdownToggle(schedule.id, e)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dropdown Menu */}
          {openDropdownId &&
            createPortal(
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(null);
                  }}
                  aria-hidden="true"
                />
                <div
                  className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                >
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleAction(openDropdownId, 'edit');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-slate-500" />
                      <span>Edit Schedule</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const schedule = MOCK_SCHEDULED_REPORTS.find(s => s.id === openDropdownId);
                        handleScheduleAction(openDropdownId, schedule?.status === 'Paused' ? 'resume' : 'pause');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {MOCK_SCHEDULED_REPORTS.find(s => s.id === openDropdownId)?.status === 'Paused' ? (
                        <>
                          <Play className="h-4 w-4 text-slate-500" />
                          <span>Resume Schedule</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 text-slate-500" />
                          <span>Pause Schedule</span>
                        </>
                      )}
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleAction(openDropdownId, 'delete');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Schedule</span>
                    </button>
                  </div>
                </div>
              </>,
              document.body
            )}
        </>
      )}
    </div>
  );
};
