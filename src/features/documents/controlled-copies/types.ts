export type ControlledCopyStatus = "Pending Approval" | "Active" | "Recalled" | "Obsolete" | "Destroyed";

export type CurrentStage = "Waiting for QM" | "Ready for Print" | "In Use";

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

export interface ControlledCopy {
  id: string;
  controlNumber: string;
  documentId: string;
  documentTitle: string;
  version: string;
  location: string;
  locationCode: string;
  copyNumber: number;
  totalCopies: number;
  requestDate: string;
  requestedBy: string;
  status: ControlledCopyStatus;
  currentStage: CurrentStage;
  reason: string;
  department: string;
  effectiveDate: string;
  recalledDate?: string;
  destructionDate?: string;
  destructionMethod?: string;
  destructedBy?: string;
  destructionSupervisor?: string;
  destructionEvidenceUrl?: string;
}
