# New Document Feature Structure

Cấu trúc thư mục đã được tổ chức theo module để dễ bảo trì và mở rộng.

## Cấu trúc thư mục

```
new-document/
├── NewDocumentView.tsx          # Main container component
├── index.ts                      # Public exports
├── README.md                     # This file
└── components/
    ├── NewDocumentForm.tsx       # General Information form (~260 lines)
    │
    ├── training/                 # Training Module (~140 lines total)
    │   ├── index.tsx             # Main training component & exports
    │   ├── types.ts              # TypeScript types
    │   ├── utils.ts              # Utility functions (point redistribution)
    │   ├── TrainingConfigSection.tsx  # Config inputs (passing score, attempts, etc.)
    │   └── QuestionCard.tsx      # Individual question editor
    │
    ├── document-upload/          # Document Upload Module
    │   ├── index.tsx             # Main upload panel (DocumentUploadPanel)
    │   └── FilePreview.tsx       # File preview component
    │
    └── document-details/         # Document Details Module (~60 lines per tab)
        ├── index.tsx             # Main container with tab navigation
        ├── types.ts              # TypeScript types
        ├── RevisionsTab.tsx      # Revision history
        ├── ReviewersTab.tsx      # Reviewers management
        └── OtherTabs.tsx         # Approvers, Knowledges, Copies, Related docs
```

## Lợi ích của cấu trúc mới

### 1. **Separation of Concerns**
- Mỗi module xử lý một chức năng riêng biệt
- Dễ dàng tìm kiếm và sửa đổi code

### 2. **Giảm độ phức tạp**
- Không còn file quá 300 dòng
- Mỗi component tập trung vào một nhiệm vụ cụ thể

### 3. **Tái sử dụng**
- Types và utils có thể import riêng lẻ
- Components có thể dùng ở nhiều nơi

### 4. **Dễ test**
- Mỗi module nhỏ dễ viết unit test
- Mock dependencies đơn giản hơn

### 5. **Scalability**
- Dễ dàng thêm features mới (thêm tab, question type, etc.)
- Không ảnh hưởng đến code hiện tại

## Import Examples

```tsx
// Import main components
import { TrainingInformationTab } from "./components/training";
import { DocumentUploadPanel } from "./components/document-upload";
import { DocumentDetailsCard } from "./components/document-details";

// Import types if needed
import type { TrainingConfig, Question } from "./components/training";
import type { Reviewer, Approver } from "./components/document-details";

// Import utilities
import { redistributePoints } from "./components/training/utils";
```

## Quy tắc khi thêm code mới

1. **File không nên vượt quá 300 dòng**: Nếu file lớn hơn, chia nhỏ thành các component/function riêng
2. **Một folder cho một module lớn**: Training, Upload, Details, v.v.
3. **Types riêng biệt**: Tạo file `types.ts` cho mỗi module
4. **Utils riêng biệt**: Các hàm helper nên ở file `utils.ts`
5. **Index file làm public API**: Export những gì cần thiết qua `index.tsx`

## Maintenance Notes

- **Training module**: Chứa logic Quiz builder, tự động tính điểm
- **Document Upload**: Xử lý upload file, preview, drag-and-drop
- **Document Details**: 6 tabs quản lý metadata (Revisions, Reviewers, Approvers, etc.)
- **NewDocumentForm**: Form chính với các trường thông tin cơ bản

Khi cần thêm tính năng mới, hãy xem xét tạo folder module mới thay vì chỉnh sửa file hiện tại.
