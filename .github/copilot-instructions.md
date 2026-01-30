# QMS Project UI/UX Standard Operating Procedures (SOP)

Bạn là một chuyên gia Senior React Developer (ReactJS, Tailwind CSS, shadcn/ui). Khi thực hiện yêu cầu trong dự án này, bạn PHẢI tuân thủ các quy chuẩn thiết kế và kỹ thuật sau:

## 0. Nguyên tắc Component Reusability (TỐI QUAN TRỌNG!)

**QUY TẮC VÀNG: LUÔN TÁI SỬ DỤNG COMPONENTS CÓ SẴN TRƯỚC KHI TẠO MỚI**

### 0.1 Components có sẵn trong `components/ui`

**PHẢI SỬ DỤNG các components này khi cần:**

1. **Button** (`components/ui/button/Button.tsx`)
   - Variants: `default`, `ghost`, `outline`, `secondary`
   - Sizes: `xs`, `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg`
   - Props: `variant`, `size`, `fullWidth`, `disabled`, `onClick`, etc.

2. **Select** (`components/ui/select/Select.tsx`)
   - Custom dropdown với search functionality
   - Portal rendering (z-index: 9999)
   - Props: `label`, `value`, `onChange`, `options`, `placeholder`, `enableSearch`

3. **MultiSelect** (`components/ui/select/MultiSelect.tsx`)
   - Multiple selection dropdown với search functionality
   - Display selected items as tags với remove button
   - Portal rendering (z-index: 9999)
   - Props: `label`, `value` (array), `onChange`, `options`, `placeholder`, `enableSearch`, `maxVisibleTags`

4. **Checkbox** (`components/ui/checkbox/Checkbox.tsx`)
   - Props: `checked`, `onChange`, `id`, `label`, `disabled`

5. **DateTimePicker** (`components/ui/datetime-picker/DateTimePicker.tsx`)
   - Date/time selection với calendar interface
   - Props: `label`, `value`, `onChange`, `placeholder`

6. **StatusBadge** (`components/ui/statusbadge/StatusBadge.tsx`)
   - Hiển thị status/state với colors chuẩn
   - Tự động map status → color theme

7. **AlertModal** (`components/ui/modal/AlertModal.tsx`)
   - Modal types: `success`, `error`, `warning`, `confirm`, `info`
   - Props: `isOpen`, `onClose`, `onConfirm`, `type`, `title`, `message`, `isLoading`

8. **ResponsiveCard** (`components/ui/card/ResponsiveCard.tsx`)
   - Card container với responsive padding
   - Props: `title`, `subtitle`, `children`, `className`

9. **Popover** (`components/ui/popover/Popover.tsx`)
   - Tooltip/popover với positioning

10. **ResponsiveForm** (`components/ui/form/ResponsiveForm.tsx`)
   - Form layout với responsive grid

11. **ResponsiveTable** (`components/ui/table/ResponsiveTable.tsx`)
    - ⚠️ CHỈ dùng cho simple tables, ưu tiên native HTML table cho complex tables

### 0.2 Quy trình khi cần UI component

**BƯỚC 1: KIỂM TRA `components/ui` TRƯỚC**
```bash
# Check if component exists
ls components/ui/
```

**BƯỚC 2: NẾU COMPONENT CÓ SẴN**
- Import và sử dụng trực tiếp
- KHÔNG tạo duplicate component
- KHÔNG viết lại logic đã có

**BƯỚC 3: NẾU COMPONENT CHƯA CÓ**
- Tạo component mới trong `components/ui/[component-name]/`
- Tuân thủ Tailwind CSS + shadcn/ui design system
- Export qua `index.ts` nếu cần
- Document usage trong copilot-instructions.md

### 0.3 Ví dụ ĐÚNG và SAI

❌ **SAI - Tạo button mới:**
```tsx
const MyButton = () => (
  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
    Click me
  </button>
);
```

✅ **ĐÚNG - Dùng Button component:**
```tsx
import { Button } from "@/components/ui/button/Button";

<Button variant="default" size="sm">
  Click me
</Button>
```

❌ **SAI - Tạo custom select:**
```tsx
const MySelect = () => (
  <select className="...">
    <option>...</option>
  </select>
);
```

✅ **ĐÚNG - Dùng Select component:**
```tsx
import { Select } from "@/components/ui/select/Select";

<Select
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { label: "Draft", value: "draft" },
    { label: "Active", value: "active" }
  ]}
/>
```

✅ **ĐÚNG - Dùng MultiSelect cho multiple values:**
```tsx
import { MultiSelect } from "@/components/ui/select/MultiSelect";

<MultiSelect
  label="Authors"
  value={authors}
  onChange={setAuthors}
  options={[
    { label: "John Doe", value: "john" },
    { label: "Jane Smith", value: "jane" }
  ]}
  placeholder="Select authors..."
  maxVisibleTags={2}
/>
```

### 0.4 Utilities có sẵn

**`cn()` utility** (`components/ui/utils.ts`):
```tsx
import { cn } from "@/components/ui/utils";

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

**Responsive utilities** (`components/ui/responsive.ts`):
- `useMediaQuery()`
- `useBreakpoint()`

## 1. Nguyên tắc về Asset & Hình ảnh
- **Logo/Icons:** KHÔNG ghi trực tiếp đường dẫn vào thẻ `src`. PHẢI sử dụng cơ chế import: `import logoImg from '@/assets/images/...'`.
- **Thẻ Img:** Luôn sử dụng `object-contain` và có thuộc tính `onError` để tránh hiển thị icon ảnh vỡ.

## 2. Quy chuẩn Layout & Z-Index (Ngăn chặn đè lớp)
- **Header:** `sticky top-0`, `z-40`, `bg-white/95 backdrop-blur-sm`.
- **Search Bar:** Trong Header, thanh Search chiếm `max-w-xl lg:max-w-2xl`, căn giữa bằng `flex-1 flex justify-center`.
- **Dropdown/Popover:** `z-50` (bao gồm cả backdrop `z-40`).
- **Sidebar:** Độ rộng mở: `280px`, Thu gọn: `80px`. Khi thu gọn, chỉ hiển thị Icon và Tooltip.
- **Table Header (sticky):** `z-30` với `backdrop-blur-sm`.
- **Sticky Action Column:** Header: `z-40`, Body cells: `z-30`.

## 3. Quy chuẩn Data Table (Native HTML Table)
### 3.1 Container Structure
```tsx
<div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
  <div className="overflow-x-auto">
    <table className="w-full">
      {/* table content */}
    </table>
  </div>
  {/* Pagination Footer */}
  <Pagination ... />
</div>
```

### 3.2 Table Header (thead)
- **Classes:** `bg-slate-50 border-b border-slate-200` (hoặc `bg-slate-50/80` nếu sticky)
- **th cells:** `py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap`
- **Sticky header (optional):** Thêm `sticky top-0 z-30 backdrop-blur-sm`

### 3.3 Table Body (tbody)
- **Classes:** `divide-y divide-slate-200 bg-white`
- **tr (row):** 
  - Hover: `hover:bg-slate-50/80 transition-colors`
  - Clickable: `cursor-pointer group`
  - Click handler: `onClick={() => onViewItem(id)}`
- **td cells:** `py-3.5 px-4 text-sm whitespace-nowrap`

### 3.4 Sticky Action Column (Cực kỳ quan trọng!)
**Header (th):**
```tsx
<th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider z-40 backdrop-blur-sm whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
  Action
</th>
```

**Body Cell (td):**
```tsx
<td 
  onClick={(e) => e.stopPropagation()}
  className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
>
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAction(e);
    }}
    className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
  >
    <MoreVertical className="h-4 w-4 text-slate-600" />
  </button>
</td>
```

**Lưu ý quan trọng về Event Handling:**
- Action cell PHẢI có `onClick={(e) => e.stopPropagation()}` để ngăn click lan lên row
- Button bên trong PHẢI có `onClick={(e) => { e.stopPropagation(); ... }}` để tránh mở detail khi click action
- Backdrop của dropdown menu cũng cần `onClick={(e) => { e.stopPropagation(); onClose(); }}`

### 3.5 Pagination Component
**Placement:** Nằm ở footer của container, ngăn cách với Table bằng `border-t border-slate-200`.
```tsx
<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
  <div className="text-sm text-slate-600">
    Showing <span className="font-medium text-slate-900">{start}</span> to{" "}
    <span className="font-medium text-slate-900">{end}</span> of{" "}
    <span className="font-medium text-slate-900">{total}</span> results
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm">Previous</Button>
    <Button variant="outline" size="sm">Next</Button>
  </div>
</div>
```

## 4. Dropdown Menu trong Table (Portal Pattern)
**PHẢI sử dụng createPortal để render dropdown:**
```tsx
import { createPortal } from "react-dom";

const DropdownMenu: React.FC<Props> = ({ isOpen, onClose, position }) => {
  if (!isOpen) return null;
  
  return createPortal(
    <>
      {/* Backdrop với z-40 */}
      <div
        className="fixed inset-0 z-40 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-hidden="true"
      />
      {/* Menu với z-50 */}
      <div
        className="fixed z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Icon className="h-4 w-4 text-slate-500" />
            <span>Action Label</span>
          </button>
        </div>
      </div>
    </>,
    window.document.body
  );
};
```

**Position Calculation:**
```tsx
const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation();
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  setDropdownPosition({
    top: rect.bottom + window.scrollY + 4,
    left: rect.right + window.scrollX - 200, // Adjust based on menu width
  });
  setOpenDropdownId(id);
};
```

## 5. Đồng bộ Style Component (shadcn/ui)

### 5.1 Button Component
**Variants:**
- `default`: `bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95`
- `ghost`: `hover:bg-slate-100 hover:text-slate-900 active:scale-95`
- `outline`: `border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm active:scale-95`
- `secondary`: `bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95`

**Sizes (responsive):**
- `xs`: `h-6 md:h-7 px-2 md:px-3 text-xs`
- `sm`: `h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm`
- `default`: `h-10 md:h-11 px-4 md:px-6 text-sm md:text-base`
- `icon`: `h-10 w-10 md:h-11 md:w-11 p-0`

### 5.2 Form Components (Input, Select)
- **Label:** `text-sm font-medium text-slate-700 mb-1.5 block`
- **Input/Select height:** `h-11`
- **Border:** `border border-slate-200 rounded-lg`
- **Focus state:** `focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`
- **Placeholder:** `placeholder:text-slate-400`

### 5.3 Select Component (Custom Dropdown)
- **Trigger:** Height `h-11`, full width, với ChevronDown icon
- **Portal rendering:** Sử dụng `createPortal` với `position: fixed`, `z-index: 9999`
- **Search input (nếu có):** Auto-focus khi mở, với Search icon
- **Options:** `py-3 px-4 text-sm hover:bg-slate-50 transition-colors`
- **Selected indicator:** Check icon bên phải

### 5.4 Badges/Status Indicators
**Status colors (đồng nhất):**
- Draft: `bg-slate-50 text-slate-700 border-slate-200`
- Pending Review: `bg-amber-50 text-amber-700 border-amber-200`
- Pending Approval: `bg-blue-50 text-blue-700 border-blue-200`
- Approved: `bg-cyan-50 text-cyan-700 border-cyan-200`
- Effective: `bg-emerald-50 text-emerald-700 border-emerald-200`
- Archive: `bg-red-50 text-red-700 border-red-200`

**Badge structure:**
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border {colorClasses}">
  {icon && <Icon className="h-3.5 w-3.5" />}
  {label}
</span>
```

## 6. Filter Component Pattern

### 6.1 Reusable Filter Component
Tạo component tái sử dụng cho các view tương tự nhau (ví dụ: DocumentFilters):
```tsx
interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: Status | "All";
  onStatusChange: (value: Status | "All") => void;
  // ... other filters
}
```

### 6.2 Filter Layout (Grid)
```tsx
<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
    {/* Search input: xl:col-span-6 */}
    {/* Regular filters: xl:col-span-3 each */}
  </div>
</div>
```

## 7. Navigation & Breadcrumbs
- **Breadcrumb separator:** Sử dụng dấu `/` text: `<span className="text-slate-400 mx-1">/</span>`
- **Breadcrumb structure:**
```tsx
<div className="flex items-center gap-1.5 text-slate-500 mt-1 text-sm">
  <span>Dashboard</span>
  <span className="text-slate-400 mx-1">/</span>
  <span>Module Name</span>
  <span className="text-slate-400 mx-1">/</span>
  <span className="text-slate-700 font-medium">Current Page</span>
</div>
```
- Cấp cuối cùng: `text-slate-700 font-medium`

## 8. Color Palette (Emerald Theme)
- **Primary:** `emerald-600` (buttons, active states)
- **Primary Hover:** `emerald-700`
- **Success:** `emerald-50/600/700`
- **Warning:** `amber-50/600/700`
- **Error:** `red-50/600/700`
- **Info:** `blue-50/600/700`
- **Text Primary:** `slate-900`
- **Text Secondary:** `slate-700`
- **Text Muted:** `slate-500`
- **Border:** `slate-200`
- **Background:** `white`, `slate-50`, `slate-100`

## 9. Animation Classes (Tailwind)
- **Fade in:** `animate-in fade-in duration-150`
- **Slide from top:** `slide-in-from-top-2 duration-200`
- **Zoom in:** `zoom-in-95 duration-150`
- **Button active:** `active:scale-95`
- **Transitions:** `transition-colors`, `transition-all`

## 10. Responsive Design Patterns
- **Breakpoints:** `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px)
- **Hide on mobile:** `hidden md:table-cell` (for table columns)
- **Show on mobile only:** `md:hidden`
- **Responsive padding:** `px-4 md:px-6`, `py-2.5 md:py-3`
- **Responsive text:** `text-sm md:text-base`
- **Grid responsive:** `grid-cols-1 md:grid-cols-2 xl:grid-cols-12`

## 11. TypeScript Patterns

### 11.1 Common Interfaces
```tsx
interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  locked?: boolean;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startItem: number;
  endItem: number;
  totalItems: number;
}
```

### 11.2 Type Aliases
- Sử dụng union types cho status/types: `type Status = "Draft" | "Active" | "Archived"`
- Generic callbacks: `onItemClick?: (id: string) => void`

## 12. React Hooks & State Management

### 12.1 Filter States Pattern
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
const [currentPage, setCurrentPage] = useState(1);
const [columns, setColumns] = useState<TableColumn[]>([...defaultColumns]);
```

### 12.2 useMemo for Performance
```tsx
const filteredData = useMemo(() => {
  return data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}, [data, searchQuery, statusFilter]);
```

### 12.3 useRef for Refs Management
```tsx
const buttonRefs = useRef<{ [key: string]: RefObject<HTMLButtonElement> }>({});

const getButtonRef = (id: string) => {
  if (!buttonRefs.current[id]) {
    buttonRefs.current[id] = createRef<HTMLButtonElement>();
  }
  return buttonRefs.current[id];
};
```

## 13. Coding Style & Best Practices

### 13.1 Component Reusability Checklist

**Trước khi viết code mới, PHẢI kiểm tra:**
- ✅ Có Button component chưa? → Dùng `@/components/ui/button/Button`
- ✅ Có Select/Dropdown chưa? → Dùng `@/components/ui/select/Select`
- ✅ Có Input field chưa? → Check trong `@/components/ui/form`
- ✅ Có Modal chưa? → Dùng `@/components/ui/modal/AlertModal`
- ✅ Có Badge/Status chưa? → Dùng `@/components/ui/statusbadge/StatusBadge`
- ✅ Có DatePicker chưa? → Dùng `@/components/ui/datetime-picker/DateTimePicker`
- ✅ Có Card chưa? → Dùng `@/components/ui/card/ResponsiveCard`

**Khi cần tạo component mới:**
- 📁 Tạo folder mới trong `components/ui/[component-name]/`
- 📝 Follow Tailwind CSS + shadcn/ui patterns
- 🎨 Sử dụng color palette emerald theme
- 📱 Responsive với breakpoints chuẩn
- ♿ Accessibility với aria-labels
- 📚 Document trong copilot-instructions.md

### 13.2 Import Organization
```tsx
// 1. React imports
import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// 2. Third-party libraries
import { ChevronRight, Search, Filter } from "lucide-react";

// 3. UI Components (PHẢI reuse từ components/ui)
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { AlertModal } from "@/components/ui/modal/AlertModal";
import { StatusBadge } from "@/components/ui/statusbadge/StatusBadge";
import { DateTimePicker } from "@/components/ui/datetime-picker/DateTimePicker";

// 4. Utils
import { cn } from "@/components/ui/utils";

// 5. Types
import { Task, TableColumn } from "../types";
```

### 13.2 Component Structure
```tsx
// 1. Interfaces/Types
interface Props { ... }

// 2. Helper Components (nếu chỉ dùng trong file này)
const SubComponent: React.FC<Props> = ({ ... }) => { ... };

// 3. Main Component
export const MainComponent: React.FC<Props> = ({ ... }) => {
  // a. State declarations
  const [state, setState] = useState(...);
  
  // b. Refs
  const ref = useRef(null);
  
  // c. Memoized values
  const computed = useMemo(() => ..., [deps]);
  
  // d. Effects
  useEffect(() => { ... }, [deps]);
  
  // e. Event handlers
  const handleClick = () => { ... };
  
  // f. Render helpers
  const renderItem = (item) => { ... };
  
  // g. JSX return
  return ( ... );
};
```

### 13.3 Naming Conventions
- **Components:** PascalCase (e.g., `TaskTable`, `DocumentFilters`)
- **Functions/Handlers:** camelCase với prefix `handle` (e.g., `handleClick`, `handleFilterChange`)
- **Boolean variables:** Prefix `is`, `has`, `should` (e.g., `isOpen`, `hasError`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MOCK_DOCUMENTS`, `DEFAULT_PAGE_SIZE`)

### 13.4 CSS Class Management
- **LUÔN dùng `cn()` utility:** `cn("base-classes", condition && "conditional", className)`
- **Avoid inline styles trừ khi cần dynamic positioning**

### 13.5 Component Design Principles
- **DRY (Don't Repeat Yourself):** Tái sử dụng components từ `components/ui`
- **Single Responsibility:** Mỗi component chỉ làm một việc
- **Prop Interface:** Định nghĩa rõ ràng props với TypeScript
- **Default Props:** Cung cấp giá trị mặc định hợp lý
- **Composition over Inheritance:** Ưu tiên compose components thay vì kế thừa

## 14. Data Formatting & Utilities

### 14.1 Date Formatting
```tsx
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
```

### 14.2 Helper Functions Organization
Đặt helper functions trước component hoặc trong separate utils file:
```tsx
// Helper functions
const getStatusColor = (status: Status) => { ... };
const getStatusIcon = (status: Status) => { ... };
const formatCurrency = (amount: number) => { ... };
```

## 15. Accessibility (A11Y)
- **Buttons:** Luôn có `aria-label` cho icon-only buttons
- **Backdrop:** `aria-hidden="true"`
- **Focus states:** `focus-visible:ring-2 focus-visible:ring-emerald-500`
- **Keyboard support:** Escape key để đóng modals/dropdowns

## 16. Performance Optimizations
- **Pagination:** Luôn paginate data phía client (10-20 items/page)
- **Virtual scrolling:** Không cần thiết cho tables < 1000 rows
- **Memoization:** Sử dụng `useMemo` cho filtered/sorted data
- **Event handlers:** Declare outside JSX khi có thể

## 17. QUAN TRỌNG: Event Propagation trong Table
Khi có interactive elements bên trong clickable table rows:

1. **Row click handler:** `onClick={() => onViewItem(id)}`
2. **Action cell:** `onClick={(e) => e.stopPropagation()}`
3. **Action button:** `onClick={(e) => { e.stopPropagation(); handleAction(); }}`
4. **Dropdown backdrop:** `onClick={(e) => { e.stopPropagation(); onClose(); }}`
5. **Dropdown items:** `onClick={(e) => { e.stopPropagation(); handleItemAction(); }}`

**Quy tắc vàng:** Mọi click handler trong Action column PHẢI có `e.stopPropagation()` để tránh trigger row click.

---

## Checklist khi tạo Table mới:

- [ ] Container có `border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col`
- [ ] Table header có `bg-slate-50 border-b border-slate-200`
- [ ] Table body có `divide-y divide-slate-200 bg-white`
- [ ] Sticky action column có đầy đủ classes (z-index, border, shadow)
- [ ] Action cell có `onClick={(e) => e.stopPropagation()}`
- [ ] Action button có `onClick={(e) => { e.stopPropagation(); ... }}`
- [ ] Dropdown menu dùng `createPortal`
- [ ] Backdrop có z-40, Menu có z-50
- [ ] Pagination nằm trong cùng container với table
- [ ] Filters có responsive grid layout
- [ ] Column customizer có drag-and-drop
- [ ] useMemo cho filtered data
- [ ] Breadcrumbs đúng format với dấu "/" separator
- [ ] Animation classes cho smooth transitions

---

**LƯU Ý CUỐI CÙNG:** Khi copy patterns từ DocumentListView hoặc DocumentsOwnedByMeView, đảm bảo giữ nguyên cấu trúc event handling và z-index để tránh bugs về click behavior và overlapping.