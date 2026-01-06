# Template Tabs

Cloned from `src/features/documents/all-document/new-document/new-tabs`

## Structure

```
template-tabs/
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
} from '@/features/documents/template-library/template-tabs';

// Or via main index
import {
    GeneralTab,
    DocumentTab,
    // ...
} from '@/features/documents/template-library';
```

## Components Overview

### GeneralTab
- Template metadata form (title, type, author, etc.)
- **isTemplateMode**: Set to `true` for template creation
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

### GeneralTab (Template Mode)
```tsx
interface GeneralTabProps {
    formData: FormData;
    onFormChange: (data: FormData) => void;
    isTemplateMode?: boolean;        // Set to true for templates
    hideTemplateCheckbox?: boolean;
}

// Usage for templates
<GeneralTab 
    formData={formData} 
    onFormChange={setFormData}
    isTemplateMode={true}  // Hide template checkbox, show template-specific UI
/>
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
- **Template-specific**: Set `isTemplateMode={true}` in GeneralTab
