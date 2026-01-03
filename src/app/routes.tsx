import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DashboardView } from '@/features/dashboard';
import { DocumentListView, DocumentsOwnedByMeView, DetailDocumentView } from '@/features/documents';
import { RevisionListView, NewRevisionView, RevisionsOwnedByMeView, RevisionWorkspaceView } from '@/features/documents/document-revisions';
import { NewDocumentView } from '@/features/documents/new-document';
import { BatchDocumentView } from '@/features/documents/batch-document/BatchDocumentView';
import { ExternalDocumentsView } from '@/features/documents/external-documents';
import { ArchivedDocumentsView } from '@/features/documents/archived';
import { MyTasksView } from '@/features/my-tasks';
import { ProfileView, UserManagementView } from '@/features/settings';
import { LoginView } from '@/features/auth';
import { UIShowcase } from '@/features/ui-showcase/UIShowcase';
import { UnderConstruction } from './UnderConstruction';
import { MainLayout } from '@/components/layout/MainLayout';

// Wrapper for Detail View to extract ID from params
const DetailDocumentViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DetailDocumentView documentId={id!} onBack={() => navigate(-1)} />;
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
        <Route path="documents/revisions/new" element={<NewRevisionView />} />      <Route path="/documents/revisions/workspace" element={<RevisionWorkspaceView />} />        <Route path="documents/revisions/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/controlled-copies/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/archived" element={<ArchivedDocumentsView />} />
        <Route path="documents/external" element={<ExternalDocumentsView />} />
        {/* Detail View */}
        <Route path="documents/:id" element={<DetailDocumentViewWrapper />} />
        {/* Profile */}
        <Route path="profile" element={<ProfileView onBack={() => navigate(-1)} />} />
        {/* Settings */}
        <Route path="settings/users" element={<UserManagementView />} />
        {/* UI Showcase */}
        <Route path="ui-demo" element={<UIShowcase />} />
        {/* Fallback for other routes */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};
