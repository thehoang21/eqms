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

// Training Method: defines how employees complete the course
export type TrainingMethod =
  | "Read & Understood"  // Employee reads, then confirms + e-sign
  | "Theory Quiz"        // Multiple choice quiz
  | "Hands-on/OJT";      // On-the-job training requiring trainer sign-off

export interface Recurrence {
  enabled: boolean;
  intervalMonths: number; // e.g. 12 = annual retraining
}

export type AttendanceStatus = 
  | "Registered" 
  | "Attended" 
  | "Absent" 
  | "Excused";

// Quiz/Test Types — used inside Theory Quiz method
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
  trainingMethod: TrainingMethod;    // NEW: how employees complete the course
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
  recurrence?: Recurrence;           // NEW: periodic retraining schedule
  linkedDocumentId?: string;         // NEW: linked SOP/document ID
  linkedDocumentTitle?: string;      // NEW: linked SOP/document title
  config?: TrainingConfig;
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

// Course Workflow Types
export type CourseWorkflowStatus =
  | "Draft"
  | "Pending Review"
  | "Pending Approval"
  | "Approved"
  | "Rejected";

// Alias kept for backward compatibility
export type CourseApprovalStatus = CourseWorkflowStatus;

export interface CourseApproval {
  id: string;
  courseId: string;
  trainingId: string;
  courseTitle: string;
  relatedSOP: string;
  sopDocumentId: string;
  trainingMethod: TrainingMethod;    // updated: full TrainingMethod type
  recurrence?: Recurrence;           // NEW
  linkedDocumentId?: string;         // NEW
  linkedDocumentTitle?: string;      // NEW
  submittedBy: string;
  submittedAt: string;
  department: string;
  approvalStatus: CourseWorkflowStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  passScore: number;
  questions: Question[];
}
