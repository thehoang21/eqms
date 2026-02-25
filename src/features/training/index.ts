export {
  CourseListView,
  CreateCourseView,
  PendingReviewView,
  PendingApprovalView,
  ApprovalDetailView,
  ResultEntryPage,
  CourseDetailView,
  CourseProgressView,
  EditCourseView,
} from "./course-inventory";

// Materials
export {
  MaterialsView,
  UploadMaterialView,
  MaterialDetailView,
} from "./materials";

// Compliance Tracking
export { TrainingMatrixView } from "./compliance-tracking/TrainingMatrixView";
export { CourseStatusView } from "./compliance-tracking/CourseStatusView";

// Records & Archive
export { EmployeeTrainingFilesView } from "./records-archive/EmployeeTrainingFilesView";
export { ExportRecordsView } from "./records-archive/ExportRecordsView";

export type {
  TrainingRecord,
  TrainingFilters,
  TrainingStatus,
  TrainingType,
  Attendee,
  AttendanceStatus,
  TrainingConfig,
  Question,
  QuestionOption,
  QuestionType,
  TrainingTestType,
  CourseApproval,
  CourseApprovalStatus,
  CourseWorkflowStatus,
} from "./types";
