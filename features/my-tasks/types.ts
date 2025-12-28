export type Priority = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In-Progress" | "Reviewing" | "Completed";
export type ModuleType = "Document" | "Deviation" | "CAPA" | "Training";
export type ViewMode = "table" | "card";

export interface TimelineEvent {
  date: string;
  action: string;
  user: string;
}

export interface Task {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  module: ModuleType;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  assignee: string;
  assigneeAvatar?: string;
  reporter: string;
  reporterAvatar?: string;
  progress: number;
  timeline: TimelineEvent[];
}
