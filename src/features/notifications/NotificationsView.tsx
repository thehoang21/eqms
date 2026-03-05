import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from '@/components/ui/breadcrumb/Breadcrumb';
import { notifications as notificationsBreadcrumb } from '@/components/ui/breadcrumb/breadcrumbs.config';
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
  MoreVertical,
  Eye,
  ExternalLink,
  Download,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateRangePicker } from "@/components/ui/datetime-picker/DateRangePicker";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { TableEmptyState } from "@/components/ui/table/TableEmptyState";
import { FilterCard } from "@/components/ui/card/FilterCard";
import { cn } from "@/components/ui/utils";
import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFilterTab,
} from "./types";
import { IconInfoCircle } from "@tabler/icons-react";
import { MOCK_NOTIFICATIONS } from "./mockData";

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
    system: { bg: "bg-slate-100", text: "text-slate-600", badge: "bg-slate-500" },
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
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex-1 sm:flex-initial",
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
  onClearFilters: () => void;
  hasActiveFilters: boolean;
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
  onClearFilters,
  hasActiveFilters,
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
      {/* Row 1: Search, Type, Module */}
      <FilterCard.Row>
        <FilterCard.Item span={6} mdSpan={2}>
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 transition-colors"
            />
          </div>
        </FilterCard.Item>

        <FilterCard.Item span={3}>
          <Select
            label="Type"
            value={type}
            onChange={(val) => setType(val as string)}
            options={typeOptions}
          />
        </FilterCard.Item>

        <FilterCard.Item span={3}>
          <Select
            label="Module"
            value={module}
            onChange={(val) => setModule(val as string)}
            options={moduleOptions}
          />
        </FilterCard.Item>
      </FilterCard.Row>

      {/* Row 2: Priority, Time Range */}
      <FilterCard.Row className="mt-3 sm:mt-4">
        <FilterCard.Item span={3}>
          <Select
            label="Priority"
            value={priority}
            onChange={(val) => setPriority(val as string)}
            options={priorityOptions}
          />
        </FilterCard.Item>

        <FilterCard.Item span={3} mdSpan={1}>
          <DateRangePicker
            label="Time Range"
            startDate={dateFrom}
            endDate={dateTo}
            onStartDateChange={setDateFrom}
            onEndDateChange={setDateTo}
            placeholder="Select date range"
          />
        </FilterCard.Item>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <FilterCard.Item span={6} mdSpan={1} className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 gap-1.5 whitespace-nowrap"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </FilterCard.Item>
        )}
      </FilterCard.Row>
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
            <IconInfoCircle className="h-4 w-4 flex-shrink-0" />
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
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
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
      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-slate-500 text-center whitespace-nowrap">
        {index}
      </td>

      {/* Icon & Title */}
      <td className="py-2 px-2 sm:py-3.5 sm:px-4">
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
      <td className="py-2 px-2 sm:py-3.5 sm:px-4 hidden md:table-cell whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-700">
          {notification.module}
        </span>
      </td>

      {/* Related Item */}
      <td className="py-2 px-2 sm:py-3.5 sm:px-4 hidden lg:table-cell whitespace-nowrap">
        {notification.relatedItem ? (
          <span className="text-xs sm:text-sm font-medium text-emerald-600">
            {notification.relatedItem.code}
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-slate-400">—</span>
        )}
      </td>

      {/* Priority */}
      <td className="py-2 px-2 sm:py-3.5 sm:px-4 hidden md:table-cell">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border capitalize",
            getPriorityStyles(notification.priority)
          )}
        >
          {notification.priority}
        </span>
      </td>

      {/* Time */}
      <td className="py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-slate-500 hidden sm:table-cell whitespace-nowrap">
        {formatTimeAgo(notification.createdAt)}
      </td>

      {/* Actions */}
      <td
        onClick={(e) => e.stopPropagation()}
        className="sticky right-0 bg-white py-2 px-2 sm:py-3.5 sm:px-4 text-xs sm:text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
      >
        <button
          onClick={handleDropdownToggle}
          className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="More actions"
        >
          <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
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
const EmptyState: React.FC<{
  type: NotificationFilterTab;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}> = ({ type, hasActiveFilters, onClearFilters }) => {
  const messages = {
    all: {
      title: "No notifications",
      description: hasActiveFilters
        ? "We couldn't find any notifications matching your filters. Try adjusting your search criteria or clear filters."
        : "You're all caught up!",
    },
    unread: {
      title: "No unread notifications",
      description: hasActiveFilters
        ? "We couldn't find any unread notifications matching your filters. Try adjusting your search criteria or clear filters."
        : "All notifications have been read",
    },
    read: {
      title: "No read notifications",
      description: hasActiveFilters
        ? "We couldn't find any read notifications matching your filters. Try adjusting your search criteria or clear filters."
        : "Notifications you've read will appear here",
    },
  };

  return (
    <TableEmptyState
      icon={<Bell className="h-7 w-7 md:h-8 md:w-8 text-slate-300" />}
      title={messages[type].title}
      description={messages[type].description}
      actionLabel="Clear Filters"
      onAction={hasActiveFilters ? onClearFilters : undefined}
    />
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
              aria-label="More actions"
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setType("all");
    setModule("all");
    setPriority("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = search !== "" || type !== "all" || module !== "all" || priority !== "all" || dateFrom !== "" || dateTo !== "";

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Notifications
          </h1>
          <Breadcrumb items={notificationsBreadcrumb(navigate)} />
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-wrap">
          <Button
            onClick={() => console.log("Export notifications")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={counts.unread === 0}
            className="whitespace-nowrap gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="inline">Mark all as read</span>
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
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
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
            <EmptyState type={activeTab} hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
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
              onItemsPerPageChange={setItemsPerPage}
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
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center w-10 sm:w-14">
                  No.
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Notification
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Module
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Related Item
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Priority
                </th>
                <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                  Time
                </th>
                <th className="sticky right-0 bg-slate-50 py-2.5 px-2 sm:py-3.5 sm:px-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
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
                    <EmptyState type={activeTab} hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
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
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
};
