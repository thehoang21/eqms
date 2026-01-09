import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DashboardView } from '@/features/dashboard';
import { DocumentsOwnedByMeView, DetailDocumentView } from '@/features/documents';
import { RevisionListView, NewRevisionView, RevisionsOwnedByMeView, RevisionWorkspaceView, PendingMyReviewView, PendingMyApprovalView, RevisionReviewView, RevisionApprovalView } from '@/features/documents/document-revisions';
import { StandaloneRevisionView } from '@/features/documents/document-revisions/components/StandaloneRevisionView';
import { DocumentReviewView } from '@/features/documents/all-document/new-document/review-document';
import { DocumentApprovalView } from '@/features/documents/all-document/new-document/approval-document';
import { NewDocumentView, BatchDocumentView, NewTemplateView } from '@/features/documents/all-document/new-document';
import { ArchivedDocumentsView } from '@/features/documents/archived-document';
import { MyTasksView } from '@/features/my-tasks';
import { ProfileView, UserManagementView, DictionariesView } from '@/features/settings';
import { LoginView } from '@/features/auth';
import { UIShowcase } from '@/features/ui-showcase/UIShowcase';
import { UnderConstruction } from './UnderConstruction';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentListView } from '@/features/documents/all-document';
import { TemplateLibraryView } from '@/features/documents/template-library';

// Wrapper for Detail View to extract ID from params
const DetailDocumentViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DetailDocumentView documentId={id!} onBack={() => navigate(-1)} />;
};

// Wrapper for Review View to extract ID from params
const DocumentReviewViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DocumentReviewView documentId={id!} onBack={() => navigate(-1)} currentUserId="1" />;
};

// Wrapper for Approval View to extract ID from params
const DocumentApprovalViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DocumentApprovalView documentId={id!} onBack={() => navigate(-1)} currentUserId="1" />;
};

// Wrapper for Revision Review View to extract ID from params
const RevisionReviewViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RevisionReviewView documentId={id!} onBack={() => navigate(-1)} currentUserId="1" />;
};

// Wrapper for Revision Approval View to extract ID from params
const RevisionApprovalViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RevisionApprovalView revisionId={id!} onBack={() => navigate(-1)} currentUserId="1" />;
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Login Route (No Layout) */}
      <Route path="/login" element={<LoginView onLogin={() => navigate('/dashboard')} />} />
      
      {/* Protected Routes (With Layout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="my-tasks" element={<MyTasksView />} />
        {/* Document Routes */}
        <Route path="documents/owned" element={<DocumentsOwnedByMeView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/all" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/all/new" element={<NewDocumentView />} />
        <Route path="documents/batch/new" element={<BatchDocumentView />} />
        <Route path="documents/revisions/all" element={<RevisionListView />} />
        <Route path="documents/revisions/owned" element={<RevisionsOwnedByMeView />} />
        <Route path="documents/revisions/pending-review" element={<PendingMyReviewView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/revisions/pending-approval" element={<PendingMyApprovalView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/revisions/new" element={<NewRevisionView />} />
        <Route path="documents/revisions/standalone" element={<StandaloneRevisionView />} />
        <Route path="/documents/revisions/workspace" element={<RevisionWorkspaceView />} />
        {/* Revision Review - must be before wildcard route */}
        <Route path="documents/revisions/review/:id" element={<RevisionReviewViewWrapper />} />
        {/* Revision Approval - must be before wildcard route */}
        <Route path="documents/revisions/approval/:id" element={<RevisionApprovalViewWrapper />} />
        <Route path="documents/revisions/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/controlled-copies/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/templates" element={<TemplateLibraryView onViewTemplate={(id) => navigate(`/documents/templates/${id}`)} onCreateTemplate={() => navigate('/documents/templates/new')} />} />
        <Route path="documents/templates/new" element={<NewTemplateView />} />
        <Route path="documents/archived" element={<ArchivedDocumentsView />} />
        {/* Detail View */}
        <Route path="documents/:id" element={<DetailDocumentViewWrapper />} />
        {/* Document Review */}
        <Route path="documents/:id/review" element={<DocumentReviewViewWrapper />} />
        {/* Document Approval */}
        <Route path="documents/:id/approval" element={<DocumentApprovalViewWrapper />} />
        {/* Profile */}
        <Route path="profile" element={<ProfileView onBack={() => navigate(-1)} />} />
        {/* Settings */}
        <Route path="settings/users" element={<UserManagementView />} />
        <Route path="settings/dictionaries" element={<DictionariesView />} />
        {/* UI Showcase */}
        <Route path="ui-demo" element={<UIShowcase />} />
        {/* Fallback for other routes */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};
