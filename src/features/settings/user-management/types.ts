// User Management Type Definitions

export type UserRole = "Admin" | "QA Manager" | "Document Owner" | "Reviewer" | "Approver" | "Viewer";
export type UserStatus = "Active" | "Inactive" | "Pending";

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  businessUnit: string;
  department: string;
  status: UserStatus;
  lastLogin: string;
  createdDate: string;
}

export interface NewUser {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessUnit: string;
  department: string;
  status: UserStatus;
}
