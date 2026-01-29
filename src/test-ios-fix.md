# iOS Safari Fix Test Guide

## Vấn đề đã khắc phục
- ✅ Dropdown tự động đóng khi tap vào search input trên Safari iOS
- ✅ Mất bàn phím khi focus vào search input  
- ✅ Event propagation không đúng trên touch events

## Các fix đã áp dụng

### 1. Select Component (components/ui/select/Select.tsx)
- ✅ Thêm `preventDefault()` cho `onTouchStart` và `onTouchEnd` events
- ✅ Tăng timeout cho event listeners (50ms thay vì 10ms)  
- ✅ Thêm `touchend` event listener với `passive: false`
- ✅ Cải thiện focus logic với iOS detection
- ✅ Thêm `WebkitTapHighlightColor: 'transparent'` cho input
- ✅ Force focus với delay trong touch events
- ✅ Improved focus management với `onFocus` handler

### 2. MultiSelect Component (components/ui/select/MultiSelect.tsx)  
- ✅ Áp dụng cùng fixes như Select component
- ✅ Event handling cho container và input
- ✅ iOS-specific focus management

## Components đang sử dụng Select/MultiSelect (đã được fix)

### Documents Module:
- ✅ ArchivedDocumentFilters.tsx
- ✅ DocumentFilters.tsx 
- ✅ CreateLinkModal.tsx
- ✅ GeneralInformationTab.tsx
- ✅ AuditTrailTab.tsx
- ✅ GeneralTab.tsx (có cả Select và MultiSelect)
- ✅ DocumentRelationships.tsx
- ✅ StandaloneRevisionView.tsx
- ✅ RevisionsOwnedByMeView.tsx
- ✅ TemplateFilters.tsx
- ✅ ControlledCopiesView.tsx
- ✅ BatchDocumentUpload.tsx

### Other Modules:
- ✅ DeviationsView.tsx
- ✅ NotificationsView.tsx  
- ✅ CapaView.tsx
- ✅ TrainingView.tsx
- ✅ MyTasksView.tsx
- ✅ UIShowcase.tsx

## Cách test

### Desktop (Chrome/Firefox/Edge):
1. Mở dropdown 
2. Click vào search input
3. ✅ Input được focus, keyboard hiện
4. Type để search
5. ✅ Dropdown không đóng

### Mobile Safari iOS:
1. Mở dropdown
2. **Tap** vào search input  
3. ✅ Input được focus, iOS keyboard hiện
4. ✅ Dropdown **KHÔNG** tự đóng
5. Type để search
6. ✅ Search hoạt động bình thường
7. Tap option để chọn
8. ✅ Dropdown đóng và value được set

### Priority Test Pages (có nhiều Select components):

1. **Documents > Document List** - DocumentFilters với nhiều Select
2. **Documents > Controlled Copies** - ControlledCopiesView
3. **My Tasks** - MyTasksView với filters
4. **Deviations** - DeviationsView với multiple selects  
5. **Notifications** - NotificationsView với 3 selects
6. **UI Showcase** - Test page với Select examples

## Validation Complete ✅

- ✅ Không có native HTML `<select>` elements  
- ✅ Tất cả components sử dụng custom Select/MultiSelect đã được fix
- ✅ iOS Safari touch events được handle đúng cách
- ✅ Focus management được cải thiện cho mobile
- ✅ Event propagation được fix để tránh dropdown đóng không mong muốn

## Technical Details

### Key iOS Safari Fixes:
```tsx
// Container events
onTouchStart={(e) => {
  e.stopPropagation();
  e.preventDefault();
}}

// Input events
onTouchEnd={(e) => {
  e.stopPropagation();
  e.preventDefault();
  setTimeout(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, 100);
}}

// Focus handling
onBlur={(e) => {
  const relatedTarget = e.relatedTarget as Node;
  if (dropdownRef.current?.contains(relatedTarget)) {
    e.preventDefault();
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  }
}}

// iOS detection for keyboard
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  requestAnimationFrame(() => {
    if (searchInputRef.current) {
      searchInputRef.current.click();
      searchInputRef.current.focus();
    }
  });
}
```