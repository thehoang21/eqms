# Documents Feature Module

This module handles all document-related functionality in the QMS application.

## Directory Structure

```
documents/
├── index.ts                 # Main entry point - all public exports
├── README.md                # This file
├── types/                   # Centralized type definitions (re-exports from sub-modules)
│   ├── index.ts
│   ├── document.types.ts    # Core document types
│   ├── archived.types.ts    # Re-exports from archived-documents
│   └── controlled-copy.types.ts  # Re-exports from controlled-copies
├── hooks/                   # Shared custom hooks
│   ├── index.ts
│   └── useBatchNavigation.ts
├── shared/                  # Shared components, layouts, tabs
│   ├── index.ts
│   ├── components/          # Reusable UI components
│   │   ├── DocumentFilters.tsx
│   │   └── CreateLinkModal.tsx
│   ├── layouts/             # Layout components
│   │   └── DocumentWorkflowLayout.tsx
│   └── tabs/                # Shared tab components (CONSOLIDATED)
│       ├── GeneralTab/      # ✅ Single source - used by all modules
│       │   ├── GeneralTab.tsx
│       │   └── subtabs/     # Sub-tab components
│       ├── TrainingTab/
│       ├── SignaturesTab/
│       └── AuditTab/
├── views/                   # Top-level views
│   ├── DocumentsView.tsx    # Main document list view
│   └── RequestControlledCopyView.tsx
├── document-detail/         # Document detail/view mode
│   ├── DetailDocumentView.tsx
│   └── tabs/
├── document-list/           # Document creation & management
│   ├── index.ts
│   ├── single-document/     # Single document views
│   ├── batch-document/      # Batch document upload
│   ├── new-document/        # Document creation (modal & DocumentTab only)
│   │   ├── NewDocumentModal.tsx
│   │   └── new-tabs/
│   │       └── DocumentTab/ # Document-specific upload functionality
│   ├── review-document/     # Review workflow
│   └── approval-document/   # Approval workflow
├── document-revisions/      # Revision management
│   ├── index.ts
│   ├── views/               # List views
│   ├── components/          # Revision components
│   ├── revision-tabs/       # Revision-specific tabs
│   │   └── DocumentTab/     # Has view/edit mode for revisions
│   ├── review-revision/     
│   └── approval-revision/   
├── controlled-copies/       # Controlled copy management
│   ├── index.ts
│   ├── types.ts             # Local types (source of truth)
│   ├── ControlledCopiesView.tsx
│   ├── detail/              
│   └── components/          
├── template-library/        # Template management
│   ├── index.ts
│   ├── TemplateLibraryView.tsx
│   ├── NewTemplateView.tsx
│   └── template-tabs/
│       └── DocumentTab/     # Template-specific upload
└── archived-documents/      # Archived document management
    ├── index.ts
    ├── types.ts             # Local types (source of truth)
    ├── ArchivedDocumentsView.tsx
    ├── components/
    └── utils.ts
```

## Import Guidelines

### Recommended Import Patterns

```tsx
// Import from main index for public APIs
import { 
  DocumentsView, 
  DetailDocumentView,
  DocumentFilters,
  DocumentWorkflowLayout 
} from '@/features/documents';

// Import types from centralized types folder
import type { 
  Document, 
  DocumentStatus, 
  ControlledCopy 
} from '@/features/documents/types';

// Import hooks
import { useBatchNavigation } from '@/features/documents/hooks';

// Import shared tabs
import { 
  TrainingTab, 
  SignaturesTab, 
  AuditTab 
} from '@/features/documents/shared/tabs';
```

### Sub-module Imports

For sub-feature specific components, import from the sub-module:

```tsx
// From document-list
import { NewDocumentModal } from '@/features/documents/document-list';

// From document-revisions
import { RevisionListView, NewRevisionView } from '@/features/documents/document-revisions';

// From controlled-copies
import { ControlledCopiesView } from '@/features/documents/controlled-copies';

// From template-library
import { TemplateLibraryView } from '@/features/documents/template-library';
```

## Key Principles

1. **Centralized Types**: All type definitions are in `/types` folder
2. **Shared Components**: Reusable components live in `/shared`
3. **Feature Cohesion**: Related components stay together
4. **Clear Exports**: Each sub-module has an `index.ts` with explicit exports
5. **No Circular Dependencies**: Import direction flows from specific → general

## Adding New Features

1. Create a new folder under `documents/` if it's a major feature
2. Add types to `/types` folder
3. Add reusable components to `/shared` if used across sub-features
4. Export public APIs from the sub-module's `index.ts`
5. Export from main `index.ts` if it's a public API
