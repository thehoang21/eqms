import React from "react";
import { LinkIcon } from "lucide-react";
import { Select } from "@/components/ui/select/Select";
import { MultiSelect } from "@/components/ui/select/MultiSelect";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
import { cn } from "@/components/ui/utils";
import { DocumentType, DOCUMENT_TYPES } from "@/types/documentTypes";

// Export FormData interface to be reused by parent components
export interface GeneralTabFormData {
  title: string;
  type: DocumentType;
  author: string;
  coAuthors: (string | number)[];
  businessUnit: string;
  department: string;
  knowledgeBase: string;
  subType: string;
  periodicReviewCycle: number;
  periodicReviewNotification: number;
  language: string;
  reviewDate: string;
  description: string;
  isTemplate: boolean;
}

// Alias for backward compatibility
type FormData = GeneralTabFormData;

interface GeneralTabProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  isTemplateMode?: boolean;
  hideTemplateCheckbox?: boolean;
  suggestedDocumentCode?: string; // Suggested code from parent document
  documentNumber?: string; // Auto-generated document number
  createdDateTime?: string; // Auto-generated created date/time
  openedBy?: string; // Auto-generated opened by user
  isObsoleted?: boolean;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  formData,
  onFormChange,
  isTemplateMode = false,
  hideTemplateCheckbox = false,
  suggestedDocumentCode = "",
  documentNumber = "",
  createdDateTime = "",
  openedBy = "",
  isObsoleted = false,
}) => {
  const setFormData = (data: Partial<FormData>) => {
    onFormChange({ ...formData, ...data });
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Document Number (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Number
          </label>
          <input
            type="text"
            value={documentNumber}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after Next Step"
          />
        </div>

        {/* Created (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Created (Date - Time)
          </label>
          <input
            type="text"
            value={createdDateTime}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Auto-generated after Next Step"
          />
        </div>

        {/* Suggested Document Code (if parent is selected) */}
        {suggestedDocumentCode && (
          <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-900">
                  Gợi ý mã tài liệu con:
                </p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">
                  {suggestedDocumentCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Author, Co-Author & Opened by - Same row with 2-1-1 ratio */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {/* Opened by (read-only, auto-generated) */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Opened by
            </label>
            <input
              type="text"
              value={openedBy}
              readOnly
              className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
              placeholder="Auto-generated after Next Step"
            />
          </div>
          {/* Author (Select) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Author<span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              value={formData.author}
              onChange={(value) =>
                !isObsoleted && setFormData({ author: value })
              }
              options={[
                { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                { label: "John Smith", value: "John Smith" },
                { label: "Mary Williams", value: "Mary Williams" },
                { label: "Robert Brown", value: "Robert Brown" },
              ]}
              enableSearch={true}
              placeholder="Select author..."
              disabled={isObsoleted}
            />
          </div>

          {/* Co-Authors (MultiSelect) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Co-Authors
            </label>
            <MultiSelect
              value={formData.coAuthors}
              onChange={(values) =>
                !isObsoleted && setFormData({ coAuthors: values })
              }
              options={[
                { label: "Shani Rosenbilt", value: "Shani Rosenbilt" },
                { label: "John Smith", value: "John Smith" },
                { label: "Mary Williams", value: "Mary Williams" },
                { label: "Robert Brown", value: "Robert Brown" },
              ]}
              enableSearch={true}
              placeholder="Select co-authors..."
              maxVisibleTags={2}
              disabled={isObsoleted}
            />
          </div>
        </div>

        {/* Is Template */}
        {!isTemplateMode && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="isTemplate"
              className={cn(
                "text-sm font-medium text-slate-700",
                !isObsoleted && "cursor-pointer",
              )}
            >
              Is Template?
            </label>
            <Checkbox
              id="isTemplate"
              checked={formData.isTemplate}
              onChange={(checked) =>
                !isObsoleted && setFormData({ isTemplate: checked })
              }
              disabled={isObsoleted}
            />
          </div>
        )}

        {/* Business Unit (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Business Unit<span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            value={formData.businessUnit}
            onChange={(value) =>
              !isObsoleted && setFormData({ businessUnit: value })
            }
            options={[
              { label: "Operation Unit", value: "Operation Unit" },
              { label: "QA Unit", value: "QA Unit" },
              { label: "QC Unit", value: "QC Unit" },
              { label: "HR Unit", value: "HR Unit" },
            ]}
            enableSearch={true}
            disabled={isObsoleted}
          />
        </div>

        {/* Document Name - Full width */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Document Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              !isObsoleted && setFormData({ title: e.target.value })
            }
            placeholder="Enter document name"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Department (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Department
          </label>
          <Select
            value={formData.department}
            onChange={(value) =>
              !isObsoleted && setFormData({ department: value })
            }
            options={[
              {
                label: "Human Resources & Administrator",
                value: "Human Resources & Administrator",
              },
              { label: "Production", value: "Production" },
              { label: "Quality Control", value: "Quality Control" },
              { label: "Quality Assurance", value: "Quality Assurance" },
            ]}
            enableSearch={true}
            disabled={isObsoleted}
          />
        </div>

        {/* Knowledge Base */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Knowledge Base
          </label>
          <input
            type="text"
            value={formData.knowledgeBase}
            onChange={(e) =>
              !isObsoleted && setFormData({ knowledgeBase: e.target.value })
            }
            placeholder="Enter knowledge base"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Document Type (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Document Type<span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            value={formData.type}
            onChange={(value) =>
              !isObsoleted && setFormData({ type: value as DocumentType })
            }
            options={DOCUMENT_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            enableSearch={true}
            placeholder="Select document type..."
            disabled={isObsoleted}
          />
        </div>

        {/* Sub-Type (Select) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Sub-Type</label>
          <Select
            value={formData.subType}
            onChange={(value) =>
              !isObsoleted && setFormData({ subType: value })
            }
            options={[
              { label: "-- None --", value: "" },
              { label: "Template", value: "Template" },
              { label: "Guideline", value: "Guideline" },
              { label: "Checklist", value: "Checklist" },
            ]}
            enableSearch={true}
            placeholder="Select sub-type..."
            disabled={isObsoleted}
          />
        </div>

        {/* Periodic Review Cycle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Periodic Review Cycle (Months)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={formData.periodicReviewCycle || ""}
            onChange={(e) =>
              !isObsoleted &&
              setFormData({
                periodicReviewCycle: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Enter review cycle in months"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Periodic Review Notification */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Periodic Review Notification (Days)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={formData.periodicReviewNotification || ""}
            onChange={(e) =>
              !isObsoleted &&
              setFormData({
                periodicReviewNotification: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Enter notification days before review"
            disabled={isObsoleted}
            className={cn(
              "w-full h-11 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>

        {/* Effective Date (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Effective Date (dd/MM/yyyy)
          </label>
          <input
            type="text"
            value={""}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>
        {/* Valid Until (read-only, auto-generated) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Valid Until (dd/MM/yyyy)
          </label>
          <input
            type="text"
            value={""}
            readOnly
            className="w-full h-11 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700"
            placeholder="Set when approved"
          />
        </div>

        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <Select
            value={formData.language}
            onChange={(value) =>
              !isObsoleted && setFormData({ language: value })
            }
            options={[
              { label: "English", value: "English" },
              { label: "Vietnamese", value: "Vietnamese" },
            ]}
            enableSearch={false}
            disabled={isObsoleted}
          />
        </div>

        {/* Review Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Review Date
          </label>
          <DateTimePicker
            value={formData.reviewDate || ""}
            onChange={(value) =>
              !isObsoleted && setFormData({ reviewDate: value })
            }
            placeholder="Select review date"
            disabled={isObsoleted}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              !isObsoleted && setFormData({ description: e.target.value })
            }
            placeholder="Enter document description"
            rows={4}
            disabled={isObsoleted}
            className={cn(
              "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none",
              isObsoleted && "bg-slate-100 cursor-not-allowed",
            )}
          />
        </div>
      </div>
    </div>
  );
};
