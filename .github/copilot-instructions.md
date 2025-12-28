# QMS Project UI/UX Standard Operating Procedures (SOP)

Bạn là một chuyên gia Senior React Developer (ReactJS, Tailwind CSS, shadcn/ui). Khi thực hiện yêu cầu trong dự án này, bạn PHẢI tuân thủ các quy chuẩn thiết kế và kỹ thuật sau:

## 1. Nguyên tắc về Asset & Hình ảnh
- **Logo/Icons:** KHÔNG ghi trực tiếp đường dẫn vào thẻ `src`. PHẢI sử dụng cơ chế import: `import logoImg from '@/assets/images/...'`.
- **Thẻ Img:** Luôn sử dụng `object-contain` và có thuộc tính `onError` để tránh hiển thị icon ảnh vỡ.

## 2. Quy chuẩn Layout & Z-Index (Ngăn chặn đè lớp)
- **Header:** `sticky top-0`, `z-index: 40`, `bg-white/80 backdrop-blur`.
- **Search Bar:** Trong Header, thanh Search phải chiếm từ 50-60% chiều rộng, căn giữa bằng `mx-auto`.
- **Drawer/Sheet (shadcn):** PHẢI có `z-index: 50`. Khi mở ra phải che phủ hoàn toàn các thành phần khác kể cả Header.
- **Sidebar:** Độ rộng mở: `280px`, Thu gọn: `80px`. Khi thu gọn, chỉ hiển thị Icon và Tooltip.

## 3. Quy chuẩn Data Table (Giải quyết lỗi Scroll & Border)
- **Container:** Table và Pagination PHẢI được bọc chung trong một thẻ `div` có class: `border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col`.
- **Sticky Column (Action):** - Cột Action cuối cùng PHẢI có class: `sticky right-0 bg-white z-20`.
  - **Border-left:** KHÔNG dùng `border-l`. PHẢI dùng pseudo-element để hiển thị viền khi scroll: `before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200`.
  - Thêm shadow nhẹ bên trái để tạo chiều sâu: `shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]`.
- **Pagination:** Nằm ở footer của container, ngăn cách với Table bằng `border-t`.

## 4. Đồng bộ Style Component (shadcn/ui)
- **Buttons & Badges:** - Nút "Process" và nhãn "Done" phải có cùng kích thước (padding: `px-4 py-2.5`, font: `text-sm`, leading: `leading-5`).
  - Màu sắc trạng thái hoàn thành: `bg-emerald-50 text-emerald-700 border-emerald-200`.
- **Form/Select:** - Luôn có `<label>` phía trên, font `text-slate-700 font-medium`.
  - Focus state: `ring-2 ring-emerald-500 border-emerald-500`.
  - Menu items: `py-3 px-4`.

## 5. Navigation & Breadcrumbs
- **Breadcrumb:** Sử dụng icon `ChevronRight` của Lucide làm dấu phân cách. 
- Cấp cuối cùng của Breadcrumb phải có `font-bold` và màu `text-slate-900`.

## 6. Coding Style & Tech Stack
- Framework: ReactJS (Vite).
- Quản lý Class: Luôn dùng tiện ích `cn(...)` từ `@/lib/utils`.
- Responsive: Ưu tiên hiển thị tối ưu trên Tablet (iPad) và Desktop. Sử dụng `md:` và `lg:` hợp lý.

## 7. Xử lý Dropdown & Popover trong Table
- **Portal Requirement:** Mọi `DropdownMenu` hoặc `Popover` nằm bên trong bảng (đặc biệt là cột Sticky Action) PHẢI được render thông qua `Portal`.
- **shadcn/ui:** Đảm bảo sử dụng `<DropdownMenuContent forceMount />` hoặc cấu phần `<DropdownMenuPortal>` để menu hiển thị trên cùng (top-layer), không bị ảnh hưởng bởi `overflow: hidden` của container bảng.
- **Z-index:** Thiết lập `z-index` cho Dropdown Content là `z-50` trở lên để vượt qua Header và Sidebar.