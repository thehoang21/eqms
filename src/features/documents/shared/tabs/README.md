# Shared Document Tabs

This folder contains **shared tab components** used across multiple document features (new documents, revisions, templates).

## ✅ Consolidated Tabs (Identical Implementation)

These tabs were **identical across all 3 implementations** and have been consolidated here:

### 1. **TrainingTab** 
- **Location:** `TrainingTab/TrainingTab.tsx`
- **Purpose:** Configure training requirements and assessment questions
- **Features:**
  - Training type selection (read-only, test & certification)
  - Passing score configuration
  - Question builder with multiple choice/true-false options
  - Point redistribution system
  - Drag-and-drop question reordering
- **Dependencies:** `utils.ts`, `types.ts`, `TrainingConfigSection.tsx`, `QuestionCard.tsx`

### 2. **SignaturesTab**
- **Location:** `SignaturesTab/SignaturesTab.tsx`
- **Purpose:** Placeholder for e-signature workflow
- **Status:** Under development

### 3. **AuditTab**
- **Location:** `AuditTab/AuditTab.tsx`
- **Purpose:** Placeholder for audit trail history
- **Status:** Under development

---

## ⚠️ Feature-Specific Tabs (Not Consolidated)

These tabs have **significant differences** and remain in their respective feature folders:

### **GeneralTab**
- **Locations:** 
  - `new-document/new-tabs/GeneralTab/` - Has parent document & suggested code features
  - `document-revisions/revision-tabs/GeneralTab/` - Different responsive classes
  - `template-library/template-tabs/GeneralTab/` - Template-specific variations
  
- **Reason:** Different props, UI elements, and state management per context

### **DocumentTab**
- **Locations:**
  - `new-document/new-tabs/DocumentTab/` - Document relationships (parent/child)
  - `document-revisions/revision-tabs/DocumentTab/` - **View/Edit modes with PDF/DOCX preview**
  - `template-library/template-tabs/DocumentTab/` - Simple upload only
  
- **Reason:** Completely different use cases and dependencies (PDF viewer, etc.)

---

## 📦 Usage

### Import from shared location:
```typescript
import { TrainingTab } from '@/features/documents/shared/tabs/TrainingTab/TrainingTab';
import { SignaturesTab } from '@/features/documents/shared/tabs/SignaturesTab/SignaturesTab';
import { AuditTab } from '@/features/documents/shared/tabs/AuditTab/AuditTab';
```

### Used by:
- `features/documents/all-document/new-document/` (New Document creation)
- `features/documents/document-revisions/` (Document revisions)
- `features/documents/template-library/` (Document templates)

---

## 📊 Consolidation Impact

### Before Consolidation:
- 3 duplicate TrainingTab folders × 5 files = **15 files**
- 3 duplicate SignaturesTab files = **3 files**
- 3 duplicate AuditTab files = **3 files**
- **Total:** 21 duplicate files

### After Consolidation:
- 1 shared TrainingTab folder = **5 files**
- 1 shared SignaturesTab = **1 file**
- 1 shared AuditTab = **1 file**
- **Total:** 7 files

### **Reduction:** 14 files removed (~67% reduction)

---

## 🔄 Migration Notes

**Date:** January 19, 2026  
**Action:** Phase 1 - Consolidate identical tab components

**Changes:**
1. ✅ Created `shared/tabs/` structure
2. ✅ Moved TrainingTab, SignaturesTab, AuditTab from 3 locations
3. ✅ Updated imports in:
   - `new-document/new-tabs/index.ts`
   - `document-revisions/revision-tabs/index.ts`
   - `template-library/template-tabs/index.ts`
   - `document-revisions/approval-revision/RevisionApprovalView.tsx`
   - `new-document/single-document/SingleDocumentView.tsx`
4. ✅ Removed 9 duplicate folders
5. ✅ Verified no TypeScript errors

**Breaking Changes:** None (imports preserved via barrel exports)

---

## 🚀 Future Improvements

- [ ] Consider unifying GeneralTab with feature flags/props
- [ ] Extract common file upload logic from DocumentTab variants
- [ ] Create shared FilePreview component for reuse
- [ ] Add unit tests for shared components
