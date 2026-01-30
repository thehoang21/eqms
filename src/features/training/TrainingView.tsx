import React, { useState, useMemo } from "react";
import {
  Search,
  GraduationCap,
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Award,
  Download,
} from "lucide-react";
import { IconSmartHome, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { cn } from "@/components/ui/utils";
import {
  TrainingRecord,
  TrainingFilters,
  TrainingStatus,
  TrainingType,
} from "./types";
import {
  MobileCard,
  MobileCardList,
} from "@/components/ui/table/MobileCardView";

// Mock Data
const MOCK_TRAININGS: TrainingRecord[] = [
  {
    id: "1",
    trainingId: "TRN-2026-001",
    title: "GMP Basic Training",
    description:
      "Introduction to Good Manufacturing Practice principles and requirements",
    type: "GMP",
    status: "Scheduled",
    instructor: "Dr. John Smith",
    scheduledDate: "2026-02-15",
    duration: 4,
    location: "Training Room A",
    capacity: 30,
    enrolled: 25,
    department: "Production",
    mandatory: true,
    passScore: 80,
    createdBy: "Admin",
    createdAt: "2026-01-20",
    updatedAt: "2026-01-24",
  },
  {
    id: "2",
    trainingId: "TRN-2026-002",
    title: "Cleanroom Behavior & Hygiene",
    description: "Essential practices for maintaining cleanroom standards",
    type: "Safety",
    status: "In-Progress",
    instructor: "Sarah Johnson",
    scheduledDate: "2026-01-26",
    duration: 3,
    location: "Cleanroom B",
    capacity: 20,
    enrolled: 20,
    department: "Quality Assurance",
    mandatory: true,
    passScore: 85,
    createdBy: "QA Manager",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-25",
  },
  {
    id: "3",
    trainingId: "TRN-2026-003",
    title: "HPLC Operation Advanced",
    description: "Advanced techniques for HPLC operation and troubleshooting",
    type: "Technical",
    status: "Completed",
    instructor: "Dr. Michael Chen",
    scheduledDate: "2026-01-20",
    duration: 6,
    location: "Laboratory 2",
    capacity: 15,
    enrolled: 14,
    department: "QC Lab",
    mandatory: false,
    passScore: 75,
    createdBy: "Lab Supervisor",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-21",
  },
  {
    id: "4",
    trainingId: "TRN-2026-004",
    title: "ISO 9001:2015 Requirements",
    description:
      "Understanding ISO 9001 quality management system requirements",
    type: "Compliance",
    status: "Scheduled",
    instructor: "Emma Wilson",
    scheduledDate: "2026-03-01",
    duration: 8,
    location: "Conference Hall",
    capacity: 40,
    enrolled: 15,
    department: "All Departments",
    mandatory: false,
    passScore: 70,
    createdBy: "QA Director",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-23",
  },
  {
    id: "5",
    trainingId: "TRN-2026-005",
    title: "SOP Review & Update Procedures",
    description: "Training on proper SOP review and revision processes",
    type: "SOP",
    status: "Overdue",
    instructor: "David Brown",
    scheduledDate: "2026-01-10",
    duration: 2,
    location: "Meeting Room 3",
    capacity: 25,
    enrolled: 18,
    department: "Documentation",
    mandatory: true,
    passScore: 80,
    createdBy: "Doc Control",
    createdAt: "2025-12-20",
    updatedAt: "2026-01-05",
  },
];

export const TrainingView: React.FC = () => {
  // Filters
  const [filters, setFilters] = useState<TrainingFilters>({
    searchQuery: "",
    typeFilter: "All",
    statusFilter: "All",
    dateFrom: "",
    dateTo: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Options
  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "GMP", value: "GMP" },
    { label: "Safety", value: "Safety" },
    { label: "Technical", value: "Technical" },
    { label: "Compliance", value: "Compliance" },
    { label: "SOP", value: "SOP" },
    { label: "Software", value: "Software" },
  ];

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Overdue", value: "Overdue" },
  ];

  // Filtered Data
  const filteredData = useMemo(() => {
    return MOCK_TRAININGS.filter((training) => {
      const matchesSearch =
        training.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        training.trainingId
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        training.instructor
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      const matchesType =
        filters.typeFilter === "All" || training.type === filters.typeFilter;
      const matchesStatus =
        filters.statusFilter === "All" ||
        training.status === filters.statusFilter;

      const matchesDateFrom =
        !filters.dateFrom || training.scheduledDate >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || training.scheduledDate <= filters.dateTo;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [MOCK_TRAININGS, filters]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Status Badge Mapping
  const getStatusColor = (
    status: TrainingStatus,
  ): "draft" | "pendingReview" | "approved" | "effective" | "archived" => {
    switch (status) {
      case "Scheduled":
        return "pendingReview";
      case "In-Progress":
        return "approved";
      case "Completed":
        return "effective";
      case "Overdue":
        return "archived";
      default:
        return "draft";
    }
  };

  const getTypeIcon = (type: TrainingType) => {
    switch (type) {
      case "GMP":
        return <Award className="h-3.5 w-3.5" />;
      case "Safety":
        return <FileText className="h-3.5 w-3.5" />;
      default:
        return <GraduationCap className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb + Action Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Training Management
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">
              Training Management
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Button
            onClick={() => console.log("Export triggered")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => console.log("New Training")}
            size="sm"
            className="whitespace-nowrap gap-2"
          >
            <IconPlus className="h-4 w-4" />
            New Training
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-slate-200 shadow-sm">
        {/* Row 1: Search + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="xl:col-span-3">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, ID, or instructor..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="xl:col-span-3">
            <Select
              label="Type"
              value={filters.typeFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  typeFilter: value as TrainingType | "All",
                })
              }
              options={typeOptions}
            />
          </div>
        </div>

        {/* Row 2: Status + Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-end mt-4">
          {/* Status Filter */}
          <div className="xl:col-span-2">
            <Select
              label="Status"
              value={filters.statusFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  statusFilter: value as TrainingStatus | "All",
                })
              }
              options={statusOptions}
            />
          </div>

          {/* Date From */}
          <div className="xl:col-span-2">
            <DateTimePicker
              label="From Date"
              value={filters.dateFrom}
              onChange={(value) => setFilters({ ...filters, dateFrom: value })}
              placeholder="Select start date"
            />
          </div>

          {/* Date To */}
          <div className="xl:col-span-2">
            <DateTimePicker
              label="To Date"
              value={filters.dateTo}
              onChange={(value) => setFilters({ ...filters, dateTo: value })}
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">
                Total Trainings
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Scheduled</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.filter((t) => t.status === "Scheduled").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  MOCK_TRAININGS.filter((t) => t.status === "In-Progress")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {MOCK_TRAININGS.filter((t) => t.status === "Overdue").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <MobileCardList>
        {paginatedData.map((training, index) => (
          <MobileCard
            key={training.id}
            index={(currentPage - 1) * itemsPerPage + index + 1}
            fields={[
              {
                label: "Training ID",
                value: <span className="font-mono">{training.trainingId}</span>,
              },
              {
                label: "Title",
                value: training.title,
                fullWidth: true,
              },
              {
                label: "Type",
                value: (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {getTypeIcon(training.type)}
                    {training.type}
                  </span>
                ),
                badge: true,
              },
              {
                label: "Status",
                value: <StatusBadge status={getStatusColor(training.status)} />,
                badge: true,
              },
              {
                label: "Instructor",
                value: training.instructor,
              },
              {
                label: "Date",
                value: new Date(training.scheduledDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  },
                ),
              },
              {
                label: "Enrolled",
                value: `${training.enrolled}/${training.capacity}`,
              },
            ]}
            actions={[
              {
                label: "View",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => console.log("View training", training.id),
                variant: "outline",
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => console.log("Edit training", training.id),
              },
            ]}
          />
        ))}
      </MobileCardList>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  No.
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Training ID
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Title
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Type
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Status
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Instructor
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Scheduled Date
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-left">
                  Enrolled
                </th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center sticky right-0 bg-slate-50 z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((training, index) => (
                <tr
                  key={training.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="font-mono text-slate-900">
                      {training.trainingId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900 font-medium">
                    {training.title}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {getTypeIcon(training.type)}
                      {training.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <StatusBadge status={getStatusColor(training.status)} />
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {training.instructor}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-900">
                    {new Date(training.scheduledDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-medium">
                        {training.enrolled}/{training.capacity}
                      </span>
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all rounded-full",
                            training.enrolled >= training.capacity
                              ? "bg-emerald-500"
                              : training.enrolled >= training.capacity * 0.8
                                ? "bg-amber-500"
                                : "bg-cyan-500",
                          )}
                          style={{
                            width: `${(training.enrolled / training.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-center sticky right-0 bg-white z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-50">
                    <button className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors">
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
