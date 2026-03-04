import type { DocumentType, DocumentStatus } from "@/features/documents/types";

// --- Types ---
export interface Revision {
  id: string;
  documentNumber: string;
  revisionNumber: string;
  created: string;
  openedBy: string;
  revisionName: string;
  state: DocumentStatus;
  author: string;
  effectiveDate: string;
  validUntil: string;
  documentName: string;
  type: DocumentType;
  department: string;
  hasRelatedDocuments?: boolean;
  hasCorrelatedDocuments?: boolean;
  isTemplate?: boolean;
}

// --- Mock Data ---
export const MOCK_REVISIONS: Revision[] = [
  // Pending Review items (for testing Review workflow)
  {
    id: "rev-001",
    documentNumber: "SOP.0001.01",
    revisionNumber: "2.0",
    created: "08/01/2026",
    openedBy: "John Smith",
    revisionName: "Quality Control Testing Revision",
    state: "Pending Review",
    author: "Dr. Sarah Johnson",
    effectiveDate: "20/01/2026",
    validUntil: "20/01/2027",
    documentName: "Quality Control Testing SOP",
    type: "SOP",
    department: "Quality Assurance",
  },
  {
    id: "rev-002",
    documentNumber: "SOP.0002.01",
    revisionNumber: "3.1",
    created: "07/01/2026",
    openedBy: "Jane Doe",
    revisionName: "Manufacturing Process Update",
    state: "Pending Review",
    author: "Michael Chen",
    effectiveDate: "25/01/2026",
    validUntil: "25/01/2027",
    documentName: "Manufacturing Process SOP",
    type: "SOP",
    department: "Production",
  },
  // Pending Approval items (for testing Approval workflow)
  {
    id: "rev-003",
    documentNumber: "POL.0001.01",
    revisionNumber: "1.5",
    created: "06/01/2026",
    openedBy: "Alice Johnson",
    revisionName: "Safety Policy Revision",
    state: "Pending Approval",
    author: "Emily Brown",
    effectiveDate: "01/02/2026",
    validUntil: "01/02/2027",
    documentName: "Workplace Safety Policy",
    type: "Policy",
    department: "Quality Assurance",
  },
  {
    id: "rev-004",
    documentNumber: "SOP.0003.01",
    revisionNumber: "4.0",
    created: "05/01/2026",
    openedBy: "Bob Williams",
    revisionName: "Validation Protocol Update",
    state: "Pending Approval",
    author: "David Lee",
    effectiveDate: "05/02/2026",
    validUntil: "05/02/2027",
    documentName: "Equipment Validation Protocol",
    type: "Protocol",
    department: "R&D",
  },
  // Other statuses for variety
  ...Array.from({ length: 41 }, (_, i) => {
    const status = ["Draft", "Approved", "Effective", "Archive"][i % 4] as DocumentStatus;
    return {
      id: `${i + 5}`,
      documentNumber: `SOP.${String(i + 5).padStart(4, "0")}.0${(i % 3) + 1}`,
      revisionNumber: `${Math.floor(i / 3) + 1}.${i % 3}`,
      created: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
      openedBy: ["John Smith", "Jane Doe", "Alice Johnson", "Bob Williams"][i % 4],
      revisionName: `Revision ${i + 5}`,
      state: status,
      author: ["Dr. Sarah Johnson", "Michael Chen", "Emily Brown", "David Lee"][i % 4],
      effectiveDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split("T")[0],
      validUntil: new Date(Date.now() + Math.random() * 20000000000).toISOString().split("T")[0],
      documentName: `Standard Operating Procedure ${i + 5}`,
      type: ["SOP", "Policy", "Form", "Report"][i % 4] as DocumentType,
      department: ["Quality Assurance", "Production", "R&D", "Regulatory Affairs"][i % 4],
      hasRelatedDocuments: status === "Effective" && i % 3 === 0, // Some Effective revisions have related docs
      hasCorrelatedDocuments: i % 2 === 0, // Some revisions have correlated docs
      isTemplate: i % 4 === 0,
    };
  }),
];
