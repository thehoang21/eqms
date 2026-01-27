// Shared types for subtabs

// Document Revisions
export interface Revision {
    id: string;
    version: string;
    date: string;
    author: string;
    changes: string;
    status: string;
}

// Document Relationships
export interface ParentDocument {
    id: string;
    title: string;
    type: string;
}

export interface RelatedDocument {
    id: string;
    title: string;
    type: string;
}

// Reviewers & Approvers
export interface Reviewer {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
    order: number;
}

export interface Approver {
    id: string;
    name: string;
    role: string;
    email: string;
    department: string;
}

export type ReviewFlowType = 'sequential' | 'parallel';

// Controlled Copies
export interface ControlledCopy {
    id: string;
    location: string;
    recipient: string;
    copyNumber: string;
    status: string;
    dateIssued: string;
}

// Knowledge Base
export interface Knowledge {
    id: string;
    title: string;
    category: string;
    tags: string[];
    dateAdded: string;
}
