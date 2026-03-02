// Shared mock data for document features

// User type for Approvers/Reviewers tabs
export interface MockUser {
  id: string;
  name: string;
  username: string;
  role: string;
  department: string;
  email: string;
}

// Mock Data for User Selection (Approvers, Reviewers)
export const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Nguyen Van A', username: 'nguyenvana', role: 'QA Manager', department: 'Quality Assurance', email: 'a.nguyen@example.com' },
  { id: '2', name: 'Tran Thi B', username: 'tranthib', role: 'Director', department: 'Board of Directors', email: 'b.tran@example.com' },
  { id: '3', name: 'Le Van C', username: 'levanc', role: 'Production Manager', department: 'Production', email: 'c.le@example.com' },
  { id: '4', name: 'Pham Thi D', username: 'phamthid', role: 'Technical Lead', department: 'Technical', email: 'd.pham@example.com' },
  { id: '5', name: 'Hoang Van E', username: 'hoangvane', role: 'Quality Control', department: 'Quality Control', email: 'e.hoang@example.com' },
];

// User options for CreateLinkModal (email-based format)
export const MOCK_USER_OPTIONS = [
  { value: "user-1", label: "John Smith - john.smith@company.com" },
  { value: "user-2", label: "Sarah Johnson - sarah.johnson@company.com" },
  { value: "user-3", label: "Michael Chen - michael.chen@company.com" },
  { value: "user-4", label: "Emma Williams - emma.williams@company.com" },
  { value: "user-5", label: "David Brown - david.brown@company.com" },
  { value: "user-6", label: "Robert Taylor - robert.taylor@company.com" },
  { value: "user-7", label: "Lisa Anderson - lisa.anderson@company.com" },
  { value: "user-8", label: "James Wilson - james.wilson@company.com" },
];

export const MOCK_DEPARTMENTS = [
  { value: "dept-1", label: "Quality Assurance" },
  { value: "dept-2", label: "Manufacturing" },
  { value: "dept-3", label: "Research & Development" },
  { value: "dept-4", label: "Regulatory Affairs" },
  { value: "dept-5", label: "Supply Chain" },
];
