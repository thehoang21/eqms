// Document Details module types
export interface Revision {
    id: string;
    version: string;
    date: string;
    author: string;
    changes: string;
    status: "Draft" | "Approved" | "Rejected";
}

export interface Reviewer {
    id: string;
    name: string;
    email: string;
    department: string;
}

export interface Approver {
    id: string;
    name: string;
    email: string;
    role: string;
    order: number;
}

export interface Knowledge {
    id: string;
    title: string;
    category: string;
}

export interface ControlledCopy {
    id: string;
    copyNumber: string;
    location: string;
    holder: string;
}

export interface RelatedDocument {
    id: string;
    documentNumber: string;
    title: string;
    relationship: string;
}

export type TabType = "revisions" | "reviewers" | "approvers" | "knowledges" | "copies" | "related";
