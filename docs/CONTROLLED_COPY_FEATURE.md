# 📋 Controlled Copy Feature - Implementation Guide

## 🎯 Overview

Tính năng **Controlled Copy** cho phép in bản sao có kiểm soát của các tài liệu đang ở trạng thái **Effective**. Mỗi bản sao sẽ được đánh mã số riêng biệt và phải được thu hồi khi có phiên bản mới hoặc tài liệu bị hủy bỏ.

---

## 🔧 Components Created

### 1. ControlledCopyModal.tsx
**Location:** `src/features/documents/components/ControlledCopyModal.tsx`

**Props Interface:**
```typescript
interface ControlledCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;        // Document code (e.g., "SOP.0001.03")
  documentTitle: string;      // Document title
  onConfirm: (data: ControlledCopyRequest) => void;
}
```

**Request Interface:**
```typescript
interface ControlledCopyRequest {
  documentId: string;
  locationId: string;         // Selected location ID
  locationName: string;       // Location name for display
  reason: string;             // Reason for printing (min 10 chars)
  quantity: number;           // Number of copies (1-50)
  signature: string;          // E-signature reason
}
```

**Features:**
- ✅ Dropdown select với search cho Distribution Locations
- ✅ Textarea input cho reason (minimum 10 characters)
- ✅ Quantity input với +/- buttons (range: 1-50)
- ✅ Warning box màu vàng (amber theme)
- ✅ Form validation với error messages
- ✅ E-Signature modal integration
- ✅ Responsive design
- ✅ Portal rendering (z-index: 50)

---

## 🎨 UI Design Details

### Header
```tsx
- Icon: Printer (emerald theme)
- Title: "Yêu cầu Bản sao có kiểm soát"
- Subtitle: Document ID (e.g., "SOP.0001.03")
- Close button (X icon)
```

### Warning Box
```tsx
- Background: bg-amber-50
- Border: border-amber-200
- Icon: AlertCircle (amber-600)
- Title: "Lưu ý quan trọng" (font-semibold)
- Message: Detailed warning about control numbers and retrieval
```

### Form Fields

#### 1. Location Select
- **Component:** `<Select>` từ `@/components/ui/select/Select`
- **Props:** 
  - `label="Location *"`
  - `enableSearch={true}`
  - `placeholder="Select distribution location"`
- **Options:** 10 mock locations (QA Lab, Production Floors, Warehouse, etc.)
- **Validation:** Required field

#### 2. Reason Textarea
- **Type:** Native textarea
- **Props:**
  - `rows={4}`
  - `placeholder="e.g., 'Replace damaged copy', 'New production line setup'"`
- **Validation:** 
  - Required
  - Minimum 10 characters
- **Help text:** "This will be recorded in the audit trail"

#### 3. Quantity Input
- **Type:** Number input với increment/decrement buttons
- **Range:** 1-50
- **Default:** 1
- **UI:** Horizontal layout với - / input / + buttons
- **Validation:** Must be between 1 and 50

### Summary Box
```tsx
- Background: bg-slate-50
- Lists:
  • Number of copies will be printed
  • Each copy receives unique control number
  • All copies must be returned when revised
```

### Footer Actions
```tsx
- Cancel button (outline variant)
- "Xác nhận in & Ký số" button (default variant với Lock icon)
```

---

## 🔗 Integration Points

### 1. DocumentListView.tsx Updates

#### Imports Added:
```typescript
import { Printer } from "lucide-react";
import { ControlledCopyModal, ControlledCopyRequest } from "../components/ControlledCopyModal";
```

#### State Added:
```typescript
const [isControlledCopyModalOpen, setIsControlledCopyModalOpen] = useState(false);
const [selectedDocumentForCopy, setSelectedDocumentForCopy] = useState<Document | null>(null);
```

#### Handlers Added:
```typescript
const handlePrintControlledCopy = (document: Document) => {
  setSelectedDocumentForCopy(document);
  setIsControlledCopyModalOpen(true);
};

const handleControlledCopyConfirm = (request: ControlledCopyRequest) => {
  console.log("Controlled Copy Request:", request);
  // TODO: Send to backend API
  alert(`Successfully requested ${request.quantity} controlled copies`);
  setIsControlledCopyModalOpen(false);
  setSelectedDocumentForCopy(null);
};
```

#### Dropdown Menu Updates:
```typescript
// Added to DropdownMenuProps interface
onPrintControlledCopy?: (document: Document) => void;

// Added to "Effective" status actions (first item)
{
  icon: Printer,
  label: "Print Controlled Copy",
  onClick: () => {
    onPrintControlledCopy?.(document);
    onClose();
  },
  color: "text-slate-500"
}
```

#### Modal Render:
```tsx
{selectedDocumentForCopy && (
  <ControlledCopyModal
    isOpen={isControlledCopyModalOpen}
    onClose={() => {
      setIsControlledCopyModalOpen(false);
      setSelectedDocumentForCopy(null);
    }}
    documentId={selectedDocumentForCopy.documentId}
    documentTitle={selectedDocumentForCopy.title}
    onConfirm={handleControlledCopyConfirm}
  />
)}
```

---

## 📊 Mock Data

### Distribution Locations (10 locations):
```typescript
[
  { id: '1', code: 'LOC-QA-01', name: 'Quality Assurance Lab', department: 'Quality Assurance' },
  { id: '2', code: 'LOC-PROD-01', name: 'Production Floor A', department: 'Production' },
  { id: '3', code: 'LOC-PROD-02', name: 'Production Floor B', department: 'Production' },
  { id: '4', code: 'LOC-QC-01', name: 'Quality Control Lab', department: 'Quality Control' },
  { id: '5', code: 'LOC-WHS-01', name: 'Warehouse - Raw Material', department: 'Warehouse' },
  { id: '6', code: 'LOC-WHS-02', name: 'Warehouse - Finished Goods', department: 'Warehouse' },
  { id: '7', code: 'LOC-RD-01', name: 'R&D Laboratory', department: 'Research & Development' },
  { id: '8', code: 'LOC-ENG-01', name: 'Engineering Office', department: 'Engineering' },
  { id: '9', code: 'LOC-HSE-01', name: 'Health, Safety & Environment Office', department: 'HSE' },
  { id: '10', code: 'LOC-REG-01', name: 'Regulatory Affairs Office', department: 'Regulatory Affairs' },
]
```

---

## 🎬 User Flow

### Step 1: Access Feature
1. Navigate to **All Documents** view
2. Find a document with status **"Effective"** (green badge)
3. Click **More Actions** button (⋮ icon)
4. Dropdown menu shows **"Print Controlled Copy"** as first option

### Step 2: Fill Form
1. Modal opens with document info displayed
2. Read warning box about control requirements
3. Select **Location** from dropdown (searchable)
4. Enter **Reason** (minimum 10 characters)
5. Set **Quantity** (use +/- buttons or type directly)
6. Review summary box

### Step 3: E-Signature
1. Click **"Xác nhận in & Ký số"** button
2. E-Signature Modal opens
3. Enter password and reason for change
4. Click **"Confirm & Sign"**

### Step 4: Confirmation
1. Request is submitted
2. Success message shows number of copies requested
3. Both modals close automatically

---

## 🔐 Security & Compliance

### Validation Rules:
- ✅ Location selection is mandatory
- ✅ Reason must be ≥ 10 characters
- ✅ Quantity must be 1-50
- ✅ E-signature required for all requests

### Audit Trail:
The following data should be logged:
```typescript
{
  action: "CONTROLLED_COPY_REQUESTED",
  timestamp: Date.now(),
  userId: currentUser.id,
  documentId: "SOP.0001.03",
  locationId: "LOC-QA-01",
  reason: "Replace damaged copy in QA lab",
  quantity: 2,
  signature: "Username confirmed with password",
  ipAddress: "...",
  userAgent: "..."
}
```

---

## 🚀 Backend Integration (TODO)

### API Endpoint:
```typescript
POST /api/documents/controlled-copy

Request Body:
{
  documentId: string;
  locationId: string;
  reason: string;
  quantity: number;
  signature: {
    username: string;
    password: string; // hashed
    reason: string;
    timestamp: string;
  }
}

Response:
{
  success: boolean;
  copyNumbers: string[];  // e.g., ["CC-001", "CC-002"]
  message: string;
}
```

### Backend Actions:
1. Validate user permissions (only authorized users can request)
2. Check document status (must be "Effective")
3. Validate location exists
4. Generate unique control numbers for each copy
5. Create audit log entry
6. Send notification to document controller
7. Update distribution matrix
8. Generate print job (optional)

---

## 🎨 Component Reusability

### Components Reused from `@/components/ui`:
- ✅ **Button** (`button/Button.tsx`)
  - Variants: `default`, `outline`
  - Sizes: `default`
  
- ✅ **Select** (`select/Select.tsx`)
  - Props: `label`, `value`, `onChange`, `options`, `enableSearch`
  
- ✅ **ESignatureModal** (`esignmodal/ESignatureModal.tsx`)
  - Props: `isOpen`, `onClose`, `onConfirm`, `actionTitle`

### Icons from Lucide React:
- `Printer` (modal header)
- `AlertCircle` (warning box + validation errors)
- `Lock` (confirm button)
- `X` (close button)

---

## 📱 Responsive Design

### Breakpoints:
- **Mobile:** Single column layout
- **Tablet:** Single column with optimized spacing
- **Desktop:** Single column (modal width: max-w-2xl)

### Modal Behavior:
- Max height: 90vh với scroll
- Sticky header during scroll
- Portal rendering prevents z-index issues

---

## ✅ Testing Checklist

### Functional Tests:
- [ ] Modal opens when clicking "Print Controlled Copy" for Effective documents
- [ ] Modal does NOT appear for non-Effective documents
- [ ] Location dropdown is searchable
- [ ] Reason validation (min 10 chars)
- [ ] Quantity validation (1-50 range)
- [ ] +/- buttons work correctly
- [ ] Cannot submit with empty required fields
- [ ] E-Signature modal opens on submit
- [ ] Success message shows after e-signature
- [ ] Both modals close after confirmation
- [ ] Cancel button closes modal without action

### UI Tests:
- [ ] Warning box is clearly visible (amber theme)
- [ ] Form fields have proper labels
- [ ] Error messages appear below fields
- [ ] Summary box shows correct information
- [ ] Modal is centered on screen
- [ ] Backdrop closes modal when clicked
- [ ] ESC key closes modal
- [ ] Responsive on mobile/tablet/desktop

### Accessibility Tests:
- [ ] All form inputs have labels
- [ ] Buttons have aria-labels
- [ ] Focus management works properly
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## 🐛 Known Limitations

1. **Mock Data:** Distribution locations are hardcoded. In production, fetch from API.
2. **API Integration:** Currently uses `alert()` for success. Implement proper toast notifications.
3. **Backend:** No actual API call yet. Need to implement `/api/documents/controlled-copy` endpoint.
4. **Permissions:** No permission check. Add role-based access control.
5. **Print Job:** No actual printing. Need to integrate with print server/system.

---

## 📝 Next Steps

### Frontend:
1. Replace `alert()` with toast notification (use existing toast system)
2. Add loading state during API call
3. Implement error handling for API failures
4. Add print preview feature (optional)
5. Implement permission check (e.g., only QA Manager can request)

### Backend:
1. Create API endpoint for controlled copy requests
2. Implement control number generation algorithm
3. Set up database table for tracking controlled copies
4. Create notification system for document controllers
5. Integrate with print server (if applicable)
6. Add permission middleware

### Documentation:
1. Update user manual with controlled copy workflow
2. Create training materials for users
3. Document control number format (e.g., "CC-YYYY-XXXX")
4. Define SOP for controlled copy retrieval

---

## 🎓 Code Style Compliance

### ✅ SOP Adherence:
- [x] Reused components from `components/ui`
- [x] Followed Tailwind CSS emerald theme
- [x] Used portal rendering for modal (z-index: 50)
- [x] Implemented responsive design
- [x] Added proper TypeScript types
- [x] Used `cn()` utility for conditional classes
- [x] Followed button variants pattern
- [x] Used proper icon sizes and colors
- [x] Implemented proper event propagation handling
- [x] Used semantic HTML
- [x] Added proper aria-labels
- [x] Followed existing modal patterns

---

**Feature Status:** ✅ **Ready for Testing**  
**Last Updated:** January 10, 2026  
**Developer:** GitHub Copilot (Claude Sonnet 4.5)
