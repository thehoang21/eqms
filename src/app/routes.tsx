import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';

// Layout
import { MainLayout } from '@/components/layout/MainLayout';

// Features - Dashboard & Tasks
import { DashboardView } from '@/features/dashboard';
import { MyTasksView } from '@/features/my-tasks';

// Features - Documents
import { 
  DetailDocumentView,
  ArchivedDocumentsView 
} from '@/features/documents';
import { DocumentsView } from '@/features/documents/document-list';
import { 
  NewDocumentView, 
  BatchDocumentView 
} from '@/features/documents/document-list/new-document';
import { DocumentReviewView } from '@/features/documents/document-list/review-document';
import { DocumentApprovalView } from '@/features/documents/document-list/approval-document';

// Features - Document Revisions
import { 
  RevisionListView, 
  NewRevisionView, 
  RevisionsOwnedByMeView, 
  RevisionWorkspaceView, 
  PendingDocumentsView, 
  RevisionReviewView, 
  RevisionApprovalView 
} from '@/features/documents/document-revisions';
import { StandaloneRevisionView } from '@/features/documents/document-revisions/components/StandaloneRevisionView';

// Features - Templates & Controlled Copies
import { 
  TemplateLibraryView,
  NewTemplateView 
} from '@/features/documents/template-library';
import { 
  ControlledCopiesView, 
  ControlledCopyDetailView, 
  DestroyControlledCopyView 
} from '@/features/documents/controlled-copies';
import { RequestControlledCopyView } from '@/features/documents/views/RequestControlledCopyView';

// Features - Settings
import { 
  ProfileView, 
  UserManagementView, 
  AddUserView, 
  EditUserView, 
  DictionariesView 
} from '@/features/settings';
import { RolePermissionView } from '@/features/settings/role-permission';

// Features - Auth
import { LoginView } from '@/features/auth';

// Dev Tools
import { UIShowcase } from '@/features/ui-showcase/UIShowcase';
import { UnderConstruction } from './UnderConstruction';

// ==================== ROUTE WRAPPERS ====================
// Reusable wrapper for extracting ID from URL params

interface RouteWrapperProps {
  render: (id: string, navigate: ReturnType<typeof useNavigate>) => React.ReactElement;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ render }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    navigate('/dashboard');
    return null;
  }
  
  return render(id, navigate);
};

// Specific route wrappers
const DetailDocumentViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <DetailDocumentView documentId={id} onBack={() => navigate(-1)} />
    )} 
  />
);

const DocumentReviewViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <DocumentReviewView documentId={id} onBack={() => navigate(-1)} currentUserId="1" />
    )} 
  />
);

const DocumentApprovalViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <DocumentApprovalView documentId={id} onBack={() => navigate(-1)} currentUserId="1" />
    )} 
  />
);

const RevisionReviewViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <RevisionReviewView documentId={id} onBack={() => navigate(-1)} currentUserId="1" />
    )} 
  />
);

const RevisionApprovalViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <RevisionApprovalView revisionId={id} onBack={() => navigate(-1)} currentUserId="1" />
    )} 
  />
);

const ControlledCopyDetailViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <ControlledCopyDetailView controlledCopyId={id} onBack={() => navigate(-1)} />
    )} 
  />
);

// ==================== MAIN ROUTES ====================

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/login" element={<LoginView onLogin={() => navigate('/dashboard')} />} />
      
      {/* ==================== PROTECTED ROUTES (WITH LAYOUT) ==================== */}
      <Route path="/" element={<MainLayout />}>
        {/* Root redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* ===== DASHBOARD & TASKS ===== */}
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="my-tasks" element={<MyTasksView />} />
        
        {/* ===== DOCUMENTS ===== */}
        <Route path="documents">
          {/* Document Lists */}
          <Route path="owned" element={<DocumentsView viewType="owned-by-me" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
          <Route path="all" element={<DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
          <Route path="all/new" element={<NewDocumentView />} />
          <Route path="archived" element={<ArchivedDocumentsView />} />
          
          {/* Batch Operations */}
          <Route path="batch/new" element={<BatchDocumentView />} />
          
          {/* Document Detail & Actions */}
          <Route path=":id" element={<DetailDocumentViewWrapper />} />
          <Route path=":id/review" element={<DocumentReviewViewWrapper />} />
          <Route path=":id/approval" element={<DocumentApprovalViewWrapper />} />
          
          {/* Document Revisions */}
          <Route path="revisions">
            <Route path="all" element={<RevisionListView />} />
            <Route path="owned" element={<RevisionsOwnedByMeView />} />
            <Route path="pending-review" element={<PendingDocumentsView viewType="review" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
            <Route path="pending-approval" element={<PendingDocumentsView viewType="approval" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
            <Route path="new" element={<NewRevisionView />} />
            <Route path="new-standalone" element={<StandaloneRevisionView />} />
            <Route path="workspace" element={<RevisionWorkspaceView />} />
            <Route path="review/:id" element={<RevisionReviewViewWrapper />} />
            <Route path="approval/:id" element={<RevisionApprovalViewWrapper />} />
            <Route path="*" element={<DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
          </Route>
          
          {/* Controlled Copies */}
          <Route path="controlled-copies">
            <Route index element={<ControlledCopiesView />} />
            <Route path=":id" element={<ControlledCopyDetailViewWrapper />} />
            <Route path=":id/destroy" element={<DestroyControlledCopyView />} />
            <Route path="*" element={<DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
          </Route>
          <Route path="controlled-copy/request" element={<RequestControlledCopyView />} />
          
          {/* Templates */}
          <Route path="templates">
            <Route index element={<TemplateLibraryView onViewTemplate={(id) => navigate(`/documents/templates/${id}`)} onCreateTemplate={() => navigate('/documents/templates/new')} />} />
            <Route path="new" element={<NewTemplateView />} />
          </Route>
        </Route>
        
        {/* ===== SETTINGS ===== */}
        <Route path="settings">
          <Route path="user-management">
            <Route index element={<UserManagementView />} />
            <Route path="add" element={<AddUserView />} />
            <Route path="edit/:userId" element={<EditUserView />} />
          </Route>
          <Route path="roles" element={<RolePermissionView />} />
          <Route path="dictionaries" element={<DictionariesView />} />
        </Route>
        
        {/* ===== PROFILE ===== */}
        <Route path="profile" element={<ProfileView onBack={() => navigate(-1)} />} />
        
        {/* ===== DEV TOOLS ===== */}
        <Route path="ui-demo" element={<UIShowcase />} />
        
        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};
