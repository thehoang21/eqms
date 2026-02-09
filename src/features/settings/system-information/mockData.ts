import type { SystemInfo, ChangelogEntry } from "./types";

export const MOCK_CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.5.1",
    releaseDate: "2026-02-01",
    changes: {
      features: [
        "Added system health monitoring dashboard",
        "Enhanced API performance metrics tracking",
        "Implemented real-time memory usage graphs",
      ],
      improvements: [
        "Optimized database connection pooling",
        "Improved server uptime calculation accuracy",
        "Enhanced export functionality with custom date ranges",
      ],
      bugFixes: [
        "Fixed incorrect CPU usage percentage display",
        "Resolved memory leak in system monitoring service",
      ],
    },
  },
  {
    version: "2.5.0",
    releaseDate: "2026-01-15",
    changes: {
      features: [
        "Added license management interface",
        "Implemented feature flag configuration UI",
        "Added API endpoint health monitoring",
      ],
      improvements: [
        "Enhanced system information refresh mechanism",
        "Improved database backup status tracking",
      ],
    },
  },
  {
    version: "2.4.8",
    releaseDate: "2025-12-20",
    changes: {
      improvements: [
        "Enhanced error handling for system metrics collection",
        "Improved clipboard copy functionality",
      ],
      bugFixes: [
        "Fixed date formatting issues in system logs",
        "Resolved tab switching animation glitches",
        "Fixed export JSON formatting errors",
      ],
    },
  },
  {
    version: "2.4.5",
    releaseDate: "2025-11-10",
    changes: {
      features: [
        "Added comprehensive system information view",
        "Implemented tabbed navigation for system components",
      ],
      bugFixes: [
        "Fixed server uptime calculation",
      ],
    },
  },
];

export const MOCK_SYSTEM_INFO: SystemInfo = {
  application: {
    name: "eQMS - Quality Management System",
    version: "2.5.1",
    environment: "production",
    buildDate: "2026-02-01T10:30:00Z",
    buildNumber: "20260201.1030",
    description: "Enterprise Quality Management System for pharmaceutical and medical device industries",
  },
  server: {
    os: "Ubuntu 22.04.3 LTS",
    nodeVersion: "v20.11.0",
    memoryTotal: "16 GB",
    memoryUsed: "10.4 GB",
    memoryUsagePercent: 65,
    cpuCores: 8,
    cpuModel: "Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz",
    uptime: "45 days, 12 hours, 34 minutes",
  },
  database: {
    type: "PostgreSQL",
    version: "15.4",
    host: "db.eqms.internal",
    port: "5432",
    database: "eqms_production",
    connectionStatus: "connected",
    lastBackup: "2026-02-09T02:00:00Z",
  },
  api: {
    baseUrl: "https://api.eqms.company.com/v2",
    version: "2.5.1",
    status: "online",
    lastHealthCheck: "2026-02-09T08:45:32Z",
    responseTime: "42 ms",
  },
  features: [
    {
      id: "esignature",
      name: "Electronic Signature (21 CFR Part 11)",
      description: "Digital signature functionality compliant with FDA regulations",
      enabled: true,
    },
    {
      id: "batch-review",
      name: "Batch Review & Approval",
      description: "Review and approve multiple documents simultaneously",
      enabled: true,
    },
    {
      id: "document-linking",
      name: "Document Cross-Referencing",
      description: "Link related documents and track dependencies",
      enabled: true,
    },
    {
      id: "training-management",
      name: "Training Management",
      description: "Track training requirements and completion status",
      enabled: true,
    },
    {
      id: "controlled-copies",
      name: "Controlled Copy Management",
      description: "Manage distribution of physical/electronic controlled copies",
      enabled: true,
    },
    {
      id: "audit-trail",
      name: "Comprehensive Audit Trail",
      description: "Complete tracking of all system activities and changes",
      enabled: true,
    },
    {
      id: "change-control",
      name: "Change Control Module",
      description: "Manage change requests and impact assessments",
      enabled: true,
    },
    {
      id: "capa",
      name: "CAPA (Corrective & Preventive Actions)",
      description: "Track and manage corrective and preventive actions",
      enabled: true,
    },
    {
      id: "deviations",
      name: "Deviation Management",
      description: "Record and investigate deviations from procedures",
      enabled: true,
    },
    {
      id: "complaints",
      name: "Customer Complaints",
      description: "Log and track customer complaints",
      enabled: false,
    },
    {
      id: "validation",
      name: "Validation Protocols",
      description: "Manage equipment and process validation",
      enabled: false,
    },
    {
      id: "supplier-management",
      name: "Supplier Quality Management",
      description: "Track supplier qualifications and audits",
      enabled: false,
    },
  ],
  license: {
    licenseType: "Enterprise",
    companyName: "Pharmaceutical Manufacturing Co., Ltd.",
    issuedDate: "2025-03-01",
    expiryDate: "2027-02-28",
    daysUntilExpiry: 384,
    maxUsers: 500,
    activeUsers: 287,
    modules: [
      "Document Control",
      "Training Management",
      "Change Control",
      "CAPA",
      "Deviations",
      "Audit Trail",
      "Controlled Copies",
      "Electronic Signature",
    ],
  },
};
