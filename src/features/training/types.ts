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

// Quiz/Test Types
export type QuestionType = "multiple_choice" | "essay";
export type TrainingTestType = "read_understand" | "test_certification";

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    points: number;
    imageUrl?: string;
    options?: QuestionOption[];
}

export interface TrainingConfig {
    trainingType: TrainingTestType;
    passingScore: number;
    maxAttempts: number;
    trainingPeriodDays: number;
    distributionList: string[]; // IDs of departments/divisions
    questions: Question[];
}

export interface TrainingFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: "uploading" | "success" | "error";
}

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
  config?: TrainingConfig; // Training configuration with quiz
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
