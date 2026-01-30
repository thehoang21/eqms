import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  CheckCheck,
  Trash2,
  User,
  FileText,
  AlertTriangle,
  MessageCircle,
  UserPlus,
  CheckCircle,
  ThumbsUp,
  Reply,
  Settings,
  Filter,
  MoreVertical,
  Eye,
  ExternalLink,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { FilterCard } from "@/components/ui/card/FilterCard";
import { cn } from "@/components/ui/utils";
import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFilterTab,
} from "./types";

// --- Mock Data ---
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "review-request",
    title: "Document Review Request",
    description: "John Smith requested your review on SOP-QA-015",
    module: "Document",
    priority: "high",
    status: "unread",
    createdAt: "2026-01-29T08:30:00Z",
    sender: { id: "u1", name: "John Smith" },
    relatedItem: {
      id: "doc1",
      type: "document",
      code: "SOP-QA-015",
      title: "Quality Assurance Procedures",
    },
    actionUrl: "/documents/doc1/review",
  },
  {
    id: "2",
    type: "approval",
    title: "Document Approved",
    description: "Sarah Johnson approved DEV-2023-089",
    module: "Deviation",
    priority: "medium",
    status: "unread",
    createdAt: "2026-01-29T07:45:00Z",
    sender: { id: "u2", name: "Sarah Johnson" },
    relatedItem: {
      id: "dev1",
      type: "deviation",
      code: "DEV-2023-089",
      title: "Temperature Excursion Investigation",
    },
    actionUrl: "/deviations-ncs",
  },
  {
    id: "3",
    type: "capa-assignment",
    title: "CAPA Assignment",
    description: "You were assigned to CAPA-2023-045",
    module: "CAPA",
    priority: "critical",
    status: "unread",
    createdAt: "2026-01-29T06:00:00Z",
    relatedItem: {
      id: "capa1",
      type: "capa",
      code: "CAPA-2023-045",
      title: "Packaging Defect Corrective Action",
    },
    actionUrl: "/capa-management",
  },
  {
    id: "4",
    type: "training-completion",
    title: "Training Completed",
    description: "Mike Wilson completed training on GMP Basics",
    module: "Training",
    priority: "low",
    status: "read",
    createdAt: "2026-01-28T14:30:00Z",
    readAt: "2026-01-28T16:00:00Z",
    sender: { id: "u3", name: "Mike Wilson" },
    relatedItem: {
      id: "trn1",
      type: "training",
      code: "TRN-2025-055",
      title: "GMP Basics Annual Training",
    },
    actionUrl: "/training-management",
  },
  {
    id: "5",
    type: "document-update",
    title: "Document Updated",
    description: "Quality Team updated SOP-QA-001",
    module: "Document",
    priority: "medium",
    status: "read",
    createdAt: "2026-01-28T10:15:00Z",
    readAt: "2026-01-28T11:30:00Z",
    sender: { id: "u4", name: "Quality Team" },
    relatedItem: {
      id: "doc2",
      type: "document",
      code: "SOP-QA-001",
      title: "Quality Management System Overview",
    },
    actionUrl: "/documents/doc2",
  },
  {
    id: "6",
    type: "comment-reply",
    title: "Comment Reply",
    description: "Emma Davis replied to your comment on Document Review Process",
    module: "Document",
    priority: "low",
    status: "read",
    createdAt: "2026-01-27T16:45:00Z",
    readAt: "2026-01-27T18:00:00Z",
    sender: { id: "u5", name: "Emma Davis" },
  },
  {
    id: "7",
    type: "review-request",
    title: "CAPA Review Request",
    description: "Lisa Chen requested your review on CAPA-2023-078",
    module: "CAPA",
    priority: "high",
    status: "unread",
    createdAt: "2026-01-27T09:30:00Z",
    sender: { id: "u6", name: "Lisa Chen" },
    relatedItem: {
      id: "capa2",
      type: "capa",
      code: "CAPA-2023-078",
      title: "Equipment Calibration Failure",
    },
    actionUrl: "/capa-management",
  },
  {
    id: "8",
    type: "document-update",
    title: "Document Published",
    description: "Regulatory Team published SOP-REG-003",
    module: "Document",
    priority: "medium",
    status: "read",
    createdAt: "2026-01-26T14:00:00Z",
    readAt: "2026-01-26T15:30:00Z",
    sender: { id: "u7", name: "Regulatory Team" },
    relatedItem: {
      id: "doc3",
      type: "document",
      code: "SOP-REG-003",
      title: "Regulatory Submission Guidelines",
    },
    actionUrl: "/documents/doc3",
  },
  {
    id: "9",
    type: "training-completion",
    title: "Training Completed",
    description: "David Brown completed training on Deviation Handling",
    module: "Training",
    priority: "low",
    status: "read",
    createdAt: "2026-01-25T11:20:00Z",
    readAt: "2026-01-25T12:00:00Z",
    sender: { id: "u8", name: "David Brown" },
    relatedItem: {
      id: "trn2",
      type: "training",
      code: "TRN-2025-060",
      title: "Deviation Handling Procedures",
    },
    actionUrl: "/training-management",
  },
  {
    id: "10",
    type: "approval",
    title: "Change Control Approved",
    description: "Maria Garcia approved CHG-2023-156",
    module: "Change Control",
    priority: "high",
    status: "read",
    createdAt: "2026-01-24T16:30:00Z",
    readAt: "2026-01-24T17:00:00Z",
    sender: { id: "u9", name: "Maria Garcia" },
    relatedItem: {
      id: "chg1",
      type: "change-control",
      code: "CHG-2023-156",
      title: "Production Line Modification",
    },
    actionUrl: "/change-management",
  },
  {
    id: "11",
    type: "deviation-assignment",
    title: "Urgent Deviation Assignment",
    description: "You were assigned to DEV-2023-234",
    module: "Deviation",
    priority: "critical",
    status: "unread",
    createdAt: "2026-01-23T08:00:00Z",
    relatedItem: {
      id: "dev2",
      type: "deviation",
      code: "DEV-2023-234",
      title: "Critical Equipment Failure",
    },
    actionUrl: "/deviations-ncs",
  },
  {
    id: "12",
    type: "document-update",
    title: "Batch Record Updated",
    description: "Production Team updated BP-PROD-045",
    module: "Document",
    priority: "medium",
    status: "read",
    createdAt: "2026-01-22T13:45:00Z",
    readAt: "2026-01-22T14:30:00Z",
    sender: { id: "u10", name: "Production Team" },
    relatedItem: {
      id: "doc4",
      type: "document",
      code: "BP-PROD-045",
      title: "Batch Production Record Template",
    },
    actionUrl: "/documents/doc4",
  },
];

// Helper functions
const getTypeIcon = (type: NotificationType) => {
  const icons: Record<NotificationType, typeof Bell> = {
    "review-request": MessageCircle,
    approval: CheckCircle,
    "capa-assignment": UserPlus,
    "training-completion": ThumbsUp,
    "document-update": FileText,
    "comment-reply": Reply,
    "deviation-assignment": AlertTriangle,
    "change-control": Settings,
    system: Bell,
  };
  return icons[type] || Bell;
};

const getTypeColor = (type: NotificationType) => {
  const colors: Record<NotificationType, { bg: string; text: string; badge: string }> = {
    "review-request": { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-500" },
    approval: { bg: "bg-emerald-100", text: "text-emerald-600", badge: "bg-emerald-500" },
    "capa-assignment": { bg: "bg-amber-100", text: "text-amber-600", badge: "bg-amber-500" },
    "training-completion": { bg: "bg-purple-100", text: "text-purple-600", badge: "bg-purple-500" },
    "document-update": { bg: "bg-cyan-100", text: "text-cyan-600", badge: "bg-cyan-500" },
    "comment-reply": { bg: "bg-slate-100", text: "text-slate-600", badge: "bg-slate-500" },
    "deviation-assignment": { bg: "bg-red-100", text: "text-red-600", badge: "bg-red-500" },
    "change-control": { bg: "bg-indigo-100", text: "text-indigo-600", badge: "bg-indigo-500" },
    system: { bg: "bg-gray-100", text: "text-gray-600", badge: "bg-gray-500" },
  };
  return colors[type] || colors.system;
};

const getPriorityStyles = (priority: NotificationPriority) => {
  const styles: Record<NotificationPriority, string> = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-amber-50 text-amber-700 border-amber-200",
    medium: "bg-blue-50 text-blue-700 border-blue-200",
    low: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return styles[priority];
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// --- Components ---

// Tab Component
const NotificationTabs: React.FC<{
  activeTab: NotificationFilterTab;
  setActiveTab: (tab: NotificationFilterTab) => void;
  counts: { all: number; unread: number; read: number };
}> = ({ activeTab, setActiveTab, counts }) => {
  const tabs: { id: NotificationFilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "unread", label: "Unread", count: counts.unread },
    { id: "read", label: "Read", count: counts.read },
  ];

  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            activeTab === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full",
              activeTab === tab.id
                ? tab.id === "unread"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
                : "bg-slate-200/60 text-slate-500"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// Filters Component
const NotificationFilters: React.FC<{
  search: string;
  setSearch: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  module: string;
  setModule: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
}> = ({
  search,
  setSearch,
  type,
  setType,
  module,
  setModule,
  priority,
  setPriority,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) => {
  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Review Request", value: "review-request" },
    { label: "Approval", value: "approval" },
    { label: "CAPA Assignment", value: "capa-assignment" },
    { label: "Training Completion", value: "training-completion" },
    { label: "Document Update", value: "document-update" },
    { label: "Comment Reply", value: "comment-reply" },
    { label: "Deviation Assignment", value: "deviation-assignment" },
    { label: "Change Control", value: "change-control" },
  ];

  const moduleOptions = [
    { label: "All Modules", value: "all" },
    { label: "Document", value: "Document" },
    { label: "Deviation", value: "Deviation" },
    { label: "CAPA", value: "CAPA" },
    { label: "Training", value: "Training" },
    { label: "Change Control", value: "Change Control" },
  ];

  const priorityOptions = [
    { label: "All Priorities", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <FilterCard>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="xl:col-span-4">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="xl:col-span-2">
          <Select
            label="Type"
            value={type}
            onChange={(val) => setType(val as string)}
            options={typeOptions}
          />
        </div>

        {/* Module Filter */}
        <div className="xl:col-span-2">
          <Select
            label="Module"
            value={module}
            onChange={(val) => setModule(val as string)}
            options={moduleOptions}
          />
        </div>

        {/* Priority Filter */}
        <div className="xl:col-span-2">
          <Select
            label="Priority"
            value={priority}
            onChange={(val) => setPriority(val as string)}
            options={priorityOptions}
          />
        </div>

        {/* Date From */}
        <div className="xl:col-span-2">
          <DateTimePicker
            label="From"
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Start date"
          />
        </div>
      </div>
    </FilterCard>
  );
};

// Dropdown Menu for Actions
const NotificationActionsDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onView: () => void;
}> = ({ isOpen, onClose, position, notification, onMarkAsRead, onDelete, onView }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onTouchStart={(e) => {
          // Allow scroll gestures to pass through
          if (e.touches.length === 1) {
            return;
          }
        }}
        onTouchMove={(e) => {
          // Allow scroll gestures to pass through
          return;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
        style={{ 
          // Allow scroll on touch devices
          touchAction: 'auto',
          // Make backdrop invisible but still clickable
          backgroundColor: 'transparent'
        }}
      />
      <div
        className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">View Details</span>
          </button>
          {notification.status === "unread" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Mark as Read</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">Delete</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

// Notification Row Component
const NotificationRow: React.FC<{
  notification: Notification;
  index: number;
  onView: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, index, onView, onMarkAsRead, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const Icon = getTypeIcon(notification.type);
  const colors = getTypeColor(notification.type);

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 180,
    });
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <tr
      onClick={() => onView(notification)}
      className={cn(
        "group cursor-pointer transition-colors",
        notification.status === "unread"
          ? "bg-emerald-50/30 hover:bg-emerald-50/50"
          : "hover:bg-slate-50/80"
      )}
    >
      {/* No. */}
      <td className="py-3.5 px-4 text-sm text-slate-500 text-center whitespace-nowrap">
        {index}
      </td>

      {/* Icon & Title */}
      <td className="py-3.5 px-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                colors.bg
              )}
            >
              <Icon className={cn("h-5 w-5", colors.text)} />
            </div>
            {notification.status === "unread" && (
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm",
                notification.status === "unread"
                  ? "font-semibold text-slate-900"
                  : "font-medium text-slate-700"
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
              {notification.description}
            </p>
          </div>
        </div>
      </td>

      {/* Module */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {notification.module}
        </span>
      </td>

      {/* Related Item */}
      <td className="py-3.5 px-4 hidden lg:table-cell">
        {notification.relatedItem ? (
          <span className="text-sm font-medium text-emerald-600">
            {notification.relatedItem.code}
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      {/* Priority */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
            getPriorityStyles(notification.priority)
          )}
        >
          {notification.priority}
        </span>
      </td>

      {/* Time */}
      <td className="py-3.5 px-4 text-sm text-slate-500 hidden sm:table-cell whitespace-nowrap">
        {formatTimeAgo(notification.createdAt)}
      </td>

      {/* Actions */}
      <td
        onClick={(e) => e.stopPropagation()}
        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
      >
        <button
          onClick={handleDropdownToggle}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-slate-600" />
        </button>
        <NotificationActionsDropdown
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          position={dropdownPosition}
          notification={notification}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
          onDelete={() => onDelete(notification.id)}
          onView={() => onView(notification)}
        />
      </td>
    </tr>
  );
};

// Empty State Component
const EmptyState: React.FC<{ type: NotificationFilterTab }> = ({ type }) => {
  const messages = {
    all: { title: "No notifications", subtitle: "You're all caught up!" },
    unread: { title: "No unread notifications", subtitle: "All notifications have been read" },
    read: { title: "No read notifications", subtitle: "Notifications you've read will appear here" },
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-base font-medium text-slate-900">{messages[type].title}</p>
      <p className="text-sm text-slate-500 mt-1">{messages[type].subtitle}</p>
    </div>
  );
};

// Mobile Card Component
const NotificationCard: React.FC<{
  notification: Notification;
  index: number;
  onView: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, index, onView, onMarkAsRead, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const Icon = getTypeIcon(notification.type);
  const colors = getTypeColor(notification.type);

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: Math.min(rect.right + window.scrollX - 180, window.innerWidth - 210),
    });
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      onClick={() => onView(notification)}
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all duration-200 active:scale-[0.99]",
        notification.status === "unread"
          ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
          : "bg-white border-slate-200 hover:border-slate-200"
      )}
    >
      {/* Header: Icon + Title + Action */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              colors.bg
            )}
          >
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          {notification.status === "unread" && (
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm leading-tight",
                notification.status === "unread"
                  ? "font-semibold text-slate-900"
                  : "font-medium text-slate-700"
              )}
            >
              {notification.title}
            </p>
            <button
              onClick={handleDropdownToggle}
              className="shrink-0 p-1.5 -mr-1.5 -mt-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {notification.description}
          </p>
        </div>
      </div>

      {/* Footer: Metadata */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        {/* Module Badge */}
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {notification.module}
        </span>
        
        {/* Priority Badge */}
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize",
            getPriorityStyles(notification.priority)
          )}
        >
          {notification.priority}
        </span>
        
        {/* Related Item */}
        {notification.relatedItem && (
          <span className="text-xs font-medium text-emerald-600">
            {notification.relatedItem.code}
          </span>
        )}
        
        {/* Time - pushed to right */}
        <span className="text-xs text-slate-400 ml-auto">
          {formatTimeAgo(notification.createdAt)}
        </span>
      </div>

      {/* Dropdown */}
      <NotificationActionsDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        position={dropdownPosition}
        notification={notification}
        onMarkAsRead={() => onMarkAsRead(notification.id)}
        onDelete={() => onDelete(notification.id)}
        onView={() => onView(notification)}
      />
    </div>
  );
};

// --- Main View ---
export const NotificationsView: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [module, setModule] = useState("all");
  const [priority, setPriority] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Notification data (in real app, this would come from API)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => n.status === "unread").length,
      read: notifications.filter((n) => n.status === "read").length,
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Tab filter
      if (activeTab === "unread" && notification.status !== "unread") return false;
      if (activeTab === "read" && notification.status !== "read") return false;

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          notification.title.toLowerCase().includes(searchLower) ||
          notification.description.toLowerCase().includes(searchLower) ||
          notification.relatedItem?.code.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (type !== "all" && notification.type !== type) return false;

      // Module filter
      if (module !== "all" && notification.module !== module) return false;

      // Priority filter
      if (priority !== "all" && notification.priority !== priority) return false;

      // Date filters
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        const notificationDate = new Date(notification.createdAt);
        if (notificationDate < fromDate) return false;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        const notificationDate = new Date(notification.createdAt);
        if (notificationDate > toDate) return false;
      }

      return true;
    });
  }, [notifications, activeTab, search, type, module, priority, dateFrom, dateTo]);

  // Paginated notifications
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Handlers
  const handleViewNotification = (notification: Notification) => {
    // Mark as read
    if (notification.status === "unread") {
      handleMarkAsRead(notification.id);
    }
    // Navigate to related item
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "read" as const, readAt: new Date().toISOString() } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "unread"
          ? { ...n, status: "read" as const, readAt: new Date().toISOString() }
          : n
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Notifications
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={counts.unread === 0}
            className="whitespace-nowrap gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <NotificationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
        />
      </div>

      {/* Filters */}
      <NotificationFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          module={module}
          setModule={setModule}
          priority={priority}
          setPriority={setPriority}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

      {/* Mobile: Card List */}
      <div className="md:hidden space-y-3">
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification, idx) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              index={(currentPage - 1) * itemsPerPage + idx + 1}
              onView={handleViewNotification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl">
            <EmptyState type={activeTab} />
          </div>
        )}
        
        {/* Mobile Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredNotifications.length}
            />
          </div>
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center w-14">
                  No.
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Notification
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Module
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Related Item
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Priority
                </th>
                <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                  Time
                </th>
                <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedNotifications.length > 0 ? (
                paginatedNotifications.map((notification, idx) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    index={(currentPage - 1) * itemsPerPage + idx + 1}
                    onView={handleViewNotification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteNotification}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState type={activeTab} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredNotifications.length}
          />
        )}
      </div>
    </div>
  );
};
