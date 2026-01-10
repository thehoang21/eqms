# 🚀 Controlled Copy - Quick Start Guide

## 📋 TL;DR

Tính năng cho phép in **bản sao có kiểm soát** của tài liệu Effective với E-Signature validation.

---

## 🎯 How to Use

### 1️⃣ Mở Modal
```
All Documents → Find "Effective" document → Click ⋮ → Select "Print Controlled Copy"
```

### 2️⃣ Điền Form
- **Location:** Chọn nơi phân phối (dropdown có search)
- **Reason:** Nhập lý do (≥10 ký tự)
- **Quantity:** Số lượng bản in (1-50)

### 3️⃣ Ký số
Click **"Xác nhận in & Ký số"** → Nhập password → Xác nhận

---

## 📁 Files Created

```
src/features/documents/components/
  ├── ControlledCopyModal.tsx    (~400 lines)
  └── index.ts

src/features/documents/all-document/
  └── DocumentListView.tsx       (updated)

docs/
  └── CONTROLLED_COPY_FEATURE.md
```

---

## 🔧 Quick Integration

### Import Component:
```typescript
import { ControlledCopyModal, ControlledCopyRequest } from '@/features/documents/components';
```

### Use in Your View:
```tsx
const [isOpen, setIsOpen] = useState(false);
const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

const handleConfirm = (request: ControlledCopyRequest) => {
  console.log("Request:", request);
  // TODO: Call API
  setIsOpen(false);
};

<ControlledCopyModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  documentId={selectedDoc?.documentId || ''}
  documentTitle={selectedDoc?.title || ''}
  onConfirm={handleConfirm}
/>
```

---

## ✅ Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Location | Required | "Location is required" |
| Reason | Min 10 chars | "Reason must be at least 10 characters" |
| Quantity | 1-50 | "Quantity must be between 1 and 50" |

---

## 🎨 UI Components Used

- ✅ **Button** from `@/components/ui/button/Button`
- ✅ **Select** from `@/components/ui/select/Select`
- ✅ **ESignatureModal** from `@/components/ui/esignmodal/ESignatureModal`

---

## 📊 Mock Locations

10 distribution locations available:
- LOC-QA-01: Quality Assurance Lab
- LOC-PROD-01: Production Floor A
- LOC-PROD-02: Production Floor B
- LOC-QC-01: Quality Control Lab
- LOC-WHS-01: Warehouse - Raw Material
- LOC-WHS-02: Warehouse - Finished Goods
- LOC-RD-01: R&D Laboratory
- LOC-ENG-01: Engineering Office
- LOC-HSE-01: HSE Office
- LOC-REG-01: Regulatory Affairs Office

---

## 🔌 Backend TODO

```typescript
// API Endpoint to implement:
POST /api/documents/controlled-copy

// Request:
{
  documentId: "SOP.0001.03",
  locationId: "LOC-QA-01",
  reason: "Replace damaged copy",
  quantity: 2,
  signature: "E-signature data"
}

// Response:
{
  success: true,
  copyNumbers: ["CC-2026-001", "CC-2026-002"],
  message: "Controlled copies requested successfully"
}
```

---

## 🐛 Test Scenarios

### ✅ Happy Path:
1. Click "Print Controlled Copy" on Effective document
2. Select location: "LOC-QA-01"
3. Enter reason: "Replace damaged copy in QA lab"
4. Set quantity: 2
5. Click "Xác nhận in & Ký số"
6. Enter password in E-Signature modal
7. Confirm → See success message

### ❌ Error Cases:
1. Submit without location → See "Location is required"
2. Enter reason < 10 chars → See "Reason must be at least 10 characters"
3. Set quantity to 0 or 51 → See "Quantity must be between 1 and 50"

---

## 🎯 Key Features

- ✅ Only shows for **Effective** documents
- ✅ Searchable location dropdown
- ✅ Form validation with error messages
- ✅ E-Signature integration
- ✅ Warning box about control requirements
- ✅ Quantity controls (+/- buttons)
- ✅ Summary box before submission
- ✅ Responsive design
- ✅ Portal rendering (no z-index issues)

---

## 📸 UI Preview

```
┌──────────────────────────────────────────────┐
│ 🖨️ Yêu cầu Bản sao có kiểm soát        [X] │
│ SOP.0001.03                                  │
├──────────────────────────────────────────────┤
│ Document Title:                              │
│ Standard Operating Procedure for QC...       │
│                                              │
│ ⚠️ Lưu ý quan trọng                          │
│ Mọi bản in sẽ được đánh mã số riêng biệt... │
│                                              │
│ Location *                                   │
│ [Select distribution location ▼]            │
│                                              │
│ Reason for Printing *                        │
│ [Text area for reason...]                    │
│                                              │
│ Number of Copies *                           │
│ [-] [2] [+]                                  │
│                                              │
│ Summary:                                     │
│ • 2 controlled copies will be printed        │
│ • Each copy receives unique control number   │
│ • All copies must be returned when revised   │
├──────────────────────────────────────────────┤
│                    [Cancel] [🔒 Xác nhận...] │
└──────────────────────────────────────────────┘
```

---

## 🔗 Related Documentation

- Full Docs: [`CONTROLLED_COPY_FEATURE.md`](./CONTROLLED_COPY_FEATURE.md)
- SOP: [`copilot-instructions.md`](../.github/copilot-instructions.md)
- UI Components: [`src/components/ui/`](../src/components/ui/)

---

**Status:** ✅ Ready to Use  
**Created:** January 10, 2026
