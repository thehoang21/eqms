/**
 * Training Matrix Mock Data
 * Generates realistic Employee × SOP/Material training matrix data
 */

import type {
  SOPColumn,
  EmployeeRow,
  TrainingCell,
  CellStatus,
  MatrixKPI,
} from "./types";

// ─── SOP / Training Material Columns ────────────────────────────────
export const MOCK_SOPS: SOPColumn[] = [
  { id: "SOP-001", code: "SOP-001", title: "GMP Basic Training", category: "GMP", version: "v3.0", effectiveDate: "15/01/2025" },
  { id: "SOP-002", code: "SOP-002", title: "Cleanroom Operations", category: "Technical", version: "v2.1", effectiveDate: "01/03/2025" },
  { id: "SOP-003", code: "SOP-003", title: "Workplace Safety & HSE", category: "Safety", version: "v4.0", effectiveDate: "10/02/2025" },
  { id: "SOP-004", code: "SOP-004", title: "ISO 9001 Internal Auditor", category: "Compliance", version: "v1.2", effectiveDate: "20/11/2024" },
  { id: "SOP-005", code: "SOP-005", title: "SOP Documentation & Control", category: "GMP", version: "v2.0", effectiveDate: "01/04/2025" },
  { id: "SOP-006", code: "SOP-006", title: "HPLC Operations", category: "Technical", version: "v3.1", effectiveDate: "20/01/2025" },
  { id: "SOP-007", code: "SOP-007", title: "Validation IQ/OQ/PQ", category: "Technical", version: "v2.0", effectiveDate: "15/05/2025" },
  { id: "SOP-008", code: "SOP-008", title: "Risk Assessment & FMEA", category: "Compliance", version: "v1.5", effectiveDate: "01/12/2024" },
  { id: "SOP-009", code: "SOP-009", title: "Chemical Safety", category: "Safety", version: "v3.2", effectiveDate: "01/06/2025" },
  { id: "SOP-010", code: "SOP-010", title: "Data Integrity (ALCOA+)", category: "Compliance", version: "v2.0", effectiveDate: "15/03/2025" },
  { id: "SOP-011", code: "SOP-011", title: "Deviation & CAPA", category: "GMP", version: "v2.3", effectiveDate: "20/02/2025" },
  { id: "SOP-012", code: "SOP-012", title: "Change Control Process", category: "GMP", version: "v1.1", effectiveDate: "10/04/2025" },
  { id: "SOP-013", code: "SOP-013", title: "Sampling Procedures", category: "Technical", version: "v2.0", effectiveDate: "05/01/2025" },
  { id: "SOP-014", code: "SOP-014", title: "Equipment Calibration", category: "Technical", version: "v3.0", effectiveDate: "01/07/2025" },
  { id: "SOP-015", code: "SOP-015", title: "Batch Record Review", category: "GMP", version: "v1.8", effectiveDate: "20/05/2025" },
];

// ─── Employee Rows ──────────────────────────────────────────────────
export const MOCK_EMPLOYEES: EmployeeRow[] = [
  { id: "EMP-001", name: "Dr. Anna Smith", employeeCode: "QA-001", department: "Quality Assurance", jobTitle: "QA Manager", hireDate: "15/03/2019" },
  { id: "EMP-002", name: "James Carter", employeeCode: "QA-002", department: "Quality Assurance", jobTitle: "QA Specialist", hireDate: "01/06/2020" },
  { id: "EMP-003", name: "Maria Lopez", employeeCode: "QA-003", department: "Quality Assurance", jobTitle: "QA Manager", hireDate: "10/01/2021" },
  { id: "EMP-004", name: "Robert Johnson", employeeCode: "QC-001", department: "Quality Control", jobTitle: "QC Analyst", hireDate: "20/08/2022" },
  { id: "EMP-005", name: "Linda Chen", employeeCode: "QC-002", department: "Quality Control", jobTitle: "QC Analyst", hireDate: "14/02/2023" },
  { id: "EMP-006", name: "David Park", employeeCode: "QC-003", department: "Quality Control", jobTitle: "Lab Technician", hireDate: "10/04/2020" },
  { id: "EMP-007", name: "Sarah Kim", employeeCode: "PRD-001", department: "Production", jobTitle: "Production Operator", hireDate: "20/07/2021" },
  { id: "EMP-008", name: "Michael Brown", employeeCode: "PRD-002", department: "Production", jobTitle: "Production Operator", hireDate: "15/01/2022" },
  { id: "EMP-009", name: "Emily Davis", employeeCode: "PRD-003", department: "Production", jobTitle: "Production Supervisor", hireDate: "05/09/2019" },
  { id: "EMP-010", name: "Kevin Wilson", employeeCode: "PRD-004", department: "Production", jobTitle: "Production Operator", hireDate: "12/03/2023" },
  { id: "EMP-011", name: "Jennifer Lee", employeeCode: "ENG-001", department: "Engineering", jobTitle: "Validation Engineer", hireDate: "01/11/2020" },
  { id: "EMP-012", name: "Thomas Wright", employeeCode: "ENG-002", department: "Engineering", jobTitle: "Validation Engineer", hireDate: "10/05/2021" },
  { id: "EMP-013", name: "Jessica Martinez", employeeCode: "ENG-003", department: "Engineering", jobTitle: "Engineering Manager", hireDate: "15/08/2018" },
  { id: "EMP-014", name: "Daniel Taylor", employeeCode: "DOC-001", department: "Documentation", jobTitle: "Document Controller", hireDate: "01/02/2022" },
  { id: "EMP-015", name: "Amanda Garcia", employeeCode: "DOC-002", department: "Documentation", jobTitle: "Document Controller", hireDate: "20/06/2023" },
  { id: "EMP-016", name: "Chris Anderson", employeeCode: "HSE-001", department: "HSE", jobTitle: "HSE Coordinator", hireDate: "05/10/2020" },
  { id: "EMP-017", name: "Patricia White", employeeCode: "HSE-002", department: "HSE", jobTitle: "HSE Specialist", hireDate: "15/12/2021" },
  { id: "EMP-018", name: "Steven Harris", employeeCode: "SC-001", department: "Supply Chain", jobTitle: "Warehouse Operator", hireDate: "10/04/2022" },
  { id: "EMP-019", name: "Nancy Clark", employeeCode: "SC-002", department: "Supply Chain", jobTitle: "Warehouse Operator", hireDate: "20/07/2023" },
  { id: "EMP-020", name: "Richard Moore", employeeCode: "QC-004", department: "Quality Control", jobTitle: "QC Analyst", hireDate: "15/02/2020" },
];

// ─── Helper: random date in range ───────────────────────────────────
const parseDMY = (d: string): Date => {
  const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  return new Date(d);
};

const randomDate = (start: string, end: string): string => {
  const s = parseDMY(start).getTime();
  const e = parseDMY(end).getTime();
  const d = new Date(s + Math.random() * (e - s));
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

// ─── Generate Training Cells ────────────────────────────────────────
// Deterministic-ish generation based on employee/SOP combination
const generateCell = (emp: EmployeeRow, sop: SOPColumn): TrainingCell => {
  // Determine if this SOP is required for this employee's role
  const requiredMap: Record<string, string[]> = {
    "QA Manager":          ["SOP-001","SOP-004","SOP-005","SOP-010","SOP-011","SOP-008","SOP-012","SOP-015"],
    "QA Specialist":       ["SOP-001","SOP-004","SOP-005","SOP-010","SOP-011","SOP-008"],
    "QC Analyst":          ["SOP-001","SOP-006","SOP-009","SOP-010","SOP-005","SOP-013"],
    "Lab Technician":      ["SOP-001","SOP-006","SOP-009","SOP-010","SOP-014"],
    "Production Operator": ["SOP-001","SOP-002","SOP-003","SOP-005"],
    "Production Supervisor":["SOP-001","SOP-002","SOP-003","SOP-005","SOP-011","SOP-012"],
    "Validation Engineer": ["SOP-001","SOP-007","SOP-008","SOP-010","SOP-012"],
    "Engineering Manager": ["SOP-001","SOP-007","SOP-008","SOP-010","SOP-011","SOP-012"],
    "Document Controller": ["SOP-001","SOP-005","SOP-010","SOP-012"],
    "HSE Coordinator":     ["SOP-001","SOP-003","SOP-009","SOP-008"],
    "HSE Specialist":      ["SOP-001","SOP-003","SOP-009","SOP-008"],
    "Warehouse Operator":  ["SOP-001","SOP-003","SOP-005"],
  };

  const requiredSops = requiredMap[emp.jobTitle] || ["SOP-001"];
  const isRequired = requiredSops.includes(sop.id);

  if (!isRequired) {
    return {
      employeeId: emp.id,
      sopId: sop.id,
      status: "NotRequired",
      lastTrainedDate: null,
      expiryDate: null,
      score: null,
      attempts: 0,
    };
  }

  // Deterministic status based on hash of ids
  const hash = (emp.id + sop.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const statusSeed = hash % 100;

  let status: CellStatus;
  let lastTrainedDate: string | null = null;
  let expiryDate: string | null = null;
  let score: number | null = null;
  let attempts = 0;

  if (statusSeed < 55) {
    // 55% Qualified
    status = "Qualified";
    lastTrainedDate = randomDate("01/01/2025", "31/12/2025");
    expiryDate = randomDate("01/06/2026", "01/06/2027");
    score = 75 + (hash % 26); // 75-100
    attempts = 1 + (hash % 2);
  } else if (statusSeed < 70) {
    // 15% Pending
    status = "Pending";
    lastTrainedDate = null;
    expiryDate = null;
    score = null;
    attempts = 0;
  } else if (statusSeed < 82) {
    // 12% Overdue
    status = "Overdue";
    lastTrainedDate = randomDate("01/01/2023", "01/06/2024");
    expiryDate = randomDate("01/07/2024", "31/12/2025");
    score = hash % 2 === 0 ? 60 + (hash % 20) : null;
    attempts = hash % 2 === 0 ? 1 : 0;
  } else if (statusSeed < 92) {
    // 10% ExpiringSoon
    status = "ExpiringSoon";
    lastTrainedDate = randomDate("01/01/2025", "01/10/2025");
    expiryDate = randomDate("01/03/2026", "02/04/2026"); // within ~30 days of "today" March 3, 2026
    score = 70 + (hash % 31);
    attempts = 1;
  } else {
    // 8% Overdue again for variation
    status = "Overdue";
    lastTrainedDate = randomDate("01/06/2023", "01/12/2024");
    expiryDate = randomDate("01/01/2025", "30/11/2025");
    score = null;
    attempts = 0;
  }

  return {
    employeeId: emp.id,
    sopId: sop.id,
    status,
    lastTrainedDate,
    expiryDate,
    score,
    attempts,
  };
};

// Build flat cell map: key = "EMP-001|SOP-001"
export const MOCK_CELLS: Map<string, TrainingCell> = new Map();

MOCK_EMPLOYEES.forEach((emp) => {
  MOCK_SOPS.forEach((sop) => {
    const cell = generateCell(emp, sop);
    MOCK_CELLS.set(`${emp.id}|${sop.id}`, cell);
  });
});

// Helper to get a cell
export const getCell = (employeeId: string, sopId: string): TrainingCell | undefined =>
  MOCK_CELLS.get(`${employeeId}|${sopId}`);

// ─── Compute KPIs ───────────────────────────────────────────────────
export const computeKPIs = (
  employees: EmployeeRow[],
  sops: SOPColumn[],
  cells: Map<string, TrainingCell>
): MatrixKPI => {
  let totalRequired = 0;
  let qualified = 0;
  let overdue = 0;
  let expiring = 0;

  employees.forEach((emp) => {
    sops.forEach((sop) => {
      const cell = cells.get(`${emp.id}|${sop.id}`);
      if (!cell || cell.status === "NotRequired") return;
      totalRequired++;
      if (cell.status === "Qualified") qualified++;
      if (cell.status === "Overdue") overdue++;
      if (cell.status === "ExpiringSoon") expiring++;
    });
  });

  return {
    complianceRate: totalRequired > 0 ? Math.round((qualified / totalRequired) * 100) : 0,
    totalOverdue: overdue,
    expiringSoon: expiring,
    daysUntilNextAudit: 42, // static for demo
  };
};

// ─── Filter Options ─────────────────────────────────────────────────
export const DEPARTMENT_OPTIONS = [
  { label: "All Departments", value: "All" },
  { label: "Quality Assurance", value: "Quality Assurance" },
  { label: "Quality Control", value: "Quality Control" },
  { label: "Production", value: "Production" },
  { label: "Engineering", value: "Engineering" },
  { label: "Documentation", value: "Documentation" },
  { label: "HSE", value: "HSE" },
  { label: "Supply Chain", value: "Supply Chain" },
];

export const JOB_TITLE_OPTIONS = [
  { label: "All Job Titles", value: "All" },
  { label: "QA Manager", value: "QA Manager" },
  { label: "QA Specialist", value: "QA Specialist" },
  { label: "QC Analyst", value: "QC Analyst" },
  { label: "Lab Technician", value: "Lab Technician" },
  { label: "Production Operator", value: "Production Operator" },
  { label: "Production Supervisor", value: "Production Supervisor" },
  { label: "Validation Engineer", value: "Validation Engineer" },
  { label: "Engineering Manager", value: "Engineering Manager" },
  { label: "Document Controller", value: "Document Controller" },
  { label: "HSE Coordinator", value: "HSE Coordinator" },
  { label: "HSE Specialist", value: "HSE Specialist" },
  { label: "Warehouse Operator", value: "Warehouse Operator" },
];

export const STATUS_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "✅ Qualified", value: "Qualified" },
  { label: "⏳ Pending", value: "Pending" },
  { label: "❌ Overdue", value: "Overdue" },
  { label: "⚠️ Expiring Soon", value: "ExpiringSoon" },
  { label: "⚪ Not Required", value: "NotRequired" },
];
