import React, { useState } from "react";
import {
  History,
  Search,
  Calendar,
  ChevronDown,
  Info,
  Monitor,
  CheckCircle2,
  FileEdit,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Select, SelectOption } from "@/components/ui/select/Select";
import { Button } from "@/components/ui/button/Button";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
    department: string;
  };
  action: string;
  actionType: "create" | "review" | "approve" | "reject" | "edit" | "download" | "print" | "view";
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  reason?: string;
  ipAddress: string;
  device: string;
}

const mockAuditData: AuditEntry[] = [
  {
    id: "AUD-2025-001",
    timestamp: "2025-12-27 14:30:05",
    user: { name: "Robert Johnson", role: "Director", department: "Quality Assurance" },
    action: "Approved Document",
    actionType: "approve",
    reason: "Document meets all GMP requirements and is ready for implementation",
    ipAddress: "192.168.1.105",
    device: "Windows 11 Pro - Chrome 120"
  },
  {
    id: "AUD-2025-002",
    timestamp: "2025-12-26 16:45:22",
    user: { name: "Jane Smith", role: "QA Manager", department: "Quality Assurance" },
    action: "Reviewed Document",
    actionType: "review",
    changes: [
      { field: "Section 4.2", oldValue: "Process must be validated", newValue: "Process must be validated and documented" },
      { field: "Effective Date", oldValue: "2025-12-20", newValue: "2025-12-27" }
    ],
    reason: "Added clarification on documentation requirements",
    ipAddress: "192.168.1.103",
    device: "Windows 10 - Firefox 121"
  },
  {
    id: "AUD-2025-003",
    timestamp: "2025-12-25 10:15:33",
    user: { name: "John Doe", role: "Document Author", department: "Quality Control" },
    action: "Submitted for Review",
    actionType: "review",
    ipAddress: "192.168.1.102",
    device: "Windows 11 - Edge 120"
  },
  {
    id: "AUD-2025-004",
    timestamp: "2025-12-24 09:20:15",
    user: { name: "John Doe", role: "Document Author", department: "Quality Control" },
    action: "Edited Draft",
    actionType: "edit",
    changes: [
      { field: "Purpose", oldValue: "To establish procedure for...", newValue: "To establish comprehensive procedure for..." }
    ],
    reason: "Improved clarity of document purpose",
    ipAddress: "192.168.1.102",
    device: "Windows 11 - Edge 120"
  },
  {
    id: "AUD-2025-005",
    timestamp: "2025-12-23 14:00:00",
    user: { name: "John Doe", role: "Document Author", department: "Quality Control" },
    action: "Created Draft",
    actionType: "create",
    ipAddress: "192.168.1.102",
    device: "Windows 11 - Edge 120"
  },
  {
    id: "AUD-2025-006",
    timestamp: "2025-12-27 11:20:45",
    user: { name: "Sarah Williams", role: "Training Coordinator", department: "Human Resources" },
    action: "Downloaded Controlled Copy",
    actionType: "download",
    reason: "For training session materials",
    ipAddress: "192.168.1.110",
    device: "MacOS Sonoma - Safari 17"
  },
  {
    id: "AUD-2025-007",
    timestamp: "2025-12-26 08:30:12",
    user: { name: "Michael Chen", role: "QC Analyst", department: "Quality Control" },
    action: "Printed Controlled Copy",
    actionType: "print",
    reason: "Hard copy required for cleanroom use (Copy No. 03)",
    ipAddress: "192.168.1.108",
    device: "Windows 10 - Chrome 120"
  }
];

const milestones = [
  { label: "Created", date: "23 Dec", status: "completed", icon: FileEdit },
  { label: "Reviewed", date: "25 Dec", status: "completed", icon: Eye },
  { label: "Approved", date: "27 Dec", status: "completed", icon: CheckCircle2 },
  { label: "Effective", date: "27 Dec", status: "current", icon: BadgeCheck }
];

const actionTypeOptions: SelectOption[] = [
  { value: "all", label: "All Actions"},
  { value: "create", label: "Create" },
  { value: "edit", label: "Edit" },
  { value: "review", label: "Review" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
  { value: "download", label: "Download" },
  { value: "print", label: "Print"}
];

export const AuditTrailTab: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = mockAuditData.filter(entry => {
    const matchesAction = selectedAction === "all" || entry.actionType === selectedAction;
    const matchesSearch = entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  const getActionBadge = (actionType: string) => {
    const styles = {
      create: "bg-blue-50 text-blue-700 border-blue-200",
      edit: "bg-amber-50 text-amber-700 border-amber-200",
      review: "bg-purple-50 text-purple-700 border-purple-200",
      approve: "bg-emerald-50 text-emerald-700 border-emerald-200",
      reject: "bg-red-50 text-red-700 border-red-200",
      download: "bg-emerald-50 text-emerald-700 border-emerald-200",
      print: "bg-slate-50 text-slate-700 border-slate-200",
      view: "bg-slate-50 text-slate-600 border-slate-200"
    };
    return styles[actionType as keyof typeof styles] || styles.view;
  };

  const openChangesModal = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setShowChangesModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Visual Timeline */}
      <div className="bg-white border rounded-xl border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Document Lifecycle</h3>
          <span className="text-xs text-slate-500">SOP-QA-001 v2.0</span>
        </div>
        <div className="relative flex items-center justify-between">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              {/* Connector Line */}
              {index < milestones.length - 1 && (
                <div className={cn(
                  "absolute top-5 left-1/2 w-full h-0.5",
                  milestone.status === "completed" ? "bg-emerald-500" : "bg-slate-200"
                )} />
              )}
              
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center relative z-10 border-2",
                milestone.status === "completed" 
                  ? "bg-emerald-50 border-emerald-500" 
                  : milestone.status === "current"
                  ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-100"
                  : "bg-slate-50 border-slate-300"
              )}>
                <milestone.icon className={cn(
                  "h-5 w-5",
                  milestone.status === "completed"
                    ? "text-emerald-600"
                    : milestone.status === "current"
                    ? "text-emerald-600"
                    : "text-slate-400"
                )} />
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-xs font-medium",
                  milestone.status === "completed" || milestone.status === "current"
                    ? "text-slate-900"
                    : "text-slate-500"
                )}>
                  {milestone.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{milestone.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Action Filter with Select Component */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Filter by Action:</span>
            <div className="w-[200px]">
              <Select
                value={selectedAction}
                onChange={(value) => setSelectedAction(value as string)}
                options={actionTypeOptions}
                placeholder="All Actions"
                searchPlaceholder="Search actions..."
                enableSearch={false}
                triggerClassName="h-10"
              />
            </div>
          </div>

          {/* Date Range (Placeholder) */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Last 30 days</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user or action..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="flex-1 overflow-hidden border bg-white shadow-sm flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Changes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  IP / Device
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <History className="h-12 w-12 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">No audit entries found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {searchQuery || selectedAction !== "all" 
                            ? "Try adjusting your filters or search query" 
                            : "No audit trail records available for this document"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      {/* số thứ tự */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                      </td>
                    {/* Timestamp */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {entry.timestamp.split(' ')[1]}
                          </div>
                          <div className="text-xs text-slate-500">
                            {entry.timestamp.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {entry.user.name}
                        </div>
                        <div className="text-xs text-slate-600">
                          {entry.user.role}
                        </div>
                        <div className="text-xs text-slate-500">
                          {entry.user.department}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                        getActionBadge(entry.actionType)
                      )}>
                        {entry.action}
                      </span>
                    </td>

                    {/* Changes */}
                    <td className="px-4 py-4">
                      {entry.changes && entry.changes.length > 0 ? (
                        <button
                          onClick={() => openChangesModal(entry)}
                          className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          <Info className="h-4 w-4" />
                          {entry.changes.length} field{entry.changes.length > 1 ? 's' : ''} changed
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">No changes</span>
                      )}
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-4 max-w-xs">
                      {entry.reason ? (
                        <p className="text-sm text-slate-700 line-clamp-2">{entry.reason}</p>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    {/* IP / Device */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <Monitor className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-mono text-slate-700">
                            {entry.ipAddress}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {entry.device}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>
              Showing <span className="font-medium text-slate-900">{startItem}</span> to{" "}
              <span className="font-medium text-slate-900">{endItem}</span> of{" "}
              <span className="font-medium text-slate-900">{filteredData.length}</span> results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
            size="sm"
              className="h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Changes Detail Modal */}
      {showChangesModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Change Details</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {selectedEntry.action} by {selectedEntry.user.name} on {selectedEntry.timestamp}
                </p>
              </div>
              <button
                onClick={() => setShowChangesModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedEntry.changes && selectedEntry.changes.length > 0 ? (
                <div className="space-y-4">
                  {selectedEntry.changes.map((change, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="text-sm font-semibold text-slate-900 mb-3">
                        {change.field}
                      </div>
                      <div className="space-y-2">
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <div className="text-xs font-medium text-red-700 mb-1">Old Value:</div>
                          <div className="text-sm text-slate-700">{change.oldValue}</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <div className="text-xs font-medium text-green-700 mb-1">New Value:</div>
                          <div className="text-sm text-slate-700">{change.newValue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No changes recorded</p>
              )}

              {selectedEntry.reason && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-amber-700 mb-1">Reason for Change:</div>
                  <div className="text-sm text-slate-700">{selectedEntry.reason}</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
              <button
                onClick={() => setShowChangesModal(false)}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
