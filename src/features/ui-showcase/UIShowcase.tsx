import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card/ResponsiveCard';
import { 
  ResponsiveTableContainer, 
  ResponsiveTableWrapper, 
  Table, 
  TableHeader, 
  TableBody, 
  TableCell, 
  TableRow, 
  TablePagination
} from '@/components/ui/table/ResponsiveTable';
import { StatusBadge, StatusType } from '@/components/ui/statusbadge/StatusBadge';
import { Popover } from '@/components/ui/popover/Popover';
import { FormField } from '@/components/ui/form/ResponsiveForm';
import { Select } from '@/components/ui/select/Select';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { AlertModal, AlertModalType } from '@/components/ui/modal';
import { MoreHorizontal, Eye, Edit, Trash2, FileText, Download } from 'lucide-react';

export const UIShowcase: React.FC = () => {
  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: AlertModalType;
    title: string;
    description: string;
    isLoading?: boolean;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    description: '',
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'developer',
    notifications: true,
    bio: ''
  });

  // Table State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = (type: AlertModalType) => {
    let title = '';
    let description = '';

    switch (type) {
      case 'success':
        title = 'Operation Successful';
        description = 'The document has been successfully approved and released to the system.';
        break;
      case 'error':
        title = 'Submission Failed';
        description = 'Unable to save changes. Please check your internet connection and try again.';
        break;
      case 'warning':
        title = 'Delete Document?';
        description = 'This action cannot be undone. This will permanently delete the document and remove all associated data.';
        break;
      case 'info':
        title = 'System Maintenance';
        description = 'The system will undergo scheduled maintenance tonight from 02:00 AM to 04:00 AM.';
        break;
      case 'confirm':
        title = 'Confirm Action';
        description = 'Are you sure you want to proceed with this action?';
        break;
    }

    setModalState({
      isOpen: true,
      type,
      title,
      description,
    });
  };

  const handleConfirm = () => {
    if (modalState.type === 'confirm' || modalState.type === 'warning') {
      setModalState(prev => ({ ...prev, isLoading: true }));
      setTimeout(() => {
        setModalState(prev => ({ ...prev, isOpen: false, isLoading: false }));
      }, 1500);
    } else {
      setModalState(prev => ({ ...prev, isOpen: false }));
    }
  };

  // Mock Data for Table
  const allTableData = [
    { id: 1, code: 'SOP.0001.01', title: 'Document Control Procedure', version: '1.0', status: 'effective', author: 'John Doe', date: '2023-12-01' },
    { id: 2, code: 'POL.0001.02', title: 'Environmental Policy', version: '2.0', status: 'pendingReview', author: 'Jane Smith', date: '2023-12-05' },
    { id: 3, code: 'FORM.0012.01', title: 'Change Request Form', version: '1.0', status: 'draft', author: 'Mike Johnson', date: '2023-12-10' },
    { id: 4, code: 'POL.0003.03', title: 'Quality Policy', version: '3.0', status: 'approved', author: 'Sarah Wilson', date: '2023-11-20' },
    { id: 5, code: 'SOP-002', title: 'Internal Audit Procedure', version: '1.2', status: 'obsolete', author: 'David Brown', date: '2023-10-15' },
    { id: 6, code: 'SOP-003', title: 'Deviation Management', version: '2.0', status: 'effective', author: 'Emily Chen', date: '2023-12-15' },
    { id: 7, code: 'WI-010', title: 'Sample Testing Protocol', version: '1.5', status: 'approved', author: 'Tom Anderson', date: '2023-12-08' },
    { id: 8, code: 'FORM-020', title: 'Training Record', version: '1.0', status: 'draft', author: 'Lisa Park', date: '2023-12-12' },
    { id: 9, code: 'POL-005', title: 'Data Integrity Policy', version: '1.0', status: 'effective', author: 'Robert Lee', date: '2023-11-25' },
    { id: 10, code: 'SOP-004', title: 'CAPA Management', version: '3.1', status: 'pendingReview', author: 'Maria Garcia', date: '2023-12-18' },
    { id: 11, code: 'WI-015', title: 'Cleaning Validation', version: '2.0', status: 'approved', author: 'James Wilson', date: '2023-12-20' },
    { id: 12, code: 'FORM-025', title: 'Audit Checklist', version: '1.2', status: 'effective', author: 'Anna Martinez', date: '2023-12-22' },
  ];

  // Paginate Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allTableData.slice(startIndex, endIndex);
  }, [currentPage]);

  const totalPages = Math.ceil(allTableData.length / itemsPerPage);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">UI Components Showcase</h1>
        <p className="text-slate-500">Comprehensive demonstration of the design system components.</p>
      </div>

      {/* 1. Buttons & Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons & Status Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700">Button Variants</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700">Button Sizes</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Edit className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700">Status Badges</h4>
              <div className="flex flex-wrap gap-4">
                <StatusBadge status="draft" />
                <StatusBadge status="pendingReview" />
                <StatusBadge status="pendingApproval" />
                <StatusBadge status="approved" />
                <StatusBadge status="effective" />
                <StatusBadge status="obsolete" />
                <StatusBadge status="archived" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Modals & Popovers */}
      <Card>
        <CardHeader>
          <CardTitle>Modals & Popovers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-700">Alert Modals</h4>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => openModal('success')} className="bg-emerald-600 hover:bg-emerald-700">Success</Button>
                <Button onClick={() => openModal('error')} className="bg-red-600 hover:bg-red-700">Error</Button>
                <Button onClick={() => openModal('warning')} className="bg-amber-600 hover:bg-amber-700">Warning</Button>
                <Button onClick={() => openModal('info')} className="bg-blue-600 hover:bg-blue-700">Info</Button>
                <Button onClick={() => openModal('confirm')} variant="outline">Confirm</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-700">Popovers</h4>
              <div className="flex gap-4">
                <Popover 
                  title="Information"
                  content="This is a helpful tooltip that provides additional context about a feature or setting."
                  placement="bottom"
                  triggerClassName="inline-flex"
                />
                
                <div className="relative inline-block">
                   {/* Custom Popover Trigger Example */}
                   <Button variant="outline" className="gap-2">
                     Custom Popover <MoreHorizontal className="h-4 w-4" />
                   </Button>
                   {/* Note: In a real implementation, you'd wrap this button with the Popover component */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField label="Full Name" required hint="Enter your legal name">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </FormField>

              <FormField label="Role" required>
                <Select
                  value={formData.role}
                  onChange={(val) => setFormData({...formData, role: val})}
                  options={[
                    { label: 'Developer', value: 'developer' },
                    { label: 'Designer', value: 'designer' },
                    { label: 'Manager', value: 'manager' },
                    { label: 'QA Engineer', value: 'qa' },
                  ]}
                />
              </FormField>
            </div>

            <div className="space-y-4">
              <FormField label="Bio" layout="vertical">
                <textarea 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px]"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </FormField>

              <div className="pt-4">
                <Checkbox 
                  id="notifications"
                  label="Receive email notifications"
                  checked={formData.notifications}
                  onChange={(checked) => setFormData({...formData, notifications: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Data Table */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle>Data Table</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button size="sm" className="gap-2">
                <FileText className="h-4 w-4" /> New Document
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <ResponsiveTableContainer className="border-0 shadow-none rounded-none">
          <ResponsiveTableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>No.</TableCell>
                  <TableCell isHeader>
                    Code
                  </TableCell>
                  <TableCell isHeader>
                    Title
                  </TableCell>
                  <TableCell isHeader align="center">
                    Version
                  </TableCell>
                  <TableCell isHeader>
                    Status
                  </TableCell>
                  <TableCell isHeader>
                    Author
                  </TableCell>
                  <TableCell isHeader>
                    Date
                  </TableCell>
                  <TableCell isHeader sticky="right" align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">{row.code}</TableCell>
                    <TableCell className="text-slate-700">{row.title}</TableCell>
                    <TableCell align="center" className="text-slate-500">{row.version}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status as StatusType} />
                    </TableCell>
                    <TableCell className="text-slate-600">{row.author}</TableCell>
                    <TableCell className="text-slate-500">{row.date}</TableCell>
                    <TableCell sticky="right" align="right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTableWrapper>
          
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={allTableData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </ResponsiveTableContainer>
      </Card>

      {/* Global Alert Modal */}
      <AlertModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        isLoading={modalState.isLoading}
      />
    </div>
  );
};
