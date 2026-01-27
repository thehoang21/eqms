# My Tasks Feature

This module provides a comprehensive task management interface for the QMS application.

## Folder Structure

```
my-tasks/
├── index.ts                    # Main export (MyTasksView)
├── MyTasksView.tsx             # Main view component with filters
├── types/
│   └── index.ts                # Type definitions (Task, Priority, Status, etc.)
├── utils/
│   └── index.ts                # Utility functions (formatting, styling, calculations)
├── components/
│   ├── index.ts                # Components barrel export
│   ├── TaskTable.tsx           # Table/List view of tasks
│   ├── TaskCalendarView.tsx    # Calendar view of tasks
│   ├── TaskGanttView.tsx       # Gantt chart view
│   └── TaskDetailDrawer.tsx    # Task detail side drawer
└── README.md                   # This file
```

## Components

### MyTasksView
Main view component with:
- Filter controls (search, module, status, assignee, date range)
- View mode toggle (List, Calendar, Gantt)
- Task count summary

### TaskTable
Table view with:
- Sortable columns
- Pagination
- Status/Priority badges
- Action buttons

### TaskCalendarView
Monthly calendar with:
- Task indicators on dates
- Month/Year navigation
- Task preview on click

### TaskGanttView
Gantt chart with:
- Timeline visualization
- Module grouping
- Zoom controls
- Day/Month view toggle

### TaskDetailDrawer
Side drawer showing:
- Task details
- Timeline/Activity log
- Action buttons (Review, Approve, etc.)

## Types

```typescript
type Priority = "Critical" | "High" | "Medium" | "Low";
type TaskStatus = "Pending" | "In-Progress" | "Reviewing" | "Completed";
type ModuleType = "Document" | "Deviation" | "CAPA" | "Training";
type ViewMode = "list" | "calendar" | "gantt" | "timeline";

interface Task {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  module: ModuleType;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  assignee: string;
  reporter: string;
  progress: number;
  timeline: TimelineEvent[];
}
```

## Usage

```tsx
import { MyTasksView } from '@/features/my-tasks';

// In your route
<Route path="/my-tasks" element={<MyTasksView />} />
```

## Utilities

Import utility functions:
```tsx
import { 
  getPriorityColor, 
  getStatusBadgeStyle, 
  getModuleIcon,
  isOverdue,
  daysUntil,
  formatDate
} from '@/features/my-tasks/utils';
```
