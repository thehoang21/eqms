export type ItemType = 'folder' | 'file';

export interface FileSystemItem {
    id: string;
    parentId: string | null; // null for root
    name: string;
    type: ItemType;
    size?: string;
    updatedAt: string;
    updatedBy: string;
    itemCount?: number; // For folders
    fileExtension?: string; // For files
    
    // Extended details
    createdAt?: string;
    createdBy?: string;
    version?: string;
    tags?: string[];
    description?: string;
    permissions?: ('read' | 'write' | 'delete')[];
}

export type ViewMode = 'grid' | 'list';
