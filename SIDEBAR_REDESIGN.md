# Sidebar Redesign - Tài liệu

## Tổng quan
Sidebar đã được thiết kế lại theo mẫu hiện đại với các tính năng mới và responsive behavior cho mọi thiết bị.

## Responsive Behavior (CẬP NHẬT MỚI)

### Breakpoints
- **Mobile** (< 768px): Off-canvas overlay menu
- **Tablet/iPad** (768px - 1279px): Auto-collapsed sidebar (chỉ icons)
- **Desktop** (≥ 1280px): Collapsible sidebar (user controlled)

### Chi tiết theo từng breakpoint:

#### 1. **Mobile (< 768px)**
- Sidebar off-canvas (ẩn mặc định)
- Toggle button mở hamburger menu overlay
- Có backdrop khi menu mở
- Full width sidebar khi mở

#### 2. **Tablet/iPad (768px - 1279px)**
- Sidebar **TỰ ĐỘNG THU GỌN** chỉ hiển thị icons
- Sticky position (luôn hiển thị)
- Không có overlay backdrop
- Width: 80px
- Hover vào menu item có sub-menu → hiển thị popup menu
- Toggle button cho phép expand/collapse thủ công

#### 3. **Desktop (≥ 1280px)**
- Sidebar có thể expand/collapse theo ý người dùng
- State được giữ khi resize
- Toggle button ở header khi expanded, ở footer khi collapsed
- Width: 280px (expanded), 80px (collapsed)

## Tính năng mới

### 1. **Toggle Button**
- **Khi sidebar mở rộng**: Toggle button (ChevronLeft icon) xuất hiện ở góc phải header
- **Khi sidebar thu gọn**: Toggle button (ChevronRight icon) xuất hiện ở footer sidebar
- **Responsive**: 
  - Mobile (< 768px): Hamburger icon / X icon
  - Tablet/Desktop (≥ 768px): Expand/Collapse icons

### 2. **Hover Menu Popup (Sidebar Thu gọn)**
Khi sidebar ở trạng thái thu gọn, hover chuột vào menu item có sub-menu sẽ:
- Hiển thị popup menu bên cạnh sidebar
- Popup có header với icon và label của menu item
- Hiển thị tất cả sub-items (level 2, 3, ...)
- Sub-items có thể expand/collapse với animation mượt mà
- Click vào sub-item để navigate
- Popup tự động đóng khi hover ra ngoài

### 3. **Design Improvements**
- **Cleaner look**: Rounded corners, better spacing
- **Active indicator**: Vertical bar màu emerald-600 bên trái item
- **Smooth animations**: Duration 200-300ms với easing functions
- **Better hover states**: Subtle background changes
- **Improved typography**: Font weights và sizes rõ ràng hơn

### 4. **Z-Index Management**
- Sidebar: `z-30` (tablet/desktop), `z-50` (mobile)
- Mobile overlay: `z-40`
- Hover menu popup: `z-60`

## Technical Details

### useResponsiveSidebar Hook (CẬP NHẬT)

```tsx
// Breakpoint constants
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const DESKTOP_BREAKPOINT = 1280;

// Auto-collapse logic
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
  const width = window.innerWidth;
  // Auto-collapse on tablet
  return width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT;
});
```

### Resize Handler
```tsx
if (isMobile) {
  // Mobile: Close sidebar, reset collapse
  setIsMobileMenuOpen(false);
  setIsSidebarCollapsed(false);
} else if (isTablet) {
  // Tablet: Auto-collapse sidebar
  setIsMobileMenuOpen(false);
  setIsSidebarCollapsed(true);
} else {
  // Desktop: Close mobile menu, keep user's collapse preference
  setIsMobileMenuOpen(false);
}
```

### Toggle Function
```tsx
const toggleSidebar = useCallback(() => {
  const width = window.innerWidth;
  const isMobile = width < MOBILE_BREAKPOINT;
  
  if (isMobile) {
    // Mobile: toggle menu visibility (off-canvas)
    setIsMobileMenuOpen(prev => !prev);
  } else {
    // Tablet & Desktop: toggle collapse state
    setIsSidebarCollapsed(prev => !prev);
  }
}, []);
```

### Props mới
```tsx
interface SidebarProps {
  // ... existing props
  onToggleSidebar: () => void; // NEW: Function to toggle sidebar
}
```

### State Management
```tsx
// Hover menu state
const [hoverMenu, setHoverMenu] = useState<HoverMenuState>({
  isOpen: boolean,
  item: NavItem | null,
  position: { top: number, left: number },
  expandedSubItems: string[]
});
```

### Timeout Handling
- **Enter delay**: 150ms trước khi hiển thị popup
- **Leave delay**: 200-300ms trước khi đóng popup
- Cleanup timeouts khi component unmount

### Portal Rendering
Hover menu được render qua `createPortal` vào `document.body` để tránh overflow issues và đảm bảo z-index hoạt động đúng.

## Usage

### Trong MainLayout
```tsx
<Sidebar
  isCollapsed={isSidebarCollapsed}
  activeId={activeId}
  onNavigate={handleNavigate}
  isMobileOpen={isMobileMenuOpen}
  onClose={closeMobileMenu}
  onToggleSidebar={toggleSidebar} // Pass toggle function
/>
```

### Responsive Behavior
- **Mobile** (< 768px): Sidebar off-canvas, toggle button mở/đóng sidebar
- **Tablet** (768px - 1279px): Sidebar tự động thu gọn, toggle button expand/collapse
- **Desktop** (≥ 1280px): Sidebar sticky, toggle button thu gọn/mở rộng

## Styling

### Tailwind Breakpoints sử dụng
- `md:` (768px) - Tablet breakpoint
- `lg:` (1024px) - Large tablet/small desktop
- `xl:` (1280px) - Desktop breakpoint

### Tailwind Classes sử dụng
- `transition-all duration-300 ease-in-out`: Smooth transitions
- `animate-in fade-in slide-in-from-left-2`: Entry animations
- `rounded-xl`, `rounded-lg`: Modern rounded corners
- `shadow-xl`, `shadow-sm`: Depth với shadows
- `backdrop-blur-sm`: Subtle blur effects

### CSS Module
File `Sidebar.module.css` chứa:
- Custom scrollbar styles cho hover menu
- Keyframe animations
- Reusable variables

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid, Flexbox, Portal API support
- Tailwind CSS animations

## Performance
- `useCallback` cho event handlers
- Debounced hover với timeouts
- Memoized sub-components
- Efficient re-renders với React.memo
- Optimized resize handling với 150ms debounce

## Testing Guidelines

### Test trên các thiết bị:
1. **iPhone (< 768px)**: 
   - Sidebar phải off-canvas
   - Hamburger menu hoạt động
   - Backdrop hiển thị khi mở

2. **iPad/Tablet (768px - 1279px)**:
   - Sidebar tự động thu gọn chỉ hiển thị icons
   - Sticky position
   - Hover menu popup hoạt động
   - Toggle button expand/collapse

3. **Desktop (≥ 1280px)**:
   - Sidebar có thể expand/collapse
   - State được giữ khi resize
   - Toggle button responsive

## Future Enhancements
- [ ] Keyboard navigation (arrow keys) trong hover menu
- [ ] Remember sidebar state trong localStorage (desktop only)
- [ ] Drag-to-resize sidebar width
- [ ] Custom themes cho sidebar
- [ ] Search functionality trong hover menu
- [ ] Gesture support cho tablet (swipe to expand/collapse)
