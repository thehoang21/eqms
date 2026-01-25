/**
 * Training Management Types
 * Định nghĩa types cho Training module
 */

export type TrainingStatus = 
  | "Scheduled" 
  | "In-Progress" 
  | "Completed" 
  | "Cancelled" 
  | "Overdue";

export type TrainingType = 
  | "GMP" 
  | "Safety" 
  | "Technical" 
  | "Compliance" 
  | "SOP" 
  | "Software";

export type AttendanceStatus = 
  | "Registered" 
  | "Attended" 
  | "Absent" 
  | "Excused";

export interface TrainingRecord {
  id: string;
  trainingId: string;
  title: string;
  description: string;
  type: TrainingType;
  status: TrainingStatus;
  instructor: string;
  scheduledDate: string;
  duration: number; // in hours
  location: string;
  capacity: number;
  enrolled: number;
  department: string;
  mandatory: boolean;
  passScore: number;
  attendees?: Attendee[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendee {
  userId: string;
  name: string;
  department: string;
  position: string;
  status: AttendanceStatus;
  score?: number;
  completedAt?: string;
  certificateIssued?: boolean;
}

export interface TrainingFilters {
  searchQuery: string;
  typeFilter: TrainingType | "All";
  statusFilter: TrainingStatus | "All";
  dateFrom: string;
  dateTo: string;
}
