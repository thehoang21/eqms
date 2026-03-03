import { TrainingMaterial } from "./types";

// Mock Data — expanded for dashboard
export const MOCK_MATERIALS: TrainingMaterial[] = [
  {
    id: "1", materialId: "TM-VID-001", title: "GMP Introduction Video", description: "Comprehensive overview of Good Manufacturing Practices",
    type: "Video", version: "2.1", department: "Quality Assurance", status: "Approved", uploadedAt: "2026-02-15", uploadedBy: "John Doe",
    fileSize: "125 MB", fileSizeBytes: 131072000, usageCount: 15,
    linkedCourses: ["TRN-2026-001", "TRN-2026-004", "TRN-2026-008"],
  },
  {
    id: "2", materialId: "TM-PDF-002", title: "Cleanroom Operations Manual", description: "Step-by-step guide for cleanroom operations and procedures",
    type: "PDF", version: "3.0", department: "Production", status: "Approved", uploadedAt: "2026-02-10", uploadedBy: "Jane Smith",
    fileSize: "4.5 MB", fileSizeBytes: 4718592, usageCount: 22,
    linkedCourses: ["TRN-2026-002", "TRN-2026-005"],
  },
  {
    id: "3", materialId: "TM-PDF-003", title: "Equipment Handling Guide", description: "Visual guide for proper equipment handling and maintenance",
    type: "PDF", version: "1.5", department: "Engineering", status: "Pending Review", uploadedAt: "2026-02-08", uploadedBy: "Mike Johnson",
    fileSize: "8.2 MB", fileSizeBytes: 8597504, usageCount: 18,
    linkedCourses: ["TRN-2026-003"],
  },
  {
    id: "4", materialId: "TM-IMG-004", title: "Safety Protocol Infographic", description: "Key safety protocols illustrated for quick reference",
    type: "Image", version: "1.0", department: "HSE", status: "Approved", uploadedAt: "2026-02-20", uploadedBy: "Sarah Williams",
    fileSize: "2.1 MB", fileSizeBytes: 2202009, usageCount: 30,
    linkedCourses: ["TRN-2026-001", "TRN-2026-005", "TRN-2026-007", "TRN-2026-009", "TRN-2026-012"],
  },
  {
    id: "5", materialId: "TM-VID-005", title: "ISO 9001 Training Video", description: "Understanding ISO 9001:2015 requirements and implementation",
    type: "Video", version: "4.2", department: "Quality Assurance", status: "Draft", uploadedAt: "2026-02-12", uploadedBy: "Robert Brown",
    fileSize: "210 MB", fileSizeBytes: 220200960, usageCount: 12,
    linkedCourses: ["TRN-2026-006"],
  },
  {
    id: "6", materialId: "TM-DOC-006", title: "SOP Template Pack", description: "Standard Operating Procedure templates for documentation",
    type: "Document", version: "2.0", department: "Quality Control", status: "Approved", uploadedAt: "2026-02-01", uploadedBy: "Emily Davis",
    fileSize: "1.0 MB", fileSizeBytes: 1048576, usageCount: 8,
    linkedCourses: ["TRN-2026-010"],
  },
  {
    id: "7", materialId: "TM-PDF-007", title: "Chemical Handling Procedures", description: "Safe practices for chemical storage, handling, and disposal",
    type: "PDF", version: "1.2", department: "HSE", status: "Obsoleted", uploadedAt: "2026-01-28", uploadedBy: "David Miller",
    fileSize: "3.0 MB", fileSizeBytes: 3145728, usageCount: 25,
    linkedCourses: ["TRN-2026-005", "TRN-2026-011", "TRN-2026-013"],
  },
  {
    id: "8", materialId: "TM-DOC-008", title: "HPLC Training Slides", description: "HPLC instrumentation, calibration, and operational procedures",
    type: "Document", version: "2.3", department: "Quality Control", status: "Approved", uploadedAt: "2026-01-28", uploadedBy: "Lisa Anderson",
    fileSize: "15 MB", fileSizeBytes: 15728640, usageCount: 6,
    linkedCourses: ["TRN-2026-014"],
  },
  {
    id: "9", materialId: "TM-VID-009", title: "Deviation Investigation Training", description: "How to investigate and document process deviations",
    type: "Video", version: "1.0", department: "Quality Assurance", status: "Approved", uploadedAt: "2026-02-10", uploadedBy: "Michael Chen",
    fileSize: "180 MB", fileSizeBytes: 188743680, usageCount: 10,
    linkedCourses: ["TRN-2026-002", "TRN-2026-006"],
  },
  {
    id: "10", materialId: "TM-PDF-010", title: "Personal Protective Equipment Guide", description: "Selection, usage, and maintenance of PPE",
    type: "PDF", version: "3.1", department: "HSE", status: "Approved", uploadedAt: "2026-02-15", uploadedBy: "Patricia Wilson",
    fileSize: "5.8 MB", fileSizeBytes: 6082355, usageCount: 20,
    linkedCourses: ["TRN-2026-001", "TRN-2026-007", "TRN-2026-009"],
  },
  {
    id: "11", materialId: "TM-DOC-011", title: "Batch Record Review Checklist", description: "Comprehensive checklist for batch record review process",
    type: "Document", version: "1.8", department: "Quality Assurance", status: "Pending Approval", uploadedAt: "2026-02-20", uploadedBy: "James Taylor",
    fileSize: "0.8 MB", fileSizeBytes: 838860, usageCount: 14,
    linkedCourses: ["TRN-2026-004", "TRN-2026-008"],
  },
  {
    id: "12", materialId: "TM-PDF-012", title: "Water System Qualification", description: "Procedures for water system IQ, OQ, and PQ",
    type: "PDF", version: "2.0", department: "Engineering", status: "Draft", uploadedAt: "2026-02-25", uploadedBy: "Jennifer Lee",
    fileSize: "12 MB", fileSizeBytes: 12582912, usageCount: 4,
    linkedCourses: ["TRN-2026-015"],
  },
];
