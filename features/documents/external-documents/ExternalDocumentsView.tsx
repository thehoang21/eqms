import React, { useState, useMemo, useRef } from 'react';
import { 
    LayoutGrid, 
    List, 
    FolderPlus, 
    Upload, 
    Search, 
    ChevronRight, 
    Home,
    ArrowLeft,
    ArrowUpDown
} from 'lucide-react';
import { Button } from '../../../components/ui/button/Button';
import { AlertModal } from '../../../components/ui/modal/AlertModal';
import { cn } from '../../../components/ui/utils';
import { FileSystemItem } from './components/FileSystemItem';
import { FileDetailDrawer } from './components/FileDetailDrawer';
import { CreateFolderModal } from './components/CreateFolderModal';
import { RenameModal } from './components/RenameModal';
import { FileSystemItem as IFileSystemItem, ViewMode } from './types';

// Mock Data
const MOCK_ITEMS: IFileSystemItem[] = [
    { 
        id: '1', 
        parentId: null, 
        name: 'Quality Manuals', 
        type: 'folder', 
        updatedAt: '2024-01-15', 
        updatedBy: 'Admin', 
        itemCount: 5,
        createdAt: '2023-12-01',
        description: 'Core quality management system documentation and manuals.',
        permissions: ['read', 'write', 'delete']
    },
    { 
        id: '2', 
        parentId: null, 
        name: 'Regulatory Docs', 
        type: 'folder', 
        updatedAt: '2024-01-20', 
        updatedBy: 'Admin', 
        itemCount: 3,
        createdAt: '2023-12-05',
        description: 'External regulatory compliance documents and guidelines.',
        permissions: ['read']
    },
    { 
        id: '3', 
        parentId: null, 
        name: 'Supplier Certificates', 
        type: 'folder', 
        updatedAt: '2024-01-22', 
        updatedBy: 'Admin', 
        itemCount: 12,
        createdAt: '2024-01-01',
        permissions: ['read', 'write']
    },
    { 
        id: '4', 
        parentId: '1', 
        name: 'ISO 9001:2015.pdf', 
        type: 'file', 
        size: '2.5 MB', 
        updatedAt: '2024-01-10', 
        updatedBy: 'User', 
        fileExtension: 'pdf',
        version: '2.0',
        tags: ['ISO', 'Standard', 'Quality'],
        description: 'Official ISO 9001:2015 standard document reference.',
        permissions: ['read']
    },
    { 
        id: '5', 
        parentId: '1', 
        name: 'Internal Audit Checklist.xlsx', 
        type: 'file', 
        size: '45 KB', 
        updatedAt: '2024-01-12', 
        updatedBy: 'User', 
        fileExtension: 'xlsx',
        version: '1.1',
        tags: ['Audit', 'Checklist', 'Internal'],
        permissions: ['read', 'write']
    },
    { 
        id: '6', 
        parentId: '2', 
        name: 'FDA Guidelines.pdf', 
        type: 'file', 
        size: '5.1 MB', 
        updatedAt: '2024-01-18', 
        updatedBy: 'User', 
        fileExtension: 'pdf',
        version: '1.0',
        tags: ['FDA', 'Regulatory', 'Guidelines'],
        permissions: ['read']
    },
    { 
        id: '7', 
        parentId: null, 
        name: 'Meeting Minutes.docx', 
        type: 'file', 
        size: '1.2 MB', 
        updatedAt: '2024-01-25', 
        updatedBy: 'User', 
        fileExtension: 'docx',
        createdAt: '2024-01-25',
        description: 'Minutes from the monthly quality review meeting.',
        permissions: ['read', 'write', 'delete']
    },
];

export const ExternalDocumentsView: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<IFileSystemItem | null>(null);
    const [items, setItems] = useState<IFileSystemItem[]>(MOCK_ITEMS);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IFileSystemItem | null>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [itemToRename, setItemToRename] = useState<IFileSystemItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
    const currentFolderName = currentPath.length > 0 ? currentPath[currentPath.length - 1].name : 'Root';

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Filter by parent
            if (item.parentId !== currentFolderId) return false;
            
            // Filter by search
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            
            return true;
        }).sort((a, b) => {
            // Folders first
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });
    }, [items, currentFolderId, searchQuery]);

    const handleNavigate = (item: IFileSystemItem) => {
        if (item.type === 'folder') {
            setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const handleNavigateRoot = () => {
        setCurrentPath([]);
    };

    const handleNavigateUp = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    const handleCreateFolder = (folderName: string) => {
        const newFolder: IFileSystemItem = {
            id: Math.random().toString(36).substr(2, 9),
            parentId: currentFolderId,
            name: folderName,
            type: 'folder',
            updatedAt: new Date().toISOString(),
            updatedBy: 'CurrentUser',
            itemCount: 0,
            createdAt: new Date().toISOString(),
            permissions: ['read', 'write', 'delete']
        };
        setItems([...items, newFolder]);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFile: IFileSystemItem = {
                id: Math.random().toString(36).substr(2, 9),
                parentId: currentFolderId,
                name: file.name,
                type: 'file',
                size: `${(file.size / 1024).toFixed(1)} KB`,
                updatedAt: new Date().toISOString(),
                updatedBy: 'CurrentUser',
                fileExtension: file.name.split('.').pop(),
                createdAt: new Date().toISOString(),
                permissions: ['read', 'write', 'delete']
            };
            setItems([...items, newFile]);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Mock handlers
    const handleRename = (item: IFileSystemItem) => {
        setItemToRename(item);
        setIsRenameModalOpen(true);
    };
    const handleConfirmRename = (newName: string) => {
        if (itemToRename) {
            setItems(items.map(i => 
                i.id === itemToRename.id 
                    ? { ...i, name: newName, updatedAt: new Date().toISOString(), updatedBy: 'CurrentUser' }
                    : i
            ));
            setIsRenameModalOpen(false);
            setItemToRename(null);
        }
    };
    const handleDelete = (item: IFileSystemItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };
    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setItems(items.filter(i => i.id !== itemToDelete.id));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };
    const handleDownload = (item: IFileSystemItem) => console.log('Download', item);
    const handleViewDetail = (item: IFileSystemItem) => setSelectedItem(item);

    return (
        <div className="h-full flex flex-col space-y-4 relative">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">External Documents</h1>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                            <span className="hidden sm:inline">Dashboard</span>
                            <Home className="h-3 w-3 sm:hidden" />
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                            <span className="hidden sm:inline">Document Control</span>
                            <span className="sm:hidden">...</span>
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-700 font-medium">External Documents</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 h-10 w-64 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'grid' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'list' ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    <Button 
                        size='sm' 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setIsCreateFolderOpen(true)}
                    >
                        <FolderPlus className="h-4 w-4" />
                        New Folder
                    </Button>
                    <Button 
                        size='sm' 
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleUploadClick}
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Breadcrumbs & Navigation */}
            <div className="flex items-center gap-2 px-1">
                <button 
                    onClick={handleNavigateUp}
                    disabled={currentPath.length === 0}
                    className="p-1 hover:bg-slate-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </button>

                <div className="flex items-center gap-1 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <button 
                        onClick={handleNavigateRoot}
                        className={cn(
                            "flex items-center hover:text-emerald-600 transition-colors",
                            currentPath.length === 0 && "font-semibold text-slate-900"
                        )}
                    >
                        <Home className="h-4 w-4" />
                    </button>
                    
                    {currentPath.map((folder, index) => (
                        <React.Fragment key={folder.id}>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                onClick={() => handleBreadcrumbClick(index)}
                                className={cn(
                                    "hover:text-emerald-600 transition-colors truncate max-w-[150px]",
                                    index === currentPath.length - 1 && "font-semibold text-slate-900"
                                )}
                            >
                                {folder.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className={cn(
                "flex-1 bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden flex flex-col",
                viewMode === 'grid' ? "p-4" : "bg-white"
            )}>
                {/* List View Header */}
                {viewMode === 'list' && (
                    <div className="flex items-center gap-4 px-3 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="w-8"></div> {/* Icon placeholder */}
                        <div className="flex-1 flex items-center gap-1 cursor-pointer hover:text-slate-700">
                            Name <ArrowUpDown className="h-3 w-3" />
                        </div>
                        <div className="w-32 hidden sm:block">Owner</div>
                        <div className="w-32 hidden sm:block">Date Modified</div>
                        <div className="w-24 text-right hidden sm:block">File Size</div>
                        <div className="w-24 text-right hidden sm:block">File Count</div>
                        <div className="w-10"></div> {/* Action placeholder */}
                    </div>
                )}

                <div className={cn(
                    "flex-1 overflow-y-auto",
                    viewMode === 'grid' 
                        ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 content-start" 
                        : "flex flex-col gap-0"
                )}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <FileSystemItem
                                key={item.id}
                                item={item}
                                viewMode={viewMode}
                                onNavigate={handleNavigate}
                                onRename={handleRename}
                                onDelete={handleDelete}
                                onDownload={handleDownload}
                                onViewDetail={handleViewDetail}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="p-4 bg-slate-100 rounded-full mb-3">
                                <FolderPlus className="h-8 w-8 text-slate-300" />
                            </div>
                            <p className="text-lg font-medium text-slate-600">This folder is empty</p>
                            <p className="text-sm">Upload files or create a new folder to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Drawer */}
            <FileDetailDrawer 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />

            {/* Create Folder Modal */}
            <CreateFolderModal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                onCreate={handleCreateFolder}
                parentName={currentFolderName}
            />

            {/* Rename Modal */}
            <RenameModal
                isOpen={isRenameModalOpen}
                onClose={() => {
                    setIsRenameModalOpen(false);
                    setItemToRename(null);
                }}
                onRename={handleConfirmRename}
                currentName={itemToRename?.name || ''}
                itemType={itemToRename?.type || 'file'}
            />

            {/* Delete Confirmation Modal */}
            <AlertModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                type="warning"
                title={`Delete ${itemToDelete?.type === 'folder' ? 'Folder' : 'File'}?`}
                description={
                    <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                            Are you sure you want to delete <span className="font-semibold text-slate-900">{itemToDelete?.name}</span>?
                        </p>
                        {itemToDelete?.type === 'folder' && itemToDelete.itemCount && itemToDelete.itemCount > 0 && (
                            <p className="text-sm text-amber-600 font-medium">
                                ⚠️ This folder contains {itemToDelete.itemCount} item(s). All contents will be deleted.
                            </p>
                        )}
                        <p className="text-sm text-slate-500">
                            This action cannot be undone.
                        </p>
                    </div>
                }
                confirmText="Delete"
                cancelText="Cancel"
                showCancel
            />
        </div>
    );
};
