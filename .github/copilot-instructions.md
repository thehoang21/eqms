# QMS Project UI/UX Standard Operating Procedures (SOP)

Bạn là một chuyên gia Senior React Developer (ReactJS, Tailwind CSS, shadcn/ui). Khi thực hiện yêu cầu trong dự án này, bạn PHẢI tuân thủ các quy chuẩn thiết kế và kỹ thuật sau:

---

## 0. Nguyên tắc Component Reusability (TỐI QUAN TRỌNG!)

**QUY TẮC VÀNG: LUÔN TÁI SỬ DỤNG COMPONENTS CÓ SẴN TRƯỚC KHI TẠO MỚI**

### 0.1 Components có sẵn trong `components/ui`

**PHẢI SỬ DỤNG các components này khi cần:**

#### 1. Button — `components/ui/button/Button.tsx`
```tsx
import { Button } from "@/components/ui/button/Button";
```
- **Variants:** `default` | `outline` | `ghost` | `destructive` | `secondary` | `link`
- **Sizes:** `xs` | `sm` | `default` | `lg` | `xl` | `icon` | `icon-sm` | `icon-lg`
- **Props:** `variant`, `size`, `fullWidth`, `disabled`, `onClick`, `type`
- **Actual size heights:** `xs=h-8`, `sm=h-9`, `default=h-10/h-11`, `icon=h-11 w-11`

#### 2. Select — `components/ui/select/Select.tsx`
```tsx
import { Select } from "@/components/ui/select/Select";
```
- Custom dropdown với search + async search + grouped options
- Portal rendering (z-index: 9999)
- **Props:** `label`, `value`, `onChange`, `options`, `groups`, `placeholder`, `enableSearch`, `disabled`, `isLoading`, `onSearch` (async), `debounceMs`, `minSearchLength`

#### 3. MultiSelect — `components/ui/select/MultiSelect.tsx`
```tsx
import { MultiSelect } from "@/components/ui/select/MultiSelect";
```
- Multiple selection, display selected items as tags
- Portal rendering (z-index: 9999)
- **Props:** `label`, `value` (array), `onChange`, `options`, `placeholder`, `enableSearch`, `maxVisibleTags`

#### 4. Checkbox — `components/ui/checkbox/Checkbox.tsx`
```tsx
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
```
- **Props:** `checked`, `onChange`, `id`, `label`, `disabled`

#### 5. DateTimePicker — `components/ui/datetime-picker/DateTimePicker.tsx`
```tsx
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";
```
- **Props:** `label`, `value`, `onChange`, `placeholder`

#### 6. StatusBadge — `components/ui/statusbadge/StatusBadge.tsx`
```tsx
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
```
- Tự động map `StatusType` → color/label
- **StatusType:** `draft` | `pendingReview` | `pendingApproval` | `approved` | `rejected` | `pendingTraining` | `readyForPublishing` | `published` | `effective` | `active` | `archived` | `obsolete` | `current` | `blocked` | `inProgress`
- **Props:** `status: StatusType`, `size?: 'sm' | 'default' | 'lg'`

#### 7. Badge — `components/ui/badge/Badge.tsx`
```tsx
import { Badge, TaskStatusBadge, PriorityBadge } from "@/components/ui/badge/Badge";
```
- **Variants:** `default` | `success` | `warning` | `error` | `info` | `secondary` | `outline`
- **Sizes:** `sm` | `default` | `lg`
- **Props:** `variant`, `size`, `icon`, `pill` (rounded-full vs rounded-lg), `className`
- Included pre-built: `TaskStatusBadge` (status: Pending/In-Progress/Reviewing/Completed/Overdue), `PriorityBadge` (Critical/High/Medium/Low)

#### 8. AlertModal — `components/ui/modal/AlertModal.tsx`
```tsx
import { AlertModal } from "@/components/ui/modal/AlertModal";
```
- **Types:** `success` | `error` | `warning` | `confirm` | `info`
- **Props:** `isOpen`, `onClose`, `onConfirm`, `type`, `title`, `description`, `isLoading`

#### 9. ResponsiveCard — `components/ui/card/ResponsiveCard.tsx`
```tsx
import { ResponsiveCard } from "@/components/ui/card/ResponsiveCard";
```
- **Props:** `title`, `subtitle`, `children`, `className`

#### 10. Popover — `components/ui/popover/Popover.tsx`
```tsx
import { Popover } from "@/components/ui/popover/Popover";
```

#### 11. ResponsiveForm — `components/ui/form/ResponsiveForm.tsx`
```tsx
import { ResponsiveForm } from "@/components/ui/form/ResponsiveForm";
```

#### 12. ActionDropdown — `components/ui/dropdown/ActionDropdown.tsx`
```tsx
import { ActionDropdown } from "@/components/ui/dropdown/ActionDropdown";
import type { ActionDropdownItem } from "@/components/ui/dropdown/ActionDropdown";
```
- **Dùng cho table row actions** — trigger là MoreVertical icon
- Portal rendering, auto-positioning (flip up khi gần bottom viewport)
- **Props:** `actions: ActionDropdownItem[]`, `size?: 'sm' | 'default' | 'lg'`, `disabled?`, `triggerIcon?`, `minWidth?`
- **ActionDropdownItem:** `{ label, icon?, onClick, disabled?, destructive? }` hoặc `{ type: 'divider' }`

```tsx
<ActionDropdown
  actions={[
    { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: handleView },
    { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: handleEdit },
    { type: 'divider' },
    { label: 'Delete', icon: <Trash className="h-4 w-4" />, onClick: handleDelete, destructive: true },
  ]}
/>
```

#### 13. SmartDropdown — `components/ui/dropdown/SmartDropdown.tsx`
```tsx
import { SmartDropdown, DropdownItem, DropdownDivider } from "@/components/ui/dropdown/SmartDropdown";
```
- **Dùng khi cần custom trigger** (không phải MoreVertical)
- Auto-positioning (flip up khi gần bottom), Portal rendering, Escape key support
- **Props:** `isOpen`, `onClose`, `triggerRef`, `children`, `estimatedHeight?`, `minWidth?`, `closeOnBackdrop?`

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);
const [isOpen, setIsOpen] = useState(false);

<button ref={triggerRef} onClick={() => setIsOpen(true)}>Open</button>

<SmartDropdown
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  triggerRef={triggerRef}
  estimatedHeight={200}
>
  <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
  <DropdownDivider />
  <DropdownItem onClick={handleDelete} destructive>Delete</DropdownItem>
</SmartDropdown>
```

#### 14. TablePagination — `components/ui/table/TablePagination.tsx`
```tsx
import { TablePagination } from "@/components/ui/table/TablePagination";
```
- **Props:** `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange`, `onItemsPerPageChange?`, `showItemCount?`, `showPageNumbers?`, `showItemsPerPageSelector?`, `itemsPerPageOptions?`

#### 15. Toast — `components/ui/toast/Toast.tsx`
```tsx
import { useToast } from "@/components/ui/toast";

const { showToast } = useToast();
showToast({ type: 'success', title: 'Saved', message: 'Changes saved.', duration: 3000 });
```
- **Types:** `success` | `error` | `warning` | `info`

#### 16. Loading — `components/ui/loading/Loading.tsx`
```tsx
import { Loading, InlineLoading, FullPageLoading, ButtonLoading, SectionLoading } from "@/components/ui/loading/Loading";
```
- **Variants:**
  - `<Loading />` — Default inline loading
  - `<InlineLoading size="xs" />` — Nhỏ, dùng trong button/dropdown
  - `<FullPageLoading text="Loading..." />` — Full page overlay
  - `<ButtonLoading text="Saving..." light />` — Trong button (light=white spinner)
  - `<SectionLoading />` — Card/section loading
- **Props:** `size` (`xs|sm|default|lg|xl`), `color` (default: `#111111`), `count`, `text`, `fullPage`, `className`
- **PHẢI SỬ DỤNG thay cho custom spinner CSS**

#### 17. Breadcrumb — `components/ui/breadcrumb/Breadcrumb.tsx`
```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import breadcrumbs from "@/components/ui/breadcrumb/breadcrumbs.config";
```
- **PHẢI SỬ DỤNG** thay cho breadcrumb inline thủ công
- Tự động render: Dashboard icon → middle items (ẩn trên mobile) → active item (bold)
- Clickable items dùng `onClick`, non-clickable chỉ cần `label`

**Sử dụng config có sẵn:**
```tsx
const navigate = useNavigate();
<Breadcrumb items={breadcrumbs.documentList(navigate)} />
<Breadcrumb items={breadcrumbs.revisionReview(navigate, onBack, document.documentId)} />
<Breadcrumb items={breadcrumbs.documentDetail(navigate, { fromArchive: true })} />
```

**Tạo breadcrumb custom (khi không có sẵn trong config):**
```tsx
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb/Breadcrumb";

const items: BreadcrumbItem[] = [
  { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
  { label: "Module Name", onClick: () => navigate(ROUTES.MODULE) },
  { label: "Current Page", isActive: true },
];
<Breadcrumb items={items} />
```

**Sau khi thêm màn hình mới, PHẢI bổ sung vào `breadcrumbs.config.ts`.**

---

### 0.2 Quy trình khi cần UI component

**BƯỚC 1:** Kiểm tra `components/ui` trước
**BƯỚC 2:** Nếu có → import và dùng trực tiếp, KHÔNG tạo duplicate
**BƯỚC 3:** Nếu chưa có → tạo trong `components/ui/[name]/`, tuân thủ design system, document vào file này

### 0.3 Ví dụ ĐÚNG và SAI

❌ **SAI — Custom button:**
```tsx
<button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Click</button>
```
✅ **ĐÚNG:**
```tsx
<Button variant="default" size="sm">Click</Button>
```

❌ **SAI — Custom loading spinner:**
```tsx
<div className="h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
```
✅ **ĐÚNG:**
```tsx
<InlineLoading size="sm" />
<ButtonLoading text="Processing..." light />
```

❌ **SAI — Breadcrumb thủ công:**
```tsx
<div className="flex items-center gap-1.5">
  <IconLayoutDashboard className="h-4 w-4" />
  <span>/</span>
  <span>Document Control</span>
</div>
```
✅ **ĐÚNG:**
```tsx
<Breadcrumb items={breadcrumbs.documentList(navigate)} />
```

❌ **SAI — Custom dropdown createPortal thủ công:**
```tsx
{openDropdownId && createPortal(<>...</>, document.body)}
```
✅ **ĐÚNG:**
```tsx
<ActionDropdown actions={[...]} />
```

### 0.4 Utilities có sẵn

**`cn()` utility** — `components/ui/utils.ts`:
```tsx
import { cn } from "@/components/ui/utils";
<div className={cn("base-class", isActive && "active-class", className)} />
```

**Hooks** — `src/hooks/`:
- `useDropdownPosition()` — tính vị trí dropdown tránh tràn viewport
- `usePagination()` — logic phân trang
- `useDebounce()` — debounce input
- `useLocalStorage()` — persist state

---

## 1. Nguyên tắc về Asset & Hình ảnh

- **Logo/Icons:** KHÔNG ghi đường dẫn trực tiếp. PHẢI dùng import:
```tsx
import logoImg from '@/assets/images/logo.png';
```
- **Thẻ img:** Luôn có `object-contain` và `onError`:
```tsx
<img src={logoImg} alt="Logo" className="h-14 w-auto object-contain"
  onError={(e) => { e.currentTarget.style.display = "none"; }} />
```

---

## 2. Quy chuẩn Layout & Z-Index

| Layer | Z-index | Notes |
|---|---|---|
| Header | `z-40` | `sticky top-0 bg-white/95 backdrop-blur-sm` |
| Sidebar | `z-30` | Mở: 280px, Thu gọn: 80px |
| Table Header sticky | `z-30` | `backdrop-blur-sm` |
| Sticky Action Column header | `z-40` | |
| Sticky Action Column body | `z-30` | |
| Dropdown backdrop | `z-40` | |
| Dropdown menu | `z-50` | |
| Modal | `z-50` | |
| Full page loading | `z-50` | |

---

## 3. Quy chuẩn Data Table (Native HTML Table)

### 3.1 Container Structure
```tsx
<div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
  <div className="overflow-x-auto flex-1">
    <table className="w-full">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
    {/* Empty state bên ngoài table, bên trong overflow-x-auto */}
  </div>
  <TablePagination ... />
</div>
```

### 3.2 Table Header (thead)
```tsx
<thead className="bg-slate-50 border-b border-slate-200">
  <tr>
    <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
      Column
    </th>
    {/* Sticky action header */}
    <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
      Actions
    </th>
  </tr>
</thead>
```

### 3.3 Table Body (tbody)
```tsx
<tbody className="divide-y divide-slate-200 bg-white">
  {paginatedData.map((item) => (
    <tr
      key={item.id}
      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
      onClick={() => handleView(item.id)}
    >
      <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-700">
        {item.value}
      </td>
      {/* Sticky action cell */}
      <td
        onClick={(e) => e.stopPropagation()}
        className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
      >
        <ActionDropdown
          actions={[
            { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: () => handleView(item.id) },
            { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: () => handleEdit(item.id) },
            { type: 'divider' },
            { label: 'Delete', icon: <Trash className="h-4 w-4" />, onClick: () => handleDelete(item.id), destructive: true },
          ]}
        />
      </td>
    </tr>
  ))}
</tbody>
```

### 3.4 Empty State
```tsx
{paginatedData.length === 0 && (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <IconInbox className="h-12 w-12 text-slate-300 mb-4" />
    <p className="text-lg font-medium text-slate-600">No items found</p>
    <p className="text-sm">Try adjusting your filters</p>
  </div>
)}
```

### 3.5 Event Propagation Rules (QUAN TRỌNG!)
1. **Row:** `onClick={() => handleView(id)}`
2. **Action td:** `onClick={(e) => e.stopPropagation()}`
3. **Dùng `ActionDropdown`** — tự động xử lý event handling bên trong

---

## 4. Breadcrumb Pattern (CHUẨN HOÁ)

**PHẢI dùng `Breadcrumb` component + `breadcrumbs.config.ts`**

```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import breadcrumbs from "@/components/ui/breadcrumb/breadcrumbs.config";

const navigate = useNavigate();
<Breadcrumb items={breadcrumbs.documentDetail(navigate, { fromArchive: true })} />
```

**Danh sách configs có sẵn** (xem đầy đủ tại `breadcrumbs.config.ts`):

| Config key | Params |
|---|---|
| `documentList(navigate)` | |
| `archivedDocuments(navigate)` | |
| `documentDetail(navigate, { fromArchive? })` | |
| `newDocument(navigate)` | |
| `revisionList(navigate)` | |
| `revisionsOwnedByMe(navigate)` | |
| `pendingDocuments(navigate, activeTab?)` | `'pending-review'` / `'pending-approval'` |
| `revisionDetail(navigate)` | |
| `revisionReview(navigate, onBack?, documentId?)` | |
| `revisionApproval(navigate, onBack?, documentId?)` | |
| `controlledCopies(navigate, activeTab?)` | |
| `controlledCopyDetail(navigate)` | |
| `trainingMaterials(navigate)` | |
| `coursesList(navigate)` | |
| `userManagement(navigate)` | |
| `myTasks(navigate)` | |
| `notifications(navigate)` | |

**Khi tạo màn hình mới → PHẢI bổ sung config vào `breadcrumbs.config.ts`**

---

## 5. Filter Component Pattern

### 5.1 Filter Layout
```tsx
<div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
    {/* Search: xl:col-span-6 */}
    <div className="xl:col-span-6">
      <label className="block text-xs font-medium text-slate-700 mb-1.5">Search</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full h-9 pl-9 pr-4 text-sm border border-slate-200 rounded-lg
            focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
            placeholder:text-slate-400"
        />
      </div>
    </div>
    {/* Regular filter: xl:col-span-3 */}
    <div className="xl:col-span-3">
      <Select label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
    </div>
  </div>
</div>
```

---

## 6. Form Input Standards

```tsx
{/* Label */}
<label htmlFor="fieldId" className="block text-sm font-medium text-slate-700 mb-1.5">
  Field Name <span className="text-red-500">*</span>
</label>

{/* Input */}
<input
  id="fieldId"
  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg
    focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
    placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
  placeholder="Enter value..."
/>

{/* Error message */}
{error && (
  <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1.5
    animate-in fade-in slide-in-from-top-1 duration-200" role="alert">
    {error}
  </p>
)}

{/* Textarea */}
<textarea
  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg resize-none
    focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
    placeholder:text-slate-400"
  rows={4}
/>
```

---

## 7. Badge/Status Color System

### StatusBadge (workflow statuses)
```tsx
<StatusBadge status="pendingReview" size="sm" />
<StatusBadge status="approved" />
```

### Badge (general tags)
```tsx
<Badge variant="success" pill>Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error" icon={<AlertCircle className="h-3 w-3" />}>Critical</Badge>
<TaskStatusBadge status="In-Progress" />
<PriorityBadge priority="High" />
```

### Manual badge colors (khi cần custom)
| Status | Classes |
|---|---|
| Draft | `bg-slate-100 text-slate-700 border-slate-200` |
| Pending Review | `bg-amber-50 text-amber-700 border-amber-200` |
| Pending Approval | `bg-blue-50 text-blue-700 border-blue-200` |
| Approved / Effective | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Pending Training | `bg-purple-50 text-purple-700 border-purple-200` |
| Ready for Publishing | `bg-indigo-50 text-indigo-700 border-indigo-200` |
| Obsoleted | `bg-orange-50 text-orange-700 border-orange-200` |
| Rejected / Cancelled | `bg-red-50 text-red-700 border-red-200` |

**Badge structure (manual):**
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border {colorClasses}">
  {icon && <Icon className="h-3.5 w-3.5" />}
  {label}
</span>
```

---

## 8. Border-Radius Standards (3-Tier)

| Level | Class | Dùng cho |
|---|---|---|
| Large | `rounded-xl` | Cards, Panels, Modals, Table containers, Filter panels |
| Medium | `rounded-lg` | Buttons, Inputs, Selects, Dropdowns, Alert boxes |
| Pill/Circle | `rounded-full` | Status badges, Tags, Avatars, Dot indicators |

❌ **KHÔNG dùng:** `rounded-md`, `rounded-2xl`, `rounded`

---

## 9. Color Palette (Emerald Theme)

| Token | Value |
|---|---|
| Primary | `emerald-600` |
| Primary Hover | `emerald-700` |
| Text Primary | `slate-900` |
| Text Secondary | `slate-700` |
| Text Muted | `slate-500` |
| Border | `slate-200` |
| Background | `white`, `slate-50`, `slate-100` |
| Success | `emerald-*` |
| Warning | `amber-*` |
| Error | `red-*` |
| Info | `blue-*` |

---

## 10. Animation Classes

```
animate-in fade-in duration-150            → Fade in
slide-in-from-top-2 duration-200           → Slide from top
slide-in-from-bottom-2 duration-200        → Slide from bottom
zoom-in-95 duration-150                    → Zoom in
active:scale-[0.97]                        → Button press
transition-colors                          → Color transition
transition-all duration-200                → General transition
```

---

## 11. Responsive Design

| Breakpoint | Value |
|---|---|
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

**Patterns:**
```tsx
hidden md:table-cell                            // Ẩn trên mobile (table columns)
md:hidden                                       // Chỉ hiện trên mobile
px-4 md:px-6                                    // Responsive padding
text-sm md:text-base                            // Responsive text
grid-cols-1 md:grid-cols-2 xl:grid-cols-12      // Responsive grid
```

---

## 12. Data Formatting

**PHẢI** dùng `@/utils/format.ts`, KHÔNG viết inline:

```tsx
import { formatDate, formatDateUS, formatDateTime, formatDateLong, formatRelativeTime, formatFileSize } from "@/utils/format";

formatDate(dateString)          // "Jan 15, 2025"
formatDateUS(dateString)        // "01/15/2025"
formatDateTime(dateString)      // "Jan 15, 2025, 2:30 PM"
formatDateLong(dateString)      // "January 15, 2025"
formatRelativeTime(dateString)  // "2 hours ago"
formatFileSize(bytes)           // "1.5 MB"
```

❌ KHÔNG viết: `new Date(date).toLocaleDateString("en-US", { ... })`

---

## 13. TypeScript Patterns

```tsx
// Status types
type Status = "Draft" | "Pending Review" | "Pending Approval" | "Effective" | "Obsoleted";

// Common interfaces
interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

// Generic handlers
onItemClick?: (id: string) => void;
```

---

## 14. React Patterns

### State Management
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

### useMemo cho performance
```tsx
const filteredData = useMemo(() => {
  return data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}, [data, searchQuery, statusFilter]);

const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage; // Khai báo ngoài nếu dùng trong JSX

const paginatedData = useMemo(() => {
  return filteredData.slice(startIndex, startIndex + itemsPerPage);
}, [filteredData, startIndex, itemsPerPage]);
```

### Component Structure
```tsx
// 1. Interfaces/Types
// 2. Helper functions/constants
// 3. Main Component:
//   a. State declarations
//   b. Refs
//   c. useMemo (filteredData, paginatedData)
//   d. useEffect
//   e. Event handlers (handleXxx)
//   f. JSX return
```

---

## 15. Import Organization

```tsx
// 1. React
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";

// 2. Router
import { useNavigate, useLocation } from "react-router-dom";

// 3. Third-party
import { Eye, Edit, Trash, Search } from "lucide-react";
import { IconLayoutDashboard } from "@tabler/icons-react";

// 4. UI Components (PHẢI reuse từ components/ui)
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { ActionDropdown } from "@/components/ui/dropdown/ActionDropdown";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { TablePagination } from "@/components/ui/table/TablePagination";
import { Breadcrumb } from "@/components/ui/breadcrumb/Breadcrumb";
import breadcrumbs from "@/components/ui/breadcrumb/breadcrumbs.config";
import { cn } from "@/components/ui/utils";

// 5. Features/Utils
import { ROUTES } from "@/app/routes.constants";
import { formatDate } from "@/utils/format";

// 6. Local types
import type { ItemType } from "./types";
```

---

## 16. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component | PascalCase | `DocumentListView`, `TaskTable` |
| Handler | camelCase + `handle` prefix | `handleClick`, `handleFilterChange` |
| Boolean state | `is`/`has`/`should` prefix | `isOpen`, `hasError`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MOCK_DOCUMENTS`, `DEFAULT_PAGE_SIZE` |
| Types/Interfaces | PascalCase | `DocumentStatus`, `TableColumn` |

---

## 17. Accessibility (A11Y)

```tsx
// Icon-only buttons PHẢI có aria-label
<button aria-label="More actions"><MoreVertical className="h-4 w-4" /></button>

// Backdrop
<div aria-hidden="true" className="fixed inset-0" onClick={onClose} />

// Form fields
<input aria-invalid={!!error} aria-describedby={error ? "field-error" : undefined} />

// Loading state
<button aria-busy={isLoading} disabled={isLoading}>Submit</button>
```

---

## 18. Auth Pages — Shared Carousel

**3 màn hình auth dùng chung config:**
```tsx
import { AUTH_SLIDE_IMAGES, CAROUSEL_INTERVAL } from "./authCarousel";
// AUTH_SLIDE_IMAGES: 9 ảnh (ipad1.webp → ipad9.webp)
// CAROUSEL_INTERVAL: 3000ms
```
- **Text content:** `SLIDE_CONTENT[index % SLIDE_CONTENT.length]` — mỗi màn hình có content riêng, số slide = 9
- **Indicators:** Chấm tròn nhỏ `h-2 w-2 rounded-full`
  - Active: `bg-emerald-500 scale-125`
  - Inactive: `bg-white/30`

---

## 19. Checklist khi tạo Table mới

- [ ] Container: `border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col`
- [ ] thead: `bg-slate-50 border-b border-slate-200`
- [ ] tbody: `divide-y divide-slate-200 bg-white`
- [ ] Row clickable: `cursor-pointer group` + `onClick={() => handleView(id)}`
- [ ] Sticky action column: z-index + shadow + before border classes đầy đủ
- [ ] Action cell: `onClick={(e) => e.stopPropagation()}`
- [ ] Actions: dùng `ActionDropdown` component
- [ ] Empty state: centered, icon + message
- [ ] Pagination: dùng `TablePagination` component
- [ ] Filters: responsive grid, dùng `Select` component
- [ ] `useMemo` cho filteredData + paginatedData
- [ ] Breadcrumb: dùng `Breadcrumb` + config từ `breadcrumbs.config.ts`

## 20. Checklist khi tạo màn hình mới

- [ ] Bổ sung breadcrumb config vào `breadcrumbs.config.ts`
- [ ] Loading states: dùng `Loading`/`ButtonLoading`/`SectionLoading`
- [ ] Toast notifications: dùng `useToast`
- [ ] Confirm dialogs: dùng `AlertModal`
- [ ] Date formatting: dùng `@/utils/format`
- [ ] Thêm route vào `routes.constants.ts` và `routes.tsx`

---

**LƯU Ý:** Khi copy patterns từ DocumentListView hoặc DocumentsOwnedByMeView, đảm bảo giữ nguyên cấu trúc event handling và z-index để tránh bugs về click behavior và overlapping.
