/**
 * Shared Tabs - Document Feature
 * 
 * Common tab components used across document workflows.
 * These tabs are reused in new documents, revisions, and templates.
 */

// General Tab (shared across all document types)
export { GeneralTab, type GeneralTabFormData } from './GeneralTab/GeneralTab';
export * from './GeneralTab/subtabs';

// Training Tab
export { TrainingTab, type TrainingConfig } from './TrainingTab/TrainingTab';

// Signatures Tab
export { SignaturesTab } from './SignaturesTab/SignaturesTab';

// Audit Tab  
export { AuditTab } from './AuditTab/AuditTab';
