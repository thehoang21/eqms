import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Calendar,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";
import { IconSmartHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";

interface ExportConfig {
  reportType: string;
  dateFrom: string;
  dateTo: string;
  department: string;
  includeScores: boolean;
  includeAttendance: boolean;
  includeCertificates: boolean;
  format: string;
}

export const ExportRecordsView: React.FC = () => {
  const navigate = useNavigate();

  const [config, setConfig] = useState<ExportConfig>({
    reportType: "individual",
    dateFrom: "",
    dateTo: "",
    department: "All",
    includeScores: true,
    includeAttendance: true,
    includeCertificates: false,
    format: "pdf",
  });

  const reportTypeOptions = [
    { label: "Individual Training Record", value: "individual" },
    { label: "Department Summary", value: "department" },
    { label: "Course Completion Report", value: "course" },
    { label: "Compliance Matrix", value: "matrix" },
    { label: "Audit Trail", value: "audit" },
  ];

  const departmentOptions = [
    { label: "All Departments", value: "All" },
    { label: "Quality Assurance", value: "Quality Assurance" },
    { label: "Quality Control", value: "Quality Control" },
    { label: "Production", value: "Production" },
    { label: "Documentation", value: "Documentation" },
    { label: "Engineering", value: "Engineering" },
  ];

  const formatOptions = [
    { label: "PDF Document", value: "pdf" },
    { label: "Excel Spreadsheet", value: "excel" },
    { label: "CSV File", value: "csv" },
  ];

  const handleExport = () => {
    console.log("Exporting with config:", config);
    // Implement export logic here
  };

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {/* Header: Title + Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Export Training Records
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
            <IconSmartHome className="h-4 w-4" />
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Training Management</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="hidden sm:inline">Records & Archive</span>
            <span className="sm:hidden">...</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-700 font-medium">Export Records</span>
          </div>
        </div>
      </div>

      {/* Export Configuration Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Export Configuration</h2>

        <div className="space-y-6">
          {/* Row 1: Report Type & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Report Type"
                value={config.reportType}
                onChange={(val) => setConfig((prev) => ({ ...prev, reportType: val }))}
                options={reportTypeOptions}
              />
            </div>

            <div>
              <Select
                label="Department"
                value={config.department}
                onChange={(val) => setConfig((prev) => ({ ...prev, department: val }))}
                options={departmentOptions}
              />
            </div>
          </div>

          {/* Row 2: Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DateTimePicker
                label="From Date"
                value={config.dateFrom}
                onChange={(val) => setConfig((prev) => ({ ...prev, dateFrom: val }))}
                placeholder="Select start date"
              />
            </div>

            <div>
              <DateTimePicker
                label="To Date"
                value={config.dateTo}
                onChange={(val) => setConfig((prev) => ({ ...prev, dateTo: val }))}
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Row 3: Export Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Export Format"
                value={config.format}
                onChange={(val) => setConfig((prev) => ({ ...prev, format: val }))}
                options={formatOptions}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-6"></div>

          {/* Include Options */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Include in Export</h3>
            <div className="space-y-3">
              <Checkbox
                id="includeScores"
                label="Include Test Scores and Assessments"
                checked={config.includeScores}
                onChange={(checked) =>
                  setConfig((prev) => ({ ...prev, includeScores: checked }))
                }
              />
              <Checkbox
                id="includeAttendance"
                label="Include Attendance Records"
                checked={config.includeAttendance}
                onChange={(checked) =>
                  setConfig((prev) => ({ ...prev, includeAttendance: checked }))
                }
              />
              <Checkbox
                id="includeCertificates"
                label="Include Training Certificates (PDF only)"
                checked={config.includeCertificates}
                onChange={(checked) =>
                  setConfig((prev) => ({ ...prev, includeCertificates: checked }))
                }
                disabled={config.format !== "pdf"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Export Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Report Type:</span>
            <span className="font-medium text-slate-900">
              {reportTypeOptions.find((opt) => opt.value === config.reportType)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Department:</span>
            <span className="font-medium text-slate-900">{config.department}</span>
          </div>
          {config.dateFrom && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">From:</span>
              <span className="font-medium text-slate-900">
                {new Date(config.dateFrom).toLocaleDateString()}
              </span>
            </div>
          )}
          {config.dateTo && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">To:</span>
              <span className="font-medium text-slate-900">
                {new Date(config.dateTo).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Format:</span>
            <span className="font-medium text-slate-900 uppercase">{config.format}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Generate and Export
        </Button>
      </div>
    </div>
  );
};
