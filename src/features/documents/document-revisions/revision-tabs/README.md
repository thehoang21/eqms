# Revision Tabs

Cloned from `src/features/documents/all-document/new-document/new-tabs`

## Structure

```
revision-tabs/
├── index.ts                 # Main exports
├── GeneralTab/
│   ├── GeneralTab.tsx       # General information form
│   └── subtabs/
│       ├── index.ts
│       ├── types.ts
│       ├── DocumentRevisionsTab.tsx
│       ├── ReviewersTab.tsx
│       ├── ApproversTab.tsx
│       ├── DocumentKnowledgesTab.tsx
│       ├── ControlledCopiesTab.tsx
│       └── RelatedDocumentsTab.tsx
├── DocumentTab/
│   ├── DocumentTab.tsx      # Document upload/file management
│   ├── FilePreview.tsx      # File preview component
│   └── docx-preview.css     # Styles for document preview
├── TrainingTab/
│   ├── TrainingTab.tsx      # Training configuration
│   ├── QuestionCard.tsx
│   ├── TrainingConfigSection.tsx
│   ├── types.ts
│   └── utils.ts
├── SignaturesTab/
│   └── SignaturesTab.tsx    # Signature configuration
├── AuditTab/
│   └── AuditTab.tsx         # Audit trail display
└── WorkflowTab/
    └── WorkflowTab.tsx      # Workflow diagram

```

## Usage

```tsx
import {
    GeneralTab,
    DocumentTab,
    TrainingTab,
    SignaturesTab,
    AuditTab,
    WorkflowTab,
    type UploadedFile
} from '@/features/documents/document-revisions/revision-tabs';

// Or via main index
import {
    GeneralTab,
    DocumentTab,
    // ...
} from '@/features/documents/document-revisions';
```

## Components Overview

### GeneralTab
- Document metadata form (title, type, author, etc.)
- Sub-tabs for:
  - Document Revisions
  - Reviewers
  - Approvers
  - Document Knowledges
  - Controlled Copies
  - Related Documents

### DocumentTab
- Drag & drop file upload
- File list with progress
- File preview (PDF, Office docs, images)

### TrainingTab
- Training configuration
- Quiz/assessment setup
- Question management

### SignaturesTab
- E-signature configuration
- Signature workflow

### AuditTab
- Audit trail display
- History tracking

### WorkflowTab
- Visual workflow diagram
- Approval flow representation

## Props

### GeneralTab
```tsx
interface GeneralTabProps {
    formData: FormData;
    onFormChange: (data: FormData) => void;
    isTemplateMode?: boolean;
    hideTemplateCheckbox?: boolean;
}
```

### DocumentTab
```tsx
interface DocumentTabProps {
    uploadedFiles: UploadedFile[];
    onFilesChange: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
    selectedFile: File | null;
    onSelectFile: (file: File | null) => void;
}
```

## Notes

- All components follow the design system in `.github/copilot-instructions.md`
- Uses UI components from `@/components/ui`
- Responsive design with mobile support
- Proper TypeScript typing
