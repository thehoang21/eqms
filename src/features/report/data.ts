import {
  FileText,
  Calendar,
  GitBranch,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  MessageSquareWarning,
  History,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react';
import type { ReportTemplate, ReportHistory, ScheduledReport } from './types';

// --- Report Templates ---
export const REPORT_TEMPLATES: ReportTemplate[] = [
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
export const COMPLIANCE_TEMPLATES: ReportTemplate[] = [
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
    description:
      'Evaluates data integrity controls: Attributable, Legible, Contemporaneous, Original, Accurate.',
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
    description:
      'Annual review of product quality including trends, deviations, changes, and CAPAs.',
    icon: BarChart3,
    regulatoryRef: 'EU-GMP Chapter 1 (1.10)',
  },
];

// --- Mock Report History ---
export const MOCK_REPORT_HISTORY: ReportHistory[] = [
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
export const MOCK_SCHEDULED_REPORTS: ScheduledReport[] = [
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
