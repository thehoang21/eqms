// Export Training Management components

// Course Inventory
export { CourseListView, MaterialsView, CreateCourseView, PendingReviewView, PendingApprovalView, ApprovalDetailView } from './course-inventory';

// Compliance Tracking
export { TrainingMatrixView } from './compliance-tracking/TrainingMatrixView';
export { CourseStatusView } from './compliance-tracking/CourseStatusView';

// Records & Archive
export { EmployeeTrainingFilesView } from './records-archive/EmployeeTrainingFilesView';
export { ExportRecordsView } from './records-archive/ExportRecordsView';

export type { TrainingRecord, TrainingFilters, TrainingStatus, TrainingType, Attendee, AttendanceStatus, TrainingConfig, Question, QuestionOption, QuestionType, TrainingTestType, CourseApproval, CourseApprovalStatus, CourseWorkflowStatus } from './types';
