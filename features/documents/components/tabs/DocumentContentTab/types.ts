export interface DocumentContentTabProps {
    documentStatus?: string;
    documentNumber?: string;
    documentName?: string;
    documentId?: string;
    documentVersion?: string;
    userCanPrint?: boolean;
    userCanDownload?: boolean;
    userCanCopy?: boolean;
    currentUser?: string;
    previousVersion?: string;
}

export interface Signature {
    name: string;
    role: string;
    action: string;
    timestamp: string;
    signatureId: string;
}

export interface PrintRequest {
    reason: string;
    copies: number;
}

export interface OutlineItem {
    id: number;
    title: string;
    page: number;
}
